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

- [ ] Formulário de abertura de chamados (Web).
- [ ] Lista de chamados com filtros e busca rápida.
- [ ] Detalhes do chamado: Histórico de interações (comentários), Anexos e Mudança de Status.
- [ ] Lógica de priorização e atribuição automática básica.
- [ ] Sistema de categorias e subcategorias (Incidentes vs. Requisições).

## Fase 3: SLAs e Dashboards (Inteligência Operacional)
**Objetivo:** Controlar prazos e oferecer visibilidade em tempo real.

- [ ] Implementação do motor de SLA (Cálculo de prazos baseado em prioridade).
- [ ] Widgets do Dashboard do Atendente (Contadores, Atividades Recentes).
- [ ] Dashboard do Gestor com gráficos (Recharts: Volume por categoria, Status SLA).
- [ ] Sistema de Notificações In-app e por E-mail (Resumo de ações).

## Fase 4: Autoatendimento e Satisfação (V1.0)
**Objetivo:** Reduzir carga operacional e coletar feedback.

- [ ] Base de Conhecimento: CRUD de artigos e portal de busca.
- [ ] Portal do Solicitante: Visão simplificada de chamados e histórico.
- [ ] Pesquisa de Satisfação NPS (Pós-fechamento).
- [ ] Pesquisa 180 (Avaliação do Solicitante pelo Atendente).

## Fase 5: Refinamento e Performance (Polimento Final)
**Objetivo:** Garantir uma UX excepcional e alta performance.

- [ ] Polimento de UI: Animações complexas (Framer Motion), transições e micro-interações.
- [ ] Otimização de Performance (Core Web Vitals) e SEO básico.
- [ ] Landing Page institucional do I9 Chamados.
- [ ] Preparação para Deploy de Produção e Auditoria Final.
