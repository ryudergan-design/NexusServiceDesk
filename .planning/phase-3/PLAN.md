# Plano de Fase 3: SLAs e Dashboards (Inteligência Operacional)

## Objetivo
Implementar o motor de SLA para controle de prazos e criar dashboards gerenciais e operacionais modernos para visibilidade em tempo real da performance do Service Desk.

## Contexto e Requisitos
- **SLA:** Controle de Tempo de Primeira Resposta (FRT) e Tempo de Resolução.
- **Dashboards:** KPIs de volume, conformidade de SLA e distribuição por categoria.
- **UI:** Uso de Tremor ou Shadcn Charts para gráficos profissionais em Dark Mode.

## Etapas de Implementação

### 1. Motor de SLA (Service Level Agreement)
- [ ] Criar modelo `SLARule` no Prisma para definir prazos por prioridade.
- [ ] Implementar utilitário de cálculo de tempo considerando horário comercial (09:00 - 18:00).
- [ ] Adicionar campos de SLA no modelo `Ticket` (Ex: `responseDue`, `resolutionDue`).
- [ ] Implementar lógica de "Pausa de SLA" para o status "Pendente Usuário".

### 2. Widgets do Dashboard (Componentes)
- [ ] Desenvolver cartões de KPI (Tremor/Card):
    - Tickets Abertos hoje.
    - % de Conformidade de SLA.
    - Tempo Médio de Resolução (MTTR).
- [ ] Criar gráfico de barras para "Volume por Categoria".
- [ ] Desenvolver gráfico de linha para "Tendência de Incidentes (7 dias)".

### 3. Dashboard do Atendente (Operacional)
- [ ] Implementar visualização compacta dos tickets com SLA mais próximo do vencimento.
- [ ] Criar sinalizadores visuais (Glow Neon) para tickets em atraso.
- [ ] Adicionar feed de "Atividade Recente" no dashboard.

### 4. Dashboard do Gestor (Estratégico)
- [ ] Criar visão macro com filtros globais (Departamento, Período).
- [ ] Implementar ranking de agentes por produtividade/satisfação.
- [ ] Desenvolver exportação simples de relatório (CSV/Print).

### 5. Notificações e Alertas
- [ ] Implementar sistema de alertas visuais (Toasts) quando um ticket de alta prioridade é atribuído.
- [ ] Configurar monitoramento de SLA para mudar cores dos badges automaticamente.

## Verificação e Testes
- [ ] Validar se o cálculo de SLA pula finais de semana corretamente.
- [ ] Testar a pausa do cronômetro ao mudar status para "Pendente".
- [ ] Garantir que os gráficos renderizam corretamente no Dark Mode.
- [ ] Verificar responsividade dos Dashboards em tablets.

## Comandos Úteis
```bash
npm install tremor @tremor/react
# ou para Shadcn Charts
npx shadcn@latest add chart
```
