import { prisma } from "@/lib/prisma";
import { generateText } from "ai";
import { models } from "../config";

export interface RetrievalResult {
  id: string;
  title: string;
  content: string;
  score: number;
}

/**
 * Busca artigos na base de conhecimento usando SQLite FTS5.
 * Utiliza o ranking bm25 para relevância.
 */
export async function retrieveKnowledge(query: string, limit: number = 3): Promise<RetrievalResult[]> {
  // Limpeza básica da query para evitar erros de sintaxe no MATCH
  const sanitizedQuery = query.replace(/[^\w\s]/gi, ' ').trim();
  
  if (!sanitizedQuery) return [];

  /**
   * O SQLite FTS5 usa bm25() onde valores menores indicam maior relevância.
   * A tabela KnowledgeArticle_FTS usa articleId como referência para o ID da KnowledgeArticle original.
   */
  try {
    const results = await prisma.$queryRaw<any[]>`
      SELECT 
        articleId as id, 
        title, 
        content,
        bm25(KnowledgeArticle_FTS) as rank
      FROM KnowledgeArticle_FTS 
      WHERE KnowledgeArticle_FTS MATCH ${sanitizedQuery}
      ORDER BY rank
      LIMIT ${limit}
    `;

    return results.map(r => ({
      id: r.id,
      title: r.title,
      content: r.content,
      score: Math.abs(Number(r.rank)) 
    }));
  } catch (error) {
    console.error('Erro na busca FTS5:', error);
    return [];
  }
}

/**
 * Agente de RAG que processa o chamado e retorna uma sugestão baseada no conhecimento recuperado.
 */
export async function getContextualResponse(ticketTitle: string, ticketDescription: string) {
  const searchQuery = `${ticketTitle} ${ticketDescription}`;
  const articles = await retrieveKnowledge(searchQuery);

  if (articles.length === 0) {
    return {
      suggestedSolution: null,
      context: "Nenhum artigo relevante encontrado na base de conhecimento.",
      articles: []
    };
  }

  const contextStr = articles
    .map((a, i) => `Artigo ${i + 1}: ${a.title}\nConteúdo: ${a.content}`)
    .join("\n\n");

  const { text } = await generateText({
    model: models.reasoning,
    prompt: `
      Você é um assistente técnico de suporte N1/N2. 
      Use os artigos da base de conhecimento abaixo para sugerir uma solução ou resposta para o chamado.
      
      CHAMADO:
      Título: ${ticketTitle}
      Descrição: ${ticketDescription}
      
      BASE DE CONHECIMENTO DISPONÍVEL:
      ${contextStr}
      
      INSTRUÇÕES:
      1. Se os artigos fornecerem a solução, resuma-a de forma clara.
      2. Se os artigos forem apenas parcialmente relevantes, mencione o que ajuda e o que falta.
      3. Se nada for relevante, informe que não há base de conhecimento específica disponível.
      4. Responda em Markdown.
    `,
  });

  return {
    suggestedSolution: text,
    context: contextStr,
    articles: articles.map(a => ({ id: a.id, title: a.title }))
  };
}
