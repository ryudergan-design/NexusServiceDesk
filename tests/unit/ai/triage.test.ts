import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runTriageAgent } from '@/lib/ai/agents/triage';
import { generateObject } from 'ai';

// Mock do AI SDK
vi.mock('ai', () => ({
  generateObject: vi.fn(),
}));

// Mock do Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    aILog: {
      create: vi.fn().mockResolvedValue({ id: 'test-log-id' }),
    },
  },
}));

describe('runTriageAgent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return triage data for a valid ticket', async () => {
    const mockOutput = {
      category: 'TI',
      priority: 'MEDIUM',
      urgency: 'MEDIUM',
      impact: 'LOW',
      summary: 'Erro de senha no Outlook mesmo com senha correta.',
      isInternal: false,
    };

    (generateObject as any).mockResolvedValue({ object: mockOutput });

    const ticket = {
      title: 'Não consigo acessar meu e-mail',
      description: 'Ao tentar entrar no Outlook, recebo erro de senha incorreta, mesmo tendo certeza da senha.',
    };

    const result = await runTriageAgent(ticket);

    expect(result).toEqual(mockOutput);
    expect(generateObject).toHaveBeenCalled();
  });
});
