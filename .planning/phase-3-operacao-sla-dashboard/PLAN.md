# Plano: Fase 3 - Operacao, SLA, Dashboard e Dual View

## Objetivo
Consolidar a camada de monitoramento e operacao diaria do produto.

## Escopo
- Motor basico de SLA.
- Dashboard principal com leitura distinta para cliente e equipe.
- Alternancia Kanban e Desk.
- Filtros de fila por papel e responsavel.
- Performance visual para lotes grandes de tickets.
- Acessibilidade mobile com rolagem horizontal onde o conteudo for naturalmente largo.
- Adaptacao da Gestao de Usuarios para mobile sem perder a tabela desktop.

## Arquivos Envolvidos
- `prisma/schema.prisma`
- `src/lib/sla.ts`
- `src/lib/actions/dashboard.ts`
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/tickets/page.tsx`
- `src/components/dashboard/desk-view.tsx`
- `src/components/dashboard/kanban-view.tsx`
- `src/hooks/use-virtual-list.ts`
- `src/components/dashboard/ticket-detail-view.tsx`
- `src/app/dashboard/admin/users/users-client.tsx`
- `src/components/header.tsx`
- `PROJETO/testes-mobile/`

## Tarefas
- [x] Entregar indicadores e dashboard operacional.
- [x] Implementar Desk, Kanban e Quick View.
- [x] Restringir e otimizar a visualizacao das filas.
- [x] Garantir acesso mobile aos blocos largos com rolagem horizontal controlada.
- [x] Reestruturar a Gestao de Usuarios para uso mobile com evidencia visual.

## Verificacao
- [x] Dashboard exibe informacoes relevantes por perfil.
- [x] Kanban e Desk funcionam como modos complementares.
- [x] O Kanban geral mostra apenas novos sem atendente e tickets do proprio atendente.
- [x] A listagem permanece fluida com volume alto.
- [x] O detalhe do chamado nao prende mais informacao horizontal no mobile.
- [x] A Gestao de Usuarios possui antes/depois documentado em `PROJETO/testes-mobile/gestao-usuarios/`.
