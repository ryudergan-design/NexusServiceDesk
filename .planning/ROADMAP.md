# Roadmap: I9 Chamados

## Fase 1: Fundação e Autenticação (Setup Inicial)
**Objetivo:** Estabelecer a infraestrutura técnica e o controle de acesso básico.
- [x] Setup do projeto Next.js (Tailwind, Shadcn/UI, Framer Motion).
- [x] Modelagem do Banco de Dados (Prisma Schema).
- [x] Configuração do Supabase (Auth e Database).
- [x] Implementação de Login, Registro e Fluxo de Recuperação de Senha (UI).
- [x] Layout base do Dashboard (Shell: Sidebar, Header, Perfil).

## Fase 1.1: Refinamento e Segurança (Pivot SQLite)
**Objetivo:** Tornar o sistema funcional com banco de dados SQLite local e segurança.
- [x] Implementação do CredentialsProvider com bcryptjs.
- [x] Migração para SQLite Local (Prisma v6).
- [x] Execução das migrações e Seed do Admin inicial.
- [x] Ajustes de responsividade Mobile e flash de tema.

## Fase 2: Ciclo de Vida do Chamado (Core Ticketing)
**Objetivo:** Permitir a criação, tramitação e fechamento de chamados.

- [x] Formulário de abertura de chamados (Web).
- [x] Lista de chamados com filtros e busca rápida.
- [x] Detalhes do chamado: Histórico de interações (comentários), Anexos e Mudança de Status.
- [x] Lógica de priorização e atribuição automática básica.
- [x] Sistema de categorias e subcategorias (Incidentes vs. Requisições).

## Fase 3: SLAs e Dashboards (Inteligência Operacional)
**Objetivo:** Controlar prazos e oferecer visibilidade em tempo real.

- [x] Implementação do motor de SLA (Cálculo de prazos baseado em prioridade).
- [x] Widgets do Dashboard do Atendente (Contadores, Atividades Recentes).
- [x] Dashboard do Gestor com gráficos (Recharts: Volume por categoria, Status SLA).
- [x] Sistema de Notificações In-app e por E-mail (Resumo de ações).

## Fase 4: Autoatendimento e Satisfação (V1.0)
**Objetivo:** Reduzir carga operacional e coletar feedback.

- [ ] Base de Conhecimento: CRUD de artigos e portal de busca. (Persistido em SQLite)
- [ ] Portal do Solicitante: Visão simplificada de chamados e histórico.
- [ ] Pesquisa de Satisfação NPS (Pós-fechamento). (Persistido em SQLite)
- [ ] Pesquisa 180 (Avaliação do Solicitante pelo Atendente). (Persistido em SQLite)
- [ ] **Integração de Auditoria:** Garantir que todas as ações administrativas e de segurança sejam registradas na tabela `AuditLog` e `AccessLog`.

## Diretrizes SQL Transversais
- **SQLite como única fonte de verdade:** Todos os dados, desde configurações de UI até logs de acesso, devem ser persistidos no banco local.
- **Gestão de Imagens:** Nenhuma imagem deve existir sem um link correspondente na tabela `Attachment`.
- **Registro de Tudo:** Cada execução crítica (login, erro, mudança de regra) deve gerar uma linha em tabela organizada de log.

## Fase 5: Refinamento e Performance (Polimento Final)
**Objetivo:** Garantir uma UX excepcional e alta performance.

- [ ] Polimento de UI: Animações complexas (Framer Motion), transições e micro-interações.
- [ ] Otimização de Performance (Core Web Vitals) e SEO básico.
- [ ] Landing Page institucional do I9 Chamados.
- [ ] Preparação para Deploy de Produção e Auditoria Final.
