import { z } from 'zod';

/**
 * Contratos de Dados para os Agentes de IA do I9 Chamados.
 * Garante que a saída da IA seja estruturada e segura.
 */

// Schema do Agente de Triagem
export const TriageSchema = z.object({
  category: z.string().describe('Nome da categoria sugerida'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).describe('Nível de prioridade'),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH']).describe('Urgência percebida'),
  impact: z.enum(['LOW', 'MEDIUM', 'HIGH']).describe('Impacto percebido'),
  summary: z.string().describe('Resumo executivo do problema (máximo 100 caracteres)'),
  isInternal: z.boolean().describe('Se o problema parece ser interno/infraestrutura'),
});

// Schema do Agente de Coleta
export const CollectionSchema = z.object({
  missingInfo: z.array(z.string()).describe('Lista de informações que estão faltando'),
  questions: z.array(z.string()).describe('Perguntas diretas para o solicitante'),
  isComplete: z.boolean().describe('Se o ticket já possui informações suficientes para ser resolvido'),
});

// Schema do Agente Solucionador (Magic Compose)
export const SolverSchema = z.object({
  solution: z.string().describe('Proposta de solução formatada em Markdown'),
  relevantArticleIds: z.array(z.string()).describe('IDs dos artigos da base de conhecimento citados'),
  confidence: z.number().min(0).max(1).describe('Nível de confiança da IA na solução'),
});

// Schema do Agente de Curadoria (Novos Artigos)
export const CurationSchema = z.object({
  title: z.string().describe('Título profissional para o artigo'),
  content: z.string().describe('Conteúdo do guia de solução em Markdown'),
  categoryId: z.string().describe('ID da categoria do artigo'),
  tags: z.array(z.string()).describe('Tags para facilitar a busca'),
});

// Schema de Análise de Sentimento (NPS)
export const SentimentSchema = z.object({
  score: z.number().min(0).max(10).describe('Nota de sentimento detectada (0-10)'),
  sentiment: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE']).describe('Sentimento geral'),
  insights: z.array(z.string()).describe('Pontos positivos ou negativos destacados no feedback'),
});

// Schema de Resposta Simplificada do Agente IA
export const AIAgentSchema = z.object({
  message: z.string().describe('Resposta elegante em Markdown para o cliente'),
  suggestedStatus: z.enum(['COMPLETED', 'PENDING_USER', 'TRIAGE', 'BUDGET_APPROVAL', 'DEVELOPMENT', 'ESCALATE']).describe('Status sugerido para o chamado'),
  budgetAmount: z.number().optional().describe('Valor estimado do orçamento (se aplicável)'),
  budgetDescription: z.string().optional().describe('Justificativa técnica do valor (se aplicável)'),
});

export type TriageOutput = z.infer<typeof TriageSchema>;
export type AIAgentOutput = z.infer<typeof AIAgentSchema>;
export type CollectionOutput = z.infer<typeof CollectionSchema>;
export type SolverOutput = z.infer<typeof SolverSchema>;
export type CurationOutput = z.infer<typeof CurationSchema>;
export type SentimentOutput = z.infer<typeof SentimentSchema>;
