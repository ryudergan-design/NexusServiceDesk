# Fase 8: Nexus ServiceDesk - Agentes de IA Gerenciáveis

Esta fase foca na criação de uma infraestrutura para gerenciar múltiplos Agentes de IA (Gemini) dentro do sistema, permitindo que atendentes humanos atribuam chamados manualmente para esses robôs.

## Objetivos
- Permitir o cadastro de Agentes de IA na área de Gestão de Usuários.
- Configurar cada agente com Token (API Key), Modelo e Instruções de Sistema próprias.
- Adicionar um ícone de Robô no Kanban e Desk View para atribuição rápida de IA.
- Implementar o workflow: Atendente clica no robô -> Seleciona o Agente de IA -> IA processa o chamado e responde.

## 1. Extensão do Banco de Dados (Prisma)
Adicionar os seguintes campos ao modelo `User`:
- `isAI`: Boolean (default: false)
- `aiApiKey`: String? (Para o token do Gemini)
- `aiModel`: String? (Default: "gemini-1.5-flash")
- `aiInstructions`: String? (Instruções de Sistema / Prompt)

## 2. Interface Administrativa (Gestão de Usuários)
- Criar uma aba ou seção específica para "Agentes de IA".
- Formulário para criar/editar Agentes de IA.
- Listagem diferenciada para esses usuários.

## 3. Workflow de Atribuição (UI/UX)
### No Kanban (`kanban-view.tsx`):
- Adicionar um ícone de robô (`Bot` ou `Cpu` do Lucide) nos cards dos chamados (exceto os finalizados).
- Ao clicar, abrir um `Dialog` ou `Popover` listando os Agentes de IA disponíveis.
- Ao selecionar, realizar a atribuição do chamado ao Agente escolhido.

### No Modo Desk (`desk-view.tsx`):
- Adicionar uma nova coluna "IA" com o ícone do robô.
- Mesma lógica de seleção e atribuição do Kanban.

## 4. Lógica de Execução da IA
- Criar uma Server Action `assignToAIAgent(ticketId, agentId)`.
- Essa ação deve:
  1. Validar se o `agentId` é realmente um Agente de IA.
  2. Atualizar o `assigneeId` do chamado.
  3. Recuperar as instruções e a API Key do agente.
  4. Chamar a API do Gemini com o contexto do chamado e do RAG.
  5. Adicionar a resposta da IA como um `TicketComment` (público ou interno, dependendo da configuração).
  6. Mover o chamado para o status apropriado (ex: "Aguardando Cliente" ou "Em Desenvolvimento").

## Verificação e Testes
- Criar um Agente de IA chamado "Nexus Bot" com instruções específicas.
- No Kanban, atribuir um chamado ao "Nexus Bot".
- Verificar se o comentário da IA aparece no chamado e se o log da IA foi registrado.
