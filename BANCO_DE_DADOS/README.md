# Banco de Dados

Esta pasta concentra a organizacao dos artefatos de banco do projeto.

## Estrutura
- `SQLITE/`
  Material do banco oficial atual do sistema.
- `SUPABASE/`
  Espelho estrutural e documentacao de migracao futura.
- `PROMPT_MIGRACAO_SUPABASE_PARA_SQLITE.md`
  Prompt reutilizavel para orientar migracoes de uma base original em Supabase para o padrao atual em SQLite, mantendo o espelho do Supabase.
- `PROMPT_MIGRACAO_SQLITE_PARA_SUPABASE.md`
  Prompt reutilizavel para orientar migracoes de uma base original em SQLite para Supabase, mantendo o espelho do SQLite.

## Regra pratica
- O banco oficial continua sendo `SQLite` com `Prisma`.
- O espelho do `Supabase` nao e runtime ativo.
- Sempre que o schema principal mudar, usar `npm run check` e o fluxo do espelho.
