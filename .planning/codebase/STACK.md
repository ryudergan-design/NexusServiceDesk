# Pilha de Tecnologia

**Data da Análise:** 2026-03-12

## Linguagens

**Principal:**
- TypeScript 5+ - Utilizado em toda a aplicação (frontend e backend).

## Runtime

**Ambiente:**
- Node.js (v20+ recomendado)

**Gerenciador de Pacotes:**
- npm (v10+)
- Lockfile: `package-lock.json` presente.

## Frameworks

**Core:**
- Next.js 15+ (App Router) - Framework fullstack para React.

**Banco de Dados & ORM:**
- Prisma 6+ - ORM para interação com o banco de dados.
- SQLite - Banco de dados relacional local para desenvolvimento e produção simplificada.
- LibSQL Adapter - Suporte para SQLite/Turso.

**Autenticação:**
- Auth.js (NextAuth.js v5 beta) - Sistema de autenticação com provedor de credenciais.

**Testes:**
- Não detectado explicitamente (sem `jest.config.js` ou `vitest.config.ts` na raiz).

**Build/Dev:**
- Tailwind CSS 4+ - Framework de estilização via PostCSS.
- Lucide React - Biblioteca de ícones.

## Dependências Principais

**Críticas:**
- `@prisma/client` - Cliente gerado para acesso ao banco de dados.
- `next-auth` - Gerenciamento de sessões e autenticação.
- `zod` - Validação de esquemas e tipos em tempo de execução.
- `bcryptjs` - Hash de senhas para segurança.

**UI/UX:**
- `framer-motion` - Animações e transições.
- `radix-ui` - Componentes acessíveis (headless).
- `tiptap` - Editor de texto rico (Rich Text).
- `recharts` - Visualização de dados e gráficos.
- `date-fns` - Manipulação de datas e cálculos de SLA.

## Configuração

**Ambiente:**
- Configurado via arquivo `.env`.
- Variáveis críticas esperadas: `DATABASE_URL`, `AUTH_SECRET`.

**Build:**
- `next.config.mjs` (ou similar) - Configuração do Next.js.
- `tsconfig.json` - Configuração do compilador TypeScript.
- `postcss.config.js` - Processamento de CSS.
- `components.json` - Configuração do shadcn/ui.

## Requisitos da Plataforma

**Desenvolvimento:**
- Node.js e npm instalados.
- Arquivo `dev.db` na raiz ou conforme especificado em `DATABASE_URL`.

**Produção:**
- Alvo de implantação compatível com Next.js (Vercel, Docker, etc.).
- Persistência para o arquivo SQLite se não for usado um banco remoto.

---

*Análise da pilha: 2026-03-12*
