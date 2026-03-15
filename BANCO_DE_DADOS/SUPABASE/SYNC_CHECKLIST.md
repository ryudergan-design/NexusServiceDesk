# Checklist de Sincronizacao SQLite -> Supabase

Sempre que mudar o arquivo [schema.prisma](/C:/Users/AMC/OneDrive/Music/I9%20chamados/prisma/schema.prisma), revisar estes pontos:

## 1. Mudancas de modelo
- novo model criado
- model removido
- nome de model alterado

## 2. Mudancas de coluna
- novo campo
- tipo alterado
- default alterado
- campo passou a ser opcional ou obrigatorio

## 3. Mudancas de relacionamento
- nova relation
- `onDelete`
- chaves unicas
- indices

## 4. Mudancas especificas de provider
- algo que usa recurso exclusivo do SQLite
- tabelas auxiliares de FTS
- comportamento que depende de `autoincrement`

## 5. Validacao minima
- revisar `BANCO_DE_DADOS/SUPABASE/prisma/schema.supabase.prisma`
- rodar `npm run db:mirror:validate`
- rodar `npm run db:mirror:update`
- rodar `npm run check`
- confirmar se a mudanca continua compativel com `postgresql`

## Regra simples
O schema oficial continua sendo o de `SQLite`, mas nenhuma mudanca estrutural importante deve ficar sem reflexo no espelho de `Supabase`.
