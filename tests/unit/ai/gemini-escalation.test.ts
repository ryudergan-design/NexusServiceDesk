import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildTicketDraftFromConversation,
  GeminiAIService,
  normalizeGeminiResponse,
  TicketContext,
} from '@/lib/ai/gemini-service';

const mocks = vi.hoisted(() => ({
  interactionCreateMock: vi.fn(),
  findUniqueMock: vi.fn(),
  findFirstMock: vi.fn(),
  createLogMock: vi.fn(),
  createCommentMock: vi.fn(),
  updateTicketMock: vi.fn(),
  retrieveKnowledgeMock: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: mocks.findUniqueMock,
      findFirst: mocks.findFirstMock,
    },
    aILog: {
      create: mocks.createLogMock,
    },
    ticketComment: {
      create: mocks.createCommentMock,
    },
    ticket: {
      update: mocks.updateTicketMock,
    },
  },
}));

vi.mock('@/lib/ai/rag/engine', () => ({
  retrieveKnowledge: mocks.retrieveKnowledgeMock,
}));

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    interactions = {
      create: mocks.interactionCreateMock,
    };
  },
}));

describe('GeminiAIService - Escalation Logic', () => {
  const mockContext: TicketContext = {
    id: 1,
    title: 'Problema no Wifi',
    description: 'Nao consigo conectar na rede corporativa.',
    status: 'OPEN',
    priority: 'MEDIUM',
    category: 'Redes',
    requester: { name: 'Joao', department: 'TI' },
    history: [],
  };

  const makeInteraction = (payload: Record<string, unknown>) => ({
    id: 'interaction-test',
    outputs: [{ text: JSON.stringify(payload) }],
    usageMetadata: { totalTokenCount: 100 },
  });

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'test-key';
    mocks.interactionCreateMock.mockResolvedValue(makeInteraction({
      response: 'Teste de resposta',
      suggestedStatus: null,
      suggestedPriority: null,
      confidence: 0.9,
      sentiment: 'POSITIVE',
      escalate: false,
      requires_human: false,
      reason: 'Tudo certo',
      missingInfo: [],
      categorySuggestion: null,
      suggestedBudget: null,
      budgetConfirmed: null,
      usedExternalSearch: null,
      ticketDraft: null,
    }));
    mocks.retrieveKnowledgeMock.mockResolvedValue([]);
    mocks.findUniqueMock.mockResolvedValue(null);
    mocks.findFirstMock.mockResolvedValue({ id: 'ai-1' });
    mocks.createLogMock.mockResolvedValue({});
    mocks.createCommentMock.mockResolvedValue({});
    mocks.updateTicketMock.mockResolvedValue({});
  });

  it('nao deve escalar quando confianca e alta e sentimento e positivo', async () => {
    const result = await GeminiAIService.processTicket(mockContext);
    expect(result.escalate).toBe(false);
    expect(result.requires_human).toBe(false);
  });

  it('deve escalar quando a confianca e baixa (< 0.7)', async () => {
    mocks.interactionCreateMock.mockResolvedValueOnce(makeInteraction({
      response: 'Nao tenho certeza',
      suggestedStatus: null,
      suggestedPriority: null,
      confidence: 0.5,
      sentiment: 'NEUTRAL',
      escalate: false,
      requires_human: false,
      reason: 'Baixa confianca',
      missingInfo: [],
      categorySuggestion: null,
      suggestedBudget: null,
      budgetConfirmed: null,
      usedExternalSearch: null,
      ticketDraft: null,
    }));

    const result = await GeminiAIService.processTicket(mockContext);
    expect(result.escalate).toBe(true);
    expect(result.requires_human).toBe(true);
  });

  it('deve escalar quando o sentimento e negativo', async () => {
    mocks.interactionCreateMock.mockResolvedValueOnce(makeInteraction({
      response: 'Sinto muito',
      suggestedStatus: null,
      suggestedPriority: null,
      confidence: 0.9,
      sentiment: 'NEGATIVE',
      escalate: false,
      requires_human: false,
      reason: 'Usuario irritado',
      missingInfo: [],
      categorySuggestion: null,
      suggestedBudget: null,
      budgetConfirmed: null,
      usedExternalSearch: null,
      ticketDraft: null,
    }));

    const result = await GeminiAIService.processTicket(mockContext);
    expect(result.escalate).toBe(true);
    expect(result.reason).toContain('Sentimento negativo');
  });

  it('deve escalar quando o historico passa de 3 interacoes do assistente', async () => {
    const contextWithHistory: TicketContext = {
      ...mockContext,
      history: [
        { role: 'user', content: 'Oi' },
        { role: 'assistant', content: 'Ola' },
        { role: 'user', content: 'Ajudar' },
        { role: 'assistant', content: 'Como?' },
        { role: 'user', content: 'Nao funciona' },
        { role: 'assistant', content: 'Tente isso' },
        { role: 'assistant', content: 'Mais uma tentativa' },
      ],
    };

    const result = await GeminiAIService.processTicket(contextWithHistory);
    expect(result.escalate).toBe(true);
    expect(result.reason).toContain('Limite de tentativas');
  });

  it('deve criar comentario interno privado quando houver orcamento confirmado', async () => {
    mocks.interactionCreateMock.mockResolvedValueOnce(makeInteraction({
      response: 'Posso seguir com o orcamento.',
      suggestedStatus: null,
      suggestedPriority: null,
      confidence: 0.91,
      sentiment: 'NEUTRAL',
      escalate: false,
      requires_human: false,
      reason: 'Solicitacao valida',
      missingInfo: [],
      categorySuggestion: null,
      budgetConfirmed: true,
      suggestedBudget: {
        amount: 350,
        description: 'Troca de access point e visita tecnica.',
      },
      usedExternalSearch: null,
      ticketDraft: null,
    }));

    const result = await GeminiAIService.processTicket({
      ...mockContext,
      history: [{ role: 'user', content: 'Sim, pode calcular o orcamento.' }],
    });

    expect(result.suggestedBudget?.amount).toBe(350);
    expect(mocks.createCommentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          ticketId: 1,
          isInternal: true,
          isPrivate: true,
        }),
      })
    );
    expect(mocks.updateTicketMock).toHaveBeenCalled();
  });

  it('deve retornar CREATE_TICKET no orquestrador quando precisar de humano', async () => {
    mocks.interactionCreateMock.mockResolvedValueOnce(makeInteraction({
      response: 'Vou encaminhar para um atendente humano.',
      suggestedStatus: null,
      suggestedPriority: null,
      confidence: 0.4,
      sentiment: 'NEGATIVE',
      escalate: true,
      requires_human: true,
      reason: 'Caso critico',
      missingInfo: [],
      categorySuggestion: null,
      suggestedBudget: null,
      budgetConfirmed: null,
      usedExternalSearch: null,
      ticketDraft: null,
    }));

    const result = await GeminiAIService.orchestrateConversation({
      message: 'Minha internet caiu de novo e quero falar com humano.',
      context: [{ role: 'assistant', content: 'Pode me explicar melhor?' }],
    });

    expect(result.action).toBe('CREATE_TICKET');
    expect(result.suggestedTicket?.description).toContain('Minha internet caiu de novo e quero falar com humano.');
  });

  it('deve montar rascunho de ticket com o historico da conversa', () => {
    const draft = buildTicketDraftFromConversation([
      { role: 'user', content: 'Notebook sem acesso a VPN' },
      { role: 'assistant', content: 'Ja reiniciou a maquina?' },
    ], 'Redes', 'HIGH');

    expect(draft.title).toContain('Notebook sem acesso');
    expect(draft.description).toContain('IA: Ja reiniciou a maquina?');
    expect(draft.category).toBe('Redes');
  });

  it('deve normalizar respostas com ticketDraft automatico ao escalar', () => {
    const result = normalizeGeminiResponse({
      response: 'Encaminhando.',
      confidence: 0.2,
      sentiment: 'NEGATIVE',
      escalate: true,
      reason: 'Critico',
    }, {
      ...mockContext,
      history: [{ role: 'user', content: 'Preciso de um humano agora.' }],
    });

    expect(result.sentiment).toBe('NEGATIVE');
    expect(result.requires_human).toBe(true);
    expect(result.ticketDraft?.title).toBeTruthy();
  });

  it('deve ignorar suggestedBudget incompleto sem quebrar a resposta', () => {
    const result = normalizeGeminiResponse({
      response: 'Caso resolvido.',
      confidence: 0.93,
      sentiment: 'NEUTRAL',
      escalate: false,
      requires_human: false,
      reason: 'Resposta valida',
      suggestedBudget: undefined,
    }, mockContext);

    expect(result.suggestedBudget).toBeUndefined();
    expect(result.requires_human).toBe(false);
  });

  it('deve ignorar suggestedBudget com valor zero', async () => {
    mocks.interactionCreateMock.mockResolvedValueOnce(makeInteraction({
      response: 'Vou encaminhar para um atendente humano.',
      suggestedStatus: 'IN_PROGRESS',
      suggestedPriority: null,
      confidence: 0.92,
      sentiment: 'NEUTRAL',
      escalate: true,
      requires_human: true,
      reason: 'Depende de analise humana.',
      missingInfo: [],
      categorySuggestion: null,
      suggestedBudget: {
        amount: 0,
        description: 'Aguardando detalhamento do escopo.',
      },
      budgetConfirmed: true,
      usedExternalSearch: null,
      ticketDraft: null,
    }));

    const result = await GeminiAIService.processTicket({
      ...mockContext,
      history: [{ role: 'user', content: 'Pode seguir com o orcamento.' }],
    });

    expect(result.suggestedBudget).toBeUndefined();
    expect(mocks.createCommentMock).not.toHaveBeenCalled();
  });
});
