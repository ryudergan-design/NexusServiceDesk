# Divergentes

Esta pasta guarda arquivos que hoje nao fazem parte do fluxo principal do sistema, mas que podem ter algum valor historico, tecnico ou de reaproveitamento.

## Criterio usado
- arquivos sem participacao no runtime principal do frontend
- scripts auxiliares sem ligacao com `package.json`
- artefatos de debug, auditoria, pivot ou experimentacao
- utilitarios Prisma paralelos ao fluxo atual
- banco local solto fora da estrutura oficial atual

## Subpastas
- `docs/`
  Documentos paralelos, auditorias antigas, pivots e notas operacionais.
- `scripts/`
  Scripts auxiliares e testes avulsos nao conectados ao fluxo principal.
- `prisma-utils/`
  Seeds e utilitarios antigos ou paralelos de IA e manutencao.
- `banco/`
  Arquivos de banco fora da estrutura oficial ativa.

## Estrutura oficial que ficou ativa
- frontend e backend principal em `src/`
- schema oficial em `prisma/schema.prisma`
- banco SQLite ativo em `prisma/dev.db`
- seeds principais em `prisma/seed.ts` e `prisma/seed-nexus.ts`
- fases e documentos vivos em `.planning/`
- espelho Supabase em `BANCO_DE_DADOS/SUPABASE/`

## Proximo uso
Revisar esta pasta em blocos para decidir o que:
- volta para a base oficial
- vira documentacao arquivada
- pode ser eliminado de vez
