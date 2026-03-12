# Refinamento da Experiência do Solicitante (Padrão Softdesk)

## Objetivo
Ajustar o sistema para que o Solicitante tenha uma visão estrita de seus próprios chamados, acesso limitado à edição de perfil e acompanhamento detalhado de pendências (Orçamentos/Devolutivas), conforme o fluxo do Softdesk.

## Escopo e Impacto
- **Privacidade de Dados:** Solicitantes enxergam apenas chamados abertos por eles.
- **Restrição de Perfil:** Bloqueio de edição de dados cadastrais para o papel Solicitante (apenas visualização).
- **Novas Filas de Cliente:**
    - Aguardando Minha Aprovação (Orçamentos pendentes).
    - Aguardando Minha Resposta (Chamados com devolutiva técnica).
    - Meus Chamados em Aberto.
    - Meus Chamados Encerrados.
- **Dashboard Contextual:** KPIs específicos para o Solicitante refletindo suas pendências.

## Plano de Implementação (Passo a Passo)

### 1. Segurança e Perfil
- [ ] Atualizar `src/lib/actions/users.ts`: Bloquear `updateProfile` para usuários no modo Solicitante.
- [ ] Atualizar `src/app/dashboard/profile/profile-client.tsx`:
    - Receber `activeRole` como prop.
    - Desabilitar campos e ocultar botão "Salvar" se `activeRole === 'USER'`.

### 2. Navegação e Contadores (Sidebar)
- [ ] Atualizar `src/lib/actions/nav.ts` para calcular:
    - `myAwaitingApproval` (Status `AWAITING_APPROVAL` + `requesterId`).
    - `myAwaitingResponse` (Status `PENDING_USER` + `requesterId`).
- [ ] Atualizar `src/components/sidebar-content.tsx` para exibir a nova estrutura sob "Minhas Solicitações".

### 3. Listagem de Chamados (Filtros)
- [ ] Atualizar `src/app/dashboard/tickets/page.tsx`:
    - Implementar casos `my_approval` e `my_pending` na lógica de filtragem.
    - Garantir que Solicitantes nunca vejam chamados de terceiros, mesmo sem filtro explícito.

### 4. Dashboard do Solicitante
- [ ] Atualizar `src/lib/actions/dashboard.ts`:
    - Utilizar `activeRole` para retornar KPIs de cliente (Aprovação, Resposta, Total).
- [ ] Atualizar `src/app/dashboard/dashboard-client.tsx`:
    - Ajustar os cards de estatísticas para o modo Solicitante.

## Verificação
- [ ] Logar como Solicitante e tentar editar o perfil -> Deve estar bloqueado.
- [ ] Validar se chamados de outros usuários sumiram da visão do Solicitante.
- [ ] Confirmar se o contador de "Aguardando Aprovação" no menu lateral bate com os chamados que possuem orçamento.
