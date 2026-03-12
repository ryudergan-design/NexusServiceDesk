# Contexto da Fase 1.1: Refinamento e Segurança

## Decisões de Produto e UX

### 1. Feedback e Tratamento de Erros de Auth
- **Mensagens de Erro:** Detalhadas (ex: "E-mail não existe") para facilitar a orientação do usuário.
- **Exibição:** Uso de Toasts (notificações flutuantes) para manter a interface limpa.
- **Segurança:** Bloqueio temporário de 1 minuto após 10 tentativas falhas de login.
- **Indisponibilidade:** Exibição de um Banner de Manutenção no topo em caso de falha de conexão com o banco/servidor.

### 2. Refinamento da UI Mobile
- **Navegação:** Menu lateral estilo Drawer (slide-out) para consistência com o desktop.
- **Dashboard:** Grade 2x2 para métricas principais com Carrossel Horizontal para secundárias.
- **Busca:** Campo de pesquisa oculto sob um ícone no header para economizar espaço.
- **Estética:** Manutenção do efeito Glassmorphism (vidro) para preservar a identidade premium.

### 3. Estratégia de Seed e Admin Inicial
- **Admin Principal:** `jefrsonsales@outlook.com` com senha fixa `I9Admin123`.
- **Status:** Ativação automática (`approved: true`) e papel de `ADMIN`.
- **Perfil:** Dados de perfil (Departamento, Cargo, Telefone) já preenchidos via seed para agilidade.

### 4. Fluxo Pós-Registro (Aguardando Aprovação)
- **Gestão:** Administrador gerencia novos cadastros exclusivamente pelo Dashboard (sem e-mails de alerta).
- **Confirmação:** Usuário recebe um e-mail informativo automático confirmando o status pendente.
- **Login Pendente:** Exibe mensagem de "Conta Pendente" com opção de "Reenviar Pedido".
- **Autonomia:** Usuário pode realizar o auto-cancelamento da solicitação de cadastro.

## Contexto Técnico de Código
- **Auth:** Implementação real do `CredentialsProvider` com `bcryptjs` para verificação de hash.
- **Banco:** Execução de migrações Prisma no Supabase e script de seed (`prisma/seed.ts`).
- **Mobile:** Uso de `Sheet` (Shadcn/UI) para o Drawer e Framer Motion para o carrossel.
- **API:** Criação da rota `/api/auth/register` para persistência real de novos usuários.

## Próximos Passos
- Implementar lógica de hash de senha no registro e comparação no login.
- Configurar variáveis de ambiente e rodar migrações.
- Ajustar componentes mobile para os novos padrões de grade e drawer.
