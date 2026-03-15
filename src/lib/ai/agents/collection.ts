import { generateObject } from 'ai';
import { models } from '@/lib/ai/config';
import { buildAIExecutionContext } from '@/lib/ai/context-contract';
import { CollectionSchema, type CollectionOutput } from '@/lib/ai/schemas';
import { prisma } from '@/lib/prisma';

export async function runCollectionAgent(input: {
  title: string;
  description: string;
  attachments?: string[];
  category?: string;
  userId?: string;
}): Promise<CollectionOutput> {
  const startTime = Date.now();

  try {
    const payload = buildAIExecutionContext({
      source: 'ticket-collection',
      ticket: {
        title: input.title,
        description: input.description,
        category: input.category,
      },
      attachments: (input.attachments || []).map((name) => ({ name })),
      instructions: [
        'Avalie se faltam dados para seguir com o chamado.',
        'Identifique missingInfo, questions e isComplete.',
      ],
    });

    const { object } = await generateObject({
      model: models.reasoning,
      schema: CollectionSchema,
      system: 'Você garante que o chamado tenha todas as informações necessárias antes de avançar.',
      prompt: payload,
    });

    await prisma.aILog.create({
      data: {
        agentName: 'collection',
        input: payload,
        output: JSON.stringify(object),
        latency: Date.now() - startTime,
        userId: input.userId,
      },
    });

    return object;
  } catch (error) {
    console.error('Erro na execução do Agente de Coleta:', error);
    return {
      missingInfo: [],
      questions: [],
      isComplete: true,
    };
  }
}
