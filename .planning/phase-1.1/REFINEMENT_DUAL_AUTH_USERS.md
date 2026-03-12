# Refinamento Fase 1.2: Gestão de Identidade e Perfis Duais (Padrão Softdesk)

## Objetivo
Implementar o sistema de autenticação dual (Atendente vs. Solicitante) e a gestão de usuários segmentada por abas, permitindo que um mesmo usuário transite entre papéis e que a administração seja feita de forma organizada por perfis.

## Escopo e Impacto
- **Autenticação Dual:** Nova tela de login com opção de "Tipo de Acesso".
- **Sessão Contextual:** Armazenamento do "Modo de Acesso" na sessão (JWT) para filtrar permissões em tempo real.
- **Gestão de Usuários por Abas:** Interface segmentada por perfis (Admins, Atendentes, Solicitantes, Agentes).
- **CRUD Administrativo:** Capacidade de Atendentes/Admins criarem e editarem usuários diretamente na interface.

## Arquitetura e Mudanças
- **Auth.js (Sessão):** Adição do campo `activeRole` no JWT e na Session para diferenciar o modo logado.
- **API/Actions:** Expansão das Server Actions em `src/lib/actions/users.ts` para suportar criação e edição.
- **UI:** Utilização do componente `Tabs` do Shadcn na gestão de usuários.

## Plano de Implementação (Passo a Passo)

### 1. Autenticação Contextual (Atendente vs. Solicitante)
- [ ] Atualizar o formulário de login (`src/app/auth/login/page.tsx`) para incluir botões/tabs de "Entrar como Atendente" e "Entrar como Solicitante".
- [ ] Modificar o `src/auth.ts`:
    - Capturar o modo de acesso no `authorize`.
    - Se um Atendente logar como Solicitante, forçar a role da sessão para `USER` apenas naquela sessão.
    - Se um Solicitante tentar logar como Atendente, bloquear o acesso com erro.

### 2. Gestão de Usuários por Abas (Admin/Staff)
- [ ] Reestruturar `/dashboard/admin/users/page.tsx` para usar `Tabs`:
    - **Aba Admins:** Lista apenas usuários com `role: ADMIN`.
    - **Aba Atendentes:** Lista usuários com `role: AGENT`.
    - **Aba Solicitantes:** Lista usuários com `role: USER`.
    - **Aba Agentes (IA):** Espaço reservado para os perfis de automação.
- [ ] Implementar diálogo de "Novo Usuário" e "Editar Usuário" em cada aba.

### 3. Workflow de Atendente como Gestor
- [ ] Garantir que usuários com `role: AGENT` tenham permissão de criar e editar usuários (menos outros Admins).
- [ ] Ajustar Middleware para proteger rotas baseado no `activeRole` da sessão.

## Verificação e Testes
- [ ] Logar com o usuário `jefrsonsales@outlook.com` selecionando "Solicitante" e verificar se o menu de "Gestão de Atendimento" desaparece.
- [ ] Logar com o mesmo usuário selecionando "Atendente" e confirmar se o acesso total retorna.
- [ ] Criar um novo solicitante via aba de atendentes e validar o hash de senha gerado.
