---
status: investigating
trigger: "Resolver erro de 'Unknown argument' no Prisma (isInternal/timeSpent) no Windows."
created: 2026-03-12T07:45:00.000Z
updated: 2026-03-12T07:45:00.000Z
---

## Foco Atual

hipótese: O Prisma Client em `node_modules` está bloqueado por processos do Windows (EPERM), impedindo a atualização para incluir os campos `isInternal` e `timeSpent`.
teste: Verificar se o `npx prisma generate` falha e configurar um `output` customizado no `schema.prisma`.
esperando: Que o Prisma Client seja gerado com sucesso em um novo local e que os campos sejam aceitos no TypeScript.
próxima_ação: Tentar rodar `npx prisma generate` e observar o erro.

## Sintomas

esperado: `TicketComment.create` aceitar os campos `isInternal` e `timeSpent`.
real: O compilador/Prisma reporta `Unknown argument` para esses campos.
erros: `Unknown argument 'isInternal' for data.`, `Unknown argument 'timeSpent' for data.`
reprodução: Tentar usar esses campos na chamada de `prisma.ticketComment.create`.
começou: Recentemente, após adição dos campos ao schema.

## Eliminados

## Evidência

- timestamp: 2026-03-12T07:45:00.000Z
  verificado: `prisma/schema.prisma`
  encontrado: Os campos `isInternal` e `timeSpent` ESTÃO presentes no model `TicketComment`.
  implicação: O schema está correto, o problema é a geração do Client.
- timestamp: 2026-03-12T07:46:00.000Z
  verificado: `src/app/api/tickets/[id]/comments/route.ts`
  encontrado: Comentário no código indicando que o desenvolvedor já sabe do "lock no binário" e está usando `isPrivate` como workaround para `isInternal`. `timeSpent` está sendo usado mas provavelmente causando erro de compilação ou runtime.
  implicação: A causa raiz (EPERM no Windows) está confirmada por observação externa.

## Resolução

causa_raiz:
correção:
verificação:
arquivos_alterados: []
