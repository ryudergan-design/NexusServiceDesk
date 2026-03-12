# Refinamento Fase 3: Incrementos de Excelência Operacional (Padrão Softdesk)

## Objetivo
Transformar a inteligência operacional (SLA e Gráficos) da Fase 3 em uma interface de alta fidelidade e proatividade, implementando indicadores visuais em tempo real, exportação de relatórios, alertas de criticidade e um feed de auditoria legível.

## Escopo e Impacto
- **SLA Visual:** Adição de barras de progresso dinâmicas na lista de chamados.
- **Audit Log UI:** Transformação dos logs brutos em um feed de atividades humano no Dashboard do Gestor.
- **Relatórios:** Implementação de função básica de exportação de dados do Dashboard para CSV/JSON.
- **Alertas Proativos:** Sinalização visual (animação de pulsação/glow) em chamados que atingirem 80% do SLA.

## Arquitetura e Dependências
- **Componentes:** `Progress` (Shadcn), `Tooltip` (Shadcn), `lucide-react`.
- **API:** Novos endpoints em `/api/dashboard/audit` e `/api/dashboard/export`.
- **Utils:** Expansão da lógica de `src/lib/sla.ts` para calcular percentual de consumo de tempo.

## Plano de Implementação (Passo a Passo)

### 1. Inteligência Visual de SLA
- [ ] Atualizar o componente de listagem de tickets para calcular o `%` consumido do SLA (Resposta e Resolução).
- [ ] Integrar o componente `Progress` do Shadcn na linha do ticket com cores dinâmicas:
    - **Verde (< 50%)**
    - **Amarelo (50% - 80%)**
    - **Vermelho (> 80%)**
- [ ] Adicionar `Tooltip` detalhando o tempo exato restante ao passar o mouse.

### 2. Feed de Auditoria (Audit Log)
- [ ] Criar endpoint `GET /api/dashboard/audit` para buscar os últimos logs da tabela `AuditLog`.
- [ ] No `DashboardClient`, substituir o placeholder por um feed cronológico.
- [ ] Traduzir ações técnicas (ex: `UPDATE_STATUS`) para frases amigáveis (ex: "Jefrson Sales resolveu o chamado #ABC").

### 3. Alertas e Criticidade (Pulsing Alerts)
- [ ] Implementar uma animação de "glow" ou "pulsação" (via Framer Motion) em tickets com SLA estourado ou crítico na lista de triagem.

### 4. Exportação de Relatórios
- [ ] Adicionar botão "Exportar Relatório" no Dashboard do Gestor.
- [ ] Gerar arquivo formatado (CSV) com as estatísticas de categorias e volumetria do período.

## Verificação e Testes
- [ ] Simular um ticket com 90% do tempo consumido e verificar se a barra fica vermelha e pulsa.
- [ ] Confirmar se o Audit Log reflete ações em tempo real após a mudança de status de um ticket.
- [ ] Validar a exportação do arquivo CSV com dados reais do banco SQLite.
