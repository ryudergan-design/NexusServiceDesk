# Plano: Fase 8 - Estrategia de Banco e Espelho Futuro

## Objetivo
Formalizar a estrategia de espelho estrutural para banco futuro, sem sincronizacao em tempo real e sem trocar a base oficial.

## Escopo
- Criar schema espelho para `postgresql`.
- Registrar estado de sincronizacao.
- Criar validacao automatizada.
- Integrar a checagem ao fluxo padrao do projeto.
- Documentar prompts e orientacoes de migracao.

## Arquivos Envolvidos
- `BANCO_DE_DADOS/SUPABASE/prisma/schema.supabase.prisma`
- `BANCO_DE_DADOS/SUPABASE/prisma/mirror-state.json`
- `BANCO_DE_DADOS/SUPABASE/README.md`
- `BANCO_DE_DADOS/SUPABASE/SYNC_CHECKLIST.md`
- `scripts/supabase-mirror-check.mjs`
- `package.json`

## Tarefas
- [x] Criar o espelho estrutural do Supabase.
- [x] Criar processo de verificacao de defasagem.
- [x] Integrar a checagem ao fluxo padrao e documentar a manutencao.

## Verificacao
- [x] O schema espelho existe e valida.
- [x] O projeto detecta quando o espelho ficou para tras.
- [x] O fluxo de manutencao esta documentado.
