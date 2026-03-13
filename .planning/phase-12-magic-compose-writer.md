# Fase 12: Magic Compose - Assistente de Redação Inteligente

Esta fase transforma o Magic Compose em uma ferramenta de auxílio à escrita, ajudando usuários a estruturarem melhor seus chamados e respostas usando IA.

## Objetivos
- **Redação de Chamado:** Ajudar na abertura de chamados usando Título, Descrição, Categoria e Tipo como base.
- **Refinamento de Resposta:** Polir respostas no histórico (mínimo 20 caracteres) usando o contexto do chamado.
- **Mimetismo de Linguagem:** A IA deve adaptar-se ao estilo de escrita (casual/técnico) do usuário.
- **Linguagem Simples:** Garantir que o texto gerado seja de fácil compreensão.

## 1. Backend (`src/lib/actions/ai.ts`)
Atualizar `getMagicComposeAction` (ou criar `generateWritingAssistanceAction`):
- **Parâmetros:** 
    - `text`: Texto base (Título ou Resposta parcial).
    - `context`: Objeto com { title, description, category, type, history }.
- **Lógica:**
    - Se for Novo Chamado: Gerar descrição estruturada a partir do título.
    - Se for Resposta: Polir os 20+ caracteres baseados no que está acontecendo no chamado.
    - Instrução de Sistema: "Copie o tom de voz do usuário, mas torne o texto mais claro e organizado."

## 2. Componente UI (`src/components/ai/MagicCompose.tsx`)
- Adicionar propriedades: `initialText`, `contextData`, `minChars`.
- Implementar validações:
    - Se for abertura: Habilitar se `title` estiver preenchido.
    - Se for resposta: Habilitar se `currentText.length >= 20`.

## 3. Integração
- **NewTicketPage:** Adicionar o botão ao lado do campo de descrição.
- **TicketDetailView:** Manter no formulário de resposta, mas com a nova regra de 20 caracteres.

## Verificação
- No Novo Chamado: Digitar "Erro no Login" e clicar em Magic Compose -> Ver descrição sugerida.
- Na Resposta: Digitar "Vou verificar agora o servidor" -> Clicar em Magic Compose -> Ver texto polido.
