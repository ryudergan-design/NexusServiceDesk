# Contexto da Fase 6: Atendimento Operacional por IA

## Objetivo
Fazer a IA atuar de verdade no atendimento, tomando decisoes coerentes com o workflow completo do ticket.

## Fases antigas absorvidas
- `phase-9`
- `phase-10`
- `phase-13`

## O que esta fase cobre
- Gemini como motor principal do atendimento assistido.
- Comentarios publicos e internos gerados pela IA.
- Escalonamento para atendente.
- Aplicacao de status coerentes como `PENDING_USER`, testes, desenvolvimento e aprovacao.
- Sugestao de datas planejadas.
- Logs e leitura operacional de IA no dashboard.

## Evidencias no codigo
- `src/lib/ai/gemini-service.ts`
- `src/lib/ai/config.ts`
- `src/lib/actions/ai.ts`
- `src/app/api/tickets/[id]/comments/route.ts`
- `src/lib/actions/dashboard.ts`
