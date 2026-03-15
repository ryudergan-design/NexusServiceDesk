# Contexto da Fase 2: Core Ticketing e Workflow Base

## Objetivo
Implementar o ciclo de vida central dos chamados e consolidar o workflow operacional principal do produto.

## Fases antigas absorvidas
- `phase-2`
- parte operacional de `phase-7`

## O que esta fase cobre
- Modelagem de tickets e categorias.
- Abertura, listagem e detalhamento de chamados.
- Comentarios, anexos e transicoes.
- Atribuicao e mudanca de status.
- Estados de operacao como triagem, desenvolvimento, testes e aprovacao.

## Evidencias no codigo
- `prisma/schema.prisma`
- `src/app/api/tickets/route.ts`
- `src/app/api/tickets/[id]/route.ts`
- `src/app/dashboard/tickets/new/page.tsx`
- `src/components/dashboard/ticket-detail-view.tsx`
