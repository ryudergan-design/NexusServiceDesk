# Refinamento Fase 2.4: Módulo de Qualidade (CSAT e Reabertura)

## Objetivo
Implementar o fluxo de encerramento ITIL, permitindo que o Solicitante avalie o atendimento recebido (CSAT) ou reabra o chamado caso a solução apresentada não seja satisfatória.

## Escopo e Impacto
- **Pesquisa de Satisfação (CSAT):** Adição de campos de avaliação (rating de 1 a 5 estrelas) e comentário de feedback no ticket.
- **Workflow de Encerramento:** Quando o ticket vai para `COMPLETED`, o Solicitante ganha acesso aos botões "Avaliar Atendimento" e "Não Resolvido (Reabrir)".
- **Reabertura (Contestação):** Botão que permite ao Solicitante voltar o ticket para a fila de `TRIAGE` caso o problema persista, limpando a avaliação anterior.
- **Banco de Dados:** Expansão do modelo `Ticket` para suportar `rating` e `feedback`.

## Arquitetura e Mudanças
- **Prisma Schema:** Adicionar `rating Int?` e `feedback String?` ao modelo `Ticket`.
- **API `PATCH /tickets/[id]`:** Suportar as propriedades de avaliação e a lógica de reabertura (resetando o status para `TRIAGE`).
- **UI de Detalhes:** Adicionar o componente `SatisfactionSurvey` na página do chamado (visível apenas para o Solicitante quando `status === 'COMPLETED'`).

## Plano de Implementação (Passo a Passo)

### 1. Atualização de Dados (Prisma)
- [ ] Editar `prisma/schema.prisma` adicionando `rating Int?` e `feedback String?` na tabela `Ticket`.
- [ ] Executar `npx prisma migrate dev --name add_csat_fields`.

### 2. API e Workflow Backend
- [ ] Atualizar `src/app/api/tickets/[id]/route.ts`:
    - Permitir gravação de `rating` e `feedback`.
    - Lógica de Reabertura: Se status for alterado de `COMPLETED` para `TRIAGE`, criar um log de transição dizendo "Chamado reaberto pelo solicitante".

### 3. Interface de Qualidade (Frontend)
- [ ] Criar componente visual de 5 estrelas interativo (CSS + Framer Motion).
- [ ] Na página de detalhes do chamado (`[id]/page.tsx`):
    - Se o chamado for `COMPLETED` E o usuário for o Solicitante E não tiver avaliação -> Exibir Card de Avaliação / Reabertura.
    - Se o chamado for `COMPLETED` E já tiver avaliação -> Exibir o resultado da avaliação com as estrelas preenchidas.

## Verificação e Testes
- [ ] Criar um chamado e movê-lo para "Concluído" via conta de Atendente.
- [ ] Logar como Solicitante, entrar no chamado e submeter uma avaliação de 4 estrelas.
- [ ] Em outro chamado concluído, clicar em "Não Resolvido" e verificar se ele volta para a "Fila de Triagem" no dashboard do técnico.
