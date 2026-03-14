# Integracoes e Infra de Dados

**Data da analise:** 2026-03-14

## Visao geral

As integracoes principais do projeto se concentram em:

- banco de dados e ORM
- autenticacao e sessao
- provedores de IA
- busca de conhecimento
- rotas internas e scripts operacionais

Mesmo quando nao fala com um servico externo, a aplicacao integra varias camadas internas entre `src/app/api/`, `src/lib/actions/`, `src/lib/ai/` e `prisma/`.

## Banco de dados

### Prisma + SQLite

- Schema em `prisma/schema.prisma`.
- Cliente compartilhado em `src/lib/prisma.ts`.
- Fonte de dados controlada por `DATABASE_URL`.
- Provider atual: `sqlite`.

### Modelos principais

- Auth: `User`, `Account`, `Session`, `VerificationToken`
- Chamados: `Ticket`, `TicketComment`, `TicketTransition`, `Category`, `Subcategory`, `SLARule`, `Attachment`
- Suporte operacional: `Notification`, `AuditLog`, `AccessLog`, `AILog`
- Conhecimento: `KnowledgeArticle` e tabelas FTS

### Migracoes e carga inicial

- Migracoes em `prisma/migrations/`.
- Seeds e ajustes em:
  - `prisma/seed.ts`
  - `prisma/seed-all-bots.ts`
  - `prisma/seed-master-bots.ts`
  - `prisma/seed-openrouter-bot.ts`
  - `prisma/seed-cohere-bot.ts`
  - `prisma/sync-available-models.ts`

### Sinal de evolucao futura

- Dependencias `@libsql/client` e `@prisma/adapter-libsql` mostram preparacao para evoluir de SQLite local para libSQL/Turso, embora o schema atual ainda esteja em SQLite classico.

## Autenticacao e sessao

### NextAuth/Auth.js

- Configuracao central em `src/auth.ts`.
- Rota em `src/app/api/auth/[...nextauth]/route.ts`.
- Adapter Prisma com `PrismaAdapter(prisma)`.
- Estrategia de sessao: `jwt`.

### Fluxos de auth observados

- Login por credenciais com `bcryptjs`.
- Registro em `src/app/api/auth/register/route.ts`.
- Troca de papel em `src/app/api/auth/switch-role/route.ts`.
- Middleware de protecao em `src/middleware.ts`.

### Dados de sessao expostos para a aplicacao

- `id`
- `role`
- `activeRole`
- `department`

## Integracoes de IA

### SDKs e provedores

- Base principal em `src/lib/ai/config.ts`.
- SDKs:
  - `ai`
  - `@ai-sdk/google`
  - `@ai-sdk/openai`

### Provedores detectados no codigo

- Google Gemini
- Groq
- OpenRouter
- Cohere

### Pontos da aplicacao ligados a IA

- Rotas:
  - `src/app/api/ai/curation/route.ts`
  - `src/app/api/ai/nps-analysis/route.ts`
  - `src/app/api/ai-agents/route.ts`
- Server action:
  - `src/lib/actions/ai.ts`
- Agentes:
  - `src/lib/ai/agents/collection.ts`
  - `src/lib/ai/agents/triage.ts`
  - `src/lib/ai/agents/solver.ts`
  - `src/lib/ai/agents/curation.ts`
  - `src/lib/ai/agents/nps-sentiment.ts`
- Servico adicional:
  - `src/lib/ai/gemini-service.ts`

### Padrao de configuracao observado

- Chave global por ambiente para provedores.
- Possibilidade de chave por agente em `User.aiApiKey`.
- Escolha de modelo por usuario/agente em `User.aiModel`.
- Registro operacional em `AILog`.

## Busca de conhecimento e RAG

- Base de conhecimento em `KnowledgeArticle`.
- Tabelas FTS no schema Prisma.
- Script de apoio em `scripts/setup-fts5.ts`.
- Engine de recuperacao em `src/lib/ai/rag/engine.ts`.

## Superficie de integracao interna

### Rotas principais

- `src/app/api/tickets/route.ts`
- `src/app/api/tickets/[id]/route.ts`
- `src/app/api/tickets/[id]/comments/route.ts`
- `src/app/api/categories/route.ts`
- `src/app/api/users/staff/route.ts`
- `src/app/api/stats/route.ts`
- `src/app/api/notifications/route.ts`
- `src/app/api/dashboard/export/route.ts`
- `src/app/api/dashboard/audit/route.ts`

### Server actions principais

- `src/lib/actions/dashboard.ts`
- `src/lib/actions/nav.ts`
- `src/lib/actions/users.ts`
- `src/lib/actions/ai.ts`

## Scripts operacionais

### Seeds e dados de exemplo

- `scripts/seed-100-tickets.ts`
- `scripts/seed-audit-logs.ts`
- `scripts/update-categories.ts`

### Diagnostico e manutencao

- `scripts/check-ai-logs.ts`
- `scripts/check-bots.ts`
- `scripts/check-tickets.ts`
- `scripts/test-db-write.ts`
- `scripts/fix-db-migration.ts`
- `scripts/cleanup-and-seed.ts`
- `scripts/list-gemini-models.ts`
- `scripts/migrate_gemini_to_codex.ps1`

## Variaveis de ambiente por categoria

### Banco

- `DATABASE_URL`

O que faz: define o banco usado pelo Prisma.
Quando usar: sempre.
Valor recomendado: caminho SQLite explicito no desenvolvimento local.

### Autenticacao

- `AUTH_SECRET`

O que faz: protege tokens e sessao.
Quando usar: sempre em ambiente real.
Valor recomendado: string longa, aleatoria e exclusiva por ambiente.

### IA

- `GOOGLE_GENERATIVE_AI_API_KEY`
- `GROQ_API_KEY`
- `OPENROUTER_API_KEY`
- `COHERE_API_KEY`

O que fazem: autenticam chamadas para cada provedor.
Quando usar: apenas para os provedores realmente habilitados.
Valor recomendado: manter os valores fora de logs, docs e commits.

## Cuidados importantes

- `.env` e `.env.local` existem no projeto e nao devem ser copiados para documentacao.
- O campo `User.aiApiKey` aumenta a superficie sensivel, porque chaves podem ficar salvas no banco.
- O projeto mistura varios provedores de IA; isso pede controle claro de fallback, custo e logs.

## Resumo operacional

- A integracao mais importante hoje e `Next.js` + `Prisma` + `NextAuth` + provedores de IA.
- O sistema depende fortemente de configuracao de ambiente para banco, auth e IA.
- Ha boa base de scripts para operar o ambiente local, mas a disciplina operacional precisa acompanhar esse volume de integracoes.
