# Plano de Implementação: IDs Sequenciais e Correção de Carregamento

Este plano detalha a transição dos IDs dos chamados de `cuid()` (String) para números sequenciais (Integer) e a correção do erro de carregamento dos detalhes do chamado.

## 1. Alterações no Banco de Dados (Prisma)

### `prisma/schema.prisma`
- Alterar `Ticket.id` de `String` para `Int` com `@default(autoincrement())`.
- Alterar as referências em outros modelos de `String` para `Int`:
    - `Attachment.ticketId`
    - `TicketTransition.ticketId`
    - `TicketComment.ticketId`
    - `SatisfactionSurvey.ticketId`
- Manter `AuditLog.entityId` como `String` (polimórfico).
- Manter `Notification.link` como `String`.

## 2. Alterações nas Rotas de API (Backend)

### `src/app/api/tickets/[id]/route.ts`
- Atualizar `GET` e `PATCH` para converter `params.id` para `Int` usando `parseInt()`.
- Validar se o `id` é um número válido antes da consulta.

### `src/app/api/tickets/[id]/comments/route.ts`
- Atualizar `POST` para converter `params.id` para `Int`.

### `src/app/api/tickets/route.ts`
- Nenhuma alteração estrutural necessária no `POST`, o Prisma cuidará do autoincremento.
- O `GET` retornará os novos IDs inteiros.

### `src/app/api/notifications/route.ts`
- Garantir que links gerados dinamicamente usem o ID inteiro.

## 3. Alterações no Frontend

### `src/app/dashboard/tickets/[id]/page.tsx`
- Atualizar a exibição do ID: remover `.slice(-8).toUpperCase()` e exibir apenas `#{ticket.id}`.
- Garantir que o `id` passado para a API seja o correto (já é string na URL, mas a API fará o parse).

### `src/components/dashboard/satisfaction-survey.tsx`
- Atualizar a interface `SatisfactionSurveyProps` para aceitar `ticketId: string | number`.
- Remover formatações de string específicas de `cuid` (como `slice`).

### `src/components/header.tsx`
- Verificar se a lista de notificações precisa de ajuste na formatação do link.

## 4. Correção do Erro de Carregamento

- Investigar se o erro "Não foi possível carregar os detalhes do chamado" persiste após a migração.
- Adicionar logs detalhados no backend em `src/app/api/tickets/[id]/route.ts` para capturar falhas de consulta.
- Verificar se `activeRole` está sendo extraído corretamente da sessão.

## 5. Passos de Execução

1.  Fazer backup do `dev.db` atual.
2.  Modificar `prisma/schema.prisma`.
3.  Executar `npx prisma migrate dev --name change_ticket_id_to_int`.
    *Nota: Isso pode causar a perda de dados de tickets existentes devido à alteração de tipo de chave primária em SQLite.*
4.  Executar `npx prisma generate` para atualizar o cliente customizado em `src/generated/client`.
5.  Aplicar as alterações de código no Backend.
6.  Aplicar as alterações de código no Frontend.
7.  Testar a criação de um novo chamado e a visualização de seus detalhes.
8.  Testar as notificações e o fluxo de conclusão/pesquisa.

## 6. Verificação

- [ ] Criar novo chamado -> ID deve ser 1, 2, 3...
- [ ] Clicar no chamado -> Detalhes devem carregar sem erro.
- [ ] Adicionar comentário -> Deve funcionar com ID inteiro.
- [ ] Concluir chamado -> Notificação deve aparecer com link funcional.
- [ ] Avaliar chamado -> Pesquisa deve funcionar com ID inteiro.
