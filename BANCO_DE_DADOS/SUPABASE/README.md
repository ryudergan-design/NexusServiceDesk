# Estrutura de Backup para Supabase

Esta pasta existe para manter o projeto preparado para uma futura migracao de `SQLite` para `Supabase (PostgreSQL)`, sem alterar o runtime atual.

## Objetivo
- manter um espelho estrutural do banco para Supabase
- facilitar migracao futura
- evitar redescobrir compatibilidades depois

## Estado atual do projeto
- banco oficial em uso: `SQLite`
- ORM oficial: `Prisma`
- schema oficial atual: `prisma/schema.prisma`

## Arquivos desta pasta
- `prisma/schema.supabase.prisma`
  Espelho do schema atual, adaptado para `postgresql`
- `prisma/mirror-state.json`
  Registro do ultimo estado sincronizado entre schema principal e espelho
- `SYNC_CHECKLIST.md`
  Lista do que deve ser revisado sempre que o schema SQLite mudar
- `../PROMPT_MIGRACAO_SUPABASE_PARA_SQLITE.md`
  Prompt base para orientar migracoes de uma origem Supabase para SQLite sem perder o espelho do Supabase
- `../PROMPT_MIGRACAO_SQLITE_PARA_SUPABASE.md`
  Prompt base para orientar migracoes de uma origem SQLite para Supabase sem perder o espelho do SQLite

## Regra operacional
Sempre que houver alteracao relevante em `prisma/schema.prisma`, revisar e refletir o impacto neste espelho do Supabase.

## Comandos uteis
- `npm run check`
  Fluxo padrao de revisao do projeto. Hoje ele executa a validacao de tipos e a checagem do espelho do Supabase.
- `npm run db:mirror:check`
  Verifica se o schema principal mudou desde a ultima revisao registrada.
- `npm run db:mirror:update`
  Atualiza o registro do espelho depois da revisao manual.
- `npm run db:mirror:validate`
  Valida o schema espelho do Supabase com Prisma.

## Fluxo recomendado quando mudar o schema SQLite
1. Ajustar `prisma/schema.prisma`.
2. Revisar `BANCO_DE_DADOS/SUPABASE/prisma/schema.supabase.prisma`.
3. Rodar `npm run db:mirror:validate`.
4. Rodar `npm run db:mirror:update`.
5. Rodar `npm run check`.

## Observacao importante
Nem tudo do SQLite possui equivalencia 1:1 com Postgres, especialmente:
- tabelas auxiliares de FTS do SQLite
- detalhes de migracao especificos do provider
- comportamento de indices e extensoes futuras

Por isso, este espelho serve como base de migracao e manutencao preventiva, nao como ambiente ativo de producao neste momento.
