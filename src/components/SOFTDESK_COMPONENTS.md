# Guia de Componentes Web - Softdesk (I9 Chamados)

Esta documentação descreve os componentes visuais utilizados na construção do **Softdesk**. O sistema utiliza **Shadcn/UI + Tailwind CSS** para garantir uma interface moderna, rápida e responsiva.

## 🏢 Componentes de Estrutura (Layout)
- **Sidebar:** O painel lateral de navegação. Gerencia as rotas principais (Dashboard, Chamados, Relatórios).
- **Header:** Barra fixa superior com busca global, notificações em tempo real e perfil do atendente.
- **ScrollArea:** Utilizado em listas longas (como o histórico de comentários) para garantir uma rolagem suave sem barras de sistema feias.
- **Tabs:** Organizam o detalhe do chamado em seções: "Interações", "Anexos", "Histórico de Status" e "Dados do Solicitante".

## 🎫 Componentes de Gestão de Tickets (Core)
- **Card:** O container padrão para tickets na visualização em grade. Exibe o resumo, prioridade e status.
- **Badge:** Sinalizadores visuais para status (Ex: `Verde` para Resolvido, `Vermelho` para Crítico, `Amarelo` para Em Aberto).
- **DropdownMenu:** Menu de ações rápidas (`...`) em cada ticket: "Atribuir a mim", "Alterar Prioridade", "Encerrar".
- **Accordion:** Utilizado para seções colapsáveis, como a base de conhecimento ou detalhes técnicos avançados do dispositivo do solicitante.
- **AlertDialog:** Modal de confirmação para ações irreversíveis, como a deleção de um anexo ou o fechamento de um chamado sem solução.

## ✍️ Componentes de Entrada de Dados (Forms)
- **RichTextEditor:** Editor de texto rico (Baseado no TipTap/React-Quill) para registrar descrições detalhadas e soluções.
- **Select / Combobox:** Seleção de Categorias, Subcategorias e Atendentes com busca integrada.
- **Input / Textarea:** Campos básicos para títulos, nomes e observações rápidas.
- **Checkbox / Switch:** Ativação de filtros (Ex: "Ver apenas meus chamados") e configurações de notificação.

## ⚡ Feedback e Performance (UX)
- **Skeleton:** Placas de carregamento que simulam o layout real enquanto os dados do SQLite estão sendo buscados, eliminando flashes brancos na tela.
- **Sonner (Toasts):** Notificações pop-up de sucesso/erro (Ex: "Chamado #123 criado com sucesso!").
- **Tooltip:** Dicas flutuantes em ícones de ações (Ex: Hover sobre o cronômetro para ver o tempo restante do SLA).
- **Progress:** Barra de progresso visual para indicar a proximidade do estouro do SLA de resolução.

## 🎨 Design System
- **Tema:** Dark Mode (Padrão) e Light Mode integrados via `next-themes`.
- **Animações:** Transições suaves de modais e menus via `Framer Motion`.

---
*Todos os componentes acima estão localizados em `src/components/ui/` e `src/components/dashboard/`.*
