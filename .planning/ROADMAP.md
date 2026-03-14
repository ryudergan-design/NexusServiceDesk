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

## Fase 3.1: Refinamentos Operacionais (Polimento do MVP)
**Objetivo:** Ajustar fluxos fora do escopo inicial para o lançamento da Versão 1.0.0.

- [x] Numeração Sequencial de Chamados (migração de cuid para Int).
- [x] Fluxo de Encaminhamento de Chamados entre atendentes.
- [x] Obrigatoriedade de Triagem antes de Aprovação/Resolução.
- [x] Redirecionamento automático para a Pesquisa de Satisfação via Notificações.
- [x] Correções de estabilidade no Dashboard (`toString()` de undefined).
- [x] Atualização de Seed de Usuários (Configuração de senhas e perfis padrão).

## Fase 4: Reestruturação Visual e Triagem Rápida (Softdesk Layout)
**Objetivo:** Consolidar a experiência de uso profissional com o Modo Desk e alternância Kanban.

- [x] Implementação da lógica de alternância (Toggle) Kanban vs. Desk.
- [x] Criação do componente `DeskView` (Tabela de alta densidade).
- [x] Implementação do `QuickView` (Painel lateral/Split View para detalhes).
- [x] Refatoração da Barra Lateral para Filtros Rápidos dinâmicos.
- [x] Persistência de preferência de visualização por usuário.

## Fase 5: IA Agentica e RAG (V1.1 - Automação Inteligente)
**Objetivo:** Automatizar a triagem, coleta de dados e auxiliar na resolução usando Agentes de IA e RAG no SQLite.

**Plans:** 4 planos
- [x] 05-01-PLAN.md — Infraestrutura de IA, FTS5 e Contratos Zod.
- [x] 05-02-PLAN.md — Implementação dos Agentes de Triagem, Coleta e Engine de RAG.
- [x] 05-03-PLAN.md — Agentes Solucionador, Curadoria e Backend de Sentimento NPS.
- [x] 05-04-PLAN.md — Componentes de UI (Insight Card, Magic Compose, Chat) e Dashboard NPS.

## Fase 6: Polimento Final e Deploy (Produção)
**Objetivo:** Garantir uma UX excepcional, alta performance e preparação para o ambiente de produção.

- [ ] Polimento de UI: Animações complexas (Framer Motion), transições e micro-interações.
- [ ] Otimização de Performance (Core Web Vitals) e SEO básico.
  - [ ] Otimizar fontes via `next/font/google` com `display: swap`.
  - [ ] Implementar `next/image` para melhor compressão e carregamento preguiçoso.
  - [ ] Configurar `next.config.mjs` com compressão e headers de segurança.
- [ ] Auditoria Final de Segurança, Tratamento de Erros e Persistência (SQLite).
- [ ] Landing Page institucional do I9 Chamados.
- [ ] Deploy em produção (Vercel ou Self-Hosted via Docker).

## Princípios Arquiteturais (Core)
- **SQLite como única fonte de verdade:** Todos os dados, desde configurações de UI até logs de acesso, devem ser persistidos no banco local.
- **Gestão de Imagens:** Nenhuma imagem deve existir sem um link correspondente na tabela `Attachment`.
- **Registro de Tudo:** Cada execução crítica (login, erro, mudança de regra) deve gerar uma linha em tabela organizada de log.
