# Requisitos: I9 Chamados

## Requisitos Funcionais (RF)

### RF01 - Gestão de Acesso e Autenticação
- O sistema deve suportar múltiplos perfis: Solicitante (Usuário), Atendente (Agente) e Gestor (Admin).
- Autenticação via Supabase Auth (Email/Senha e integração com AD/Google futuramente).
- Recuperação de senha e controle de sessão segura.

### RF02 - Abertura e Gestão de Chamados
- Suporte a múltiplos canais: Portal Web (Responsivo), E-mail (Inbound) e Mobile App.
- Campos obrigatórios: Título, Descrição, Categoria, Prioridade e Anexos.
- Atribuição automática de chamados baseada em filas ou carga de trabalho.
- Histórico completo de interações e log de auditoria por chamado.

### RF03 - Gestão de SLA e Prazos
- Definição de níveis de serviço (SLA) baseados na prioridade e categoria.
- Contador regressivo visual nos dashboards para cada chamado.
- Alertas automáticos para gestores em caso de iminência de violação de SLA.

### RF04 - Dashboards e Relatórios
- **Dashboard do Atendente:** Visão individual de chamados ativos, prazos e métricas pessoais.
- **Dashboard do Gestor:** Visão macro da operação, gargalos, performance da equipe e conformidade global de SLA.
- Gráficos dinâmicos com filtros por data, categoria, agente e departamento.

### RF05 - Base de Conhecimento e Autoatendimento
- Repositório de artigos, tutoriais e FAQs pesquisáveis.
- Sugestão automática de artigos ao abrir um novo chamado baseado no título/descrição.
- Portal do solicitante com status de chamados em tempo real.

### RF06 - Automação e Fluxos ITIL
- Gestão de Incidentes (Restauração rápida) e Requisições (Pedidos padrão).
- Fluxo de aprovação configurável para requisições de serviço.
- Notificações automáticas por e-mail e push em cada mudança de status.

### RF07 - Pesquisa de Satisfação (NPS/180)
- Envio automático de pesquisa NPS após fechamento do chamado.
- Pesquisa 180: O atendente pode avaliar o comportamento/clareza do solicitante.

## Requisitos Não Funcionais (RNF)

### RNF01 - Performance e Disponibilidade
- Tempo de carregamento de páginas inicial < 2s.
- Sistema 100% SaaS com alta disponibilidade (Uptime 99.9%).

### RNF02 - Segurança
- Comunicação criptografada (SSL/TLS).
- Controle de permissões baseado em papéis (RBAC).

### RNF03 - Interface (UI/UX)
- Design Dark Mode nativo com estética moderna (Shadcn + Framer Motion).
- Responsividade total para desktops, tablets e smartphones.
- Componentes animados para transições de status e carregamento de dados.

## Escopo e Limites
- **Dentro do Escopo:** MVP com Gestão de Incidentes, Requisições, Dashboard e SLA.
- **Fora do Escopo Inicial:** Integração com dispositivos de hardware (sensores) e Chatbot de IA Avançado (ficará para fases futuras).
