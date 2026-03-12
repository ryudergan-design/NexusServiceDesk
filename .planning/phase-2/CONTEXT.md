# Contexto da Fase 2: Ciclo de Vida do Chamado (Core Ticketing)

## Decisões de Produto e UX

### 1. Estrutura do Formulário de Chamado
- **Campos Obrigatórios:** Categoria/Subcategoria, Tipo (Incidente, Requisição, Bug, Sugestão, Dúvida), Urgência, Impacto, Título, Descrição e Anexos.
- **Dinamismo:** Formulário híbrido (campos padrão + campo genérico de "Observações Extras" para detalhes específicos).
- **Anexos:** Sem limite de quantidade de arquivos, respeitando o limite total de 20MB por chamado.
- **Solicitante:** Preenchimento automático (logado) ou abertura em nome de terceiros (Admin/Agente).

### 2. Lógica de Priorização e Categorias (Foco SaaS)
- **Cálculo de Prioridade:** Baseado na matriz ITIL (Impacto x Urgência), com suporte a prioridades fixas por categoria de serviço.
- **Impacto:** Medido pela severidade do problema (ex: Funcionalidade bloqueada, Erro cosmético).
- **Categorias Iniciais:** Suporte Técnico, Financeiro/Assinatura, Sugestão de Melhoria, Implantação/Onboarding.

### 3. Ciclo de Vida e Estados do Ticket
- **Status Padrão:** Novo, Triagem, Desenvolvimento, Teste, Concluído.
- **Customização:** Sistema preparado para o administrador criar status personalizados adicionais.
- **Reabertura:** Prazo de 48 horas após a marcação como "Resolvido".
- **Comunicação:** Timeline estilo Audit Feed (Vertical) com suporte a Notas Privadas e Menções (@time) para colaboração interna.

### 4. Interface de Listagem e Filtros
- **Layout:** Visualização em Cards/Kanban para agilidade visual.
- **Filtros Rápidos:** No topo por Status, Prioridade, Atendente e Categoria.
- **Ações:** Foco em ações individuais nesta fase.
- **Alertas:** Sinalizadores visuais de SLA usando cores (Verde, Amarelo, Vermelho).

## Contexto Técnico de Código
- **Prisma:** Implementação dos modelos `Ticket`, `Category`, `TicketTransition` e `Attachment`.
- **API:** Rota `POST /api/tickets` e lógica de transição via `prisma.$transaction`.
- **Frontend:** Uso de `dnd-kit` ou `framer-motion` para o Kanban e Shadcn para os formulários.
- **Storage:** Upload local de arquivos na pasta `public/uploads`.

## Próximos Passos
- Atualizar o Schema Prisma com os novos modelos.
- Implementar o fluxo de abertura de chamados.
- Desenvolver a visualização Kanban.
