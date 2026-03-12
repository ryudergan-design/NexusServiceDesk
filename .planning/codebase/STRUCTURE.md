# Estrutura do Projeto - I9 Chamados

A organização dos diretórios segue as convenções modernas do Next.js, otimizada para escalabilidade e clareza de responsabilidades.

## Árvore de Diretórios Principal
- `prisma/`: Definições de esquema (`schema.prisma`), sementes (`seed.ts`) e migrações SQL.
- `sql/`: (Nova) Pasta para documentação de arquitetura de dados e scripts SQL utilitários.
- `src/`: Raiz do código fonte.
  - `app/`: Estrutura de rotas (App Router).
    - `api/`: Endpoints de backend.
    - `auth/`: Páginas de login e registro.
    - `dashboard/`: Interface principal de gestão de chamados.
  - `components/`: Componentes React reutilizáveis (UI, layout, lógica de cliente).
  - `lib/`: Utilitários core (Prisma, SLA, Utils).
  - `generated/`: Cliente Prisma gerado automaticamente.

## Fluxo de Execução
1. O usuário interage com a interface no `dashboard`.
2. Ações disparam chamadas para a `api/`.
3. A API utiliza a `lib/prisma.ts` para interagir com o SQLite.
4. Cada alteração significativa gera um registro em tabelas de suporte (Transitions, Comments).
