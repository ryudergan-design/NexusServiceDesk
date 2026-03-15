# Mudancas Visuais

Esta pasta guarda o historico visual do projeto em formato de evidencia.

## Regra do projeto
- Toda mudanca visual deve ter imagens de `antes` e `depois`.
- O registro deve ser separado por dispositivo.
- Cada ajuste deve ganhar uma pasta propria, preferencialmente com a data da aplicacao.
- Somente as telas realmente alteradas devem entrar no pacote visual daquele ajuste.
- O objetivo e funcionar como um `commit visual`: mostrar apenas o que mudou.

## Estrutura padrao
- `mobile/<data-do-ajuste>/<Tela-Antes>.png`
- `mobile/<data-do-ajuste>/<Tela-Depois>.png`
- `computador/<data-do-ajuste>/<Tela-Antes>.png`
- `computador/<data-do-ajuste>/<Tela-Depois>.png`

## Baseline atual
- A pasta `2026-03-15-baseline` representa o estado atual das telas principais.
- Cada tela possui `atual.png` como referencia base.

## Comparativo mais recente
- A pasta `2026-03-15-mobile-app` registra a rodada de refinamento mobile mais ampla.
- Sempre que existir essa pasta, use `before.png` e `after.png` para comparar a evolucao visual.

## Fluxo obrigatorio a partir de agora
- Mudanca visual deve ser ligada a uma fase existente.
- Se a mudanca nao couber em nenhuma fase, uma nova fase deve ser criada.
- Toda mudanca visual deve gerar seu pacote de imagens.
- Depois da validacao, a entrega deve seguir com `commit` e `push`.

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
- Quando um ajuste mexer apenas em uma tela, registre apenas essa tela.
- Quando um ajuste impactar shell ou navegacao global, registre pelo menos dashboard, chamados e a tela mais diretamente afetada.
