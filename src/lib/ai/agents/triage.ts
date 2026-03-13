import { generateObject } from 'ai';
import { models } from '@/lib/ai/config';
import { TriageSchema, type TriageOutput } from '@/lib/ai/schemas';
import { prisma } from '@/lib/prisma';

/**
 * Agente de Triagem: Classifica novos chamados usando Groq/Llama 3.3.
 */
export async function runTriageAgent(ticket: { title: string; description: string; userId?: string }): Promise<TriageOutput> {
  const startTime = Date.now();
  
  try {
    const { object } = await generateObject({
      model: models.fast,
      schema: TriageSchema,
      prompt: `Você é um especialista em triagem de chamados de suporte técnico e processos corporativos.
        Analise o seguinte chamado:
        Título: ${ticket.title}
        Descrição: ${ticket.description}
        
        Classifique o chamado fornecendo a categoria, prioridade, urgência, impacto, um resumo executivo e se parece ser um problema interno.`,
    });

    const duration = Date.now() - startTime;

    // Log da execução na tabela AILog
    await prisma.aILog.create({
      data: {
        agentName: 'triage',
        input: JSON.stringify(ticket),
        output: JSON.stringify(object),
        latency: duration,
        userId: ticket.userId,
      },
    });

    return object;
  } catch (error) {
    console.error('Erro na execução do Agente de Triagem:', error);
    throw new Error('Falha ao processar triagem do chamado.');
  }
}
