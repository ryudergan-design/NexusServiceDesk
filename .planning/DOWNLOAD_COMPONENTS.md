# Adição de Componentes UI Completos

## Objetivo
Baixar e documentar uma vasta biblioteca de componentes web famosos e de sucesso (com foco em todo o ecossistema Shadcn UI e bibliotecas modernas associadas) para facilitar o planejamento e acelerar o desenvolvimento de fases futuras, garantindo que o arsenal visual esteja pronto para uso.

## Escopo e Impacto
- Baixar todos os componentes disponíveis da biblioteca padrão (Shadcn UI), o que inclui itens avançados como gráficos (charts), comboboxes, tabelas de dados, calendários, carrosséis, formulários otimizados, entre outros.
- Criar uma documentação unificada no repositório descrevendo como utilizá-los no projeto (ex: `src/components/UI_CATALOG.md`).
- Nenhuma funcionalidade de sistema atual será modificada; será estritamente a adição de novos arquivos de componentes e dependências em `src/components/ui/`.

## Passos de Implementação
1. **Instalação em Massa**:
   Executar a CLI do Shadcn para baixar os componentes adicionais do catálogo completo:
   `npx shadcn@latest add accordion alert aspect-ratio breadcrumb calendar carousel chart collapsible command context-menu drawer form hover-card input-otp menubar navigation-menu pagination popover radio-group resizable separator slider toggle toggle-group -y`
   *(Observação: alguns componentes essenciais como button, dialog, table já estão instalados, mas garantiremos a completude do ecossistema).*
2. **Validação de Dependências Extras**:
   Confirmar e instalar dependências extras que os componentes modernos requerem, como `recharts` (para gráficos) e `cmdk` (para paletas de comando).
3. **Catálogo de Componentes**:
   Escrever o arquivo `src/components/UI_CATALOG.md` contendo a lista dos componentes, suas funcionalidades (ex: *Chart* para Dashboards analíticos, *Input OTP* para verificação de 2 fatores) e exemplos práticos para rápida adoção nas Fases 4, 5, etc.

## Verificação
- Listar a pasta `src/components/ui` para confirmar a presença de mais de 40 componentes modulares.
- Executar a build do Next.js e confirmar que os novos componentes baixados não quebram o TypeScript ou ESLint do projeto devido a atualizações na biblioteca.
