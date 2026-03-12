# Refinamento Fase 1.1: Gestão Administrativa e Perfil (Padrão Softdesk)

## Objetivo
Implementar as interfaces de controle de acesso (Aprovação e Roles) e autonomia do usuário (Perfil), fechando as lacunas de gestão de contas identificadas na Fase 1.1.

## Escopo e Impacto
- **Painel de Usuários (Admin):** Interface para visualizar todos os usuários, aprovar novas contas e alterar cargos (USER, AGENT, ADMIN).
- **Página de Perfil (Usuário):** Interface para o usuário logado atualizar seus dados (nome, telefone, cargo) e visualizar suas informações de conta.
- **Segurança:** Proteção de rotas administrativas via Middleware e Server Actions.

## Arquitetura e Dependências
- **Componentes:** `Table` (Shadcn), `Dialog` (Shadcn), `Avatar` (Shadcn), `Badge` (Shadcn).
- **API/Actions:** Server Actions em `src/lib/actions/users.ts` para mutações seguras.
- **Rotas:** 
  - `/dashboard/admin/users` (Gestão de Usuários)
  - `/dashboard/profile` (Perfil do Usuário)

## Plano de Implementação (Passo a Passo)

### 1. Painel de Gestão de Usuários (Admin)
- [ ] Criar Server Action `getUsers` e `updateUserStatus` em `src/lib/actions/users.ts`.
- [ ] Criar a página `/dashboard/admin/users` com uma tabela estilizada:
    - Colunas: Nome, Email, Role, Status (Aprovado/Pendente), Ações.
    - Filtro por nome/email.
- [ ] Adicionar botão de "Aprovar" e "Mudar Role" (usando DropdownMenu ou Dialog).
- [ ] Garantir que apenas usuários com role `ADMIN` acessem esta rota (verificação no Server Component).

### 2. Página de Perfil (User/Agent/Admin)
- [ ] Criar a página `/dashboard/profile` com layout de formulário moderno.
- [ ] Exibir campos: Nome, Email (leitura), Telefone, Departamento, Cargo Atual.
- [ ] Implementar Server Action `updateProfile` para salvar as alterações.
- [ ] Adicionar feedback visual (Sonner Toast) ao salvar com sucesso.

### 3. Integração na Navegação
- [ ] Adicionar link "Gestão de Usuários" no Sidebar (visível apenas para ADMIN).
- [ ] Transformar o componente de Perfil no Header em um link clicável para a página de perfil.

## Verificação e Testes
- [ ] Criar um novo usuário (via tela de registro) e confirmar que ele aparece como "Pendente" no Painel Admin.
- [ ] Aprovar esse usuário e validar se ele consegue logar agora.
- [ ] Alterar o nome no Perfil e confirmar se o Header atualiza imediatamente.
