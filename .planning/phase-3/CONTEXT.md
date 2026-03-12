# Contexto da Fase 3: SLAs e Dashboards (Inteligência Operacional)

## Decisões de Produto e UX

### 1. Configuração das Regras de SLA
- **Prazos:** Utilização de prazos estendidos (conservadores) como base configurável por prioridade.
- **Cálculo:** Horário comercial híbrido (Seg-Sáb, 08h-18h).
- **Pausa Automática:** O cronômetro do SLA será pausado nos status "Pendente Usuário" e "Aguardando Terceiro".
- **Transparência:** O cliente final verá o cronômetro do SLA em tempo real no portal.

### 2. Widgets e Visualização de Dados
- **KPI Principal:** Saúde do SLA (gráfico de Donut/Pizza exibindo tickets dentro vs. fora do prazo).
- **Widgets Secundários:** Volume por Categoria (Barras) e Tendência Semanal (Linhas).
- **Gestão de Equipe:** Ranking de performance dos agentes disponível exclusivamente para o perfil Gestor/Admin.

### 3. Sistema de Alertas e Notificações GSD
- **Alerta Crítico:** Tickets próximos do vencimento (30 min) terão o card pulsante com efeito Glow Red no Dashboard.
- **Feedback Sonoro:** Alertas sonoros (Ping) configuráveis pelo usuário (ligar/desligar).
- **Filtros Temporais:** Atalhos rápidos para Hoje, Esta Semana, Este Mês e Range Personalizado.

## Contexto Técnico de Código
- **Prisma:** Criação do modelo `SLARule` e campos de data/hora no modelo `Ticket`.
- **Lógica:** Implementação de utilitário de cálculo de tempo em TypeScript considerando feriados e horários configurados.
- **Visualização:** Uso de Tremor ou Shadcn Charts (baseados em Recharts) para os componentes de dashboard.
- **Alertas:** Utilização de `AnimatePresence` do Framer Motion para os efeitos pulsantes e micro-interações.

## Próximos Passos
- Modelar as regras de SLA no banco de dados.
- Desenvolver o motor de cálculo de prazos.
- Implementar os Dashboards Operacional (Agente) e Estratégico (Gestor).
