import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { KnowledgeArticle } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { retrieveKnowledge } from '@/lib/ai/rag/engine';
import { resolveGeminiModelId } from './config';

export type TicketMessageRole = 'user' | 'assistant' | 'system';
export type TicketSentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

export interface TicketContext {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  subcategory?: string;
  requester: {
    name: string | null;
    department: string | null;
  };
  history: {
    role: TicketMessageRole;
    content: string;
  }[];
  knowledgeBase?: Pick<KnowledgeArticle, 'title' | 'content'>[];
}

export interface SuggestedBudget {
  amount: number;
  description: string;
}

export interface TicketDraft {
  title: string;
  description: string;
  category?: string | null;
  priority?: string | null;
  conversationHistory: {
    role: TicketMessageRole;
    content: string;
  }[];
}

export interface GeminiResponse {
  response: string;
  suggestedStatus?: string;
  suggestedPriority?: string;
  plannedStartDate?: string;
  plannedDueDate?: string;
  confidence: number;
  sentiment: TicketSentiment;
  escalate: boolean;
  requires_human?: boolean;
  reason: string;
  missingInfo?: string[];
  categorySuggestion?: string;
  suggestedBudget?: SuggestedBudget;
  budgetConfirmed?: boolean;
  usedExternalSearch?: boolean;
  ticketDraft?: TicketDraft;
}

export interface OrchestratorPayload {
  message: string;
  context?: {
    role: TicketMessageRole;
    content: string;
  }[];
  requester?: {
    name?: string | null;
    department?: string | null;
  };
  category?: string;
  priority?: string;
}

export interface OrchestratorResponse {
  action: 'RESPOND' | 'CREATE_TICKET';
  message: string;
  confidence: number;
  sentiment: TicketSentiment;
  requires_human: boolean;
  reason: string;
  suggestedTicket?: TicketDraft;
  conversation: {
    role: TicketMessageRole;
    content: string;
  }[];
}

interface ProcessTicketOptions {
  source?: 'ticket' | 'widget';
  persistBudgetSuggestion?: boolean;
}

const LEGAL_OR_ESCALATION_TERMS = [
  'advogado',
  'processo',
  'justica',
  'justicao',
  'justica',
  'procon',
  'reclamacao',
  'humano',
  'atendente',
  'supervisor',
];

const BUDGET_CONFIRMATION_TERMS = [
  'sim',
  'pode',
  'quero',
  'pode enviar',
  'pode calcular',
  'tenho interesse',
  'autoriza',
  'autorizo',
  'segue',
];

const BUDGET_INTENT_TERMS = [
  'orcamento',
  'preco',
  'valor',
  'cotacao',
];

function normalizeSentiment(value: string | undefined): TicketSentiment {
  const upper = (value || 'NEUTRAL').toUpperCase();
  if (upper === 'POSITIVE' || upper === 'NEGATIVE') return upper;
  return 'NEUTRAL';
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function extractPrice(content: string): number | null {
  const match = content.match(/R\$\s*([\d.]+(?:,\d{2})?)/i);
  if (!match) return null;

  const normalized = match[1].replace(/\./g, '').replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function containsTerm(text: string, terms: string[]) {
  const normalized = normalizeText(text);
  return terms.some((term) => normalized.includes(term));
}

function hasBudgetInterestConfirmation(context: TicketContext) {
  const combinedHistory = context.history.map((item) => item.content);
  const latestUserMessage = [...context.history].reverse().find((item) => item.role === 'user')?.content || '';
  const budgetWasMentioned =
    combinedHistory.some((content) => containsTerm(content, BUDGET_INTENT_TERMS)) ||
    containsTerm(context.title, BUDGET_INTENT_TERMS) ||
    containsTerm(context.description, BUDGET_INTENT_TERMS);

  if (!budgetWasMentioned) return false;
  return containsTerm(latestUserMessage, BUDGET_CONFIRMATION_TERMS);
}

function shouldEscalateFromContent(context: TicketContext, response: GeminiResponse) {
  const combinedUserText = `${context.title}\n${context.description}\n${context.history
    .filter((item) => item.role === 'user')
    .map((item) => item.content)
    .join('\n')}`;

  const assistantInteractions = context.history.filter((item) => item.role === 'assistant').length;
  const askedForHuman = containsTerm(combinedUserText, LEGAL_OR_ESCALATION_TERMS);
  const negativeSentiment = response.sentiment === 'NEGATIVE';

  return {
    shouldEscalate:
      response.confidence < 0.7 ||
      negativeSentiment ||
      askedForHuman ||
      assistantInteractions >= 3,
    assistantInteractions,
    askedForHuman,
  };
}

async function searchExternalKnowledge(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;

  try {
    if (apiKey && cx) {
      const params = new URLSearchParams({
        key: apiKey,
        cx,
        q: trimmed,
        num: '5',
      });

      const response = await fetch(`https://www.googleapis.com/customsearch/v1?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Google search retornou ${response.status}`);
      }

      const data = await response.json() as { items?: Array<{ title?: string; snippet?: string; link?: string }> };
      return (data.items || []).map((item) => ({
        title: item.title || 'Resultado externo',
        snippet: item.snippet || '',
        link: item.link || '',
      }));
    }

    const fallbackResponse = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(trimmed)}&format=json&no_html=1&skip_disambig=1`
    );

    if (!fallbackResponse.ok) {
      throw new Error(`Busca fallback retornou ${fallbackResponse.status}`);
    }

    const fallback = await fallbackResponse.json() as {
      AbstractText?: string;
      AbstractURL?: string;
      RelatedTopics?: Array<{ Text?: string; FirstURL?: string }>;
    };

    const results = [];
    if (fallback.AbstractText) {
      results.push({
        title: 'Resumo externo',
        snippet: fallback.AbstractText,
        link: fallback.AbstractURL || '',
      });
    }

    for (const topic of fallback.RelatedTopics || []) {
      if (topic.Text) {
        results.push({
          title: 'Resultado complementar',
          snippet: topic.Text,
          link: topic.FirstURL || '',
        });
      }

      if (results.length >= 5) break;
    }

    return results;
  } catch (error) {
    console.error('Erro na busca externa:', error);
    return [];
  }
}

async function calculateBudgetSuggestion(query: string) {
  const articles = await retrieveKnowledge(query, 5);

  const pricedArticles = articles
    .map((article) => ({
      title: article.title,
      content: article.content,
      amount: extractPrice(article.content),
    }))
    .filter((article): article is { title: string; content: string; amount: number } => article.amount !== null);

  if (pricedArticles.length === 0) {
    return {
      found: false,
      amount: null,
      description: 'Nenhum valor estruturado foi encontrado na base de conhecimento.',
      sources: [],
    };
  }

  const best = pricedArticles[0];
  return {
    found: true,
    amount: best.amount,
    description: `Baseado no artigo "${best.title}" e na tabela encontrada na base interna.`,
    sources: pricedArticles.slice(0, 3).map((article) => article.title),
  };
}

async function resolveAIActorId(agentId?: string) {
  if (agentId) return agentId;
  const fallback = await prisma.user.findFirst({
    where: { isAI: true },
    select: { id: true },
  });
  return fallback?.id || null;
}

async function persistBudgetComment(ticketId: number, budget: SuggestedBudget, agentId?: string) {
  const authorId = await resolveAIActorId(agentId);
  if (!authorId) return;

  const formattedAmount = budget.amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      budgetAmount: budget.amount,
      budgetDescription: budget.description,
    },
  });

  await prisma.ticketComment.create({
    data: {
      ticketId,
      authorId,
      isInternal: true,
      isPrivate: true,
      content: `🤖 [SUGESTAO IA] Orcamento Estimado: ${formattedAmount}. Detalhes: ${budget.description}`,
    },
  });
}

export function buildTicketDraftFromConversation(
  conversation: { role: TicketMessageRole; content: string }[],
  categorySuggestion?: string,
  priority?: string
): TicketDraft {
  const userMessages = conversation.filter((item) => item.role === 'user').map((item) => item.content.trim());
  const latestUserMessage = userMessages[userMessages.length - 1] || 'Solicitacao via widget de autoatendimento';
  const title = latestUserMessage.length > 80 ? `${latestUserMessage.slice(0, 77)}...` : latestUserMessage;

  return {
    title,
    description: conversation
      .map((item) => `${item.role === 'assistant' ? 'IA' : item.role === 'system' ? 'Sistema' : 'Usuario'}: ${item.content}`)
      .join('\n\n'),
    category: categorySuggestion,
    priority,
    conversationHistory: conversation,
  };
}

export function normalizeGeminiResponse(raw: Partial<GeminiResponse>, context: TicketContext): GeminiResponse {
  const normalized: GeminiResponse = {
    response: raw.response || 'Nao consegui gerar uma resposta segura no momento.',
    suggestedStatus: raw.suggestedStatus || undefined,
    suggestedPriority: raw.suggestedPriority || context.priority,
    plannedStartDate: normalizePlannedDate(raw.plannedStartDate),
    plannedDueDate: normalizePlannedDate(raw.plannedDueDate),
    confidence: typeof raw.confidence === 'number' ? raw.confidence : 0,
    sentiment: normalizeSentiment(raw.sentiment),
    escalate: Boolean(raw.escalate || raw.requires_human),
    requires_human: Boolean(raw.requires_human || raw.escalate),
    reason: raw.reason || 'Sem justificativa fornecida.',
    missingInfo: raw.missingInfo || [],
    categorySuggestion: raw.categorySuggestion || undefined,
    suggestedBudget: raw.suggestedBudget || undefined,
    budgetConfirmed: raw.budgetConfirmed ?? undefined,
    usedExternalSearch: raw.usedExternalSearch ?? undefined,
    ticketDraft: raw.ticketDraft
      ? {
          ...raw.ticketDraft,
          category: raw.ticketDraft.category ?? undefined,
          priority: raw.ticketDraft.priority ?? undefined,
        }
      : undefined,
  };

  const escalationDecision = shouldEscalateFromContent(context, normalized);
  normalized.suggestedStatus = normalizeWorkflowStatus(
    normalized.suggestedStatus,
    normalized.response,
    normalized.missingInfo || []
  );
  if (escalationDecision.shouldEscalate) {
    normalized.escalate = true;
    normalized.requires_human = true;
  }

  if (
    normalized.plannedStartDate &&
    normalized.plannedDueDate &&
    new Date(normalized.plannedDueDate).getTime() < new Date(normalized.plannedStartDate).getTime()
  ) {
    normalized.plannedStartDate = undefined;
    normalized.plannedDueDate = undefined;
  }

  const reasons = [normalized.reason];
  if (normalized.confidence < 0.7) reasons.push('Confianca abaixo de 70%.');
  if (normalized.sentiment === 'NEGATIVE') reasons.push('Sentimento negativo detectado.');
  if (escalationDecision.askedForHuman) reasons.push('Usuario pediu intervencao humana ou mencionou termos legais.');
  if (escalationDecision.assistantInteractions >= 3) reasons.push('Limite de tentativas automaticas atingido.');
  normalized.reason = reasons.filter(Boolean).join(' ');

  if (normalized.budgetConfirmed === undefined) {
    normalized.budgetConfirmed = hasBudgetInterestConfirmation(context);
  }

  if (normalized.escalate && !normalized.ticketDraft) {
    normalized.ticketDraft = buildTicketDraftFromConversation(
      context.history.length > 0
        ? context.history
        : [{ role: 'user', content: `${context.title}\n\n${context.description}` }],
      normalized.categorySuggestion || context.category,
      normalized.suggestedPriority || context.priority
    );
  }

  return normalized;
}

const ticketHistorySchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
});

const ticketDraftSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string().nullable(),
  priority: z.string().nullable(),
  conversationHistory: z.array(ticketHistorySchema),
});

const geminiResponseSchema = z.object({
  response: z.string(),
  suggestedStatus: z.string().nullable(),
  suggestedPriority: z.string().nullable(),
  plannedStartDate: z.string().nullable(),
  plannedDueDate: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  sentiment: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE']),
  escalate: z.boolean(),
  requires_human: z.boolean().nullable(),
  reason: z.string(),
  missingInfo: z.array(z.string()),
  categorySuggestion: z.string().nullable(),
  suggestedBudget: z.object({
    amount: z.number().nullable(),
    description: z.string().nullable(),
  }).nullable(),
  budgetConfirmed: z.boolean().nullable(),
  usedExternalSearch: z.boolean().nullable(),
  ticketDraft: ticketDraftSchema.nullable(),
});

function extractJsonFromText(text: string) {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fencedMatch ? fencedMatch[1] : trimmed;
  return JSON.parse(candidate);
}

function extractInteractionText(interaction: any) {
  const outputs = Array.isArray(interaction?.outputs) ? interaction.outputs : [];
  const textParts = outputs
    .map((item: any) => {
      if (typeof item?.text === 'string') return item.text;
      if (typeof item === 'string') return item;
      return '';
    })
    .filter(Boolean);

  if (textParts.length > 0) return textParts.join('\n');

  if (typeof interaction?.output_text === 'string') return interaction.output_text;

  throw new Error('Resposta do Gemini sem texto legivel.');
}

function extractInteractionTokens(interaction: any) {
  return (
    interaction?.usageMetadata?.totalTokenCount ||
    interaction?.usage_metadata?.total_token_count ||
    interaction?.usage?.totalTokens ||
    null
  );
}

function normalizeSuggestedBudget(
  budget: { amount: number | null; description: string | null } | null | undefined
): SuggestedBudget | undefined {
  if (!budget) return undefined;
  if (typeof budget.amount !== 'number') return undefined;
  if (budget.amount <= 0) return undefined;
  if (typeof budget.description !== 'string' || !budget.description.trim()) return undefined;

  return {
    amount: budget.amount,
    description: budget.description,
  };
}

function normalizeWorkflowStatus(
  status: string | null | undefined,
  responseText: string,
  missingInfo: string[]
) {
  const upper = (status || '').trim().toUpperCase();
  const aliases: Record<string, string> = {
    TESTING: 'TEST',
    BUDGET_APPROVAL: 'AWAITING_APPROVAL',
  };

  if (aliases[upper]) return aliases[upper];

  const supported = new Set([
    'NEW',
    'TRIAGE',
    'DEVELOPMENT',
    'TEST',
    'AWAITING_APPROVAL',
    'PENDING_USER',
    'COMPLETED',
    'RESOLVED',
  ]);

  if (supported.has(upper)) return upper;

  const asksForReply =
    missingInfo.length > 0 ||
    /\?/.test(responseText) ||
    /(informe|me envie|envie|confirme|pode me passar|preciso que voce|me diga)/i.test(responseText);

  if (asksForReply) return 'PENDING_USER';

  return undefined;
}

function normalizePlannedDate(value: string | null | undefined) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return undefined;

  const parsed = new Date(`${trimmed}T12:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return undefined;

  return trimmed;
}

function buildInteractionInput(args: {
  context: TicketContext;
  source: 'ticket' | 'widget';
  localKnowledge: { title: string; content: string }[];
  externalResults: Array<{ title: string; snippet: string; link: string }>;
  budgetConfirmed: boolean;
  budgetCalculation: any;
}) {
  const { context, source, localKnowledge, externalResults, budgetConfirmed, budgetCalculation } = args;

  const conversationHistory = context.history.map((item: { role: TicketMessageRole; content: string }) => ({
    role: item.role === 'assistant' ? 'model' : 'user',
    content: item.content,
  }));

  const schemaReference = {
    response: 'string',
    suggestedStatus: 'string|null',
    suggestedPriority: 'string|null',
    plannedStartDate: 'YYYY-MM-DD|null',
    plannedDueDate: 'YYYY-MM-DD|null',
    confidence: 'number_0_to_1',
    sentiment: 'POSITIVE|NEUTRAL|NEGATIVE',
    escalate: 'boolean',
    requires_human: 'boolean|null',
    reason: 'string',
    missingInfo: 'string[]',
    categorySuggestion: 'string|null',
    suggestedBudget: {
      amount: 'number',
      description: 'string',
    },
    budgetConfirmed: 'boolean|null',
    usedExternalSearch: 'boolean|null',
    ticketDraft: {
      title: 'string',
      description: 'string',
      category: 'string|null',
      priority: 'string|null',
      conversationHistory: [{ role: 'user|assistant|system', content: 'string' }],
    },
  };

  const finalPrompt = `Voce e um atendente especializado de Service Desk chamado NexusBot.
Analise o contexto e responda de forma empatica, objetiva e tecnica.

Regras:
1. Detecte sentimento como POSITIVE, NEUTRAL ou NEGATIVE.
2. Informe confidence entre 0 e 1.
3. Defina requires_human como true se confianca < 0.7, sentimento negativo, pedido explicito por humano, termos legais ou repetidas tentativas sem resolucao.
4. Use a base local primeiro. Se nao houver base local suficiente, use os resultados externos recebidos no contexto.
5. So sugira orcamento se budgetConfirmed for true e houver calculo disponivel no contexto.
6. Quando houver intencao de orcamento sem confirmacao, peca a confirmacao antes de sugerir qualquer valor.
7. Pense no workflow real do sistema de chamados ao sugerir o proximo status.
8. Use TRIAGE para analise, DEVELOPMENT para execucao tecnica, TESTING ou TEST para validacao, PENDING_USER quando estiver aguardando retorno do cliente, BUDGET_APPROVAL ou AWAITING_APPROVAL quando o cliente precisar aprovar um orcamento, e COMPLETED ou RESOLVED quando o caso puder ser encerrado.
9. Se sua resposta ao cliente fizer pergunta, pedir confirmacao, solicitar evidencias ou depender do retorno do solicitante, prefira PENDING_USER.
10. Quando houver contexto suficiente, estime plannedStartDate e plannedDueDate em formato YYYY-MM-DD. Se nao houver contexto suficiente, use null.
11. Retorne APENAS JSON valido, sem explicacao extra, sem markdown e sem bloco de codigo.
12. Preencha todas as chaves do schema. Quando nao souber um valor opcional, use null, [] ou false conforme fizer sentido.
13. Se source for widget e houver escalonamento, preencha ticketDraft com os dados prontos para criacao do ticket.

Schema esperado:
${JSON.stringify(schemaReference, null, 2)}

Contexto completo:
${JSON.stringify(
    {
      source,
      context,
      localKnowledge,
      externalSearchResults: externalResults,
      budgetConfirmed,
      budgetCalculation,
    },
    null,
    2
  )}`;

  return [
    ...conversationHistory,
    {
      role: 'user',
      content: finalPrompt,
    },
  ];
}

export class GeminiAIService {
  static async getTicketContext(ticketId: number): Promise<TicketContext | null> {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        requester: true,
        category: true,
        subcategory: true,
        comments: {
          orderBy: { createdAt: 'asc' },
          include: { author: true },
        },
      },
    });

    if (!ticket) return null;

    const history = ticket.comments.map((comment) => ({
      role: (comment.author.isAI ? 'assistant' : 'user') as TicketMessageRole,
      content: comment.content,
    }));

    const knowledge = await retrieveKnowledge(`${ticket.title} ${ticket.description}`, 3);

    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      category: ticket.category.name,
      subcategory: ticket.subcategory?.name || undefined,
      requester: {
        name: ticket.requester.name,
        department: ticket.requester.department,
      },
      history,
      knowledgeBase: knowledge.map((article) => ({
        title: article.title,
        content: article.content,
      })),
    };
  }

  static async processTicket(
    context: TicketContext,
    agentId?: string,
    options: ProcessTicketOptions = {}
  ): Promise<GeminiResponse> {
    const startTime = Date.now();
    let modelId = resolveGeminiModelId();
    let agentName = 'Gemini-System';
    let apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (agentId) {
      const agent = await prisma.user.findUnique({
        where: { id: agentId, isAI: true },
      });

      if (agent) {
        agentName = agent.name || `Agent-${agent.id}`;
        modelId = resolveGeminiModelId(agent.aiModel || undefined);
        apiKey = agent.aiApiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      }
    }

    try {
      if (!apiKey) {
        throw new Error('GOOGLE_GENERATIVE_AI_API_KEY nao configurada.');
      }

      const query = `${context.title} ${context.description}`.trim();
      const localKnowledge = (context.knowledgeBase || []).filter((item) => item.content?.trim());
      const externalResults = localKnowledge.length > 0 ? [] : await searchExternalKnowledge(query);
      const budgetConfirmed = hasBudgetInterestConfirmation(context);
      const budgetCalculation = budgetConfirmed ? await calculateBudgetSuggestion(query) : null;
      const client = new GoogleGenAI({ apiKey });
      const interaction = await client.interactions.create({
        model: modelId,
        input: buildInteractionInput({
          context,
          source: options.source || 'ticket',
          localKnowledge,
          externalResults,
          budgetConfirmed,
          budgetCalculation,
        }),
      });
      const rawText = extractInteractionText(interaction);
      const object = geminiResponseSchema.parse(extractJsonFromText(rawText));

      const result = normalizeGeminiResponse(
        {
          ...object,
          suggestedStatus: object.suggestedStatus ?? undefined,
          suggestedPriority: object.suggestedPriority ?? undefined,
          plannedStartDate: object.plannedStartDate ?? undefined,
          plannedDueDate: object.plannedDueDate ?? undefined,
          requires_human: object.requires_human ?? undefined,
          categorySuggestion: object.categorySuggestion ?? undefined,
          budgetConfirmed: object.budgetConfirmed ?? undefined,
          ticketDraft: object.ticketDraft
            ? {
                ...object.ticketDraft,
                category: object.ticketDraft.category ?? undefined,
                priority: object.ticketDraft.priority ?? undefined,
              }
            : undefined,
          usedExternalSearch: externalResults.length > 0,
          suggestedBudget: normalizeSuggestedBudget(object.suggestedBudget) || (
            budgetCalculation?.found && budgetCalculation.amount
              ? {
                  amount: budgetCalculation.amount,
                  description: budgetCalculation.description,
                }
              : undefined
          ),
        },
        context
      );

      if (result.suggestedBudget && result.budgetConfirmed && context.id > 0 && options.persistBudgetSuggestion !== false) {
        await persistBudgetComment(context.id, result.suggestedBudget, agentId);
      }

      await prisma.aILog.create({
        data: {
          agentName,
          ticketId: context.id > 0 ? context.id : null,
          input: JSON.stringify(context),
          output: JSON.stringify({ interactionId: interaction?.id, result }),
          tokens: extractInteractionTokens(interaction),
          latency: Date.now() - startTime,
          userId: agentId,
        },
      });

      return result;
    } catch (error) {
      console.error('Erro no GeminiAIService:', error);

      await prisma.aILog.create({
        data: {
          agentName,
          ticketId: context.id > 0 ? context.id : null,
          input: JSON.stringify(context),
          output: JSON.stringify({ error: (error as Error).message }),
          latency: Date.now() - startTime,
          userId: agentId,
        },
      });

      return normalizeGeminiResponse(
        {
          response: 'Desculpe, tive um problema tecnico ao processar sua solicitacao. Um atendente humano foi notificado.',
          confidence: 0,
          sentiment: 'NEUTRAL',
          escalate: true,
          requires_human: true,
          reason: 'Falha tecnica na integracao com IA.',
        },
        context
      );
    }
  }

  static async orchestrateConversation(
    payload: OrchestratorPayload,
    agentId?: string
  ): Promise<OrchestratorResponse> {
    const conversation = [...(payload.context || []), { role: 'user' as const, content: payload.message }];

    const context: TicketContext = {
      id: 0,
      title: payload.message,
      description: payload.message,
      status: 'NEW',
      priority: payload.priority || 'MEDIUM',
      category: payload.category || 'Geral',
      requester: {
        name: payload.requester?.name || null,
        department: payload.requester?.department || null,
      },
      history: conversation,
    };

    const result = await this.processTicket(context, agentId, {
      source: 'widget',
      persistBudgetSuggestion: false,
    });

    return {
      action: result.requires_human ? 'CREATE_TICKET' : 'RESPOND',
      message: result.response,
      confidence: result.confidence,
      sentiment: result.sentiment,
      requires_human: Boolean(result.requires_human),
      reason: result.reason,
      suggestedTicket: result.requires_human
        ? result.ticketDraft || buildTicketDraftFromConversation(conversation, result.categorySuggestion, result.suggestedPriority)
        : undefined,
      conversation,
    };
  }
}
