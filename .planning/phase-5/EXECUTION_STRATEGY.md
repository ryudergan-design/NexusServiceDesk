# Estratégia de Execução: Fase 5 - IA Agêntica e RAG

## Objetivo
Implementar a infraestrutura de IA, agentes de triagem, coleta, solução e curadoria, integrando-os à UI e ao dashboard de NPS.

## Organização em Ondas

### Onda 1: Fundação e Infraestrutura
- **Plano:** `05-01-PLAN.md`
- **Foco:** Prisma Schema (AILog, KnowledgeArticle), SQLite FTS5, AI SDK Config, Zod Schemas.
- **Subagente:** `gsd-executor`
- **Dependências:** Nenhuma.

### Onda 2: Inteligência de Entrada e RAG
- **Plano:** `05-02-PLAN.md`
- **Foco:** Agentes de Triagem e Coleta, Engine de busca RAG (FTS5 + Gemini).
- **Subagente:** `gsd-executor`
- **Dependências:** Onda 1.

### Onda 3: Resolução e Aprendizado
- **Plano:** `05-03-PLAN.md`
- **Foco:** Agente Solucionador (Magic Compose), Curadoria Automática, Backend de Sentimento NPS.
- **Subagente:** `gsd-executor`
- **Dependências:** Onda 2.

### Onda 4: Integração UI/UX e Analytics
- **Plano:** `05-04-PLAN.md`
- **Foco:** AIInsightCard, Magic Compose UI, Dashboard de NPS com Recharts.
- **Subagente:** `gsd-executor`
- **Dependências:** Onda 3.

## Verificação Global
Ao final da Onda 4, será realizada uma verificação E2E conforme detalhado em `05-04-PLAN.md`.
