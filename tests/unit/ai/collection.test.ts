import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runCollectionAgent } from '@/lib/ai/agents/collection';
import { generateObject } from 'ai';

// Mock do AI SDK
vi.mock('ai', () => ({
  generateObject: vi.fn(),
}));

// Mock do Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    aiLog: {
      create: vi.fn().mockResolvedValue({ id: 'test-log-id' }),
    },
  },
}));

describe('runCollectionAgent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve identificar quando um chamado está incompleto e sugerir perguntas', async () => {
    const mockOutput = {
      isComplete: false,
      missingInfo: ['Passos para reproduzir', 'Versão do sistema'],
      questions: [
        'Quais foram os passos exatos que você seguiu antes do erro?',
        'Qual versão do sistema você está utilizando?',
      ],
    };

    (generateObject as any).mockResolvedValue({ object: mockOutput });

    const input = {
      title: 'Erro ao salvar fatura',
      description: 'Estou tentando salvar uma fatura e dá erro 500.',
    };

    const result = await runCollectionAgent(input);

    expect(result.isComplete).toBe(false);
    expect(result.missingInfo).toContain('Passos para reproduzir');
    expect(result.questions.length).toBeGreaterThan(0);
    expect(generateObject).toHaveBeenCalled();
  });

  it('deve identificar quando um chamado está completo', async () => {
    const mockOutput = {
      isComplete: true,
      missingInfo: [],
      questions: [],
    };

    (generateObject as any).mockResolvedValue({ object: mockOutput });

    const input = {
      title: 'Dúvida sobre upgrade',
      description: 'Como faço para mudar do plano Silver para o Gold? Já vi que custa R$ 200 a mais.',
    };

    const result = await runCollectionAgent(input);

    expect(result.isComplete).toBe(true);
    expect(result.missingInfo).toHaveLength(0);
    expect(result.questions).toHaveLength(0);
  });
});
