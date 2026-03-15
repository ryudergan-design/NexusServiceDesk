# Estratégia de Pivô: I9 Chamados - Inteligência Agentica

## 1. Contexto e Justificativa
O projeto I9 Chamados atingiu maturidade no Core Ticketing (Fases 1 a 4). Para se diferenciar no mercado de ITSM em 2026, o foco deve mudar de uma ferramenta de "registro passivo" para uma ferramenta de "resolução ativa". 

**O Problema Atual:** O atendimento humano é gargalo; o conhecimento está disperso em tickets passados sem estruturação.
**A Solução:** Implementar uma arquitetura de **Agentes de IA Dedicados** que utilizam o banco de dados SQLite como memória viva (RAG) para triagem, coleta e resolução.

## 2. Nova Arquitetura: Multi-Agent System (MAS)

Em vez de um único prompt monolítico, utilizaremos agentes especializados:

| Agente | Responsabilidade | Modelo Sugerido |
| :--- | :--- | :--- |
| **Agente de Triagem** | Classifica (Incidente/Requisição), define prioridade e extrai entidades do texto inicial. | Groq (Llama 3.3 70B) |
| **Agente de Coleta** | Identifica lacunas de informação e gera perguntas dinâmicas para o solicitante. | Groq (Llama 3.1 8B) |
| **Agente de RAG (Busca)** | Recupera tickets similares e artigos da base de conhecimento no SQLite. | Gemini 2.5 Flash |
| **Agente Solucionador** | Elabora a resposta final ou guia de resolução para o atendente. | Gemini 2.5 Pro |
| **Agente de Curadoria** | Após o fechamento, extrai o "suco" da resolução para criar novos artigos de base de conhecimento. | Gemini 2.5 Flash |

## 3. Fluxo de Trabalho do Chamado (IA-First)

1.  **Ingestão:** Usuário abre chamado.
2.  **Triagem Automática:** O Agente de Triagem preenche metadados (SLA, Categoria).
3.  **Validação de Dados:** O Agente de Coleta verifica se há anexos ou infos faltando (ex: "Qual o modelo do notebook?").
4.  **Recuperação de Contexto (RAG):**
    *   Query SQL é gerada para buscar tickets com o mesmo `categoryId`.
    *   O Agente de RAG analisa os 10 resultados mais relevantes do banco.
5.  **Proposta de Solução:** O Agente Solucionador apresenta ao atendente humano: "Identificamos 3 casos similares. A solução provável é X. Deseja aplicar?".
6.  **Aprendizado Contínuo:** Ao fechar o ticket, o Agente de Curadoria atualiza a tabela `KnowledgeBase`.

## 4. Stack de IA e APIs (Free Tier)

*   **Orquestração:** Logic-based (Next.js Server Actions) + AI SDK.
*   **Groq API (Free Tier):** Utilizado para tarefas de baixa latência e alta frequência (Triagem, Coleta).
    *   *Limite:* 14.400 requisições/dia (suficiente para o volume planejado).
*   **Gemini API (Free Tier):** Utilizado para análise profunda e processamento de contexto longo (RAG, Curadoria).
    *   *Vantagem:* Janela de 1M tokens para processar histórico de logs.
*   **Vector Search:** Implementação inicial via busca textual (Full Text Search do SQLite) evoluindo para embeddings locais se necessário.

## 5. Componentes de UI Necessários

1.  **AI Insight Card:** Widget lateral no ticket mostrando "Análise da IA" e "Tickets Relacionados".
2.  **Magic Compose:** Botão no campo de resposta para gerar solução baseada no RAG.
3.  **Chat de Coleta:** Interface estilo chat para o solicitante responder perguntas da IA antes do ticket chegar ao atendente.
4.  **Knowledge Auto-Draft:** Modal que aparece ao fechar um ticket sugerindo a criação de um artigo.

## 6. Próximos Passos (Nova Fase 5)
A Fase 5 deixa de ser apenas "Autoatendimento" e passa a ser a "Engine de IA". O foco será a transformação dos dados do SQLite em inteligência acionável.
