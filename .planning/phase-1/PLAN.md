# Plano de Fase 1: Fundação e Autenticação

## Objetivo
Estabelecer a base técnica do I9 Chamados, configurando o framework Next.js, a persistência de dados com Prisma/Supabase, a autenticação e o design system moderno em Dark Mode.

## Contexto e Requisitos
- **Stack:** Next.js 15 (App Router), Tailwind CSS, Prisma ORM, Supabase Auth.
- **UI/UX:** Dark Mode mandatório, componentes Shadcn/UI, animações Framer Motion.
- **Perfis:** Solicitante, Atendente e Gestor (RBAC).

## Etapas de Implementação

### 1. Setup do Projeto e Design System
- [ ] Inicializar projeto Next.js com as flags recomendadas.
- [ ] Instalar e configurar Tailwind CSS (com suporte a Dark Mode).
- [ ] Configurar `next-themes` para gerenciamento de tema escuro.
- [ ] Instalar e configurar Shadcn/UI (Base components).
- [ ] Criar componentes de animação base com Framer Motion (FadeIn, SlideUp).

### 2. Infraestrutura de Dados e Auth
- [ ] Configurar projeto no Supabase e obter credenciais.
- [ ] Inicializar Prisma ORM e configurar conexão com Supabase (Transaction/Session pooling).
- [ ] Definir Schema Prisma:
    - `User` (id, email, name, role, avatar)
    - `Profile` (detalhes adicionais)
- [ ] Configurar Auth.js v5 (NextAuth) com Prisma Adapter.
- [ ] Implementar Middleware de proteção de rotas baseado em perfis (RBAC).

### 3. Fluxos de Autenticação (Páginas)
- [ ] Criar página de Login com UI moderna e animações.
- [ ] Criar página de Registro/Cadastro.
- [ ] Implementar fluxo de recuperação de senha.
- [ ] Garantir validação de formulários com Zod + React Hook Form.

### 4. Layout Base (Dashboard Shell)
- [ ] Criar Layout Raiz (Main Shell) com Sidebar colapsável.
- [ ] Implementar Header com Breadcrumbs dinâmicos e User Menu.
- [ ] Aplicar efeitos de glassmorphism e transparências conforme a identidade visual.
- [ ] Garantir responsividade total (Mobile-first).

## Verificação e Testes
- [ ] Validar persistência de usuários no banco de dados via Prisma Studio.
- [ ] Testar restrição de acesso em rotas protegidas.
- [ ] Verificar performance de carregamento (Lighthouse/Web Vitals).
- [ ] Validar transição suave de Dark Mode sem flashes.

## Comandos Úteis
```bash
npx create-next-app@latest . --typescript --tailwind --eslint
npx prisma init
npx shadcn-ui@latest init
```
