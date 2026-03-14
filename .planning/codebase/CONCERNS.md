# Preocupacoes e Riscos da Base

**Data da analise:** 2026-03-14

## Visao geral

O projeto esta funcional e bem adiantado, mas apresenta riscos tipicos de uma base que cresceu rapido: acoplamento pragmatico, tipagem frouxa, logs de depuracao em producao e cobertura automatizada parcial.

## 1. Tipagem frouxa em auth, sessao e UI

**Onde aparece:**

- `src/auth.ts`
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/tickets/page.tsx`
- `src/lib/actions/ai.ts`

**Risco:**

- `as any` e `@ts-ignore` escondem inconsistencias reais entre sessao, token e dados de usuario.
- Mudancas pequenas no formato da sessao podem quebrar tela ou backend sem alerta forte do compilador.

**Direcao recomendada:**

- formalizar tipos de sessao e usuario estendido
- reduzir casts manuais na leitura de `session.user`

## 2. Regra de negocio espalhada entre UI, routes e actions

**Onde aparece:**

- `src/app/dashboard/tickets/page.tsx`
- `src/app/api/tickets/route.ts`
- `src/app/api/tickets/[id]/route.ts`
- `src/lib/actions/ai.ts`

**Risco:**

- filtros, regras de status e decisoes por papel podem divergir ao longo do tempo
- manutencao fica mais cara porque a logica nao esta totalmente centralizada

**Direcao recomendada:**

- mover regras repetidas para modulos de dominio em `src/lib/`
- deixar componentes cliente mais focados em exibicao

## 3. Logging excessivo e pouco estruturado

**Onde aparece:**

- `src/lib/prisma.ts`
- `src/lib/actions/ai.ts`
- varios handlers com `console.error`

**Risco:**

- ruido alto em ambiente real
- possibilidade de expor dados operacionais sensiveis
- dificuldade de observabilidade consistente

**Direcao recomendada:**

- separar logger de desenvolvimento e producao
- revisar logs de query do Prisma fora do ambiente local

## 4. Exposicao sensivel por chaves de IA por agente

**Onde aparece:**

- `User.aiApiKey` em `prisma/schema.prisma`
- montagem dinamica de provider em `src/lib/actions/ai.ts`

**Risco:**

- credenciais ficam acopladas a registros do banco
- controles administrativos e auditoria precisam ser fortes

**Direcao recomendada:**

- restringir leitura e escrita dessas chaves
- revisar estrategia de criptografia, auditoria e rotacao

## 5. Cobertura de testes insuficiente nas bordas criticas

**Onde aparece:**

- ausencia de testes para `src/app/api/**/route.ts`
- ausencia de testes para `src/lib/actions/*.ts`
- ausencia de testes de componentes do dashboard

**Risco:**

- regressao silenciosa em auth, tickets e IA
- mudancas em Prisma ou contratos de resposta podem quebrar o frontend sem protecao

**Direcao recomendada:**

- priorizar testes de API, actions e componentes principais
- adicionar coverage e scripts de teste no `package.json`

## 6. Inconsistencias de validacao e mensagens

**Onde aparece:**

- `src/app/api/tickets/route.ts`
- `src/app/api/tickets/[id]/route.ts`
- varias rotas com textos diferentes para erros semelhantes

**Risco:**

- comportamento de borda pouco uniforme
- experiencia inconsistente para frontend e usuario

**Direcao recomendada:**

- padronizar validacao de entrada
- padronizar mensagens e payloads de erro

## 7. Acoplamento operacional em scripts e dados locais

**Onde aparece:**

- `scripts/`
- `prisma/*.ts`
- `dev.db` e `prisma/dev.db`

**Risco:**

- muitos caminhos de manutencao
- ambiente local pode se afastar do comportamento esperado em outros ambientes

**Direcao recomendada:**

- consolidar scripts mais importantes
- documentar o caminho oficial de seed, reset e diagnostico

## 8. Fetch direto sem camada comum em telas chave

**Onde aparece:**

- `src/app/dashboard/tickets/page.tsx`

**Risco:**

- tratamento de erro, loading e cache tende a ficar repetido
- mudancas no contrato da API exigem ajuste manual em varios pontos

**Direcao recomendada:**

- criar hooks ou clientes internos para rotas mais usadas
- centralizar parse de resposta e erros

## Resumo operacional

- O maior risco atual nao e falta de funcionalidade, e sim manutencao de medio prazo.
- Os temas mais urgentes sao: tipagem, padronizacao de regras, seguranca operacional de IA e ampliacao da malha de testes.
