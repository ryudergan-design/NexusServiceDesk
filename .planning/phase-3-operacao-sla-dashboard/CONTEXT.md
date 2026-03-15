# Contexto da Fase 3: Operacao, SLA, Dashboard e Dual View

## Objetivo
Dar visibilidade operacional ao sistema e criar a experiencia principal de atendimento com dashboard, Desk e Kanban.

## Fases antigas absorvidas
- `phase-3`
- `phase-4`
- `phase-11`

## O que esta fase cobre
- SLA e indicadores operacionais.
- Dashboard principal por perfil.
- Modo Desk e Modo Kanban.
- Quick View lateral.
- Filas privadas e supervisao por responsavel.
- Restricao do Kanban geral para nao expor chamados de outros atendentes ou IAs.
- Otimizacao de renderizacao com virtualizacao.

## Evidencias no codigo
- `src/lib/sla.ts`
- `src/lib/actions/dashboard.ts`
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/tickets/page.tsx`
- `src/components/dashboard/desk-view.tsx`
- `src/components/dashboard/kanban-view.tsx`
- `src/components/dashboard/ticket-quick-view.tsx`
