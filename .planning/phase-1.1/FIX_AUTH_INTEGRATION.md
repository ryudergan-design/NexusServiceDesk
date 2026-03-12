# Plano de Execução: Finalização da Autenticação (Unblock Fase 2)

## Objetivo
Finalizar a integração técnica da autenticação para permitir que o usuário realize login real e acesse as funcionalidades da Fase 2.

## Arquivos Afetados
- `src/app/auth/login/page.tsx`: Integrar função `signIn`.
- `src/auth.ts`: Refinar lógica do `authorize`.
- `src/middleware.ts`: Verificar regras de redirecionamento.

## Passos de Implementação (Via Agents)
1. **Ativar Desenvolvedor Frontend:** Atualizar o formulário de login para lidar com estados de erro do Auth.js e realizar o redirecionamento programático.
2. **Ativar Especialista Backend:** Validar a função `authorize` para garantir que a comparação de hash com `bcryptjs` está retornando o objeto de usuário esperado pelo NextAuth.
3. **Teste de Fumaça:** Realizar um login de teste com as credenciais do administrador (`jefrsonsales@outlook.com`).

## Verificação
- [ ] Login funcional com redirecionamento para `/dashboard`.
- [ ] Cookies de sessão persistidos no navegador.
- [ ] Mensagens de erro visíveis para credenciais inválidas.
