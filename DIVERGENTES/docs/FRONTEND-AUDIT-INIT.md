# Auditoria de Front-end: I9 Chamados

## Objetivo
Identificar falhas funcionais, bugs de UI (quebras de layout, interações mortas), problemas de acessibilidade e responsividade.

## Restrição Crítica
**PROIBIDO alterar o visual do site.** O estilo (glassmorphism, dark mode, animações Framer Motion) deve ser preservado. O foco é apenas na correção de funcionalidades quebradas.

## Escopo de Análise
1.  **Componentes Core (`src/components`):**
    - `rich-text-editor.tsx`
    - `sidebar-content.tsx`
    - `header.tsx`
    - Componentes Shadcn/UI em `src/components/ui`.
2.  **Páginas Principais (`src/app`):**
    - `/dashboard`
    - `/admin`
    - `/auth`
3.  **Fluxos de Usuário:**
    - Login/Logout.
    - Navegação lateral.
    - Interações de tickets (se houver componentes visíveis).

## Arquivos para Leitura Inicial
- `.planning/PROJECT.md`
- `package.json`
- `src/app/layout.tsx`
- `src/app/page.tsx`
