# Convencoes de Codigo

**Data da analise:** 2026-03-14

## Visao geral

- O projeto usa `TypeScript` em toda a base.
- O padrao dominante e `Next.js` App Router com separacao entre `src/app/`, `src/components/` e `src/lib/`.
- Ha boa organizacao estrutural, mas ainda existem pontos com `any`, `@ts-ignore` e logs de depuracao em codigo de producao.

## Nomenclatura de arquivos e pastas

- Rotas seguem `src/app/**/page.tsx`, `src/app/**/layout.tsx` e `src/app/api/**/route.ts`.
- Componentes costumam usar nome de arquivo em `kebab-case`, como `src/components/header.tsx` e `src/components/dashboard/desk-view.tsx`.
- Componentes exportados usam `PascalCase`.
- Helpers e servicos em `src/lib/` usam nomes curtos e diretos, como `src/lib/sla.ts`, `src/lib/prisma.ts` e `src/lib/ai/config.ts`.
- Scripts operacionais ficam em `scripts/` e `prisma/`.

## Imports e alias

- Alias `@` apontando para `src` em `tsconfig.json`.
- Mesmo alias replicado em `vitest.config.ts`.
- O padrao observado e importar primeiro dependencias externas e depois modulos internos.

## Convencoes de componentes React

- Componentes cliente usam `"use client"`.
- Layouts e paginas server-side usam `async` quando precisam de `auth()` ou dados de banco, como `src/app/dashboard/page.tsx`.
- Props costumam ser tipadas com `interface`.
- Estilos compostos com Tailwind e helper `cn` de `src/lib/utils.ts`.
- Base visual reutilizada a partir de `src/components/ui/`.

## Convencoes de rotas e API

- Rotas de API ficam em `src/app/api/**/route.ts`.
- Padrao comum nas rotas:
  - chamar `auth()` cedo
  - validar autorizacao
  - executar consulta ou mutacao com Prisma
  - retornar `NextResponse.json(...)` ou `new NextResponse(...)`
  - registrar falhas com `console.error(...)`
- Exemplos claros:
  - `src/app/api/tickets/route.ts`
  - `src/app/api/tickets/[id]/route.ts`
  - `src/app/api/ai-agents/route.ts`

## Server actions

- Server actions usam `"use server"` em `src/lib/actions/*.ts`.
- O padrao e concentrar regra reutilizavel nessas actions, em vez de empilhar tudo nas paginas.
- Exemplos:
  - `src/lib/actions/dashboard.ts`
  - `src/lib/actions/users.ts`
  - `src/lib/actions/nav.ts`
  - `src/lib/actions/ai.ts`

## Prisma e acesso a dados

- Cliente central em `src/lib/prisma.ts`.
- Uso direto do Prisma nas rotas e actions, sem camada de repositorio separada.
- Transacoes aparecem quando a operacao exige consistencia, como em `src/app/api/tickets/route.ts`.
- O schema fica centralizado em `prisma/schema.prisma`.

## Validacao e contratos

- `zod` e usado em auth e IA.
- Exemplo em `src/auth.ts` para credenciais.
- Schemas de IA centralizados em `src/lib/ai/schemas.ts`.
- Em varias rotas REST, a validacao ainda e manual com `formData.get(...)` e checagens simples.

## Tratamento de erros e logs

- Predomina `try/catch` com `console.error(...)`.
- Existem tags de log utilitarias, como `TICKET_POST`, `TICKETS_GET` e `AI_AGENTS_GET`.
- Ainda nao ha logger estruturado centralizado.

## Convencoes de tipagem

- A base e majoritariamente tipada, mas com pontos frouxos:
  - casts para `any` em sessao e auth
  - `@ts-ignore` em `src/auth.ts`
  - trechos de frontend que aceitam dados de ticket sem tipo forte
- Quando tipa explicitamente, o projeto tende a usar `interface` para props e `Record<string, ...>` para mapas visuais.

## Convencoes de UI

- Tailwind como base visual principal.
- `Radix UI` e `shadcn/ui` como fundacao dos componentes.
- Uso frequente de cards, tabelas, overlays e visual de dashboard.
- Componentes especiais de IA e efeito visual ficam concentrados em `src/components/ui/` e `src/components/ai/`.

## Regras implicitas da base

- Colocar regra de negocio reaproveitavel em `src/lib/`.
- Deixar paginas e rotas relativamente finas.
- Reutilizar `src/components/ui/` antes de criar variacoes novas.
- Usar Prisma direto quando a regra ainda e simples.
- Tratar auth no servidor com `auth()` em rotas e paginas protegidas.

## Inconsistencias que merecem padronizacao

- Mensagens HTTP misturam textos com e sem acento.
- Uso frequente de `any` em sessao e dominio.
- Logs de depuracao ainda estao misturados ao fluxo normal.
- Falta um padrao unico de validacao forte para todas as rotas REST.

## Resumo operacional

- A base e organizada e facil de navegar.
- A principal fragilidade de convencao hoje nao esta na estrutura, mas no relaxamento de tipos, logs e validacao entre modulos.
