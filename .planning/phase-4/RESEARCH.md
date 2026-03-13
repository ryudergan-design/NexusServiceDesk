# Pesquisa de Domínio: Fase 4 - Reestruturação Visual e Triagem Rápida

## 1. Padrões de Interface (UX/UI) para Help Desk

### Visualização Dual (Kanban vs. Tabela)
- **Mentalidade de Trabalho:** O sistema deve suportar duas "personas" ou momentos do dia:
    - **Tabela (Foco em Triagem):** Atendentes lidando com grande volume de novos chamados, filtrando por SLA, categoria e solicitante. Requer alta densidade de informação.
    - **Kanban (Foco em Fluxo):** Gestão individual ou de equipe para visualizar o progresso dos chamados em atendimento. Foco visual no "quem está fazendo o quê".
- **Lógica de Alternância:**
    - Botão de toggle discreto no topo superior direito.
    - Persistência da escolha via `localStorage` ou preferência de perfil no banco.

### Padrão Master-Detail com Side Drawer
- Em vez de navegação para uma página de detalhes (`/tickets/[id]`), utilizar o componente `Sheet` (Shadcn/UI).
- **Vantagem:** O técnico mantém o contexto da lista/kanban, filtros aplicados e posição de scroll.
- **Estrutura do Drawer:**
    - Cabeçalho fixo com botões de ação (Resolver, Encaminhar, Responder).
    - Corpo com abas (Detalhes, Atividades, Anexos).

## 2. Componentes e Tecnologias Recomendadas

- **Visualização Desk (Tabela):**
    - `DataTable` do Shadcn/UI (baseado em TanStack Table).
    - Colunas Fixas: #ID e Título.
    - Indicadores visuais de SLA (Contadores regressivos com cores semânticas).
- **Visualização Kanban:**
    - Colunas por status (NEW, TRIAGE, DEVELOPMENT, etc.).
    - Cards compactos com ícones de prioridade e avatar.
    - Transições suaves com Framer Motion.
- **Detalhes Rápidos (QuickView):**
    - Componente `Sheet` para visualização lateral.
    - Reaproveitamento da lógica de `TicketDetailsPage` em um componente modular `TicketDetailView`.

## 3. Desafios Técnicos

- **Performance:** Manter a fluidez com muitos registros na tabela e no Kanban.
- **Sincronização de Estado:** Garantir que ações tomadas no Drawer (ex: mudar status) reflitam instantaneamente na lista/kanban subjacente sem recarregamento completo da página.
- **Mobile First:** Garantir que o Modo Desk degrade bem para telas pequenas (ocultando colunas menos críticas) ou force o Modo Kanban/Lista simples.
