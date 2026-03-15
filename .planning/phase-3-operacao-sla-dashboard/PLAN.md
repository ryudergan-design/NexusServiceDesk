# Plano: Fase 3 - Operacao, SLA, Dashboard e Dual View

## Objetivo
Consolidar a camada de monitoramento e operacao diaria do produto.

## Escopo
- Motor basico de SLA.
- Dashboard principal com leitura distinta para cliente e equipe.
- Alternancia Kanban e Desk.
- Filtros de fila por papel e responsavel.
- Performance visual para lotes grandes de tickets.

## Arquivos Envolvidos
- `prisma/schema.prisma`
- `src/lib/sla.ts`
- `src/lib/actions/dashboard.ts`
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/tickets/page.tsx`
- `src/components/dashboard/desk-view.tsx`
- `src/components/dashboard/kanban-view.tsx`
- `src/hooks/use-virtual-list.ts`

## Tarefas
- [x] Entregar indicadores e dashboard operacional.
- [x] Implementar Desk, Kanban e Quick View.
- [x] Restringir e otimizar a visualizacao das filas.

## Verificacao
- [x] Dashboard exibe informacoes relevantes por perfil.
- [x] Kanban e Desk funcionam como modos complementares.
- [x] O Kanban geral mostra apenas novos sem atendente e tickets do proprio atendente.
- [x] A listagem permanece fluida com volume alto.
