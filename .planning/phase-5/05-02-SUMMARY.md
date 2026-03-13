# Fase 05 - IA RAG - Onda 2 (Paralela)
## Resumo de Execução

- **Agente de Coleta:** Implementado em `src/lib/ai/agents/collection.ts`. Identifica lacunas de informação e gera perguntas dinâmicas. Testes unitários passando.
- **Motor de RAG:** Implementado em `src/lib/ai/rag/engine.ts`. Suporte para busca FTS5 no SQLite com ranking BM25 e integração com Gemini para respostas contextuais.
- **Análise de Sentimento NPS:** Implementado em `src/lib/ai/agents/nps-sentiment.ts`. Classifica qualitativamente os feedbacks de satisfação.
- **AI Toggle UI:** Implementado em `src/components/settings/AIToggle.tsx` e integrado à página de perfil. Permite controle do usuário sobre as funcionalidades de IA.

## Verificação
- [x] Testes unitários para Triagem e Coleta passando.
- [x] Script FTS5 atualizado para suporte a String IDs (CUID).
- [x] Persistência de preferências de IA funcionando.

**Status: Concluído**
