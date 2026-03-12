# Plano de Fase 2: Ciclo de Vida do Chamado (Core Ticketing)

## Objetivo
Implementar a funcionalidade central de gestão de chamados, permitindo a abertura, tramitação, categorização e acompanhamento de tickets seguindo as melhores práticas ITIL.

## Contexto e Requisitos
- **Modelagem:** Suporte a Incidentes e Requisições com histórico de transições.
- **UI/UX:** Formulários modernos, tabelas com filtros rápidos e visualização detalhada.
- **Stack:** SQLite local, Prisma v6, Next.js 15, Framer Motion.

## Etapas de Implementação

### 1. Evolução do Banco de Dados
- [ ] Atualizar `schema.prisma` com novos modelos:
    - `Category` e `Subcategory` (Organização ITIL).
    - `Ticket` (Título, Descrição, Status, Prioridade, Impacto, Urgência).
    - `TicketTransition` (Audit Trail para conformidade ITIL).
    - `Attachment` (Referência local para arquivos).
- [ ] Rodar migração: `npx prisma migrate dev --name add_ticketing_core`.
- [ ] Atualizar script de seed com categorias padrão (TI, RH, Facilities).

### 2. Abertura de Chamados (Create)
- [ ] Criar API Route `POST /api/tickets` para criação de chamados.
- [ ] Desenvolver página `/tickets/new` com formulário multi-step ou dinâmico.
- [ ] Implementar upload de arquivos para a pasta local `public/uploads` (MVP).
- [ ] Garantir validação Zod e feedback visual neon/glow.

### 3. Visualização e Listagem (Read)
- [ ] Desenvolver página `/tickets` com tabela de chamados.
- [ ] Implementar filtros rápidos: Por Status, Prioridade e Categoria.
- [ ] Criar busca textual no cliente/servidor.
- [ ] Adicionar estados de carregamento (Skeletons animados).

### 4. Gestão e Tramitação (Update/Delete)
- [ ] Criar página de detalhes do chamado `/tickets/[id]`.
- [ ] Implementar Timeline de interações (comentários e mudanças de status).
- [ ] Adicionar funcionalidade de "Assumir Chamado" para atendentes.
- [ ] Criar botões de transição de status (ex: "Em Atendimento", "Resolver").

### 5. Lógica de Negócio e Segurança
- [ ] Restringir visualização: Usuário vê apenas seus chamados; Admin/Agente vê todos.
- [ ] Validar transições de status permitidas (Service Layer).

## Verificação e Testes
- [ ] Criar chamado com sucesso e verificar no banco.
- [ ] Validar se o histórico (`TicketTransition`) é gravado automaticamente.
- [ ] Testar upload de diferentes tipos de arquivos (PDF, PNG, JPG).
- [ ] Garantir que usuários comuns não acessam chamados de terceiros.

## Comandos Úteis
```bash
npx prisma migrate dev
npx prisma generate
```
