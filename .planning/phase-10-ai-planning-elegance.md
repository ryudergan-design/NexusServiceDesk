# Fase 10: Nexus ServiceDesk - Inteligência de Planejamento e Elegância

Esta fase foca em transformar a comunicação dos Agentes de IA em algo de alto nível, com etiqueta social e capacidade de planejar cronogramas de resolução.

## Objetivos
- Respostas ultra-elegantes em Markdown.
- Saudações automáticas baseadas no horário (Bom dia/tarde/noite).
- Planejamento automático de Datas (`plannedStartDate` e `plannedDueDate`) pela IA.
- Estrutura de resposta padronizada.

## 1. Novo Contrato de Dados (Schema)
Adicionar `AIAgentSchema` em `src/lib/ai/schemas.ts`:
- `message`: String (Markdown elegante).
- `plannedStartDate`: ISO Date String (Data sugerida para início).
- `plannedDueDate`: ISO Date String (Data sugerida para conclusão).
- `isResolvable`: Boolean (Se a IA acredita que pode resolver).
- `reasoning`: String (Explicação interna da decisão).

## 2. Lógica de Execução (Server Action)
Atualizar `assignToAIAgent` para:
1.  **Determinar Saudação:** Calcular se é "Bom dia", "Boa tarde" ou "Boa noite" no servidor.
2.  **Prompt de Planejamento:** Instruir a IA a analisar Urgência/Impacto para definir datas reais.
    - Ex: Erro crítico de SaaS -> Início Imediato, Entrega em 4h.
    - Ex: Novo Módulo -> Início em 2 dias, Entrega em 7 dias.
3.  **Uso de `generateObject`:** Forçar a IA a retornar o JSON estruturado para que possamos extrair as datas e salvá-las no banco.

## 3. Visual e Rebranding
- A mensagem deve usar separadores (`---`), listas e emojis discretos.
- O nome do cliente deve ser usado logo no início.

## Verificação
- Atribuir chamado de "Lentidão no Dashboard" ao bot.
- Verificar se os campos de "Data Prevista" no banco foram preenchidos.
- Verificar se a resposta começa com a saudação correta.
