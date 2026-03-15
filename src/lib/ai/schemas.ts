import { z } from 'zod';

/**
 * Contratos de dados para os agentes de IA do I9 Chamados.
 * Garante que a saida da IA seja estruturada e segura.
 */

export const TriageSchema = z.object({
  category: z.string().describe('Nome da categoria sugerida'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).describe('Nivel de prioridade'),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH']).describe('Urgencia percebida'),
  impact: z.enum(['LOW', 'MEDIUM', 'HIGH']).describe('Impacto percebido'),
  summary: z.string().describe('Resumo executivo do problema (maximo 100 caracteres)'),
  isInternal: z.boolean().describe('Se o problema parece ser interno/infraestrutura'),
});

export const CollectionSchema = z.object({
  missingInfo: z.array(z.string()).describe('Lista de informacoes que estao faltando'),
  questions: z.array(z.string()).describe('Perguntas diretas para o solicitante'),
  isComplete: z.boolean().describe('Se o ticket ja possui informacoes suficientes para ser resolvido'),
});

export const SolverSchema = z.object({
  solution: z.string().describe('Proposta de solucao formatada em Markdown'),
  relevantArticleIds: z.array(z.string()).describe('IDs dos artigos da base de conhecimento citados'),
  confidence: z.number().min(0).max(1).describe('Nivel de confianca da IA na solucao'),
});

export const CurationSchema = z.object({
  title: z.string().describe('Titulo profissional para o artigo'),
  content: z.string().describe('Conteudo do guia de solucao em Markdown'),
  categoryId: z.string().describe('ID da categoria do artigo'),
  tags: z.array(z.string()).describe('Tags para facilitar a busca'),
});

export const SentimentSchema = z.object({
  score: z.number().min(0).max(10).describe('Nota de sentimento detectada (0-10)'),
  sentiment: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE']).describe('Sentimento geral'),
  insights: z.array(z.string()).describe('Pontos positivos ou negativos destacados no feedback'),
});

export const AIAgentSchema = z.object({
  message: z.string().describe('Resposta elegante em Markdown para o cliente'),
  suggestedStatus: z
    .enum([
      'COMPLETED',
      'RESOLVED',
      'PENDING_USER',
      'TRIAGE',
      'AWAITING_APPROVAL',
      'BUDGET_APPROVAL',
      'DEVELOPMENT',
      'TEST',
      'TESTING',
      'ESCALATE',
    ])
    .describe('Status sugerido para o chamado'),
  budgetAmount: z.number().optional().describe('Valor estimado do orcamento (se aplicavel)'),
  budgetDescription: z.string().optional().describe('Justificativa tecnica do valor (se aplicavel)'),
});

export type TriageOutput = z.infer<typeof TriageSchema>;
export type AIAgentOutput = z.infer<typeof AIAgentSchema>;
export type CollectionOutput = z.infer<typeof CollectionSchema>;
export type SolverOutput = z.infer<typeof SolverSchema>;
export type CurationOutput = z.infer<typeof CurationSchema>;
export type SentimentOutput = z.infer<typeof SentimentSchema>;
