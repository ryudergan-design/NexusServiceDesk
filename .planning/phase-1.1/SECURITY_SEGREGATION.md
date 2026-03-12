# Refinamento de Segurança e Segregação de Papéis (Padrão Softdesk)

## Objetivo
Garantir que usuários logados como "Solicitante" não acessem telas ou funções administrativas exclusivas de "Atendentes", reforçando a segurança e a integridade do sistema RBAC (Role-Based Access Control).

## Escopo e Impacto
- **Middleware de Proteção:** Restrição de acesso a rotas `/dashboard/admin/*` e funções técnicas apenas para sessões com `activeRole` STAFF (ADMIN ou AGENT).
- **Visibilidade de UI:** Ocultação de cards, botões e menus de gestão para o modo Solicitante.
- **Workflow de Usuários:** Garantia de que a criação de usuários via Admin não conceda permissões automáticas em outros contextos de login.

## Arquitetura e Mudanças
- **`src/middleware.ts`:** Implementação de checagem do `activeRole` para rotas protegidas.
- **`src/components/sidebar-content.tsx`:** Ajuste fino na lógica de exibição baseada no `activeRole` da sessão atual.
- **`src/app/dashboard/page.tsx`:** Filtragem de estatísticas do dashboard baseada no papel ativo.

## Plano de Implementação (Passo a Passo)

### 1. Reforço no Middleware
- [ ] Atualizar o `middleware.ts` para capturar o `activeRole` da sessão.
- [ ] Bloquear acesso a `/dashboard/admin/*` e redirecionar para `/dashboard` se o `activeRole` for `USER`.

### 2. Segregação de Visualização no Dashboard
- [ ] Ajustar `src/app/dashboard/page.tsx` para que, se o usuário estiver no modo Solicitante, ele veja apenas as estatísticas de seus próprios chamados, sem acesso ao gráfico de categorias global ou feed de auditoria.

### 3. Ajuste de Navegação (Sidebar)
- [ ] Garantir que o grupo "Gestão de Atendimento" só apareça se `activeRole` for `ADMIN` ou `AGENT`.
- [ ] Ocultar o link de "Gestão de Usuários" para qualquer um que não esteja logado explicitamente no modo Atendente.

### 4. Integridade de Criação de Usuários
- [ ] Revisar a Server Action de criação para garantir que o campo `approved` e `role` sejam persistentes e não replicáveis sem ação administrativa.

## Verificação
- [ ] Logar como Admin no modo "Solicitante" e tentar acessar `/dashboard/admin/users` via URL direta -> Deve redirecionar.
- [ ] Logar como Solicitante e verificar se o Sidebar mostra apenas "Minhas Solicitações".
