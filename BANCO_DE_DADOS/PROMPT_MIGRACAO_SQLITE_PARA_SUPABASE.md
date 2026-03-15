# Prompt de Migracao: SQLite para Supabase com Espelho SQLite

Use este prompt quando a base de origem estiver em `SQLite`, mas a base oficial de destino precisar ser `Supabase/PostgreSQL`, mantendo tambem um espelho estrutural para `SQLite`.

## Objetivo

Converter uma base existente em `SQLite` para `Supabase/PostgreSQL`, sem perder a possibilidade de voltar a usar `SQLite` no futuro.

O resultado esperado e:
- `Supabase/PostgreSQL` como banco oficial de operacao
- espelho estrutural mantido para `SQLite`
- documentacao clara das divergencias entre os dois bancos

## Prompt pronto para uso

```md
Voce esta trabalhando em um projeto que precisa migrar sua base de origem em SQLite para Supabase/PostgreSQL, mas sem abandonar a preparacao futura para voltar ao SQLite.

Seu objetivo e tratar o Supabase/PostgreSQL como banco oficial de operacao e manter um espelho estrutural para SQLite.

Siga estas regras com rigor:

1. Considere o schema, estrutura ou modelo principal em Supabase/PostgreSQL como a referencia oficial final do projeto.
2. Considere o schema, estrutura ou modelo espelho em SQLite como um backup arquitetural para uso futuro.
3. Toda tabela, coluna, relacionamento, indice, constraint e regra de negocio implementada no Supabase/PostgreSQL deve ser refletida no espelho do SQLite, respeitando as diferencas entre `postgresql` e `sqlite`.
4. Nao trate o espelho do SQLite como ambiente ativo, a menos que isso seja pedido explicitamente.
5. Se algo existir no SQLite original, mas nao fizer sentido no Supabase atual, registre isso explicitamente em documentacao em vez de esconder a diferenca.
6. Sempre preserve compatibilidade com o projeto atual antes de tentar equivalencia perfeita com recursos exclusivos do Supabase.
7. Nao assuma Prisma, ORM especifico ou framework especifico, a menos que o projeto forneca isso claramente.

Sua tarefa e:

- analisar a estrutura de origem do SQLite
- converter essa estrutura para o padrao oficial em Supabase/PostgreSQL
- manter um schema, documento ou estrutura espelho para SQLite
- listar divergencias tecnicas inevitaveis entre os providers
- garantir que a documentacao de banco fique coerente com a decisao arquitetural

Entregas esperadas:

1. Estrutura principal convertida para Supabase/PostgreSQL.
2. Estrutura espelho mantida para SQLite.
3. Registro das divergencias entre Supabase e SQLite.
4. Documentacao operacional da migracao.
5. Checklist de validacao final do ambiente.

Checklist obrigatorio:

- revisar a estrutura oficial em Supabase/PostgreSQL
- revisar a estrutura espelho em SQLite
- validar consistencia entre os dois modelos
- registrar as adaptacoes feitas por diferenca de provider
- registrar riscos futuros caso o projeto volte a usar SQLite como runtime

Ao concluir, entregue:
- o que foi convertido
- o que precisou de adaptacao por diferenca de provider
- o que ficou apenas como espelho
- quais partes exigem atencao extra numa futura volta ao SQLite
```

## Quando usar

Use este arquivo quando:
- for preciso migrar de uma base local ou embarcada em `SQLite` para `Supabase`
- o projeto for passar a operar com `PostgreSQL`
- for preciso pedir para outra IA ou profissional repetir esse processo

## O que este prompt faz

- orienta a conversao do banco de origem
- protege a decisao nova de `Supabase/PostgreSQL`
- evita perder o espelho preventivo do `SQLite`

## Valor recomendado

Use este prompt como ponto de partida oficial para qualquer migracao `SQLite -> Supabase`, com espelho preventivo para `SQLite`.
