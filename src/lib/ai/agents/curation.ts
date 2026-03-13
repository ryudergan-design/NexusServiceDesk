import { generateObject } from 'ai';
import { models } from '@/lib/ai/config';
import { CurationSchema, type CurationOutput } from '@/lib/ai/schemas';
import { prisma } from '@/lib/prisma';

/**
 * Agente de Curadoria: Extrai conhecimento de chamados resolvidos para a base de conhecimento.
 * Utiliza o modelo Gemini 1.5 Flash para processar o histórico de comentários e gerar rascunhos.
 */
export async function runCurationAgent(ticketId: number, userId?: string): Promise<CurationOutput> {
  const startTime = Date.now();

  try {
    // 1. Busca os dados do ticket, incluindo comentários e categoria
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        comments: {
          orderBy: { createdAt: 'asc' },
          include: { author: true }
        },
        category: true,
      }
    });

    if (!ticket) {
      throw new Error(`Ticket #${ticketId} não encontrado.`);
    }

    // 2. Formata o histórico de interações para fornecer contexto à IA
    const history = ticket.comments
      .map(c => `${c.author?.name || 'Sistema'} (${c.isInternal ? 'Interno' : 'Público'}): ${c.content}`)
      .join('\n');

    const prompt = `Você é um curador especialista de base de conhecimento técnico (KCS).
      Sua tarefa é analisar o chamado abaixo e extrair o conhecimento relevante em um formato de artigo.
      
      DADOS DO CHAMADO:
      Título: ${ticket.title}
      Descrição: ${ticket.description}
      Categoria: ${ticket.category.name}
      
      HISTÓRICO DE RESOLUÇÃO:
      ${history}
      
      REQUISITOS DO ARTIGO:
      1. Título: Deve ser profissional e direto (ex: "Como resolver erro X no sistema Y").
      2. Conteúdo: Use Markdown. Divida em seções: # Problema (descrição clara), # Solução (passo a passo aplicado) e # Observações.
      3. Tags: 3 a 5 tags relevantes para busca.
      4. Categoria: Mantenha o ID da categoria original: ${ticket.categoryId}`;

    // 3. Gera o objeto estruturado usando o esquema de curadoria
    const { object } = await generateObject({
      model: models.reasoning, // Gemini 1.5 Flash para análise de contexto
      schema: CurationSchema,
      prompt,
    });

    const duration = Date.now() - startTime;

    // 4. Registra a execução no log de IA para auditoria e métricas
    await prisma.aILog.create({
      data: {
        agentName: 'curation',
        ticketId: ticket.id,
        input: JSON.stringify({ ticketId, title: ticket.title }),
        output: JSON.stringify(object),
        latency: duration,
        userId: userId,
      },
    });

    return object;
  } catch (error) {
    console.error('Erro na execução do Agente de Curadoria:', error);
    throw new Error('Falha ao processar extração de conhecimento do chamado.');
  }
}
