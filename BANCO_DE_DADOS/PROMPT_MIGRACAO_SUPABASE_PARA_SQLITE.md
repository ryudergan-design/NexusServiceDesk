# Prompt de Migracao: Supabase para SQLite com Espelho Supabase

Use este prompt quando a base de origem estiver em `Supabase/PostgreSQL`, mas a base oficial de destino precisar ser `SQLite`, mantendo tambem um espelho estrutural para `Supabase`.

## Objetivo

Converter uma base existente em `Supabase` para `SQLite`, sem perder a possibilidade de voltar a usar `Supabase` no futuro.

O resultado esperado e:
- `SQLite` como banco oficial de operacao
- espelho estrutural mantido para `Supabase/PostgreSQL`
- documentacao clara das divergencias entre os dois bancos

## Prompt pronto para uso

```md
Voce esta trabalhando em um projeto que precisa migrar sua base de origem em Supabase/PostgreSQL para SQLite, mas sem abandonar a preparacao futura para voltar ao Supabase.

Seu objetivo e tratar o SQLite como banco oficial de operacao e manter um espelho estrutural para Supabase/PostgreSQL.

Siga estas regras com rigor:

1. Considere o schema, estrutura ou modelo principal em SQLite como a referencia oficial final do projeto.
2. Considere o schema, estrutura ou modelo espelho em Supabase/PostgreSQL como um backup arquitetural para uso futuro.
3. Toda tabela, coluna, relacionamento, indice, constraint e regra de negocio implementada no SQLite deve ser refletida no espelho do Supabase, respeitando as diferencas entre `sqlite` e `postgresql`.
4. Nao trate o espelho do Supabase como ambiente ativo, a menos que isso seja pedido explicitamente.
5. Se algo existir no Supabase original, mas nao fizer sentido no SQLite atual, registre isso explicitamente em documentacao em vez de esconder a diferenca.
6. Sempre preserve compatibilidade com o projeto atual antes de tentar equivalencia perfeita com recursos exclusivos do Supabase.
7. Nao assuma Prisma, ORM especifico ou framework especifico, a menos que o projeto forneca isso claramente.

Sua tarefa e:

- analisar a estrutura de origem do Supabase/PostgreSQL
- converter essa estrutura para o padrao oficial em SQLite
- manter um schema, documento ou estrutura espelho para Supabase/PostgreSQL
- listar divergencias tecnicas inevitaveis entre os providers
- garantir que a documentacao de banco fique coerente com a decisao arquitetural

Entregas esperadas:

1. Estrutura principal convertida para SQLite.
2. Estrutura espelho mantida para Supabase/PostgreSQL.
3. Registro das divergencias entre SQLite e Supabase.
4. Documentacao operacional da migracao.
5. Checklist de validacao final do ambiente.

Checklist obrigatorio:

- revisar a estrutura oficial em SQLite
- revisar a estrutura espelho em Supabase/PostgreSQL
- validar consistencia entre os dois modelos
- registrar as adaptacoes feitas por diferenca de provider
- registrar riscos futuros caso o projeto volte a usar Supabase em runtime

Ao concluir, entregue:
- o que foi convertido
- o que precisou de adaptacao por diferenca de provider
- o que ficou apenas como espelho
- quais partes exigem atencao extra numa futura volta ao Supabase
```

## Quando usar

Use este arquivo quando:
- chegar uma base legada em `Supabase`
- for necessario reconstruir a base oficial em `SQLite`
- for preciso pedir para outra IA ou profissional repetir esse processo

## O que este prompt faz

- orienta a conversao do banco de origem
- protege a decisao atual de `SQLite`
- evita perder o espelho preventivo do `Supabase`

## Valor recomendado

Use este prompt como ponto de partida oficial para qualquer migracao `Supabase -> SQLite`, com espelho preventivo para `Supabase`.
