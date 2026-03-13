'use server'

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import { retrieveKnowledge } from '@/lib/ai/rag/engine';
import { AIAgentSchema } from '@/lib/ai/schemas';
import { runCollectionAgent } from '@/lib/ai/agents/collection';
import { runTriageAgent } from '@/lib/ai/agents/triage';
import { runSolverAgent } from '@/lib/ai/agents/solver';
import type { CollectionOutput, SolverOutput } from '@/lib/ai/schemas';

/**
 * Escala o chamado para um atendente humano real.
 */
async function escalateToHuman(ticketId: number, agentName: string, reason: string) {
  const staff = await prisma.user.findFirst({
    where: { role: { in: ['ADMIN', 'AGENT'] }, isAI: false, approved: true }
  });

  const targetId = staff?.id;

  await prisma.ticket.update({
    where: { id: ticketId },
    data: { assigneeId: targetId || null, status: "TRIAGE" }
  });

  await prisma.ticketComment.create({
    data: {
      ticketId,
      content: `[IA ESCALAÇÃO] O robô ${agentName} encaminhou para suporte humano.\n\n**Motivo:** ${reason}`,
      authorId: agentName.includes('Groq') || agentName.includes('Gemini') ? (await prisma.user.findFirst({where: {isAI: true}}))?.id || '' : targetId || '', 
      isInternal: true
    }
  });
}

export async function unassignAIAgent(ticketId: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Não autorizado');

  await prisma.ticket.update({
    where: { id: ticketId },
    data: { assigneeId: null }
  });

  await prisma.ticketTransition.create({
    data: {
      ticketId,
      fromStatus: "ANY",
      toStatus: "UNASSIGNED",
      comment: `Robô removido pelo atendente.`,
      performedById: (session.user as any).id
    }
  });

  revalidatePath('/dashboard');
  return { success: true };
}

export async function assignToAIAgent(ticketId: number, agentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Não autorizado');

  const userId = (session.user as any).id;

  // 1. Buscar dados completos com HISTÓRICO
  const [ticket, agent, performer] = await Promise.all([
    prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { 
        requester: true,
        comments: { include: { author: true }, orderBy: { createdAt: 'asc' } }
      }
    }),
    prisma.user.findUnique({ where: { id: agentId } }),
    prisma.user.findUnique({ where: { id: userId } })
  ]);

  if (!ticket) throw new Error('Ticket não encontrado.');
  if (!agent?.isAI || !agent.aiApiKey) throw new Error('Agente IA não configurado.');
  if (!performer) throw new Error('Sessão inválida.');

  const oldStatus = ticket.status;
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const hour = now.getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  // Formatar histórico para a IA
  const totalComments = ticket.comments.length;
  const conversationHistory = ticket.comments
    .slice(0, -1) // Todos menos o último
    .map(c => `${c.author.isAI ? '🤖 Robô' : '👤 ' + (c.author.role === 'USER' ? 'Cliente' : 'Atendente')} (${c.author.name}): ${c.content}`)
    .join("\n\n");

  const latestActivity = ticket.comments[totalComments - 1];
  const latestStr = latestActivity 
    ? `[ULTIMA ATIVIDADE] ${latestActivity.author.isAI ? '🤖 Robô' : '👤 ' + (latestActivity.author.role === 'USER' ? 'Cliente' : 'Atendente')} (${latestActivity.author.name}) disse: ${latestActivity.content}`
    : "Início do chamado.";

  console.log(`[AI_PROCESS] Ticket #${ticketId} com ${agent.name} (Analisando nova interação...)`);

  // 2. Marcar como TRIAGE e Atribuir
  await prisma.ticket.update({
    where: { id: ticketId },
    data: { 
      assigneeId: agentId, 
      status: "TRIAGE",
      plannedStartDate: now,
      plannedDueDate: tomorrow
    }
  });

  try {
    const searchQuery = `${ticket.title} ${ticket.description}`;
    const knowledge = await retrieveKnowledge(searchQuery, 3);
    const contextStr = knowledge.length > 0 
      ? knowledge.map(k => `[MANUAL] ${k.title}: ${k.content}`).join("\n")
      : "Sem manuais técnicos específicos para este caso.";

    // 3. Provedor
    let modelInstance;
    if (agent.aiModel?.includes('gemini')) {
      modelInstance = createGoogleGenerativeAI({ apiKey: agent.aiApiKey })(agent.aiModel.replace('models/', ''));
    } else if (agent.aiModel?.startsWith('cohere/')) {
      modelInstance = createOpenAI({ baseURL: 'https://api.cohere.com/v1', apiKey: agent.aiApiKey })(agent.aiModel.replace('cohere/', ''));
    } else {
      modelInstance = createOpenAI({ baseURL: 'https://api.groq.com/openai/v1', apiKey: agent.aiApiKey })(agent.aiModel || 'llama-3.3-70b-versatile');
    }
    
    // 4. Chamada IA Estruturada (generateObject) para precisão de 100%
    console.log(`[AI_PROCESS] Solicitando decisão estruturada para ${agent.name}...`);
    
    const { object: result } = await generateObject({
      model: modelInstance,
      schema: AIAgentSchema,
      system: `${agent.aiInstructions}
      
      HIERARQUIA DE AUTORIDADE:
      - O CLIENTE (${ticket.requester.name}) é o dono do chamado.
      - Se o CLIENTE pedir para encerrar, cancelar ou resolver, você DEVE usar suggestedStatus: 'COMPLETED'.
      - Se um ATENDENTE sugerir encerrar, analise se há motivo (ex: cancelamento, correção confirmada). Se não, questione antes de fechar.
      
      ESTRUTURA NEXUS:
      - Responda apenas o necessário, de forma elegante e profissional.
      - Comece com saudação se for o caso.
      
      DECISÃO DE STATUS:
      'COMPLETED': Resolvido ou pedido de encerramento pelo cliente.
      'PENDING_USER': Aguardando dado ou ação do cliente.
      'BUDGET_APPROVAL': Necessário aprovar custo/orçamento.
      'TRIAGE': Em análise técnica interna.
      'ESCALATE': Devolver para humano (casos complexos).`,
      prompt: `
        CHAMADO: ${ticket.title}
        DESCRIÇÃO: ${ticket.description}
        HISTÓRICO: ${conversationHistory}
        ${latestStr}
        CONHECIMENTO: ${contextStr}
      `
    });

    console.log(`[AI_PROCESS] Decisão de ${agent.name}: ${result.suggestedStatus}`);

    // 5. Executar Decisão
    if (result.suggestedStatus === "ESCALATE") {
      await escalateToHuman(ticketId, agent.name!, result.message);
    } else {
      await prisma.ticketComment.create({
        data: { ticketId, content: result.message, authorId: agentId, isInternal: false }
      });

      // Se houver orçamento gerado pela IA ou detectado, salvar nos campos técnicos
      await prisma.ticket.update({ 
        where: { id: ticketId }, 
        data: { 
          status: result.suggestedStatus,
          budgetAmount: result.budgetAmount ?? ticket.budgetAmount,
          budgetDescription: result.budgetDescription ?? ticket.budgetDescription
        } 
      });
    }

    // 6. Log de Atividade
    await prisma.aILog.create({
      data: {
        agentName: agent.name || "AI Agent",
        ticketId: ticket.id,
        input: ticket.description,
        output: JSON.stringify(result),
        latency: 0,
        userId: agent.id
      }
    });

    await prisma.ticketTransition.create({
      data: {
        ticketId,
        fromStatus: "TRIAGE",
        toStatus: result.suggestedStatus === "ESCALATE" ? "TRIAGE" : result.suggestedStatus,
        comment: `IA ${agent.name} processou com decisão estruturada.`,
        performedById: agentId
      }
    });

  } catch (error: any) {
    console.error("[AI_ERROR] Falha crítica:", error.message);
    await prisma.ticket.update({ where: { id: ticketId }, data: { assigneeId: userId } });
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
  if (!session?.user?.id) throw new Error('Não autorizado');

  return runCollectionAgent({
    ...data,
    userId: (session.user as any).id,
  });
}

export async function getTriageInsightAction(data: {
  title: string;
  description: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Não autorizado');

  return runTriageAgent({
    ...data,
    userId: (session.user as any).id,
  });
}

export async function getMagicComposeAction(data: {
  text: string;
  contextType: 'NEW_TICKET' | 'REPLY';
  ticketId?: string;
  category?: string;
  type?: string;
  impact?: string;
  urgency?: string;
}): Promise<{ solution: string }> {
  console.log(`[MAGIC_COMPOSE] Iniciando geração. Tipo: ${data.contextType}, Tamanho: ${data.text.length}`);
  
  const session = await auth();
  if (!session?.user?.id) {
    console.error("[MAGIC_COMPOSE] Erro: Usuário não autenticado");
    throw new Error('Não autorizado');
  }

  try {
    let contextStr = "";
    if (data.contextType === 'NEW_TICKET') {
      contextStr = `Título: ${data.text}\nCategoria: ${data.category || 'Geral'}\nTipo: ${data.type || 'Incidente'}\nImpacto: ${data.impact || 'Baixo'}\nUrgência: ${data.urgency || 'Baixa'}`;
    } else {
      const ticket = await prisma.ticket.findUnique({
        where: { id: parseInt(data.ticketId!) },
        include: { comments: { take: 5, orderBy: { createdAt: 'desc' }, include: { author: true } } }
      });
      const history = ticket?.comments.map(c => `${c.author.name}: ${c.content}`).join("\n") || "";
      contextStr = `Chamado: ${ticket?.title}\nContexto: ${ticket?.type} | ${ticket?.priority}\nHistórico Recente:\n${history}`;
    }

    console.log("[MAGIC_COMPOSE] Chamando Gemini 3.1 Flash...");

    const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });

    const { text: suggestion } = await generateText({
      model: google('gemini-3.1-flash-lite-preview'), 
      system: `Você é um refinador de texto técnico da Nexus ServiceDesk.
        Sua TAREFA ÚNICA é reescrever o texto fornecido pelo usuário para torná-lo mais claro e profissional.
        
        REGRAS CRÍTICAS:
        - Retorne APENAS o texto refinado.
        - PROIBIDO repetir ou listar os campos de contexto (Categoria, Tipo, Impacto, Urgência) no texto final. Use-os apenas para entender a gravidade e o assunto.
        - NÃO adicione saudações, despedidas ou comentários.
        - Mantenha a intenção original, corrigindo apenas gramática, ortografia e organização.`,
      prompt: `Texto para refinar: "${data.text}"\n\nCONTEXTO DO SISTEMA (USE APENAS PARA ENTENDIMENTO, NÃO REPITA):\n${contextStr}`
    });

    return { solution: suggestion.trim() };

  } catch (error: any) {
    console.error("[MAGIC_COMPOSE_ERROR] Falha crítica na geração:", error.message);
    throw new Error(`Falha na IA: ${error.message}`);
  }
}
