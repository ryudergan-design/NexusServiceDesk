# Task 1: Execucao Real da IA

## Objetivo
Permitir que a IA processe tickets de verdade dentro do fluxo de comentarios.

## Arquivos Envolvidos
- `src/lib/ai/gemini-service.ts`
- `src/app/api/tickets/[id]/comments/route.ts`
- `src/lib/actions/ai.ts`

## Criterios de Aceite
- [x] A IA consegue responder em tickets reais.
- [x] A resposta gera comentario e log.
- [x] Falhas podem ser auditadas.
