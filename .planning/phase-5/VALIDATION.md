# Plano de Validação: Fase 5 - IA Agêntica e RAG

Este documento define a estratégia de testes e critérios de aceitação para a implementação da inteligência artificial e o motor de RAG.

## 1. Critérios de Sucesso (Nyquist)

Para que cada componente de IA seja considerado validado, ele deve passar pelos seguintes testes automatizados:

| Componente | Teste Automatizado | Status | Critério de Aceitação |
| :--- | :--- | :--- | :--- |
| **Infraestrutura** | `npx prisma validate` | ✅ PASSED | Schema válido e migrações aplicadas. |
| **Agente Triagem** | `vitest triage.test.ts` | ✅ PASSED | Classificação correta de categoria e prioridade. |
| **Agente Coleta** | `vitest collection.test.ts` | ✅ PASSED | Identifica lacunas de informação. |
| **Agente Solver** | `vitest solver.test.ts` | ✅ PASSED | Gera soluções baseadas em artigos do RAG. |
| **Agente Curation** | `vitest curation.test.ts` | ✅ PASSED | Extrai conhecimento de tickets fechados. |
| **Sentiment Analysis** | `vitest sentiment.test.ts` | ✅ PASSED | Analisa feedbacks qualitativos NPS. |
| **RAG Engine** | `vitest rag.test.ts` | ✅ PASSED | Busca FTS5 e contexto contextual funcionando. |
| **Zod Contracts** | `npx tsc schemas.ts --noEmit` | ✅ PASSED | Contratos tipados e seguros. |

## 2. Casos de Teste de Usuário (UAT)

### UAT-01: Triagem e Classificação Automática
- **Cenário:** Usuário abre um chamado com título "Problema no Outlook" e descrição "Não consigo enviar e-mails desde hoje cedo".
- **Expectativa:** A IA classifica automaticamente como Categoria "E-mail/Comunicação" e Prioridade "MÉDIA".
- **Verificação:** Checar tabela `Ticket` e `AILog` após a criação.

### UAT-02: Autoatendimento com Coleta de Dados
- **Cenário:** Usuário abre chamado "Minha impressora parou".
- **Expectativa:** O `CollectionChat` aparece perguntando "Qual o modelo da impressora?" antes do ticket ser finalizado.
- **Verificação:** Interface de chat interativa visível no front-end.

### UAT-03: Magic Compose (Resolução)
- **Cenário:** Atendente abre o chamado da impressora e clica em "Magic Compose".
- **Expectativa:** A IA sugere "Verifique o cabo USB e o nível de toner" baseada em tickets similares de impressora no histórico.
- **Verificação:** Campo de resposta preenchido com o texto sugerido.

### UAT-04: Dashboard de NPS e Sentimento
- **Cenário:** Usuário deixa um NPS 3 com o comentário "O atendente foi educado, mas o sistema demorou muito para responder".
- **Expectativa:** O dashboard exibe sentimento "NEGATIVE" com o insight "Lentidão do sistema".
- **Verificação:** Visualizar o card de insights na página `/admin/nps-dashboard`.

## 3. Matriz de Rastreabilidade

| Requisito | Planos de Execução | Status |
| :--- | :--- | :--- |
| **AI-CORE** | 05-01 | Planejado |
| **AI-TRIAGE** | 05-02 | Planejado |
| **AI-COLLECT** | 05-02, 05-04 | Planejado |
| **AI-RAG** | 05-02, 05-03 | Planejado |
| **AI-SOLVER** | 05-03, 05-04 | Planejado |
| **AI-CURATION** | 05-03 | Planejado |
| **AI-NPS** | 05-03, 05-04 | Planejado |

## 4. Auditoria e Logs

Todos os prompts e respostas da IA devem ser auditáveis na tabela `AILog` contendo:
- `agentName`
- `latency` (em ms)
- `tokenUsage`
- `status` (SUCCESS/ERROR)

## 5. Procedimento de Rollback
Em caso de falha nas APIs de IA:
1. Desativar globalmente via `AIToggle` nas configurações de Admin.
2. O sistema deve reverter para o fluxo manual padrão de triagem e resposta (Core Ticketing da Fase 2).
