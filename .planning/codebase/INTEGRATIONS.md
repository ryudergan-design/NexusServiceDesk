# Integrações Externas

**Data da Análise:** 2026-03-12

## APIs e Serviços Externos

**Não Detectados:**
- No momento, a aplicação parece ser autosuficiente e não consome APIs externas de terceiros (como Stripe, AWS, Twilio) de forma explícita no código explorado.

## Armazenamento de Dados

**Bancos de Dados:**
- SQLite (Local):
  - Conexão: `DATABASE_URL` (tipicamente `file:./dev.db`).
  - Cliente: Prisma ORM (`@prisma/client`).
  - Notas de Saúde: O Prisma é instanciado em `src/lib/prisma.ts` como um singleton. A conexão é persistente durante o ciclo de vida do processo Node. No SQLite, a integridade depende do acesso exclusivo ao arquivo `.db`.

**Armazenamento de Arquivos:**
- Apenas sistema de arquivos local ou embutido (ex: `dev.db`). Não foram encontradas integrações com S3 ou serviços similares para uploads.

**Caching:**
- Nenhum serviço de cache externo (Redis, Memcached) detectado. O Next.js utiliza o cache nativo de rotas e dados.

## Autenticação e Identidade

**Provedor de Autenticação:**
- NextAuth.js (Auth.js v5) com provedor de **Credentials** (Email/Senha).
- Implementação: Estratégia JWT para sessões. Os usuários são armazenados no banco de dados SQLite local através do `PrismaAdapter`.

## Monitoramento e Observabilidade

**Rastreamento de Erros:**
- Nenhum serviço externo (Sentry, LogRocket) configurado.

**Logs:**
- Atualmente, os logs são via console (`console.log`, `console.error`).
- **Proposta de Melhoria:** Implementar uma tabela `Log` no Prisma para registros persistentes de eventos críticos (Auditoria, Erros de SLA, Acessos).

## CI/CD e Implantação

**Hospedagem:**
- Local ou VPS (presumido devido ao uso de SQLite).

## Configuração de Ambiente

**Vars de ambiente obrigatórias:**
- `DATABASE_URL`: Caminho para o banco de dados SQLite.
- `AUTH_SECRET`: Segredo usado para assinar tokens JWT do NextAuth.

**Localização de segredos:**
- Armazenados no arquivo `.env` (não versionado).

## Webhooks e Callbacks

**Entrada:**
- `/api/auth/[...nextauth]`: Callbacks de autenticação.

**Saída:**
- Nenhum webhook de saída detectado.

---

**Saúde da Conexão Prisma:**
A conexão é considerada saudável se o arquivo de banco de dados estiver acessível e o cliente Prisma estiver gerado corretamente. O uso do caminho customizado `../src/generated/client` em `schema.prisma` exige que o comando `npx prisma generate` tenha sido executado com sucesso.

**Plano para Tabela de Logs Globais:**
1. Adicionar o modelo `SystemLog` em `prisma/schema.prisma`:
   ```prisma
   model SystemLog {
     id        String   @id @default(cuid())
     level     String   // INFO, WARN, ERROR
     category  String   // AUTH, TICKETS, SYSTEM
     message   String
     metadata  String?
     userId    String?
     user      User?    @relation(fields: [userId], references: [id])
     createdAt DateTime @default(now())
   }
   ```
2. Executar `npx prisma migrate dev --name add_system_logs`.
3. Criar utilitário em `src/lib/logger.ts` para facilitar a escrita desses logs.

---

*Auditoria de integração: 2026-03-12*
