# Plano: Fase 1 - Fundacao, Auth e Base do Produto

## Objetivo
Consolidar o alicerce do produto para permitir acesso real, segregacao de perfis e navegacao inicial segura.

## Escopo
- Login local com `Auth.js`.
- Registro persistido no banco.
- Controle de aprovacao de usuario.
- Shell inicial do sistema.

## Arquivos Envolvidos
- `src/auth.ts`
- `src/app/api/auth/register/route.ts`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/components/header.tsx`

## Tarefas
- [x] Implementar autenticacao e sessao.
- [x] Persistir registro e aprovacao de usuario.
- [x] Garantir controle de acesso basico por papel.

## Verificacao
- [x] Login e registro funcionam com persistencia real.
- [x] Usuario nao aprovado nao entra na operacao.
- [x] Navegacao inicial respeita perfil e sessao.
