# Teste de Aceitação do Usuário (UAT) - Fase 3: SLAs e Dashboards

## Status Geral: ⚠️ PARCIALMENTE CONCLUÍDO
O motor de SLA está operacional e integrado à criação de tickets, mas a visualização de dados nos Dashboards ainda utiliza dados estáticos (hardcoded).

---

## 1. Testes de Funcionalidade (SLA)

### [SUCESSO] Cálculo de Prazo Comercial
- **Cenário:** Abertura de ticket na Sexta 17:30 com 120 minutos de prazo.
- **Resultado Esperado:** Sábado às 10:30 (considerando Sáb 09:00-12:00).
- **Resultado Obtido:** Sábado 10:30 (Validado via script `test-sla.ts`).
- **Persistência:** O `route.ts` está calculando e salvando corretamente no SQLite via Prisma `$transaction`.

---

## 2. Testes de Interface (Dashboards)

### [FALHA] Widgets Dinâmicos
- **Cenário:** Visualizar estatísticas reais de chamados no Dashboard.
- **Resultado Esperado:** Widgets exibindo contagens reais do banco (Total, Em Atendimento, etc.).
- **Resultado Obtido:** Dados estáticos (Total: 154, Em Atendimento: 28) fixos no código (`page.tsx`).

### [FALHA] Gráficos de Performance
- **Cenário:** Visualizar distribuição de chamados por categoria.
- **Resultado Esperado:** Gráfico Recharts renderizando dados do Prisma.
- **Resultado Obtido:** Placeholder visual ("Área para Widgets Flexíveis").

---

## 3. Diagnóstico de Lacunas
1. **Falta de API de Estatísticas:** Não existe um endpoint ou server action para sumarizar os dados dos tickets para o dashboard.
2. **Dashboard Estático:** O componente de dashboard principal não faz fetch de dados.

---

## 4. Plano de Correção (Preparado para Execução)

### Tarefa 1: Criar Server Action para Estatísticas
- **Arquivo:** `src/lib/actions/dashboard.ts` (a criar).
- **Lógica:** Contar tickets por status, calcular % de SLA dentro do prazo e volume por categoria.

### Tarefa 2: Dinamizar Dashboard
- **Arquivo:** `src/app/dashboard/page.tsx`.
- **Lógica:** Converter para Server Component ou usar `useEffect` para carregar dados reais.

### Tarefa 3: Implementar Gráficos Recharts
- **Arquivo:** `src/components/dashboard/stats-chart.tsx`.
- **Lógica:** Renderizar gráfico de barras com a distribuição real das categorias do SQLite.
