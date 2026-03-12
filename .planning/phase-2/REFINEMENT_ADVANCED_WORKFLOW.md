# Refinamento Fase 2.2: Workflows Avançados e Triagem (Padrão Softdesk)

## Objetivo
Implementar workflows críticos de colaboração e triagem, permitindo o encaminhamento de chamados para o solicitante com pausa de SLA, retorno automático de status e uma visão dedicada para chamados sem atendente (Fila de Triagem).

## Escopo e Impacto
- **Workflow de Pendência:** Botão "Aguardar Solicitante" que pausa o SLA e exige nota pública.
- **Inteligência de Retorno:** O chamado volta automaticamente para "Triagem" assim que o solicitante responde.
- **Fila de Triagem:** Página dedicada para visualizar chamados que ainda não possuem atendente atribuído.
- **Navegação Inteligente:** Submenus no Sidebar com contadores em tempo real para facilitar o foco do atendente.

## Arquitetura e Dependências
- **API de Comentários:** Atualização para detectar perfil do autor e disparar troca de status automática.
- **API de Tickets:** Novos filtros para buscar chamados sem `assigneeId`.
- **Componentes:** `Badge` (Shadcn), `Accordion` (Shadcn - para submenus no Sidebar).

## Plano de Implementação (Passo a Passo)

### 1. Workflow "Aguardar Solicitante"
- [ ] No `TicketDetailsPage`, adicionar ação rápida "Aguardar Solicitante".
- [ ] Configurar para que, ao clicar, o sistema selecione o status `PENDING_USER` e force a desativação de "Nota Interna".
- [ ] Atualizar visualização do SLA para exibir status "PAUSADO" quando o ticket estiver nesta condição.

### 2. Auto-Retorno de Status
- [ ] Atualizar `src/app/api/tickets/[id]/comments/route.ts`:
    - Se o status atual do ticket for `PENDING_USER` E o autor do comentário for o `requesterId`, mudar automaticamente o status do ticket para `TRIAGE`.
    - Registrar essa transição automática no `TicketTransition`.

### 3. Fila de Triagem (Chamados sem Atendente)
- [ ] Criar rota `/dashboard/tickets/unassigned`.
- [ ] Implementar visualização em lista/cards focada em chamados onde `assigneeId == null`.
- [ ] Adicionar botão de "Assumir Chamado" rápido nesta lista.

### 4. Refinamento do Sidebar (Nível Softdesk)
- [ ] Adicionar submenus sob "Chamados":
    - **Fila de Triagem** (Apenas Agentes/Admins) - Chamados sem atendente.
    - **Meus Atendimentos** (Apenas Agentes/Admins) - Chamados atribuídos ao logado.
    - **Meus Chamados** (Para Usuários) - Chamados abertos pelo logado.
- [ ] Implementar Server Action para buscar as contagens desses itens e exibir Badges numéricos no menu.

## Verificação e Testes
- [ ] Enviar chamado para "Aguardando Solicitante" e confirmar se o SLA parou de contar.
- [ ] Responder como Solicitante e verificar se o chamado voltou para "Triagem" sozinho.
- [ ] Abrir um novo chamado e garantir que ele apareça imediatamente na "Fila de Triagem".
