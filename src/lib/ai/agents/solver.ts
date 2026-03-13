import { generateObject } from 'ai';
import { models } from '../config';
import { SolverSchema, SolverOutput } from '../schemas';
import { retrieveKnowledge, RetrievalResult } from '../rag/engine';

interface TicketData {
  id?: string;
  title: string;
  description: string;
}

/**
 * Agente Solucionador (Magic Compose).
 * Gera uma proposta de resoluÃ§Ã£o estruturada baseada no ticket e no contexto do RAG.
 * 
 * @param ticket Dados do ticket atual
 * @param context Opcional: Contexto jÃ¡ recuperado do RAG para evitar dupla consulta
 */
export async function runSolverAgent(
  ticket: TicketData, 
  context?: RetrievalResult[]
): Promise<SolverOutput> {
  // 1. Se o contexto nÃ£o for fornecido, busca no RAG
  // Usamos o tÃ­tulo e descriÃ§Ã£o para buscar artigos relevantes
  const searchQuery = `${ticket.title} ${ticket.description}`;
  const articles = context || await retrieveKnowledge(searchQuery, 3);
  
  // Formatamos o contexto para a IA
  const contextStr = articles.length > 0 
    ? articles.map((a, i) => `[ID: ${a.id}] Artigo ${i + 1}: ${a.title}\nConteÃºdo: ${a.content}`).join("\n\n")
    : "Nenhum artigo relevante encontrado na base de conhecimento.";

  // 2. Chama a IA (Gemini 1.5 Pro) para gerar a soluÃ§Ã£o estruturada
  const { object } = await generateObject({
    model: models.power, // Utiliza Gemini 1.5 Pro configurado em config.ts
    schema: SolverSchema,
    system: `VocÃª Ã© o "Agente Solucionador" da I9 Tecnologia, um assistente especializado em suporte tÃ©cnico.
      Sua funÃ§Ã£o Ã© o "Magic Compose": gerar respostas prontas para os atendentes usarem.

      DIRETRIZES DE ESTILO E TOM:
      - EmpÃ¡tico e profissional: ReconheÃ§a o problema do usuÃ¡rio.
      - TÃ©cnico e Preciso: ForneÃ§a passos claros de resoluÃ§Ã£o.
      - Estruturado: Use Markdown (listas, negrito) para facilitar a leitura.
      - Baseado em EvidÃªncias: Priorize informaÃ§Ãµes da BASE DE CONHECIMENTO fornecida.

      INSTRUÃ‡Ã•ES DE CAMPO:
      - solution: A resposta completa em Markdown para o cliente.
      - relevantArticleIds: IDs dos artigos que realmente fundamentaram a resposta.
      - confidence: NÃ­vel de certeza na soluÃ§Ã£o proposta (0 a 1).`,
    prompt: `
      CHAMADO PARA RESOLVER:
      TÃ­tulo: ${ticket.title}
      DescriÃ§Ã£o: ${ticket.description}

      BASE DE CONHECIMENTO DISPONÃ VEL (RAG):
      ${contextStr}

      Gere a melhor proposta de soluÃ§Ã£o baseada no contexto acima.
    `,
  });

  return object;
}
