# Pesquisa Técnica: Fase 5 - Autoatendimento e Satisfação

## 1. Busca Full-Text (FTS5) com SQLite e Prisma

### Desafio
O Prisma não suporta tabelas virtuais SQLite (FTS5) nativamente no seu DSL (`findMany`, etc.).

### Solução Proposta
1.  **Migração Manual:** Criar uma tabela virtual `KnowledgeArticle_FTS` e gatilhos (`AI`, `AD`, `AU`) para sincronizar dados da tabela `KnowledgeArticle`.
2.  **Mecanismo de Busca:** Utilizar `prisma.$queryRaw` para executar comandos `MATCH` e retornar os IDs dos artigos mais relevantes (ordenados por `rank`).
3.  **Sugestão Automática:** Implementar um debounce no campo de "Assunto" do chamado para disparar a busca FTS e sugerir artigos em tempo real.

## 2. Pesquisa 180 (Agente -> Cliente)

### Conceito
Permitir que o atendente avalie a interação após o fechamento do chamado.

### Estrutura de Dados Sugerida
- **Escala:** 1 a 5 (ou ícones de sentimento).
- **Tags de Comportamento:**
    - `Claro e Objetivo`
    - `Informações Incompletas`
    - `Hostil/Abusivo`
    - `Dificuldade Técnica`
    - `Seguiu Instruções`
- **Impacto:** Essas métricas serão usadas no "Dashboard de Qualidade" para cruzar dados de satisfação do cliente (CSAT) com a percepção do atendente.

## 3. Pesquisa NPS Avançada (Cliente -> Agente)

### Estrutura
- **Pergunta Principal:** "De 0 a 10, o quanto você recomendaria nosso suporte?"
- **Lógica NPS:**
    - 0-6: Detratores
    - 7-8: Neutros
    - 9-10: Promotores
- **Comentário Aberto:** Obrigatório para notas abaixo de 7.

## 4. Referências Visuais (UI/UX)
- **Base de Conhecimento:** Layout estilo "Help Center" (Stripe/Vercel) com cards grandes e busca centralizada.
- **Micro-interações:** Usar `framer-motion` para transições suaves entre a lista de sugestões e o conteúdo do artigo.
