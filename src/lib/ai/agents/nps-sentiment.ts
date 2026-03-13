import { generateObject } from 'ai';
import { models } from '@/lib/ai/config';
import { SentimentSchema, type SentimentOutput } from '@/lib/ai/schemas';
import { prisma } from '@/lib/prisma';

/**
 * Agente de Análise de Sentimento (NPS): Analisa feedbacks qualitativos.
 * Requisito: AI-NPS
 */
export async function runSentimentAnalysis(
  feedback: string, 
  ticketId?: number, 
  userId?: string
): Promise<SentimentOutput> {
  const startTime = Date.now();
  
  try {
    const { object } = await generateObject({
      model: models.fast,
      schema: SentimentSchema,
      prompt: `Você é um especialista em análise de experiência do cliente (CX) e NPS.
        Analise o seguinte feedback de satisfação de um usuário de um sistema de chamados:
        
        Feedback: "${feedback}"
        
        Sua tarefa:
        1. Classifique o sentimento geral (POSITIVE, NEUTRAL, NEGATIVE).
        2. Atribua uma nota de sentimento de 0 a 10 (onde 0 é muito insatisfeito e 10 é muito satisfeito) com base no tom do texto.
        3. Extraia insights qualitativos curtos (ex: "Elogiou rapidez", "Reclamou da interface", "Dúvida sobre processo").
        
        Retorne os dados estruturados conforme o esquema.`,
    });

    const duration = Date.now() - startTime;

    // Log da execução na tabela AILog
    await prisma.aILog.create({
      data: {
        agentName: 'nps-sentiment',
        ticketId: ticketId,
        input: JSON.stringify({ feedback }),
        output: JSON.stringify(object),
        latency: duration,
        userId: userId,
      },
    });

    return object;
  } catch (error) {
    console.error('Erro na execução do Agente de Sentimento NPS:', error);
    throw new Error('Falha ao processar análise de sentimento.');
  }
}
