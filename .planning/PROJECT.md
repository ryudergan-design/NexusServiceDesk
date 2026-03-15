# Projeto: I9 Chamados

## Estado Atual
O projeto esta consolidado como uma central de atendimento moderna com base em `Next.js + Prisma + SQLite`, operando com visualizacao `Kanban` e `Desk`, fluxo de chamados completo, assistentes de IA com Gemini, organizacao documental estruturada em `10 fases`, documentacao institucional oficial em HTML e PDF e uma camada mobile mais proxima de aplicativo.

## Produto em Operacao
- Portal de chamados com abertura, acompanhamento e historico.
- Dashboard para atendimento e administracao.
- Dashboard principal autenticado com leitura high-tech por perfil.
- Dashboard principal autenticado com area dedicada para leitura operacional da IA.
- Navegacao mobile com barra inferior, busca rapida e shell mais proximo de app.
- Home com hero high-tech, sinais operacionais essenciais e copy enxuta para apresentacao forte sem cansar a leitura.
- Visualizacao dual `Kanban` e `Desk`.
- Atribuicao de chamados para atendentes e IAs.
- Automacao de comentarios, triagem e escalonamento com Gemini.
- Magic Compose contextual para abertura e respostas.
- Espelho estrutural de banco para Supabase, sem alterar o runtime atual.
- Documentacao institucional completa com capturas reais do sistema.

## Identidade do Projeto
- Nome tecnico do projeto: `I9 Chamados`
- Nome operacional e branding aplicado no produto: `Nexus ServiceDesk`

## Stack Oficial
- Framework: `Next.js` com App Router
- UI: `Tailwind CSS`, `Shadcn/UI`, `Framer Motion`
- Banco oficial: `SQLite`
- ORM: `Prisma`
- Autenticacao: `Auth.js v5`
- IA ativa: `Gemini` via `@google/genai`

## Marco Atual
O foco atual nao e mais construir o MVP base, e sim:
- consolidar a organizacao da base
- manter a documentacao alinhada ao executado
- separar artefatos divergentes para revisao
- preservar preparacao futura para Supabase

## Linha de Entrega Consolidada
- Fase 1: fundacao, auth e base do produto
- Fase 2: core ticketing e workflow base
- Fase 3: operacao, SLA, dashboard e dual view
- Fase 4: produto, branding e experiencia
- Fase 5: fundacao de IA e ferramentas assistidas
- Fase 6: atendimento operacional por IA
- Fase 7: dados, seeds e simulacoes
- Fase 8: estrategia de banco e espelho futuro
- Fase 9: documentacao institucional do projeto
- Fase 10: experiencia mobile app

## Diretriz Atual
A base oficial do produto e o frontend/backend presente em `src/`, sustentado por `prisma/schema.prisma`, com planejamento vivo em `.planning/`, documentacao institucional em `PROJETO/documentacao-institucional/` e triagem de legado em `DIVERGENTES/`.

## Regra de Entrega Continua
- Toda mudanca relevante deve estar documentada em uma fase.
- Se a mudanca nao se encaixar em nenhuma fase existente, uma nova fase deve ser criada.
- Toda mudanca visual deve gerar evidencias `before/after` em `PROJETO/mudancas-visuais/`.
- O fluxo padrao de entrega apos validacao e `commit` seguido de `push`.
