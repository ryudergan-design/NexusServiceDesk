# Plano de Execução: Fase 4 - Reestruturação Visual e Triagem Rápida

## 1. Objetivo
Transformar a interface de gestão de chamados em um sistema de alta produtividade, permitindo a alternância entre o Modo Kanban (atual) e o novo Modo Desk (Tabela detalhada com visualização lateral rápida).

## 2. Arquivos Chave e Contexto
- `src/app/dashboard/tickets/page.tsx`: Página principal que será refatorada para gerenciar os estados de visualização.
- `src/components/dashboard/kanban-view.tsx`: (Novo) Componente para a lógica atual de colunas e cards.
- `src/components/dashboard/desk-view.tsx`: (Novo) Componente para a visualização tabelada profissional.
- `src/components/dashboard/ticket-quick-view.tsx`: (Novo) Componente de Sheet (Drawer) para detalhes rápidos.
- `src/app/dashboard/tickets/[id]/page.tsx`: Fonte de lógica para o componente modular de detalhes.

## 3. Etapas de Implementação

### Passo 1: Modularização e Estrutura Base
- [x] Criar o componente `KanbanView.tsx` movendo a lógica atual do `tickets/page.tsx`.
- [x] Criar o componente de controle `ViewToggle.tsx` (Kanban vs Desk).
- [x] Implementar a lógica de persistência de visualização no `tickets/page.tsx` usando `localStorage`.

### Passo 2: Implementação do Modo Desk (Tabela)
- [x] Criar `DeskView.tsx` utilizando a estrutura de `Table` do Shadcn/UI.
- [x] Definir colunas: ID, Título (Prioridade), Solicitante, Categoria, Status, SLA, Ações.
- [x] Implementar indicadores visuais de SLA diretamente na tabela (cronômetros e cores).

### Passo 3: Implementação do QuickView (Drawer)
- [x] Criar `TicketQuickView.tsx` usando o componente `Sheet` do Shadcn/UI.
- [x] Modularizar a lógica de detalhes (timeline, comentários, anexos) para ser usada tanto na página full quanto no Drawer.
- [x] Garantir que ações no Drawer (ex: Iniciar Triagem, Resolver) atualizem o estado da lista/kanban pai.

### Passo 4: Refinamento de UX e Responsividade
- [x] Adicionar animações de transição entre os modos usando Framer Motion.
- [x] Ajustar a visibilidade de colunas no Modo Desk para telas menores.
- [x] Validar a experiência de "um clique" (clicar na linha da tabela abre o Drawer).

## 4. Verificação e Testes
- [ ] Testar alternância entre modos e persistência após refresh.
- [ ] Verificar se todos os filtros da Sidebar continuam afetando ambas as visões.
- [ ] Confirmar que o Drawer carrega dados corretos e permite interações completas.
- [ ] Validar performance com mais de 50 chamados na tela.
