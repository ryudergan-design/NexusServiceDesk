# Mapa de Testes

**Data da analise:** 2026-03-14

## Stack atual

- Runner: `Vitest`
- Ambiente: `jsdom`
- Setup global: `tests/setup.ts`
- Bibliotecas auxiliares:
  - `@testing-library/react`
  - `@testing-library/jest-dom`
  - `@testing-library/user-event`
  - `@vitejs/plugin-react`

## Configuracao observada

Arquivo central: `vitest.config.ts`

- `environment: 'jsdom'`
- `globals: true`
- `setupFiles: ['./tests/setup.ts']`
- alias `@` apontando para `src`

Isso deixa a base pronta para testes unitarios, testes de componente e mocks de modulos internos.

## Organizacao dos testes

- Os testes atuais ficam em `tests/unit/`.
- Subconjunto de IA em `tests/unit/ai/`.
- Nao foram encontrados testes co-localizados em `src/**`.

## Suites atuais mapeadas

### Dominio e regras gerais

- `tests/unit/tickets.test.ts`
- `tests/unit/sla.test.ts`
- `tests/unit/auth.test.ts`

### IA

- `tests/unit/ai/collection.test.ts`
- `tests/unit/ai/curation.test.ts`
- `tests/unit/ai/gemini-escalation.test.ts`
- `tests/unit/ai/rag.test.ts`
- `tests/unit/ai/sentiment.test.ts`
- `tests/unit/ai/solver.test.ts`
- `tests/unit/ai/triage.test.ts`

## Padroes de mocking

- `vi.mock(...)` e o mecanismo principal.
- Prisma e mockado em suites de auth e IA.
- SDK de IA tambem e mockado para evitar chamadas reais.
- O foco atual e validar transformacao de entrada e saida sem tocar em servicos externos.

## Cobertura funcional percebida

Hoje a cobertura visivel se concentra em:

- regras de prioridade e chamados
- calculos de SLA
- partes do fluxo de autenticacao
- agentes de IA e RAG

## Lacunas importantes

- Nao foram encontrados testes para rotas em `src/app/api/**/route.ts`.
- Nao foram encontrados testes para server actions em `src/lib/actions/*.ts`.
- Nao foram encontrados testes de componentes importantes do dashboard, como:
  - `src/components/dashboard/desk-view.tsx`
  - `src/components/dashboard/ticket-detail-view.tsx`
  - `src/components/dashboard/manager-dashboard.tsx`
- Nao ha evidencia de testes end-to-end.
- Nao ha configuracao de cobertura em `vitest.config.ts`.
- `package.json` nao tem scripts `test`, `test:watch` ou `test:coverage`.

## Qualidade percebida das suites atuais

- Os testes sao legiveis e pequenos.
- A estrategia de mocks esta consolidada.
- A cobertura mais forte esta na camada de regra isolada, nao no fluxo web completo.
- Alguns testes validam versoes simplificadas da regra, em vez de importar a implementacao real usada na aplicacao.

## Prioridades recomendadas

### Rotas criticas

- `src/app/api/tickets/route.ts`
- `src/app/api/tickets/[id]/route.ts`
- `src/app/api/tickets/[id]/comments/route.ts`
- `src/app/api/auth/register/route.ts`

### Actions centrais

- `src/lib/actions/dashboard.ts`
- `src/lib/actions/users.ts`
- `src/lib/actions/ai.ts`

### UI principal

- abertura de chamado
- fila de tickets
- visualizacao de detalhe
- dashboards por papel

## O que o projeto ja tem pronto para evoluir

- alias `@` funcionando em testes
- setup global simples e funcional
- stack suficiente para testes de componente
- mocks ja usados em varias suites

## Resumo operacional

- A base de testes existe e nao esta do zero.
- O ponto forte atual e a validacao de regras isoladas e IA.
- O maior gap esta em API, actions, componentes e fluxo real de usuario.
