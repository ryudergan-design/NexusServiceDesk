# Catálogo de Componentes UI (Shadcn UI & Radix)

Este arquivo documenta todos os componentes famosos e modernos que foram pré-baixados no repositório (`src/components/ui/`), permitindo acelerar as futuras fases do projeto (como a Fase 4).

Todos estes componentes foram extraídos de bibliotecas altamente conceituadas e são acessíveis, flexíveis e altamente customizáveis via Tailwind CSS.

---

## 🏗 Estrutura e Layout

| Componente | Arquivo | Descrição e Caso de Uso |
| --- | --- | --- |
| **Accordion** | `accordion.tsx` | Painéis expansíveis (sanfona). Ideal para FAQs, menus laterais com subitens ou detalhes secundários em chamados. |
| **Aspect Ratio** | `aspect-ratio.tsx` | Mantém a proporção de um elemento (ex: 16:9). Excelente para exibir anexos de imagens, vídeos ou placeholders sem quebrar o layout. |
| **Card** | `card.tsx` | Container versátil com cabeçalho, conteúdo e rodapé. Ótimo para dashboards, exibição de detalhes de tickets e listagem de usuários. |
| **Collapsible** | `collapsible.tsx` | Seção simples de expandir/recolher. Útil para mostrar históricos longos de comentários ou logs de auditoria sem poluir a tela. |
| **Drawer** | `drawer.tsx` | Painel deslizante que surge do rodapé ou laterais (gaveta). Excelente alternativa a modais para uso em dispositivos móveis (Mobile Nav). |
| **Resizable** | `resizable.tsx` | Divisores de painel ajustáveis (arrastáveis). Pode ser usado em uma interface estilo IDE ou visualização lado-a-lado (lista de tickets / detalhes). |
| **Scroll Area** | `scroll-area.tsx` | Barras de rolagem customizadas (cross-browser). Perfeito para listas de notificações ou histórico extenso de chamados. |
| **Separator** | `separator.tsx` | Linha divisória horizontal ou vertical acessível (`<hr>` moderno). |

---

## 🧭 Navegação

| Componente | Arquivo | Descrição e Caso de Uso |
| --- | --- | --- |
| **Breadcrumb** | `breadcrumb.tsx` | Trilha de navegação. Fundamental para ajudar o usuário a saber onde está (ex: `Início > Chamados > Ticket #123`). |
| **Menubar** | `menubar.tsx` | Menus complexos estilo aplicação desktop (ex: Arquivo, Editar, Exibir). |
| **Navigation Menu** | `navigation-menu.tsx` | Menu de navegação superior moderno com transições e suporte a sub-menus ricos (com imagens/descrições). |
| **Pagination** | `pagination.tsx` | Controles de páginação com números, "Próximo" e "Anterior". Essencial para listas grandes como as de relatórios ou chamados resolvidos. |
| **Tabs** | `tabs.tsx` | Navegação em abas na mesma página. Pode separar "Detalhes do Chamado", "SLA", "Anexos" e "Histórico". |

---

## 🎛 Formulários & Entradas (Inputs)

| Componente | Arquivo | Descrição e Caso de Uso |
| --- | --- | --- |
| **Button** | `button.tsx` | Botões padrão com variantes (primary, destructive, ghost, outline). |
| **Checkbox** | `checkbox.tsx` | Caixas de seleção acessíveis. Útil para seleções múltiplas em listas de chamados. |
| **Form** | `form.tsx` | Wrapper para React Hook Form + Zod com validação automática, mensagens de erro e labels nativos. O padrão ouro atual. |
| **Input / Textarea** | `input.tsx`, `textarea.tsx` | Campos de texto básicos para digitação. |
| **Input OTP** | `input-otp.tsx` | Campo de entrada de código com vários dígitos. Perfeito para validação de 2 Fatores (2FA) ou confirmação de ações críticas. |
| **Label** | `label.tsx` | Rótulo semântico associado a inputs, melhorando acessibilidade. |
| **Radio Group** | `radio-group.tsx` | Seleção de opção única. Pode ser usado para selecionar a Prioridade (Baixa, Média, Alta) de um ticket. |
| **Select** | `select.tsx` | Menu suspenso nativo (dropdown) para escolhas com poucas opções. |
| **Slider** | `slider.tsx` | Controle deslizante. Menos comum em chamados, mas útil em configurações e preferências visuais. |
| **Switch** | `switch.tsx` | Botão de alternância (Toggle/Liga-Desliga). Ideal para configurar alertas e ativar/desativar módulos no painel admin. |

---

## 📊 Dados e Interatividade Avançada

| Componente | Arquivo | Descrição e Caso de Uso |
| --- | --- | --- |
| **Chart** | `chart.tsx` | Gráficos poderosos (via Recharts). Peça-chave para a futura Fase de Relatórios e Dashboard analítico. |
| **Calendar** | `calendar.tsx` | Seletor de datas. Necessário para filtros (Data de Criação, Previsão de Fechamento). |
| **Carousel** | `carousel.tsx` | Exibe múltiplos itens com navegação horizontal. Pode ser usado em um mural de avisos internos na tela inicial. |
| **Command** | `command.tsx` | Paleta de comandos (estilo `Ctrl+K` ou `Cmd+K`). Permite pesquisa rápida de chamados, usuários ou ações de qualquer lugar do app. |
| **Table** | `table.tsx` | Estrutura de tabela altamente estilizada para listar dados. |
| **Toggle** & **Toggle Group** | `toggle.tsx`, `toggle-group.tsx` | Botões de liga/desliga individuais ou agrupados. Usados para filtros rápidos (Ex: "Apenas abertos"). |

---

## 🔔 Feedback & Modais

| Componente | Arquivo | Descrição e Caso de Uso |
| --- | --- | --- |
| **Alert** | `alert.tsx` | Banner persistente de alerta (Sucesso, Erro, Aviso) dentro da página. |
| **Alert Dialog** | `alert-dialog.tsx` | Modal focado em confirmações destrutivas (ex: "Tem certeza que deseja apagar este chamado?"). Obriga a resposta do usuário. |
| **Dialog** | `dialog.tsx` | Modal genérico e livre. Excelente para "Criar novo chamado" flutuante ou editar detalhes sem sair da tela de lista. |
| **Context Menu** | `context-menu.tsx` | Menu aberto ao clicar com botão direito (click direito do mouse). Pode adicionar atalhos em tabelas (ex: clique direito num chamado para "Fechar"). |
| **Dropdown Menu** | `dropdown-menu.tsx` | Menu suspenso (acionado por botão normal). Usado muito no menu de perfil (canto superior direito) ou botões de "Ações" (`...`). |
| **Hover Card** | `hover-card.tsx` | Pequeno popover que surge ao passar o mouse. Ideal para exibir os dados de contato do Usuário Solicitante ao focar no nome dele em um chamado. |
| **Popover** | `popover.tsx` | Similar ao Dialog, mas ancorado a um botão específico. Ótimo para mini-formulários de filtros complexos. |
| **Skeleton** | `skeleton.tsx` | Efeito visual de carregamento (placeholders cinzas piscando). Melhora enormemente a percepção de performance. |
| **Sonner (Toast)** | `sonner.tsx` | Notificações efêmeras em formato de brinde no canto da tela (ex: "Chamado atualizado com sucesso"). Substitui o Toast tradicional por ser mais fluído. |
| **Tooltip** | `tooltip.tsx` | Pequena dica de texto que aparece ao passar o mouse sobre botões iconográficos. |

---

## 💡 Como Usar

Para usar qualquer componente acima, importe conforme os padrões do projeto:
```tsx
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export function Exemplo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Abrir Modal</Button>
      </DialogTrigger>
      <DialogContent>
        {/* Conteúdo aqui */}
      </DialogContent>
    </Dialog>
  )
}
```
*Toda base técnica e estilo está concentrada em `src/components/ui/`. Não modifique os arquivos lá, mas sim importe-os nas pastas `src/components/`, `src/app/` ou páginas de negócio.*
