# Plano de Execução da Fase 5: IA Agêntica e RAG

Este plano orquestra a execução completa da Fase 5, focada na implementação de inteligência artificial generativa e RAG para automação e melhoria da experiência do sistema de chamados.

## Objetivos Principais
- Triagem automática e invisível de chamados.
- Coleta assistida por IA para reduzir tickets incompletos.
- Engine de busca RAG leve (SQLite FTS5).
- Sugestão de respostas (Magic Compose) para atendentes.
- Dashboard de NPS qualitativo com análise de sentimento.

## Cronograma de Execução (Ondas)

### Onda 1: Infraestrutura Core de IA (Plano 05-01)
- Atualização do Schema Prisma (Novos modelos e campos).
- Configuração de FTS5 para SQLite (Busca de Conhecimento).
- Configuração do Vercel AI SDK (Groq e Gemini).
- Definição de contratos de dados (Zod).

### Onda 2: Agentes de Processamento Inicial (Plano 05-02)
- Implementação do Agente de Triagem (Llama 3.3).
- Implementação do Agente de Coleta (Detecção de Lacunas).
- Implementação da Engine de RAG Contextual.

### Onda 3: Agentes de Resolução e Feedback (Plano 05-03)
- Implementação do Agente Solucionador (Magic Compose).
- Implementação do Agente de Curadoria (Extração de Conhecimento).
- Backend de Análise de Sentimento NPS.

### Onda 4: UI/UX e Visualização (Plano 05-04)
- Componente `AIInsightCard` lateral.
- Botão `Magic Compose` no editor de respostas.
- Modal de `CollectionChat` para abertura de chamados.
- Dashboard de NPS para gestores com Recharts.

## Verificação e Qualidade
Cada onda será verificada pelo `gsd-executor` através de testes automatizados e builds. A verificação final será manual e incluirá o fluxo completo (UAT).

---
**Status da Execução:** Pronto para iniciar Onda 1.
