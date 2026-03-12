# Plano de Fase 1.1: Refinamento e Segurança (Gaps)

**gap_closure: true**

## Objetivo
Finalizar a infraestrutura de autenticação e banco de dados para permitir o funcionamento real do sistema.

## Lacunas a Fechar
1.  **Autenticação Real:** Substituir o mock por um `CredentialsProvider` funcional com `bcryptjs`.
2.  **Migração de Dados:** Preparar o ambiente para o primeiro `prisma migrate dev`.
3.  **UX Mobile:** Ajustar o menu lateral para responsividade total em smartphones.

## Etapas de Implementação

### 1. Segurança e Auth (Back-end)
- [ ] Implementar a função `authorize` no `auth.ts`.
- [ ] Adicionar lógica de comparação de senha com `bcryptjs.compare`.
- [ ] Criar endpoint de API `/api/register` para salvar novos usuários no banco (atualmente mockado no client).

### 2. Infraestrutura de Dados
- [ ] Validar as variáveis de ambiente `.env` (DATABASE_URL e DIRECT_URL).
- [ ] Executar a migração inicial do Prisma para criar as tabelas no Supabase.
- [ ] Criar um script de "Seed" básico para o primeiro Administrador.

### 3. Ajustes de UI/UX (Front-end)
- [ ] Adicionar componente `MobileNav` com Sheet do Shadcn ou Menu Hambúrguer.
- [ ] Corrigir o "flash" de tema claro no carregamento inicial.

## Verificação
- [ ] Login bem-sucedido com usuário real do banco.
- [ ] Bloqueio de usuários não aprovados (campo `approved` no Prisma).
- [ ] Visualização correta do dashboard em dispositivos móveis.
