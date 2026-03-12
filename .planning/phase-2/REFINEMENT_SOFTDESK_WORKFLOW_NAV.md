# Refinamento Fase 2.3: Reestruturação de Navegação e Workflow de Aprovação (Padrão Softdesk)

## Objetivo
Reorganizar a estrutura de "Meus Chamados" no sistema para refletir a produtividade operacional do Softdesk e implementar o workflow de "Aprovação do Solicitante" para atendimentos que envolvem custos ou decisões críticas.

## Escopo e Impacto
- **Reestruturação do Menu:** Divisão clara entre "Gestão Operacional" (para técnicos) e "Minhas Solicitações" (para clientes).
- **Novas Filas Operacionais:** 
    - Sem Atendente (Fila de Triagem)
    - Aguardando Solicitante (Tickets em pausa pelo cliente)
    - Aguardando Aprovação (Tickets que necessitam de "Ok" financeiro/técnico)
- **Workflow de Aprovação:** 
    - Ação do técnico para solicitar aprovação.
    - Interface do cliente para Aprovar/Reprovar com log automático.
    - Pausa de SLA durante a pendência de aprovação.

## Arquitetura e Mudanças
- **Database (Prisma):** Utilização do status `AWAITING_APPROVAL` no modelo `Ticket`.
- **API PATCH /tickets/[id]:** Suporte às novas transições de aprovação.
- **Sidebar:** Nova lógica de agrupamento e contadores específicos por fila.

## Plano de Implementação (Passo a Passo)

### 1. Novo Workflow: Aprovação Financeira/Crítica
- [ ] Adicionar botão "Solicitar Aprovação" no `TicketDetailsPage` (visível para Agentes).
- [ ] Implementar interface de resposta para o Solicitante:
    - Botões "Aprovar Atendimento" e "Reprovar/Encerrar".
    - Exigir comentário na reprovação.
- [ ] Atualizar lógica de pausa de SLA para incluir o status `AWAITING_APPROVAL`.

### 2. Reorganização do Sidebar (Nível Softdesk)
- [ ] **Grupo "Gestão de Atendimento" (Staff):**
    - Meus Atendimentos (`assigneeId == me`)
    - Sem Atendente (`assigneeId == null`)
    - Aguardando Solicitante (`status == PENDING_USER`)
    - Aguardando Aprovação (`status == AWAITING_APPROVAL`)
- [ ] **Grupo "Minhas Solicitações" (Para Clientes):**
    - Chamados Abertos
    - Histórico / Encerrados
- [ ] Atualizar `src/lib/actions/nav.ts` para fornecer todos os contadores dessas novas filas.

### 3. Visualizações de Fila
- [ ] Criar/Ajustar páginas para suportar os filtros rápidos:
    - `/dashboard/tickets?filter=pending_user`
    - `/dashboard/tickets?filter=awaiting_approval`
    - `/dashboard/tickets?filter=unassigned`

## Verificação e Testes
- [ ] Simular um chamado de manutenção de hardware que exige aprovação de orçamento.
- [ ] Validar se o chamado aparece na fila "Aguardando Aprovação" do técnico.
- [ ] Confirmar se o cliente recebe as opções de Aprovar/Reprovar na tela do chamado.
- [ ] Validar se o SLA pausa corretamente durante a espera.
