# Convenções de Codificação

**Data da Análise:** 2026-03-12

## Padrões de Nomenclatura

**Arquivos:**
- Componentes React: `PascalCase.tsx` (ex: `src/components/Sidebar.tsx`)
- Hooks: `useCamelCase.ts` (ex: `src/hooks/useAuth.ts`)
- Utilitários: `camelCase.ts` (ex: `src/lib/utils.ts`)
- Páginas: `page.tsx` (Padrão Next.js App Router)
- Layouts: `layout.tsx` (Padrão Next.js App Router)

**Funções:**
- Funções e Métodos: `camelCase` (ex: `getUserData()`)
- Componentes: `PascalCase` (ex: `export function Header()`)

**Variáveis:**
- Geral: `camelCase`
- Constantes Globais: `UPPER_SNAKE_CASE`

**Tipos e Interfaces:**
- PascalCase (ex: `interface UserData {}`, `type TicketStatus = 'NEW' | 'OPEN'`)

## Padrões SQL e Banco de Dados (Prisma)

**Tabelas (Models):**
- Padrão: `PascalCase` no singular.
- Exemplo: `Ticket`, `TicketComment`, `Category`.
- Nota: Evitar plural para manter consistência com as classes do Prisma.

**Campos (Colunas):**
- Padrão: `camelCase`.
- IDs: `String` usando `cuid()` (ex: `id String @id @default(cuid())`).
- Foreign Keys: `nomeDoModelId` em camelCase (ex: `requesterId`, `ticketId`).
- Datas: `createdAt` e `updatedAt`.

**Armazenamento de Imagens e Anexos:**
- **Links de Imagem:** Armazenados como `String` contendo a URL completa ou caminho relativo.
- **Perfil do Usuário:** Campo `image` na tabela `User`.
- **Anexos de Chamado:** Tabela dedicada `Attachment` para gerenciar múltiplos arquivos.
- **Rich Text:** Imagens inseridas via editor (Tiptap) devem ser enviadas para um storage e o link resultante inserido no HTML do conteúdo.

## Estilo de Código

**Formatação:**
- Prettier é a ferramenta padrão (configuração padrão ou `.prettierrc`).
- Indentação: 2 espaços.
- Ponto e vírgula: Sim.

**Linting:**
- ESLint seguindo `eslint-config-next`.

## Organização de Importações

**Ordem:**
1. Bibliotecas externas (React, Next, etc.)
2. Componentes UI (`@/components/ui/...`)
3. Componentes locais e layouts
4. Hooks e utilitários
5. Tipos e constantes

**Aliases de Caminho:**
- `@/*` mapeado para `src/*` (definido em `tsconfig.json`).

## Tratamento de Erros

**Padrões:**
- Validação de formulários e inputs: `Zod`.
- Try/Catch em Server Actions e API Routes.
- Feedback ao usuário via Toast ou mensagens de erro em tela (Shadcn UI).

## Logging

**Framework:** `console` para desenvolvimento inicial.

---

*Análise de convenções: 2026-03-12*
