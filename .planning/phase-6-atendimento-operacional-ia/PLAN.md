# Plano: Fase 6 - Atendimento Operacional por IA

## Objetivo
Transformar a IA em participante operacional do atendimento, com capacidade de responder, planejar e encaminhar corretamente.

## Escopo
- Integracao do Gemini ao atendimento real.
- Comentarios publicos e internos.
- Escalonamento para atendente sem devolver para fila solta.
- Aplicacao de workflow completo do ticket.
- Sugestao de `plannedStartDate` e `plannedDueDate`.
- Leitura resumida da operacao de IA no dashboard.

## Arquivos Envolvidos
- `src/lib/ai/gemini-service.ts`
- `src/lib/ai/config.ts`
- `src/lib/actions/ai.ts`
- `src/app/api/tickets/[id]/comments/route.ts`
- `src/lib/actions/dashboard.ts`

## Tarefas
- [x] Conectar Gemini ao atendimento real.
- [x] Fazer a IA atuar no workflow completo do ticket.
- [x] Expor atividade e leitura operacional da IA no produto.

## Verificacao
- [x] IA responde em chamados reais.
- [x] IA pode escalar para atendente com mensagens corretas.
- [x] `PENDING_USER` e datas planejadas entram no fluxo quando fizer sentido.
- [x] Logs e indicadores da IA ficam disponiveis para leitura.
