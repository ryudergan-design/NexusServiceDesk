import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runSentimentAnalysis } from '@/lib/ai/agents/nps-sentiment';
import { generateObject } from 'ai';

// Mock do AI SDK
vi.mock('ai', () => ({
  generateObject: vi.fn(),
}));

// Mock do Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    aiLog: {
      create: vi.fn().mockResolvedValue({ id: 'log-1' }),
    },
  },
}));

describe('runSentimentAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve classificar sentimento e extrair insights de um feedback', async () => {
    const mockOutput = {
      score: 9,
      sentiment: 'POSITIVE',
      insights: ['Elogiou rapidez', 'Satisfeito com a solução'],
    };

    (generateObject as any).mockResolvedValue({ object: mockOutput });

    const feedback = 'O atendimento foi excelente e muito rápido!';
    const result = await runSentimentAnalysis(feedback);

    expect(result.sentiment).toBe('POSITIVE');
    expect(result.score).toBe(9);
    expect(result.insights).toHaveLength(2);
    expect(generateObject).toHaveBeenCalled();
  });
});
