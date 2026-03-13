# Fase 7: Nexus ServiceDesk - Rebranding e Carga de Dados

Este plano detalha a transformação do sistema I9 Softdesk para **Nexus ServiceDesk**, focando em uma startup de SaaS, alterando nomenclaturas, status de chamados e realizando uma carga massiva de dados para testes de workflow.

## Objetivos
- Renomear o sistema para **Nexus ServiceDesk**.
- Alterar a nomenclatura de "Solicitante" para "Cliente" em toda a interface e lógica.
- Atualizar o Workflow para incluir estados de Desenvolvimento, Orçamento e Testes.
- Criar 2 usuários administradores específicos.
- Limpar a base atual e gerar 50 clientes e 70 chamados fictícios para testes de estresse e workflow.

## Mudanças na Interface (UI)
1.  **Sidebar & Header:** Alterar "I9 Softdesk" para "Nexus ServiceDesk".
2.  **Labels:** Substituir "Solicitante" por "Cliente" em tabelas, formulários e filtros.
3.  **Status:** 
    - `NEW` -> "Novo"
    - `TRIAGE` -> "Em Triagem"
    - `DEVELOPMENT` -> "Em Desenvolvimento" (Novo)
    - `TESTING` -> "Em Testes" (Novo)
    - `BUDGET_APPROVAL` -> "Orçamento / Aprovação"
    - `AWAITING_CLIENT` -> "Aguardando Cliente" (Antigo PENDING_USER)
    - `COMPLETED` -> "Concluído"

## Manutenção de Base (Seed Script)
Criar um script `prisma/seed-nexus.ts` que:
1.  **Limpa as tabelas:** `Ticket`, `User` (exceto admins se necessário), `Category`, `Subcategory`.
2.  **Cria Administradores:**
    - `jefrsonsales@outlook.com` / `Fal.990544`
    - `luizkaz175@gmail.com` / `Luiz8521@`
3.  **Cria Categorias de SaaS:**
    - "Desenvolvimento de MicroSaaS"
    - "Integração de APIs"
    - "Manutenção Corretiva"
    - "Consultoria de Arquitetura"
    - "UI/UX Design"
4.  **Gera 50 Clientes:**
    - Email: `nome@nexuservicedesk.com`
    - Senha: `nome` (parte antes do @)
    - Role: `USER`
    - Approved: `true`
5.  **Gera 70 Chamados:**
    - Distribuídos entre os 50 clientes.
    - Status variados conforme o novo workflow.
    - Impacto e Urgência condizentes com o mercado de SaaS.

## Implementação Técnica

### Passo 1: Atualização dos Status no Código
- Modificar `src/lib/actions/nav.ts` para refletir os novos status.
- Atualizar componentes de exibição de status.

### Passo 2: Rebranding de Nomenclatura
- Grep por "Solicitante" e "Solicitantes" e substituir por "Cliente" e "Clientes".
- Grep por "Aguardando Usuário" e substituir por "Aguardando Cliente".

### Passo 3: Script de Seed e Manutenção
- Desenvolver e executar o script de carga de dados.

## Verificação e Testes
- Login com os novos admins.
- Login com um cliente aleatório (ex: `cliente1@nexuservicedesk.com` / `cliente1`).
- Validar se os 70 chamados aparecem no Dashboard e no Kanban.
- Testar a transição de um chamado entre os novos status.
