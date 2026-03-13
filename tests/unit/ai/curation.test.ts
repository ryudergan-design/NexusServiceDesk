import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runCurationAgent } from '@/lib/ai/agents/curation';
import { generateObject } from 'ai';

// Mock do AI SDK
vi.mock('ai', () => ({
  generateObject: vi.fn(),
}));

// Mock do Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    ticket: {
      findUnique: vi.fn().mockResolvedValue({
        id: 1,
        title: 'Problema resolvido',
        description: 'Descrição original',
        categoryId: 'cat-1',
        category: { name: 'Suporte' },
        comments: [
          { content: 'Tentei isso', author: { name: 'User' }, isInternal: false },
          { content: 'Funcionou assim', author: { name: 'Agent' }, isInternal: true }
        ]
      }),
    },
    aiLog: {
      create: vi.fn().mockResolvedValue({ id: 'log-1' }),
    }
  },
}));

describe('runCurationAgent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve gerar um rascunho de artigo a partir do histórico do ticket', async () => {
    const mockOutput = {
      title: 'Guia de Resolução: Problema resolvido',
      content: '# Problema\n...\n# Solução\n...', // Corrected newline escaping
      categoryId: 'cat-1',
      tags: ['suporte', 'resolvido'],
    };

    (generateObject as any).mockResolvedValue({ object: mockOutput });

    const result = await runCurationAgent(1);

    expect(result.title).toBe('Guia de Resolução: Problema resolvido');
    expect(result.tags).toContain('suporte');
    expect(generateObject).toHaveBeenCalled();
  });
});
