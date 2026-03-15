# Plano: Fase 2 - Core Ticketing e Workflow Base

## Objetivo
Entregar o nucleo operacional do Service Desk com tickets, historico, atribuicao e workflow coerente.

## Escopo
- Criacao e consulta de tickets.
- Categorias e subcategorias.
- Timeline de comentarios e transicoes.
- Atribuicao e mudanca de status.
- Consolidacao dos estados do fluxo atual.

## Arquivos Envolvidos
- `prisma/schema.prisma`
- `src/app/api/tickets/route.ts`
- `src/app/api/tickets/[id]/route.ts`
- `src/app/dashboard/tickets/new/page.tsx`
- `src/components/dashboard/ticket-detail-view.tsx`

## Tarefas
- [x] Modelar tickets, comentarios e transicoes.
- [x] Implementar abertura, listagem e detalhe.
- [x] Consolidar workflow base do atendimento.

## Verificacao
- [x] Chamados possuem historico de operacao.
- [x] Atribuicao e status funcionam no fluxo principal.
- [x] Tipos e categorias sustentam cenarios reais de atendimento.
