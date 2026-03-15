# Estrutura do Projeto

**Data da analise:** 2026-03-14

## Visao geral

A base segue a organizacao esperada de um app `Next.js` moderno, com separacao clara entre codigo de aplicacao, banco, testes, scripts operacionais e documentos de planejamento.

## Raiz do projeto

Arquivos e pastas principais na raiz:

- `package.json` -> dependencias e scripts principais
- `package-lock.json` -> lockfile do npm
- `tsconfig.json` -> configuracao TypeScript
- `vitest.config.ts` -> configuracao de testes
- `postcss.config.js` -> pipeline de CSS
- `components.json` -> configuracao do shadcn/ui
- `src/` -> codigo principal
- `prisma/` -> schema, migracoes e seeds
- `scripts/` -> utilitarios operacionais
- `tests/` -> testes automatizados
- `BANCO_DE_DADOS/SQLITE/sql/` -> referencias SQL e documentacao do SQLite
- `BANCO_DE_DADOS/SUPABASE/` -> espelho estrutural e documentacao do Supabase
- `.planning/` -> memoria e artefatos do fluxo GSD

## Pasta `src/`

### `src/app/`

Centro das rotas do App Router.

Blocos importantes:
- `src/app/layout.tsx` -> layout global
- `src/app/page.tsx` -> landing page
- `src/app/auth/` -> login e registro
- `src/app/dashboard/` -> area protegida principal
- `src/app/api/` -> endpoints HTTP

### `src/app/dashboard/`

Area principal da aplicacao autenticada.

Arquivos importantes:
- `src/app/dashboard/layout.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/dashboard-client.tsx`
- `src/app/dashboard/tickets/page.tsx`
- `src/app/dashboard/tickets/new/page.tsx`
- `src/app/dashboard/tickets/[id]/page.tsx`
- `src/app/dashboard/tickets/unassigned/page.tsx`
- `src/app/dashboard/admin/users/page.tsx`
- `src/app/dashboard/profile/page.tsx`

### `src/app/api/`

Endpoints do backend interno.

Grupos principais:
- auth: `src/app/api/auth/**`
- tickets: `src/app/api/tickets/**`
- dashboard: `src/app/api/dashboard/**`
- IA: `src/app/api/ai/**` e `src/app/api/ai-agents/route.ts`
- apoio: `src/app/api/categories/route.ts`, `src/app/api/stats/route.ts`, `src/app/api/notifications/route.ts`, `src/app/api/users/staff/route.ts`

### `src/components/`

Biblioteca de componentes reutilizaveis.

Subareas importantes:
- `src/components/ui/` -> componentes base
- `src/components/dashboard/` -> componentes da operacao
- `src/components/ai/` -> componentes ligados a IA
- `src/components/header.tsx`
- `src/components/sidebar.tsx`
- `src/components/sidebar-content.tsx`
- `src/components/auth-provider.tsx`
- `src/components/theme-provider.tsx`

### `src/lib/`

Nucleo tecnico e de dominio.

Subareas importantes:
- `src/lib/actions/` -> server actions
- `src/lib/ai/` -> agentes, schemas, config e RAG
- `src/lib/prisma.ts` -> cliente Prisma
- `src/lib/sla.ts` -> regras de SLA
- `src/lib/utils.ts` -> helpers compartilhados

### `src/lib/ai/`

Organizacao interna da camada de IA:
- `src/lib/ai/config.ts`
- `src/lib/ai/gemini-service.ts`
- `src/lib/ai/schemas.ts`
- `src/lib/ai/agents/`
- `src/lib/ai/rag/engine.ts`

## Pasta `prisma/`

Responsavel por banco e dados de suporte.

Conteudo principal:
- `prisma/schema.prisma`
- `prisma/migrations/`
- `prisma/seed.ts`
- scripts auxiliares de seed, limpeza e sincronizacao de modelos

## Pasta `scripts/`

Utilitarios operacionais que nao fazem parte do runtime normal da aplicacao.

Exemplos:
- `scripts/setup-fts5.ts`
- `scripts/seed-100-tickets.ts`
- `scripts/check-ai-logs.ts`
- `scripts/check-tickets.ts`
- `scripts/cleanup-and-seed.ts`

## Pasta `tests/`

Malha de testes atual.

- `tests/setup.ts`
- `tests/unit/`
- `tests/unit/ai/`

## Pasta `.planning/`

Memoria do workflow GSD.

Arquivos mais importantes:
- `PROJECT.md` -> visao do projeto
- `ROADMAP.md` -> fases do trabalho
- `STATE.md` -> estado atual e memoria curta
- `codebase/` -> mapa tecnico da base
- fases em `phase-*`

## Convencoes de localizacao

- UI e pagina: `src/app/` e `src/components/`
- API interna: `src/app/api/`
- regra de negocio: `src/lib/`
- persistencia: `prisma/`
- automacao operacional: `scripts/`
- testes: `tests/`

## O que fica facil de achar nesta estrutura

- rotas e telas: `src/app/`
- componentes visuais: `src/components/`
- regra de negocio e integracoes: `src/lib/`
- schema e migracoes: `prisma/`
- testes automatizados: `tests/`
- contexto de planejamento: `.planning/`

## Resumo operacional

- A estrutura atual e limpa, previsivel e aderente ao ecossistema Next.
- A navegacao fica simples porque cada pasta tem uma responsabilidade clara.
- O projeto ainda cabe bem nessa organizacao sem precisar de uma reorganizacao maior.
