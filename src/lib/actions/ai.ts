'use server'

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { generateText } from 'ai';
import { retrieveKnowledge } from '@/lib/ai/rag/engine';
import { runCollectionAgent } from '@/lib/ai/agents/collection';
import { runTriageAgent } from '@/lib/ai/agents/triage';
import { runSolverAgent } from '@/lib/ai/agents/solver';
import { GeminiAIService } from '@/lib/ai/gemini-service';
import { models } from '@/lib/ai/config';
import { buildAIExecutionContext } from '@/lib/ai/context-contract';
import type { CollectionOutput, SolverOutput } from '@/lib/ai/schemas';

function normalizeAIWorkflowStatus(status: string | undefined, fallback: string) {
  const upper = (status || '').trim().toUpperCase();

  const aliases: Record<string, string> = {
    TESTING: 'TEST',
    BUDGET_APPROVAL: 'AWAITING_APPROVAL',
  };

  if (aliases[upper]) return aliases[upper];

  const supported = new Set([
    'NEW',
    'TRIAGE',
    'DEVELOPMENT',
    'TEST',
    'AWAITING_APPROVAL',
    'PENDING_USER',
    'COMPLETED',
    'RESOLVED',
  ]);

  return supported.has(upper) ? upper : fallback;
}

function parseAIPlannedDate(value?: string) {
  if (!value) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;

  const parsed = new Date(`${value}T12:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

async function escalateToHuman(
  ticketId: number,
  agentId: string | undefined,
  agentName: string,
  reason: string,
  preferredAssigneeId?: string,
  publicResponse?: string
) {
  const aiAuthor = agentId
    ? await prisma.user.findUnique({
        where: { id: agentId },
        select: { id: true },
      })
    : await prisma.user.findFirst({
        where: { isAI: true },
        select: { id: true },
      });
  const authorId = aiAuthor?.id;

  const fallbackHuman = await prisma.user.findFirst({
    where: {
      id: preferredAssigneeId,
      approved: true,
      isAI: false,
      role: { in: ['ADMIN', 'AGENT'] },
    },
    select: { id: true, name: true },
  }) || await prisma.user.findFirst({
    where: {
      approved: true,
      isAI: false,
      role: { in: ['ADMIN', 'AGENT'] },
    },
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  if (!fallbackHuman) {
    throw new Error('Nenhum atendente humano disponivel para receber o chamado.');
  }

  await prisma.ticket.update({
    where: { id: ticketId },
    data: { assigneeId: fallbackHuman.id, status: 'TRIAGE' },
  });

  if (!authorId) return;

  await prisma.ticketComment.create({
    data: {
      ticketId,
      content: publicResponse?.trim() || 'Encaminhei seu chamado para um Atendente, que vai continuar o atendimento por aqui.',
      authorId,
      isInternal: false,
      isPrivate: false,
    },
  });

  await prisma.ticketComment.create({
    data: {
      ticketId,
      content: `[IA ESCALACAO] O robo ${agentName} encaminhou para um Atendente.\n\n**Responsavel definido:** ${fallbackHuman.name}\n\n**Motivo:** ${reason}`,
      authorId,
      isInternal: true,
      isPrivate: true,
    },
  });
}

export async function unassignAIAgent(ticketId: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Nao autorizado');

  await prisma.ticket.update({
    where: { id: ticketId },
    data: { assigneeId: null },
  });

  await prisma.ticketTransition.create({
    data: {
      ticketId,
      fromStatus: 'ANY',
      toStatus: 'UNASSIGNED',
      comment: 'Robo removido pelo atendente.',
      performedById: (session.user as any).id,
    },
  });

  revalidatePath('/dashboard');
  return { success: true };
}

export async function assignToAIAgent(ticketId: number, agentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Nao autorizado');

  const userId = (session.user as any).id;

  const [ticket, agent, performer] = await Promise.all([
    prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        requester: true,
        category: true,
        comments: { include: { author: true }, orderBy: { createdAt: 'asc' } },
      },
    }),
    prisma.user.findUnique({ where: { id: agentId } }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);

  if (!ticket) throw new Error('Ticket nao encontrado.');
  if (!agent?.isAI) throw new Error('Agente IA nao encontrado.');
  if (!agent.aiApiKey && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error('Agente IA nao configurado. Cadastre uma API key no agente ou configure a chave global.');
  }
  if (!performer) throw new Error('Sessao invalida.');

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const previousAssigneeId = ticket.assigneeId;
  const previousStatus = ticket.status;

  console.log(`[AI_PROCESS] Ticket #${ticketId} com ${agent.name} (Analisando nova interacao...)`);

  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      assigneeId: agentId,
      status: 'TRIAGE',
      plannedStartDate: now,
      plannedDueDate: tomorrow,
    },
  });

  try {
    const knowledge = await retrieveKnowledge(`${ticket.title} ${ticket.description}`, 3);

    const geminiResult = await GeminiAIService.processTicket({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      category: ticket.category.name,
      requester: {
        name: ticket.requester.name,
        department: ticket.requester.department,
      },
      history: ticket.comments.map((comment) => ({
        role: comment.author.isAI ? 'assistant' : 'user',
        content: comment.content,
      })),
      knowledgeBase: knowledge.map((item) => ({
        title: item.title,
        content: item.content,
      })),
    }, agent.id);

    if (geminiResult.requires_human) {
      await escalateToHuman(
        ticketId,
        agent.id,
        agent.name || 'Agente Gemini',
        geminiResult.reason,
        userId,
        geminiResult.response
      );
    } else {
      const normalizedStatus = normalizeAIWorkflowStatus(geminiResult.suggestedStatus, ticket.status);
      const aiPlannedStartDate = parseAIPlannedDate(geminiResult.plannedStartDate);
      const aiPlannedDueDate = parseAIPlannedDate(geminiResult.plannedDueDate);
      const hasValidPlannedRange =
        aiPlannedStartDate &&
        aiPlannedDueDate &&
        aiPlannedDueDate.getTime() >= aiPlannedStartDate.getTime();

      await prisma.ticketComment.create({
        data: {
          ticketId,
          content: geminiResult.response,
          authorId: agentId,
          isInternal: false,
          isPrivate: false,
        },
      });

      await prisma.ticket.update({
        where: { id: ticketId },
        data: {
          status: normalizedStatus,
          budgetAmount: geminiResult.suggestedBudget?.amount ?? ticket.budgetAmount,
          budgetDescription: geminiResult.suggestedBudget?.description ?? ticket.budgetDescription,
          plannedStartDate: hasValidPlannedRange ? aiPlannedStartDate : undefined,
          plannedDueDate: hasValidPlannedRange ? aiPlannedDueDate : undefined,
          resolutionTimeDue: hasValidPlannedRange ? aiPlannedDueDate : undefined,
        },
      });
    }

    const finalStatus = geminiResult.requires_human
      ? 'TRIAGE'
      : normalizeAIWorkflowStatus(geminiResult.suggestedStatus, ticket.status);

    await prisma.ticketTransition.create({
      data: {
        ticketId,
        fromStatus: 'TRIAGE',
        toStatus: finalStatus,
        comment: `IA ${agent.name} processou com o contrato padronizado Gemini.`,
        performedById: agentId,
      },
    });
  } catch (error: any) {
    console.error('[AI_ERROR] Falha critica:', error.message);

    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        assigneeId: previousAssigneeId ?? userId,
        status: previousStatus,
      },
    });

    await prisma.ticketComment.create({
      data: {
        ticketId,
        content: `[IA ERRO] Falha ao processar com ${agent.name}. Motivo: ${error.message}`,
        authorId: userId,
        isInternal: true,
        isPrivate: true,
      },
    });

    throw new Error(`Falha ao enviar o chamado para a IA ${agent.name}.`);
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function checkTicketCompletenessAction(data: {
  title: string;
  description: string;
  categoryId?: string;
  attachments?: string[];
}): Promise<CollectionOutput> {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Nao autorizado');

  let categoryName: string | undefined;
  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
      select: { name: true },
    });
    categoryName = category?.name;
  }

  return runCollectionAgent({
    title: data.title,
    description: data.description,
    category: categoryName,
    attachments: data.attachments,
    userId: (session.user as any).id,
  });
}

export async function getTriageInsightAction(data: {
  title: string;
  description: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Nao autorizado');

  return runTriageAgent({
    ...data,
    userId: (session.user as any).id,
  });
}

export async function getMagicComposeAction(data: {
  text: string;
  title?: string;
  contextType: 'NEW_TICKET' | 'REPLY';
  ticketId?: string;
  category?: string;
  type?: string;
  impact?: string;
  urgency?: string;
}): Promise<{ solution: string }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Nao autorizado');

  try {
    let payload = '';

    if (data.contextType === 'NEW_TICKET') {
      if (!data.title?.trim() || !data.category?.trim() || !data.type?.trim() || data.text.trim().length < 20) {
        throw new Error('Dados insuficientes para gerar a sugestao de abertura.');
      }

      payload = buildAIExecutionContext({
        source: 'magic-compose',
        ticket: {
          title: data.title,
          description: data.text,
          category: data.category || 'Geral',
          type: data.type || 'Incidente',
          impact: data.impact || 'Baixo',
          urgency: data.urgency || 'Baixa',
        },
        instructions: [
          'Atue como assistente de redacao de chamados.',
          'Use titulo, tipo e categoria como contexto para melhorar a descricao digitada.',
          'Mantenha o tom do usuario e escreva como se fosse o proprio cliente solicitando ajuda.',
          'Organize a descricao em linguagem simples e operacional.',
          'Nao repita os metadados como lista no texto final.',
        ],
      });
    } else {
      const ticket = await prisma.ticket.findUnique({
        where: { id: parseInt(data.ticketId!) },
        include: { comments: { take: 5, orderBy: { createdAt: 'desc' }, include: { author: true } } },
      });

      payload = buildAIExecutionContext({
        source: 'magic-compose',
        ticket: {
          id: data.ticketId,
          title: ticket?.title || 'Chamado',
          description: data.text,
          type: ticket?.type,
          priority: ticket?.priority,
        },
        history: ticket?.comments.map((comment) => ({
          role: comment.author.isAI ? 'assistant' : 'user',
          content: `${comment.author.name}: ${comment.content}`,
        })) || [],
        instructions: [
          'Reescreva a resposta mantendo a intencao original.',
          'Seja claro, tecnico e profissional.',
        ],
      });
    }

    const { text: suggestion } = await generateText({
      model: models.reasoning,
      system: data.contextType === 'NEW_TICKET'
        ? `Voce e um assistente de redacao da Nexus ServiceDesk.
Retorne apenas a descricao refinada do chamado.
Use o contexto de titulo, tipo e categoria para melhorar a descricao enviada.
Escreva sempre na voz do cliente, em primeira pessoa quando fizer sentido, como uma solicitacao de suporte.
Nao responda como atendente, tecnico ou sistema interno.
Preserve o estilo de linguagem original do cliente, apenas deixando mais claro e organizado.
Nao transforme a resposta em checklist, a menos que isso deixe o relato mais claro.
Nao adicione saudacoes, despedidas ou comentarios extras.
Escreva em portugues do Brasil, com clareza e linguagem simples.`
        : `Voce e um refinador de texto tecnico da Nexus ServiceDesk.
Retorne apenas o texto refinado.
Nao repita metadados do contexto no texto final.
Nao adicione saudacoes, despedidas ou comentarios extras.
Mantenha a intencao original, corrigindo gramatica, ortografia e organizacao.`,
      prompt: payload,
    });

    return { solution: suggestion.trim() };
  } catch (error: any) {
    console.error('[MAGIC_COMPOSE_ERROR] Falha critica na geracao:', error.message);
    throw new Error(`Falha na IA: ${error.message}`);
  }
}
