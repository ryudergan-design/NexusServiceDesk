import { generateText } from 'ai';
import { models } from '@/lib/ai/config';
import { prisma } from '@/lib/prisma';

export async function runCollectionAgent(input: {
  title: string;
  description: string;
  attachments?: string[];
  category?: string;
  userId?: string;
}) {
  const startTime = Date.now();

  try {
    const categoryContext = input.category 
      ? `O chamado é da categoria: ${input.category}.` 
      : 'Identifique o contexto do chamado automaticamente.';

    const { text } = await generateText({
      model: models.fast,
      system: `Você é um assistente de suporte especializado em garantir que chamados tenham todas as informações necessárias.
        RESPONDA APENAS EM JSON VÁLIDO.
        Esquema esperado:
        {
          "missingInfo": ["lista de strings"],
          "questions": ["perguntas diretas"],
          "isComplete": boolean
        }`,
      prompt: `Analise:
        Título: ${input.title}
        Descrição: ${input.description}
        ${categoryContext}
        
        Verifique se faltam: passos para reproduzir, erros específicos, documentos ou datas.`,
    });

    // Parser robusto para extrair JSON do texto (caso a IA coloque blocos de markdown)
    const jsonStr = text.includes('```json') 
      ? text.split('```json')[1].split('```')[0] 
      : text;
    
    const object = JSON.parse(jsonStr.trim());

    // Log
    await prisma.aILog.create({
      data: {
        agentName: 'collection',
        input: JSON.stringify(input),
        output: JSON.stringify(object),
        latency: Date.now() - startTime,
        userId: input.userId,
      },
    });

    return object;
  } catch (error) {
    console.error('Erro na execução do Agente de Coleta:', error);
    // Fallback amigável: se a IA falhar, deixa o chamado passar como completo para não travar o cliente
    return {
      missingInfo: [],
      questions: [],
      isComplete: true
    };
  }
}
