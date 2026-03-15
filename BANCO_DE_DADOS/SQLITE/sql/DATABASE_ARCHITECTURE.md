# Arquitetura de Dados - I9 Chamados (SQLite)

Esta pasta contém a documentação da estrutura de dados do sistema, focada na persistência total de registros, logs e ações administrativas.

## Tabelas e Propósitos

### 1. Núcleo de Usuários e Autenticação
- **User:** Cadastro de colaboradores e administradores.
- **Account / Session:** Gestão de tokens e sessões do Auth.js.
- **VerificationToken:** Tokens para validação de e-mail e recuperação de senha.

### 2. Gestão de Chamados (Ticketing Core)
- **Ticket:** O registro central de cada solicitação. Armazena título, descrição, prioridade e prazos de SLA.
- **Category / Subcategory:** Estrutura hierárquica para classificação de chamados.
- **TicketComment:** Registro de toda a comunicação entre solicitante e técnico.
- **TicketTransition:** **AuditLog especializado** que registra cada mudança de status (De -> Para).
- **Attachment:** Registro de arquivos e imagens vinculados a chamados. **Armazena apenas o link da imagem (URL/Caminho).**

### 3. Regras de Negócio e SLA
- **SLARule:** Tabela de configuração de prazos baseada em prioridade (Crítico, Alto, Médio, Baixo).

### 4. Auditoria e Logs Globais (Novas)
- **AuditLog:** Registra toda criação, edição ou deleção de registros administrativos (Categorias, Regras de SLA, Usuários).
- **AccessLog:** Registra o histórico de logins, deslogues e tentativas falhas de acesso, incluindo IP e User-Agent.

## Diretrizes de Persistência
1. **Transacionalidade:** Todas as ações que alteram o estado de um chamado (ex: fechar um ticket) devem obrigatoriamente gerar um registro em `TicketTransition`.
2. **Nenhum dado perdido:** Ações administrativas devem ser espelhadas na tabela `AuditLog`.
3. **Imagens:** O upload físico de imagens deve ser seguido pela gravação imediata do link na tabela `Attachment`.
4. **Logs de Erro:** Futuramente, implementar a persistência de exceções críticas na tabela `SystemLog`.
