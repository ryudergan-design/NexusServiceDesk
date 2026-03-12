# Refinamento de Fase 2.2: Editor de Texto Rico (Padrão Softdesk)

## Objetivo
Elevar a qualidade da comunicação no sistema de chamados, substituindo campos de texto simples por um Editor de Texto Rico (WYSIWYG), permitindo formatação profissional, blocos de código e inserção de imagens inline.

## Requisitos de Experiência (Softdesk Style)
1. **Formatação Essencial:** Negrito, Itálico, Listas (Bullets/Numeradas) e Títulos.
2. **Suporte a Código:** Inserção de blocos de código com formatação monoespaçada (essencial para suporte técnico).
3. **Imagens Inline:** Capacidade de colar imagens (prints) diretamente no corpo do texto (via Ctrl+V).
4. **Renderização Segura:** Visualização do conteúdo formatado na Timeline e Detalhes do Chamado de forma segura e responsiva.

## Especificação Técnica
- **Biblioteca:** TipTap (Headless, moderno e altamente customizável com Tailwind CSS).
- **Componentes:**
    - `src/components/rich-text-editor.tsx`: Componente base reutilizável.
    - `src/components/rich-text-renderer.tsx`: Componente para exibição segura de HTML.
- **Integração:**
    - Página de Abertura de Chamado (`/dashboard/tickets/new`).
    - Formulário de Atividades (`/dashboard/tickets/[id]`).

## Verificação (UAT)
- [ ] Criar um chamado com texto em Negrito e uma lista.
- [ ] Inserir um bloco de código em uma nota técnica interna.
- [ ] Colar uma imagem no editor e salvar com sucesso.
- [ ] Visualizar a formatação corretamente na Timeline do chamado.
