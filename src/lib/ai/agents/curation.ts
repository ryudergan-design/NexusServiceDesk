import { generateObject } from 'ai';
import { models } from '@/lib/ai/config';
import { buildAIExecutionContext } from '@/lib/ai/context-contract';
import { CurationSchema, type CurationOutput } from '@/lib/ai/schemas';
import { prisma } from '@/lib/prisma';

export async function runCurationAgent(ticketId: number, userId?: string): Promise<CurationOutput> {
  const startTime = Date.now();

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        comments: {
          orderBy: { createdAt: 'asc' },
          include: { author: true },
        },
        category: true,
      },
    });

    if (!ticket) {
      throw new Error(`Ticket #${ticketId} não encontrado.`);
    }

    const payload = buildAIExecutionContext({
      source: 'ticket-curation',
      ticket: {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        category: ticket.category.name,
      },
      history: ticket.comments.map((comment) => ({
        role: comment.author?.isAI ? 'assistant' : 'user',
        content: `${comment.author?.name || 'Sistema'} (${comment.isInternal ? 'Interno' : 'Publico'}): ${comment.content}`,
        createdAt: comment.createdAt.toISOString(),
      })),
      instructions: [
        'Transforme o histórico resolvido em artigo técnico.',
        'Use Markdown nas seções Problema, Solução e Observações.',
        `Mantenha o categoryId original: ${ticket.categoryId}.`,
      ],
    });

    const { object } = await generateObject({
      model: models.reasoning,
      schema: CurationSchema,
      system: 'Você é um curador especialista de base de conhecimento técnico no padrão KCS.',
      prompt: payload,
    });

    await prisma.aILog.create({
      data: {
        agentName: 'curation',
        ticketId: ticket.id,
        input: payload,
        output: JSON.stringify(object),
        latency: Date.now() - startTime,
        userId,
      },
    });

    return object;
  } catch (error) {
    console.error('Erro na execução do Agente de Curadoria:', error);
    throw new Error('Falha ao processar extração de conhecimento do chamado.');
  }
}
