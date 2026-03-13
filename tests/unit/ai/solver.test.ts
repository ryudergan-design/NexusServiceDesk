import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runSolverAgent } from '@/lib/ai/agents/solver';
import { generateObject } from 'ai';

// Mock do AI SDK
vi.mock('ai', () => ({
  generateObject: vi.fn(),
}));

// Mock do RAG Engine
vi.mock('@/lib/ai/rag/engine', () => ({
  retrieveKnowledge: vi.fn().mockResolvedValue([
    { id: 'art-1', title: 'Artigo Conhecimento', content: 'Solução técnica XPTO', score: 0.9 }
  ]),
}));

describe('runSolverAgent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve gerar uma solução estruturada usando contexto do RAG', async () => {
    const mockOutput = {
      solution: 'Passo 1: Faca isso. Passo 2: Faca aquilo.',
      relevantArticleIds: ['art-1'],
      confidence: 0.95,
    };

    (generateObject as any).mockResolvedValue({ object: mockOutput });

    const ticket = {
      title: 'Erro de conexão',
      description: 'O banco de dados não conecta',
    };

    const result = await runSolverAgent(ticket);

    expect(result.solution).toContain('Passo 1');
    expect(result.relevantArticleIds).toContain('art-1');
    expect(generateObject).toHaveBeenCalled();
  });
});
