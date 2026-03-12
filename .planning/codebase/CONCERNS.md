# Preocupações e Lacunas - I9 Chamados

Esta análise identifica pontos de falha na persistência, segurança e auditoria que devem ser corrigidos para garantir a integridade total do sistema.

## 1. Auditoria de Configurações Administrativas
**Problema:** Atualmente, apenas as mudanças de status de tickets são registradas (`TicketTransition`). Alterações em regras de SLA, criação de categorias ou modificações em perfis de usuários não deixam rastros.
**Risco:** Impossibilidade de rastrear quem alterou uma regra de negócio crítica.
**Proposta:** Implementar tabela `AuditLog`.

## 2. Logs de Acesso e Segurança
**Problema:** O processo de login e o `middleware.ts` não persistem tentativas de acesso no banco de dados.
**Risco:** Dificuldade em detectar ataques de força bruta ou acessos não autorizados para fins de conformidade (LGPD).
**Proposta:** Implementar tabela `AccessLog`.

## 3. Gestão de Imagens e Arquivos
**Problema:** Embora o link seja salvo no banco, a relação com o sistema de arquivos local (`public/uploads`) precisa de rotinas de limpeza para evitar arquivos órfãos caso o registro no banco falhe.
**Proposta:** Sincronização rigorosa entre o banco e o storage via transações.

## 4. Ausência de Testes Automatizados
**Problema:** Não foram encontrados testes para validar a integridade dos dados ou as regras de RBAC (Role-Based Access Control).
**Risco:** Regressões em lógica de permissão durante atualizações do esquema SQL.

## Proposta Imediata de Novos Modelos SQL
Para sanar estas lacunas, o `schema.prisma` deve ser expandido com modelos de `AuditLog` (ações administrativas) e `AccessLog` (segurança de login).
