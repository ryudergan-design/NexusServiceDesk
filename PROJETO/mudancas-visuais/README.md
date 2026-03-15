# Mudancas Visuais

Esta pasta guarda o historico visual do projeto em formato de evidencia.

## Regra do projeto
- Toda mudanca visual deve ter imagens de `antes` e `depois`.
- O registro deve ser separado por dispositivo e por tela.
- Cada ajuste deve ganhar uma pasta propria, preferencialmente com a data da aplicacao.

## Estrutura padrao
- `mobile/<tela>/<data-do-ajuste>/before.png`
- `mobile/<tela>/<data-do-ajuste>/after.png`
- `computador/<tela>/<data-do-ajuste>/before.png`
- `computador/<tela>/<data-do-ajuste>/after.png`

## Baseline atual
- A pasta `2026-03-15-baseline` representa o estado atual das telas principais.
- Cada tela possui `atual.png` como referencia base.

## Telas recomendadas
- `home-publica`
- `login`
- `cadastro`
- `dashboard`
- `chamados-central`
- `chamados-detalhe`
- `fila-sem-atendente`
- `gestao-usuarios`
- `novo-chamado`
- `perfil`

## Observacao
- Quando um ajuste mexer apenas em uma tela, basta registrar essa tela.
- Quando um ajuste impactar layout global, registre pelo menos dashboard, chamados e a tela afetada diretamente.
