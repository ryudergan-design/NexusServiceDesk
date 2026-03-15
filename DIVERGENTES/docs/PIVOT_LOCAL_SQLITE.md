# Plano de Pivot: Migração para SQLite Local (Sem Supabase)

## Objetivo
Remover a dependência do Supabase e configurar o Prisma para utilizar SQLite localmente, visando um desenvolvimento ágil e sem necessidade de infraestrutura na nuvem por enquanto.

## Motivação
- Facilidade de setup para novos desenvolvedores.
- Desenvolvimento offline e sem latência de rede.
- Zero custo de infraestrutura inicial.

## Alterações Necessárias

### 1. Documentação e Configuração
- [ ] Atualizar `PROJECT.md` e `config.json` para refletir a mudança na stack.
- [ ] Adicionar decisão histórica no `STATE.md`.

### 2. Prisma Schema (`prisma/schema.prisma`)
- [ ] Alterar `datasource db` provider de `postgresql` para `sqlite`.
- [ ] Remover campo `directUrl` (não utilizado no SQLite).
- [ ] Substituir o `enum UserRole` por `String` com valor padrão `"USER"`.
- [ ] Atualizar todos os campos que usavam o enum para usar `String`.
- [ ] Garantir que tipos incompatíveis (como `Json`) sejam tratados (atualmente não temos no schema).

### 3. Variáveis de Ambiente (`.env`)
- [ ] Atualizar `DATABASE_URL` para `file:./dev.db`.
- [ ] Remover `DIRECT_URL` e chaves específicas do Supabase.

### 4. Código da Aplicação
- [ ] Revisar `src/auth.ts` e `src/app/api/auth/register/route.ts` para garantir que as validações de `role` agora funcionem com strings (ex: `user.role === "ADMIN"`).
- [ ] Atualizar o script de seed (`prisma/seed.ts`) para lidar com a role como string.

### 5. Banco de Dados e Migrações
- [ ] Deletar migrações antigas do PostgreSQL (se houver).
- [ ] Rodar `npx prisma migrate dev --name init_sqlite`.
- [ ] Rodar `npx prisma db seed`.

## Próximos Passos
Após a migração, o sistema estará pronto para a Fase 2 (Core Ticketing) operando totalmente local.
