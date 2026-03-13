# Fase 9: Nexus ServiceDesk - Workflow Ativo de IA

Esta fase foca em tornar os Agentes de IA funcionais, interativos e visualmente identificáveis quando ativos em um chamado.

## Objetivos
- Sinalização visual (Verde) quando um chamado está atribuído a uma IA.
- Implementar resposta real via Gemini com saudação personalizada (Nome do Cliente + Resumo do Problema).
- Workflow de Fallback: IA devolve o chamado para o humano se não puder resolver.
- Registro de atividade detalhado.

## 1. Sinalização Visual (UI)
- No `RobotAssignment.tsx`, verificar se o `currentAssigneeId` pertence a um Agente de IA.
- Se sim, mudar a cor do botão de Âmbar para **Emerald (Verde)** e adicionar um brilho verde.
- O ícone do robô deve pulsar enquanto a IA estiver processando (opcional, foco na cor verde para estado "Atribuído").

## 2. Lógica Real de Atendimento (Server Action)
Atualizar `assignToAIAgent` para:
1.  **Contexto Completo:** Coletar Nome do Cliente, Título, Descrição e Contexto RAG.
2.  **Prompt Dinâmico:** Enviar as instruções do agente + dados do chamado para o Gemini.
3.  **Saudação Obrigatória:** Instruir a IA a se apresentar, saudar o cliente e citar o problema.
4.  **Decisão de Workflow:**
    - Se a IA encontrar solução -> Postar comentário público e manter atribuição ou mover para "Aguardando Cliente".
    - Se a IA não souber resolver -> Postar comentário interno explicando o motivo e **reatribuir ao atendente humano** que iniciou a ação.

## 3. Melhoria no Registro
- Criar um `TicketComment` formatado que deixe claro que a análise foi feita pela IA.
- Garantir que o nome da IA apareça como autor do comentário.

## Verificação
- Atribuir chamado ao "Nexus Suporte Técnico".
- Validar se a resposta cita o nome da empresa/cliente.
- Testar cenário onde a IA admite que não pode resolver e devolve o chamado.
