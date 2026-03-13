# Refinamento: Workflow de Visualização Dupla (Kanban vs. Desk)

Este documento detalha a implementação da alternância visual na central de chamados, integrando as dinâmicas de cartões (Trello) e tabela detalhada (Softdesk).

## 1. O Conceito Dual
A interface deve permitir que o usuário escolha entre duas mentalidades de trabalho:
- **Modo Kanban:** Focado em volume e status. Ideal para reuniões de equipe e visão geral da carga.
- **Modo Desk:** Focado em execução e triagem rápida. Ideal para o trabalho diário do atendente, onde detalhes precisam estar a um clique de distância.

## 2. Componente de Alternância (Toggle)
- Localização: Topo da tela de chamados, ao lado da busca/filtros.
- Opções: "Kanban" (Ícone de colunas) e "Desk" (Ícone de lista/tabela).
- Persistência: Usar `localStorage` para lembrar a última escolha do usuário.

## 3. Detalhamento do Modo Desk (Novo)
A "Visão Desk" será composta por:
- **Tabela de Chamados:**
    - Colunas: #ID, Título, Solicitante, Categoria, Status, SLA, Criado em.
    - Estilo: Densa, com badges para prioridade e status.
    - Interação: Hover destaca a linha; clique seleciona o chamado.
- **Split View (Quick Details):**
    - Ao selecionar um chamado na tabela, um painel lateral ou inferior abre exibindo os detalhes rápidos sem sair da lista.
    - Permite ações rápidas: Trocar Status, Encaminhar, Adicionar Comentário Curto.

## 4. Refatoração do Kanban (Existente)
- Mover a lógica atual do `TicketsPage` para um componente específico `KanbanView.tsx`.
- Ajustar os cartões para serem mais informativos na Visão Kanban.

## 5. Filtros Dinâmicos
- A barra lateral de filtros (Meus atendimentos, Sem atendente, etc.) deve afetar ambas as visualizações de forma idêntica.

---
**Critérios de Sucesso:**
- Alternância instantânea sem recarregamento de página.
- Consistência de dados entre os dois modos.
- Melhora de 30% na velocidade de triagem reportada em testes.
