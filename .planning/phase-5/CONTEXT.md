# Contexto da Fase 5: IA Agêntica e RAG (V1.1 - Automação Inteligente)

## Decisões de Implementação de IA

### 1. Autonomia e Controle Humano (Human-in-the-loop)
- **Gatilho de Triagem:** A IA deve atuar de forma **Totalmente Automática (Invisível)**, preenchendo Categoria, Prioridade e SLA instantaneamente no banco de dados. 
- **Controle:** O atendente/agent terá um botão de **"Ativar/Desativar IA"** em seu Dashboard (perfil) para controlar essa automação.
- **Validação:** A IA atua na "frente" ajudando o solicitante a ser mais claro e no "pós-envio" com o primeiro comentário automático caso falte alguma informação.

### 2. Experiência de Coleta Inteligente e RAG
- **Interação Coleta:** O sistema usará **Sugestões Inline (em tempo real)** enquanto o usuário preenche o formulário e um **Comentário Automático (pós-envio)** se houver lacunas de dados identificadas pelo Agente de Coleta.
- **Estratégia de Memória (RAG):** A IA fará uma **Varredura Global** no SQLite (Tickets NPS+, Artigos e Logs). 
- **Flexibilidade:** A arquitetura será modular para permitir **segmentação e configurações futuras** da IA (ex: focar apenas em tickets de TI ou apenas em artigos).

### 3. Monitoramento e Qualidade (Visão Gestor)
- **Dashboard de Qualidade:** Gráficos de "Taxa de Acerto" (tickets resolvidos/ajudados por IA).
- **Audit Logs:** Transparência total de logs para que o gestor veja o que a IA decidiu em cada chamado.
- **Insights de Tendências:** Relatórios gerados pela IA sobre gargalos e problemas recorrentes da operação.

## Contexto Técnico de Código
- **Orquestração:** Uso do **Vercel AI SDK** integrado com Server Actions para Groq (Llama 3.3 70B - Triagem) e Gemini (Flash 2.5 - RAG e Curadoria).
- **RAG:** Implementação inicial via **Full Text Search (FTS5)** do SQLite para manter a leveza do banco local.
- **Componentes UI:** `AIInsightCard` lateral nos detalhes do ticket e `MagicCompose` (botão de sugestão de resposta).
- **Rate Limits:** Gestão de cotas via Fallback entre Groq e Gemini.

## Próximos Passos
- Refatorar o `schema.prisma` para incluir os logs de IA e o status de ativação do agente.
- Implementar as Server Actions de orquestração de IA.
- Desenvolver os componentes de UI para visualização de insights da IA.
