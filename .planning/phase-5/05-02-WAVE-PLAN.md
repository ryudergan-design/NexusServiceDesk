# Plano de Execução: Fase 5 - Onda 2 (Paralela)

## Objetivo
Implementar a inteligência de coleta, o motor de busca contextual (RAG), a análise qualitativa de sentimentos e a interface de controle do usuário.

## Tarefas (Onda 2)

### 1. Agente de Coleta (Detecção de Lacunas)
- **Arquivo:** `src/lib/ai/agents/collection.ts`
- **Ação:** Implementar lógica de identificação de dados faltantes em chamados.
- **Subagente:** `gsd-executor`
- **Fonte:** `05-02-PLAN.md` (Task 2)

### 2. Motor de RAG (Busca de Conhecimento)
- **Arquivo:** `src/lib/ai/rag/engine.ts`
- **Ação:** Implementar busca híbrida (FTS5 + SQLite) para recuperação de artigos.
- **Subagente:** `gsd-executor`
- **Fonte:** `05-02-PLAN.md` (Task 3)

### 3. Análise de Sentimento NPS (Backend)
- **Arquivo:** `src/lib/ai/agents/nps-sentiment.ts`
- **Ação:** Classificar feedbacks abertos de NPS e extrair insights qualitativos.
- **Subagente:** `gsd-executor`
- **Fonte:** `05-03-PLAN.md` (Task 3)

### 4. AI Toggle UI (Configurações)
- **Arquivo:** `src/components/settings/AIToggle.tsx`
- **Ação:** Criar switch para habilitar/desabilitar a IA no perfil do usuário.
- **Subagente:** `gsd-executor`
- **Fonte:** `05-04-PLAN.md` (Task 1 - parte)

## Verificação
- [ ] Testes unitários para Agente de Coleta e RAG Engine.
- [ ] Verificação de logs de IA na tabela `AILog` para os novos agentes.
- [ ] Teste visual do switch de IA persistindo no banco.

**Dependências:** Plano 01 (CONCLUÍDO)
