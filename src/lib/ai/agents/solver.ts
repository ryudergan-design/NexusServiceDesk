import { generateObject } from 'ai';
import { models } from '../config';
import { buildAIExecutionContext } from '../context-contract';
import { SolverSchema, SolverOutput } from '../schemas';
import { retrieveKnowledge, RetrievalResult } from '../rag/engine';

interface TicketData {
  id?: string;
  title: string;
  description: string;
}

export async function runSolverAgent(
  ticket: TicketData,
  context?: RetrievalResult[]
): Promise<SolverOutput> {
  const searchQuery = `${ticket.title} ${ticket.description}`;
  const articles = context || await retrieveKnowledge(searchQuery, 3);

  const payload = buildAIExecutionContext({
    source: 'ticket-solver',
    ticket: {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
    },
    knowledgeBase: articles.map((article) => ({
      id: article.id,
      title: article.title,
      content: article.content,
      score: article.score,
    })),
    instructions: [
      'Gere uma proposta de solução em Markdown.',
      'Use a base de conhecimento quando houver evidência relevante.',
      'Informe relevantArticleIds e confidence.',
    ],
  });

  const { object } = await generateObject({
    model: models.reasoning,
    schema: SolverSchema,
    system: 'Você é o Agente Solucionador da I9 Tecnologia e produz respostas técnicas claras para o atendente.',
    prompt: payload,
  });

  return object;
}
