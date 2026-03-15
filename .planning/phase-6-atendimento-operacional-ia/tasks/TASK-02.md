# Task 2: Workflow Inteligente do Ticket

## Objetivo
Fazer a IA pensar no proximo passo operacional do chamado.

## Arquivos Envolvidos
- `src/lib/actions/ai.ts`
- `src/lib/ai/gemini-service.ts`

## Criterios de Aceite
- [x] A IA pode mover para `PENDING_USER`, desenvolvimento, teste e aprovacao.
- [x] Escalonamento nao devolve para fila sem responsavel.
- [x] A IA pode sugerir datas planejadas quando houver contexto.
