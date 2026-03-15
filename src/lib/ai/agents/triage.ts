import { generateObject } from 'ai';
import { models } from '@/lib/ai/config';
import { buildAIExecutionContext } from '@/lib/ai/context-contract';
import { TriageSchema, type TriageOutput } from '@/lib/ai/schemas';
import { prisma } from '@/lib/prisma';

export async function runTriageAgent(ticket: {
  title: string;
  description: string;
  userId?: string;
}): Promise<TriageOutput> {
  const startTime = Date.now();

  try {
    const payload = buildAIExecutionContext({
      source: 'ticket-triage',
      ticket: {
        title: ticket.title,
        description: ticket.description,
      },
      instructions: [
        'Classifique categoria, prioridade, urgência, impacto, resumo executivo e se parece um problema interno.',
        'Responda estritamente no schema estruturado.',
      ],
    });

    const { object } = await generateObject({
      model: models.reasoning,
      schema: TriageSchema,
      system: 'Você é um especialista em triagem de chamados de suporte técnico e processos corporativos.',
      prompt: payload,
    });

    await prisma.aILog.create({
      data: {
        agentName: 'triage',
        input: payload,
        output: JSON.stringify(object),
        latency: Date.now() - startTime,
        userId: ticket.userId,
      },
    });

    return object;
  } catch (error) {
    console.error('Erro na execução do Agente de Triagem:', error);
    throw new Error('Falha ao processar triagem do chamado.');
  }
}
