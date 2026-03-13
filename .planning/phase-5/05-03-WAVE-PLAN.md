# Plano de Execução: Fase 5 - Onda 3 (Paralela)

## Objetivo
Implementar os agentes de solução e curadoria, além dos componentes visuais de insights, dashboard de satisfação e interação de coleta.

## Tarefas (Onda 3)

### 1. Agente Solucionador (Magic Compose)
- **Arquivo:** `src/lib/ai/agents/solver.ts`
- **Ação:** Implementar sugestão de respostas baseadas em RAG e contexto do ticket.
- **Subagente:** `gsd-executor`
- **Fonte:** `05-03-PLAN.md` (Task 1)

### 2. Agente de Curadoria (Extração de Conhecimento)
- **Arquivo:** `src/lib/ai/agents/curation.ts`
- **Ação:** Extrair conhecimento de chamados resolvidos para a base de conhecimento.
- **Subagente:** `gsd-executor`
- **Fonte:** `05-03-PLAN.md` (Task 2)

### 3. AI Insight Card UI (Ticket Detail)
- **Arquivo:** `src/components/ai/AIInsightCard.tsx`
- **Ação:** Painel lateral que exibe sumário da IA e artigos sugeridos (RAG).
- **Subagente:** `gsd-executor`
- **Fonte:** `05-04-PLAN.md` (Task 1)

### 4. NPS Dashboard UI (Admin)
- **Arquivo:** `src/app/admin/nps-dashboard/page.tsx`
- **Ação:** Dashboard analítico com Recharts mostrando tendências de satisfação e insights de IA.
- **Subagente:** `gsd-executor`
- **Fonte:** `05-04-PLAN.md` (Task 3)

### 5. Collection Chat UI (Solicitação)
- **Arquivo:** `src/components/ai/CollectionChat.tsx`
- **Ação:** Interface interativa que solicita informações faltantes ao usuário.
- **Subagente:** `gsd-executor`
- **Fonte:** `05-04-PLAN.md` (Task 2 - parte)

## Verificação
- [ ] Integração visual dos componentes no layout existente.
- [ ] Mock de dados para o dashboard para validar visualização.
- [ ] Teste de fluxo de curadoria salvando rascunhos no banco.

**Dependências:** Onda 2 (CONCLUÍDO)
