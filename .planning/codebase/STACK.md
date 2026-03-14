# Pilha de Tecnologia

**Data da analise:** 2026-03-14

## Visao geral

- Aplicacao full-stack em `Next.js` com App Router.
- Linguagem principal: `TypeScript`.
- Frontend em `React` com base `shadcn/ui` + `Radix UI`.
- Backend embutido no proprio app, com rotas em `src/app/api/` e server actions em `src/lib/actions/`.
- Persistencia via `Prisma` sobre `SQLite`.
- Camada de IA apoiada por `Vercel AI SDK`, `@ai-sdk/google` e `@ai-sdk/openai`.

## Linguagem, runtime e gerenciador

- `TypeScript` em `src/`, `tests/`, `prisma/` e `scripts/`.
- Runtime esperado: `Node.js`.
- Gerenciador de pacotes: `npm`.
- Lockfile em `package-lock.json`.

## Framework principal

- `next` em `package.json`.
- `react` e `react-dom` em `package.json`.
- Entrada global em `src/app/layout.tsx`.
- Landing page em `src/app/page.tsx`.
- Area autenticada em `src/app/dashboard/`.

## Banco e acesso a dados

- `prisma` e `@prisma/client` como base de persistencia.
- Schema principal em `prisma/schema.prisma`.
- Cliente compartilhado em `src/lib/prisma.ts`.
- Banco configurado com `provider = "sqlite"` e `DATABASE_URL`.
- Dependencias `@libsql/client` e `@prisma/adapter-libsql` instaladas, indicando preparacao para cenarios libSQL/Turso.

## Autenticacao

- `next-auth` v5 beta com `@auth/prisma-adapter`.
- Configuracao central em `src/auth.ts`.
- Rota auth em `src/app/api/auth/[...nextauth]/route.ts`.
- Provider detectado: `Credentials`.
- Criptografia de senha com `bcryptjs`.

## Validacao e formularios

- `zod` para contratos e validacao.
- `react-hook-form` com `@hookform/resolvers`.
- Formularios com componentes internos em `src/components/ui/`.

## UI stack

- `Tailwind CSS` com configuracao em `postcss.config.js`.
- `components.json` mostra uso de `shadcn/ui`.
- Biblioteca base de componentes em `src/components/ui/`.
- `lucide-react` para icones.
- `framer-motion` para animacoes.
- `recharts` para dashboards.
- `@tiptap/react` e extensoes em `src/components/rich-text-editor.tsx`.
- `next-themes` para tema.
- `sonner` para toasts.

## Camada de IA

- `ai` como SDK principal.
- `@ai-sdk/google` para Gemini.
- `@ai-sdk/openai` para provedores compativeis com API OpenAI.
- Configuracao base em `src/lib/ai/config.ts`.
- Servico adicional em `src/lib/ai/gemini-service.ts`.
- Agentes especializados em:
  - `src/lib/ai/agents/collection.ts`
  - `src/lib/ai/agents/triage.ts`
  - `src/lib/ai/agents/solver.ts`
  - `src/lib/ai/agents/curation.ts`
  - `src/lib/ai/agents/nps-sentiment.ts`
- RAG em `src/lib/ai/rag/engine.ts`.

## Backend no proprio app

- Rotas HTTP em `src/app/api/`.
- Server actions em:
  - `src/lib/actions/ai.ts`
  - `src/lib/actions/dashboard.ts`
  - `src/lib/actions/nav.ts`
  - `src/lib/actions/users.ts`
- Middleware em `src/middleware.ts`.

## Testes

- `Vitest` configurado em `vitest.config.ts`.
- Ambiente `jsdom`.
- Setup global em `tests/setup.ts`.
- Suites em `tests/unit/` e `tests/unit/ai/`.
- Bibliotecas auxiliares:
  - `@testing-library/react`
  - `@testing-library/user-event`
  - `@testing-library/jest-dom`
  - `jsdom`

## Scripts e operacao

### Scripts do `package.json`

- `npm run dev` -> `next dev`
- `npm run build` -> `next build`
- `npm run start` -> `next start`
- `npm run lint` -> `next lint`

### Seeds e manutencao

- Seed principal em `prisma/seed.ts`.
- Scripts adicionais em `prisma/*.ts` e `scripts/*.ts`, como:
  - `scripts/setup-fts5.ts`
  - `scripts/seed-100-tickets.ts`
  - `scripts/check-ai-logs.ts`
  - `scripts/cleanup-and-seed.ts`

## Arquivos de configuracao principais

- `package.json`
- `tsconfig.json`
- `postcss.config.js`
- `components.json`
- `vitest.config.ts`
- `.env`
- `.env.local`

## Resumo operacional

- O projeto e um monolito moderno em `Next.js`.
- A stack mistura service desk, autenticacao por credenciais, dashboards e recursos fortes de IA.
- A base tecnica principal hoje e: `Next.js` + `Prisma` + `SQLite` + `NextAuth` + `Tailwind` + `Vercel AI SDK`.
