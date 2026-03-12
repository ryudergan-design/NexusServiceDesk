---
status: investigating
trigger: "Investigar erro 404 na rota /dashboard após o login no Next.js 15."
created: 2026-03-12T04:00:00Z
updated: 2026-03-12T04:00:00Z
---

## Foco Atual

hipótese: a rota /dashboard existe fisicamente, mas o Next.js ou o Middleware não está conseguindo resolvê-la ou está causando um redirecionamento mal sucedido para um local que resulta em 404.
teste: verificar a estrutura física dos arquivos, o matcher do middleware e o redirecionamento pós-login.
esperando: descobrir que há um erro de digitação, um conflito no matcher do middleware ou um erro de configuração de redirecionamento no NextAuth.
próxima_ação: listar arquivos em `src/app` e ler `src/middleware.ts` e `src/app/dashboard/page.tsx`.

## Sintomas

esperado: login bem-sucedido seguido de redirecionamento para `/dashboard` que exibe a página.
real: login bem-sucedido seguido de redirecionamento para `/dashboard` resultando em 404.
erros: 404 em `/dashboard`.
reprodução: realizar login e aguardar redirecionamento automático.
começou: não especificado (presumivelmente novo problema após configuração do dashboard ou middleware).

## Eliminados

## Evidência

## Resolução

causa_raiz: 
correção: 
verificação: 
arquivos_alterados: []
