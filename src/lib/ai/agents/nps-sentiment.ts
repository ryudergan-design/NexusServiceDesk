import { generateObject } from 'ai';
import { models } from '@/lib/ai/config';
import { buildAIExecutionContext } from '@/lib/ai/context-contract';
import { SentimentSchema, type SentimentOutput } from '@/lib/ai/schemas';
import { prisma } from '@/lib/prisma';

export async function runSentimentAnalysis(
  feedback: string,
  ticketId?: number,
  userId?: string
): Promise<SentimentOutput> {
  const startTime = Date.now();

  try {
    const payload = buildAIExecutionContext({
      source: 'ticket-sentiment',
      ticket: {
        id: ticketId,
        title: 'Feedback de satisfação',
        description: feedback,
      },
      feedback,
      instructions: [
        'Classifique o sentimento em POSITIVE, NEUTRAL ou NEGATIVE.',
        'Dê score de 0 a 10 e extraia insights qualitativos curtos.',
      ],
    });

    const { object } = await generateObject({
      model: models.reasoning,
      schema: SentimentSchema,
      system: 'Você é um especialista em experiência do cliente e análise de NPS.',
      prompt: payload,
    });

    await prisma.aILog.create({
      data: {
        agentName: 'nps-sentiment',
        ticketId,
        input: payload,
        output: JSON.stringify(object),
        latency: Date.now() - startTime,
        userId,
      },
    });

    return object;
  } catch (error) {
    console.error('Erro na execução do Agente de Sentimento NPS:', error);
    throw new Error('Falha ao processar análise de sentimento.');
  }
}
