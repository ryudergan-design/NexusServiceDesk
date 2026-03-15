# Requisitos: I9 Chamados

## Escopo Atual Consolidado
Este documento reflete o que o projeto considera como base funcional atual apos a reorganizacao em `10 fases`.

## Requisitos Funcionais

### RF01 - Acesso e Perfis
- O sistema deve suportar perfis de `Cliente`, `Atendente` e `Administrador`.
- O login deve funcionar com `Auth.js` e credenciais locais.
- O sistema deve controlar permissao por papel e contexto de tela.

### RF02 - Abertura e Gestao de Chamados
- O sistema deve permitir abrir chamados com `titulo`, `descricao`, `tipo` e `categoria`.
- O sistema deve permitir listar, filtrar, visualizar e atualizar chamados.
- O sistema deve manter historico de comentarios, anexos e transicoes.
- O sistema deve suportar atribuicao entre atendentes e atribuicao para IA.

### RF03 - Fluxo Operacional
- O sistema deve suportar workflow com estados operacionais do atendimento.
- O sistema deve permitir triagem, desenvolvimento, testes, aprovacao e encerramento.
- O sistema deve aceitar os estados `COMPLETED` e `RESOLVED` como encerramento valido no ecossistema atual.

### RF04 - Visualizacao Dual
- O sistema deve oferecer `Modo Kanban` e `Modo Desk`.
- A preferencia de visualizacao deve ser persistida.
- A fila de `Sem atendente` deve funcionar nos dois modos.
- No Kanban geral da equipe, devem aparecer apenas chamados novos sem atendente e tickets do proprio atendente, salvo filtro explicito.

### RF05 - Dashboards e Visao de Atendimento
- O sistema deve exibir visoes diferentes para cliente e equipe.
- O sistema deve apresentar indicadores de SLA, carga de tickets e fluxo operacional.
- O sistema deve permitir acompanhar filas de outros atendentes e de IAs por navegacao explicita.
- O dashboard principal autenticado deve refletir o padrao visual high-tech atual do produto.
- O dashboard principal autenticado deve oferecer uma area dedicada para leitura operacional da IA.
- A home deve exibir uma composicao visual high-tech coerente com o workflow real do produto, sem depender de um painel lateral fixo.
- A home deve evitar repeticao excessiva de mensagem e manter boa legibilidade tipografica, inclusive em textos com acentuacao.

### RF06 - IA no Atendimento
- O sistema deve permitir cadastrar usuarios marcados como IA.
- O sistema deve permitir atribuir chamados a robos configurados.
- A IA deve responder no chamado, registrar log e poder escalar para um `Atendente`.
- A IA nao deve devolver o chamado para fila sem responsavel quando decidir escalar.
- Em escalonamento, deve existir mensagem publica para o cliente e nota interna para a equipe.
- A IA deve pensar no workflow operacional completo do chamado, incluindo triagem, desenvolvimento, testes, aprovacao de orcamento, retorno ao cliente e encerramento.
- Quando a IA depender de resposta, confirmacao ou evidencia do cliente, o chamado deve ir para `PENDING_USER`.
- Quando o cliente responder um chamado em `PENDING_USER`, o fluxo deve permitir retorno operacional para `TRIAGE`.
- A IA pode sugerir `plannedStartDate` e `plannedDueDate` quando houver contexto suficiente.
- Se a IA nao conseguir definir datas validas, o sistema deve manter o fallback automatico atual.

### RF07 - Magic Compose
- O Magic Compose deve refinar respostas no historico do ticket.
- Na abertura de chamado, o Magic Compose deve exigir `titulo`, `tipo de chamado`, `categoria` e `descricao` com pelo menos `20 caracteres`.
- Na abertura, o texto deve ser gerado na voz do cliente.

### RF08 - Banco e Estrutura de Dados
- O banco oficial do projeto deve continuar sendo `SQLite` com `Prisma`.
- O projeto deve manter um espelho estrutural para `Supabase/PostgreSQL`.
- Toda mudanca relevante no schema oficial deve ser revisada contra o espelho.

### RF09 - Documentacao Institucional
- O projeto deve manter uma documentacao institucional oficial do produto.
- A documentacao institucional deve usar capturas reais do sistema.
- A documentacao institucional deve possuir uma versao editavel em HTML e uma versao final em PDF.
- A documentacao institucional deve registrar autoria e refletir o estado consolidado do produto.

## Requisitos Nao Funcionais

### RNF01 - Compatibilidade de Estrutura
- A organizacao da base nao deve quebrar o `Next.js`, `Prisma` ou o fluxo `GSD`.
- Documentacao humana pode ser reorganizada, mas runtime e planejamento vivo devem permanecer compativeis.

### RNF02 - Experiencia
- A interface deve ser responsiva em desktop e mobile.
- O visual deve seguir a linguagem moderna e high-tech consolidada no projeto.
- O uso mobile deve priorizar conforto operacional, leitura forte, navegacao do tipo app e acesso ao conteudo sem bloqueio critico.
- Mudancas visuais relevantes devem gerar evidencias `before/after` em `PROJETO/mudancas-visuais/`.

### RNF03 - Rastreabilidade
- O planejamento em `.planning/` deve refletir a evolucao consolidada do projeto.
- Artefatos fora do fluxo principal devem ser separados para triagem em `DIVERGENTES/`.
