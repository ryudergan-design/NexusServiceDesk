import { describe, it, expect, vi, beforeEach } from 'vitest';
import { retrieveKnowledge, getContextualResponse } from '@/lib/ai/rag/engine';
import { generateText } from 'ai';

// Mock do AI SDK
vi.mock('ai', () => ({
  generateText: vi.fn(),
}));

// Mock do Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

describe('RAG Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('retrieveKnowledge', () => {
    it('deve retornar artigos formatados a partir de uma query raw', async () => {
      const { prisma } = await import('@/lib/prisma');
      const mockRawResults = [
        { id: 'art-1', title: 'Artigo 1', content: 'Conteúdo 1', rank: -0.5 },
        { id: 'art-2', title: 'Artigo 2', content: 'Conteúdo 2', rank: -0.2 },
      ];

      (prisma.$queryRaw as any).mockResolvedValue(mockRawResults);

      const results = await retrieveKnowledge('teste query');

      expect(results).toHaveLength(2);
      expect(results[0].id).toBe('art-1');
      expect(results[0].score).toBe(0.5);
      expect(prisma.$queryRaw).toHaveBeenCalled();
    });

    it('deve retornar array vazio se a query for inválida', async () => {
      const results = await retrieveKnowledge('');
      expect(results).toEqual([]);
    });
  });

  describe('getContextualResponse', () => {
    it('deve gerar uma resposta baseada nos artigos recuperados', async () => {
      const { prisma } = await import('@/lib/prisma');
      const mockRawResults = [
        { id: 'art-1', title: 'Como resetar senha', content: 'Vá em configurações e clique em resetar.', rank: -0.9 },
      ];
      (prisma.$queryRaw as any).mockResolvedValue(mockRawResults);
      (generateText as any).mockResolvedValue({ text: 'Sugestão de solução baseada no artigo.' });

      const response = await getContextualResponse('Esqueci senha', 'Não consigo logar');

      expect(response.suggestedSolution).toBe('Sugestão de solução baseada no artigo.');
      expect(response.articles).toHaveLength(1);
      expect(response.articles[0].title).toBe('Como resetar senha');
    });

    it('deve informar quando não encontrar artigos', async () => {
      const { prisma } = await import('@/lib/prisma');
      (prisma.$queryRaw as any).mockResolvedValue([]);

      const response = await getContextualResponse('Algo obscuro', 'Descrição qualquer');

      expect(response.suggestedSolution).toBeNull();
      expect(response.articles).toHaveLength(0);
    });
  });
});
