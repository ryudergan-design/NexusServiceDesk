# Contexto da Fase 8: Estrategia de Banco e Espelho Futuro

## Objetivo
Manter `SQLite` como banco oficial do projeto e preparar o terreno para um futuro uso de `Supabase/PostgreSQL` sem mudar o runtime atual.

## Fases antigas absorvidas
- `phase-14`

## O que esta fase cobre
- Schema espelho para Supabase.
- Estado de sincronizacao estrutural.
- Script de verificacao do espelho.
- Integracao da checagem ao fluxo padrao de revisao.
- Documentacao de migracao e manutencao.

## Evidencias no codigo
- `BANCO_DE_DADOS/SUPABASE/prisma/schema.supabase.prisma`
- `BANCO_DE_DADOS/SUPABASE/prisma/mirror-state.json`
- `scripts/supabase-mirror-check.mjs`
- `package.json`
