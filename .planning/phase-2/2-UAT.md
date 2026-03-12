# Teste de Aceitação do Usuário (UAT): Fase 2 (Ciclo de Vida do Chamado)

## Estado da Sessão: Ativa
**Início:** 12/03/2026

---

## Log de Testes

### Teste 1: Abertura de Novo Chamado com Anexo
- **Objetivo:** Validar o fluxo de criação e persistência de anexos locais.
- **Status:** ✅ APROVADO
- **Resultado:** O usuário conseguiu criar o chamado e confirmar a visualização do anexo na página de detalhes.

### Teste 2: Kanban e Timeline de Transição
- **Objetivo:** Validar a organização visual e o registro de auditoria (Audit Trail).
- **Status:** ✅ APROVADO
- **Resultado:** O usuário confirmou que o chamado aparece no Kanban e as mudanças de status são registradas na Timeline após as correções de compatibilidade com Next.js 15.

### Teste 3: Cálculo de SLA (Prazos)
- **Objetivo:** Validar a inteligência de cálculo de prazos em horário comercial.
- **Status:** ✅ APROVADO
- **Resultado:** O usuário confirmou a visualização dos prazos calculados na página de detalhes.

### Teste 4: Workflow de Registro de Atividades (Softdesk)
- **Objetivo:** Validar o diário de bordo com notas internas e apontamento de esforço.
- **Status:** ✅ APROVADO
- **Resultado:** O usuário confirmou o funcionamento das notas internas e do registro de minutos gastos.

### Teste 5: Editor de Texto Rico (Softdesk Style)
- **Objetivo:** Validar a experiência de escrita Enterprise com formatação e imagens inline.
- **Status:** ⏳ EM EXECUÇÃO
- **Resultado:** 

---

## Matriz de Aprovação de Funcionalidades

| ID | Funcionalidade | Status | Observações |
| :--- | :--- | :--- | :--- |
| 1 | Abertura de Chamado (API/UI) | [✅] | Funcional com validação Zod |
| 2 | Upload de Anexos (Local) | [✅] | Salvando em public/uploads |
| 3 | Visualização Kanban (Board) | [✅] | Dinâmico por status |
| 4 | Timeline de Transições (Audit) | [✅] | Persistindo no banco e UI |
| 5 | Cálculo de SLA (Business Hours) | [✅] | Prazos automáticos visíveis |
| 6 | Registro de Notas Internas (Softdesk) | [✅] | Com seletor de privacidade |
| 7 | Apontamento de Esforço (Time Tracking) | [✅] | Soma acumulada de minutos |
| 8 | Editor de Texto Rico (WYSIWYG) | [ ] | Com suporte a Código e Imagem |

---

## Diagnóstico e Correções (se aplicável)
- **Problema:** A Fase 1 entregou a UI de Login/Register mas não integrou a função `signIn` do Auth.js v5. Além disso, o middleware protege o dashboard, impedindo testes manuais.
- **Causa Raiz:** A lógica de autenticação real ficou como uma "lacuna" na Fase 1 e 1.1.
- **Plano de Correção:** Ativar a Fase 1.1 para finalizar a integração do `CredentialsProvider`, habilitar o `signIn` no formulário de login e garantir que o redirecionamento pós-login funcione.
