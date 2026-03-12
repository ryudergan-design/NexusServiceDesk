# Arquitetura do Sistema - I9 Chamados

**Padrões Gerais:** 
Arquitetura baseada no Next.js App Router (v14+) com separação clara entre camada de apresentação (Components), lógica de negócio (Lib) e persistência (Prisma).

## Persistência e Fluxo de Dados
- **Integridade de Dados:** O sistema utiliza transações (`prisma.$transaction`) em endpoints críticos como a criação de chamados e atualizações de status para garantir que registros de auditoria e anexos sejam salvos de forma atômica.
- **Lógica de SLA:** Encapsulada em `src/lib/sla.ts`, calculando prazos de resposta e resolução baseados em prioridade e horário comercial (ITIL 4).
- **Anexos:** Armazenamento de metadados no banco de dados (`Attachment`) com links apontando para arquivos físicos.

## Camadas de Responsabilidade
1. **API (Route Handlers):** Localizados em `src/app/api/`, processam requisições, validam permissões e executam operações de banco.
2. **Components:** Interface em React com Tailwind CSS e Shadcn/UI, focada em UX moderna (Dark Mode).
3. **Lib:** Utilitários core, incluindo o cliente Prisma (`prisma.ts`) e o motor de SLA.
4. **Middleware:** Controle de acesso e proteção de rotas via Auth.js v5.

## Observações Críticas
A segurança da persistência é garantida pelo uso extensivo de transações no Prisma. Nada "escapa" do banco pois o status do ticket só muda se a transição de auditoria (`TicketTransition`) for gravada com sucesso.
