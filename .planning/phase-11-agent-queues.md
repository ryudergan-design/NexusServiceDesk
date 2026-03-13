# Fase 11: Nexus ServiceDesk - Filas Privadas e Supervisão

Esta fase altera a visibilidade de chamados para que cada atendente (humano ou bot) gerencie apenas sua própria fila, enquanto clientes ganham transparência sobre quem os está atendendo.

## Objetivos
- **Segregação de Filas:** Atendentes e Admins veem, por padrão, apenas chamados atribuídos a eles na Central.
- **Transparência Dinâmica:**
    - Clientes visualizam a coluna/campo "Atendente".
    - Atendentes visualizam a coluna/campo "Cliente".
- **Supervisão (Outros Atendentes):** Seção colapsável na navegação para visualizar filas de outros membros da equipe (incluindo bots).
- **Integração de Workflow:** Delegar para IA remove o chamado da fila do humano e envia para a fila da IA.

## 1. Filtragem de Backend (`src/app/api/tickets/route.ts`)
- Modificar a lógica de busca:
    - Se o usuário for `STAFF` (Admin/Agent) e não houver um `agentId` específico na query -> Filtrar por `assigneeId = session.user.id`.
    - Se houver `agentId` na query -> Filtrar por `assigneeId = agentId`.
    - Se for `CLIENT` -> Manter filtro de `requesterId`.

## 2. Interface de Navegação (`src/components/sidebar-content.tsx`)
- Adicionar componente colapsável "Outros Atendentes".
- Buscar lista de usuários onde `role IN ['ADMIN', 'AGENT']` (incluindo `isAI`).
- Ao clicar em um atendente, navegar para `/dashboard/tickets?agentId=ID`.

## 3. Visualização de Chamados (`DeskView` e `KanbanView`)
- Detectar o `activeRole`.
- Se `activeRole === 'USER'`: Exibir nome do `assignee` (Atendente).
- Se `activeRole !== 'USER'`: Exibir nome do `requester` (Cliente).

## 4. Lógica de Atribuição
- Garantir que ao clicar no Robô, o `assigneeId` seja atualizado, movendo o ticket para a fila do Bot e removendo da fila do humano (isso já acontece na lógica atual, mas validaremos a revalidação da rota).

## Verificação
- Logar como Admin: Ver apenas meus chamados.
- Abrir "Outros Atendentes" -> Clicar em um Bot: Ver a fila do Bot.
- Logar como Cliente: Ver o nome do atendente humano ou IA no card/coluna.
