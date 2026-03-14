# Arquitetura do Sistema

**Data da analise:** 2026-03-14

## Visao geral

O projeto segue o modelo de monolito full-stack em `Next.js`, com frontend, backend HTTP, autenticacao, acesso a banco e automacoes de IA dentro da mesma base.

A separacao principal de responsabilidades fica assim:

- interface e rotas de pagina em `src/app/`
- componentes reutilizaveis em `src/components/`
- regra de negocio, actions, IA e utilitarios em `src/lib/`
- persistencia em `prisma/`

## Estilo arquitetural

### App Router como espinha dorsal

- Paginas e layouts ficam em `src/app/`.
- Endpoints HTTP ficam em `src/app/api/**/route.ts`.
- Layout autenticado principal em `src/app/dashboard/layout.tsx`.
- Layout global em `src/app/layout.tsx`.

### Monolito com backend embutido

Nao existe separacao em servico API externo. A propria aplicacao Next entrega:

- paginas
- APIs
- server actions
- middleware
- acesso a banco

Isso reduz friccao para evoluir rapido, mas aumenta o acoplamento entre UI, auth, banco e IA.

## Camadas principais

### 1. Camada de apresentacao

Responsavel pela experiencia visual e interacao do usuario.

Arquivos importantes:
- `src/app/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/components/header.tsx`
- `src/components/sidebar.tsx`
- `src/components/dashboard/*`
- `src/components/ai/*`
- `src/components/ui/*`

Caracteristicas observadas:
- composicao com Tailwind
- biblioteca visual interna baseada em Radix/shadcn
- dashboards e views orientadas a papel do usuario
- componentes cliente marcados com `"use client"`

### 2. Camada de borda HTTP

Responsavel por receber requisicoes, validar acesso e falar com a regra de negocio ou Prisma.

Arquivos importantes:
- `src/app/api/tickets/route.ts`
- `src/app/api/tickets/[id]/route.ts`
- `src/app/api/tickets/[id]/comments/route.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/categories/route.ts`
- `src/app/api/notifications/route.ts`
- `src/app/api/dashboard/export/route.ts`
- `src/app/api/dashboard/audit/route.ts`
- `src/app/api/ai/curation/route.ts`
- `src/app/api/ai/nps-analysis/route.ts`
- `src/app/api/ai-agents/route.ts`

Padrao observado:
- auth no inicio da rota
- acesso a banco com Prisma
- resposta via `NextResponse`
- logs simples com `console.error`

### 3. Camada de regra de negocio

Fica concentrada principalmente em `src/lib/`.

Blocos principais:
- actions em `src/lib/actions/`
- IA em `src/lib/ai/`
- SLA em `src/lib/sla.ts`
- auth compartilhada em `src/auth.ts`
- utilitarios em `src/lib/utils.ts`

Exemplos:
- `src/lib/actions/dashboard.ts` agrega dados para o dashboard conforme papel
- `src/lib/actions/users.ts` administra usuarios e preferencias
- `src/lib/actions/ai.ts` orquestra atribuicao de IA, composicao de resposta e escalacao

### 4. Camada de persistencia

- Schema em `prisma/schema.prisma`
- Cliente compartilhado em `src/lib/prisma.ts`
- Migracoes em `prisma/migrations/`
- Seeds e manutencao em `prisma/*.ts`

A aplicacao acessa o banco quase sempre de forma direta nas rotas e actions. Nao ha camada de repositorio dedicada.

## Fluxo de autenticacao e autorizacao

### Autenticacao

- Configurada em `src/auth.ts`
- Provider de credenciais
- Adapter Prisma
- Sessao em JWT
- Middleware de protecao em `src/middleware.ts`

### Autorizacao

A autorizacao atual e distribuida:
- parte no middleware
- parte em route handlers
- parte em server actions
- parte na logica do frontend com `activeRole`

Isso funciona para um monolito pequeno, mas pede cuidado porque as regras ficam espalhadas.

## Fluxo de dados principal do dominio

### Chamados

Fluxo tipico:
1. usuario interage com a UI em `src/app/dashboard/tickets/*`
2. frontend consome rota ou action
3. rota/action usa `auth()`
4. Prisma le ou grava dados de `Ticket`, `TicketComment`, `TicketTransition`, `Attachment`
5. resposta volta para o frontend em JSON ou props server-side

### Dashboard

- pagina server-side em `src/app/dashboard/page.tsx`
- agregacao principal em `src/lib/actions/dashboard.ts`
- visualizacao cliente em `src/app/dashboard/dashboard-client.tsx`

### IA

Fluxo atual:
1. ticket ou interacao ativa uma action ou rota
2. camada em `src/lib/actions/ai.ts` ou `src/lib/ai/agents/*.ts` prepara contexto
3. busca de conhecimento pode ocorrer em `src/lib/ai/rag/engine.ts`
4. provedor de IA e escolhido por configuracao e por agente
5. resultado gera comentario, transicao, log ou reatribuicao

## Fronteira server/client

A base mistura bem os dois lados, mas segue um padrao razoavel:

- server components para pagina e obtencao inicial de dados
- client components para interacao, graficos e fetch adicional
- route handlers para mutacoes e APIs consumidas pelo frontend
- server actions para casos de regra reutilizavel no lado servidor

## Pontos fortes da arquitetura atual

- Estrutura facil de navegar
- Stack coesa para produto full-stack pequeno/medio
- Dominio de chamados, auth e IA ja bem conectado
- Boa base para iteracao rapida

## Pontos de tensao

- Auth e autorizacao distribuidos em muitos pontos
- Prisma usado direto em varias bordas, o que aumenta repeticao
- Tipagem de sessao ainda fragil
- IA e automacao ja tem peso suficiente para merecer observabilidade melhor

## Resumo operacional

- O projeto e um monolito full-stack em `Next.js` com App Router.
- A arquitetura atual privilegia velocidade de desenvolvimento e proximidade entre UI, API, auth, banco e IA.
- O proximo ganho arquitetural viria de endurecer autorizacao, validacao e observabilidade, nao de quebrar em microservicos.
