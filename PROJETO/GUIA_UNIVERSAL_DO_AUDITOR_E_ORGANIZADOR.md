# Guia Universal do Auditor e Organizador com IA

## Objetivo
Este documento define um processo universal para uma IA:
- auditar um projeto
- organizar a base oficial
- comparar o executado com o planejado
- consolidar a documentacao
- separar divergencias para analise posterior
- registrar evidencias visuais quando houver mudanca de interface
- concluir a entrega com validacao, commit e push quando o fluxo permitir

Ele nao deve ser tratado apenas como um texto de orientacao.
Quando a pessoa responsavel pedir que a IA siga este guia, a expectativa e que a IA execute de fato o processo de auditoria, organizacao, consolidacao documental e registro visual descrito aqui, dentro do que for permitido pelo ambiente e pelo projeto.

Ele foi pensado para servir em:
- projetos iniciais
- projetos em andamento
- projetos finalizados
- projetos web
- aplicativos
- sistemas administrativos
- projetos com ou sem fases formais
- projetos com ou sem GSD

O objetivo central e simples:
colocar ordem na casa sem perder contexto, historico e capacidade de decisao humana posterior.

---

## Resultado esperado
Ao final do processo, a IA deve conseguir entregar:
- uma leitura confiavel do estado real do projeto
- uma estrutura documental coerente com o codigo atual
- fases e tarefas organizadas de forma navegavel
- divergencias separadas em uma area propria
- evidencias visuais das mudancas realmente feitas
- historico tecnico e visual vinculado ao Git
- um registro visual-base do frontend atual, mesmo antes de novos ajustes visuais, para servir como marco inicial de comparacao futura

Em resumo:
o projeto deixa de ser um conjunto de arquivos espalhados e passa a ter rastreabilidade por codigo, documentacao, imagens e historico de versionamento.

---

## Principios

### 1. O executado tem prioridade sobre o prometido
Se houver conflito entre:
- documentacao antiga
- roadmap antigo
- promessas de fase
- README legado
- arquivos `.md` avulsos
- codigo real em uso

a auditoria deve tratar o codigo real como referencia principal do estado atual do projeto.

### 2. A IA nao deve so mexer em codigo
A IA tambem deve:
- entender o projeto
- registrar o que mudou
- reorganizar a documentacao
- isolar o que diverge
- produzir evidencias visuais quando fizer sentido
- fechar a entrega com versionamento

### 3. Divergencia nao deve ser destruida sem analise
Se algo estiver:
- antigo
- paralelo
- incompleto
- redundante
- fora do fluxo principal

isso nao deve ser apagado automaticamente quando ainda existir chance razoavel de reaproveitamento ou consulta futura.

### 4. O processo precisa ser flexivel, mas nao solto
Cada projeto pode organizar fases e tarefas de forma diferente.

Mesmo assim, a IA deve manter pelo menos:
- um nivel de contexto maior, equivalente a fase, milestone ou bloco de trabalho
- um nivel de execucao menor, equivalente a tarefa, item ou entrega rastreavel

Em outras palavras:
o formato pode variar, mas deve existir uma estrutura de fases e tarefas.

---

## Quando usar este guia

### Projeto inicial
Use este guia para:
- definir a organizacao base
- criar a trilha documental principal
- decidir estrategia de banco
- estabelecer um processo de entrega rastreavel desde o inicio

### Projeto em andamento
Use este guia para:
- auditar o que ja existe
- comparar executado vs planejado
- reorganizar fases
- consolidar documentacao
- separar sujeira e divergencias

### Projeto finalizado ou quase finalizado
Use este guia para:
- preparar uma base limpa para manutencao
- deixar um legado compreensivel
- registrar o estado final real
- organizar material historico, tecnico e visual

---

## Etapa 1. Mapear a estrutura atual do projeto
A IA deve comecar identificando:
- onde esta o frontend principal
- onde esta o backend principal
- onde esta o banco principal
- onde esta a documentacao oficial
- onde estao as fases, milestones ou equivalentes
- onde estao scripts, utilitarios e artefatos paralelos
- onde existem arquivos antigos ou fora do fluxo principal
- onde existem arquivos `.md` soltos

Se o projeto tiver interface visual, a IA tambem deve identificar:
- quais sao as telas principais do frontend
- quais sao os fluxos principais por perfil ou persona
- quais telas existem em desktop
- quais telas existem em mobile
- quais areas merecem registro visual inicial, mesmo sem mudanca recente

Exemplos de areas a mapear:
- `src/`
- `app/`
- `components/`
- `api/`
- `server/`
- `prisma/`
- `database/`
- `.planning/`
- `docs/`
- `scripts/`
- `legacy/`
- `tmp/`
- `backup/`
- `divergentes/`

### Atencao para arquivos `.md` soltos
Arquivos `.md` fora da estrutura oficial podem conter:
- contexto antigo
- requisitos parciais
- ideias ja executadas
- planos abandonados
- documentacao tecnica nunca consolidada
- instrucoes de arquitetura

Eles nao devem ser ignorados.

Regra:
- o que ja foi executado deve ser absorvido na documentacao oficial
- o que nao foi executado, ficou parcial ou diverge do estado real deve ir para a area de divergencias

---

## Etapa 2. Identificar a base oficial do projeto
A IA deve responder com clareza:
- qual e a base oficial do frontend?
- qual e a base oficial do backend?
- qual e a base oficial do banco?
- qual e a documentacao principal?
- o que e espelho?
- o que e legado?
- o que e apoio?
- o que e divergente?

Exemplo de conclusao:
- frontend oficial em `src/`
- backend oficial em `src/app/api/`
- banco oficial em `database/` ou `prisma/`
- planejamento oficial em `.planning/`

Sem isso, a reorganizacao vira chute.

---

## Etapa 3. Comparar o executado com o planejado
Se o projeto usa fases, roadmap ou milestones, a IA deve comparar:
- fases planejadas
- fases realmente executadas
- requisitos documentados
- comportamento real do sistema
- conteudo relevante de arquivos `.md` soltos

Perguntas que a IA deve responder:
- quais fases ja foram realmente executadas?
- quais fases estao parcialmente executadas?
- quais fases ficaram desatualizadas?
- quais fases hoje se sobrepoem?
- quais fases deveriam ser fundidas?
- quais fases deveriam ser renomeadas?
- quais partes do projeto foram feitas mas nunca foram documentadas direito?

Se o projeto nao usa fases formais, a comparacao pode ser feita entre:
- requisitos
- changelogs
- README tecnico
- codigo real
- documentos avulsos

---

## Etapa 4. Organizar fases, tarefas e sumario
Este ponto deve ser obrigatoriamente considerado pela IA.

### Regra principal
Uma fase pode ser dividida em mais de uma tarefa.

Essa estrutura deve ser:
- flexivel
- coerente com o projeto
- facil de navegar
- rastreavel

### O que a IA nao deve fazer
- tratar fase como um bloco obrigatoriamente pequeno
- tratar tarefa como algo sempre padronizado em todos os projetos
- assumir que um unico formato serve para qualquer time

### O que a IA deve fazer
Garantir que exista ao menos:
- uma camada maior de organizacao
  Papel: contexto, objetivo, escopo ou milestone.
- uma camada menor de execucao
  Papel: tarefas, etapas, entregas ou checkpoints.

### Exemplos validos

#### Exemplo 1. Projeto com fases e tasks
- `phase-1/CONTEXT.md`
- `phase-1/PLAN.md`
- `phase-1/tasks/TASK-01.md`
- `phase-1/tasks/TASK-02.md`

#### Exemplo 2. Projeto com milestones e itens
- `milestone-1/CONTEXT.md`
- `milestone-1/PLAN.md`
- `milestone-1/items/ITEM-01.md`

#### Exemplo 3. Projeto simples
- `contexto-geral.md`
- `plano-geral.md`
- `tarefas/TAREFA-01.md`

### Sumario organizado
Quando a reorganizacao for relevante, a IA deve produzir algum tipo de sumario do que ficou organizado.

Esse sumario pode ser:
- um `ROADMAP.md` atualizado
- um `SUMMARY.md`
- um bloco de resumo no `STATE.md`
- um documento especifico de reorganizacao

Esse sumario deve explicar, de forma curta:
- como a estrutura ficou
- quais fases foram fundidas, divididas ou renomeadas
- quais tarefas concentram a execucao
- onde consultar o estado atual

---

## Etapa 5. Atualizar a documentacao principal
Sempre que houver auditoria, reorganizacao ou mudanca relevante, a IA deve atualizar os arquivos centrais que fizerem sentido.

Arquivos comuns:
- `PROJECT.md`
  Papel: visao geral do projeto e direcao consolidada.
- `REQUIREMENTS.md`
  Papel: requisitos, regras e compromissos funcionais e nao funcionais.
- `ROADMAP.md`
  Papel: fases, marcos e evolucao planejada ou reorganizada.
- `STATE.md`
  Papel: retrato atual do projeto.
- `CONTEXT.md`
  Papel: escopo e objetivo de uma fase ou bloco.
- `PLAN.md`
  Papel: plano tecnico de implementacao ou reorganizacao.
- `TASK-xx.md`
  Papel: execucao rastreavel da fase.
- `SUMMARY.md`
  Papel: resumo do que foi consolidado, quando o projeto usar esse artefato.

Regra pratica:
- se alterou comportamento, atualizar requisitos e estado
- se alterou estrutura do projeto, atualizar roadmap e projeto
- se alterou uma fase especifica, atualizar contexto, plano e tarefas da fase

---

## Etapa 6. Separar divergencias e sujeiras
Tudo o que estiver fora do fluxo principal deve ser avaliado.

A IA deve decidir se cada item:
- pertence a base oficial
- deve ser absorvido como apoio
- deve ser tratado como divergente

### O que normalmente vira divergencia
- documentacao antiga que nao reflete mais o projeto
- fases obsoletas
- arquivos `.md` soltos com planos nao executados
- documentos parcialmente executados e nao consolidados
- scripts paralelos sem uso claro
- prototipos antigos
- espelhos de banco nao documentados
- estruturas antigas de frontend ou backend
- arquivos temporarios com valor incerto

### Regra
Quando houver duvida razoavel entre apagar e manter:
- mover para a area de divergencias
- documentar o motivo
- nao destruir de imediato

### Area recomendada
Nome sugerido:
- `DIVERGENTES/`

Outros nomes validos:
- `PENDENTE_DE_ANALISE/`
- `ARTEFATOS_PARA_TRIAGEM/`
- `LEGADO_EM_REVISAO/`

---

## Etapa 7. Produzir relatorio de divergencias
Nao basta mover coisas para uma pasta.

A IA deve gerar um relatorio que explique:
- o que foi separado
- de onde veio
- por que foi considerado divergente
- qual parece ser o risco de manter no fluxo principal
- qual acao parece mais adequada depois

Estrutura recomendada:
- item
- localizacao
- motivo da divergencia
- risco
- recomendacao inicial

Exemplos de recomendacao:
- absorver na base oficial
- revisar depois
- manter isolado
- remover apos validacao

---

## Etapa 8. Tratar a estrategia de banco de dados
Este guia tambem deve orientar a IA sobre organizacao e estrategia de banco.

### Se o projeto ainda vai decidir o banco
A IA deve sugerir caminhos claros:

#### Opcao 1. SQLite como oficial com espelho para Supabase
O que faz:
- usa SQLite como base oficial
- mantem uma estrutura espelho para Supabase/PostgreSQL
Quando usar:
- projetos locais
- desenvolvimento rapido
- operacao simples ou embarcada
- preparacao para migracao futura
Valor recomendado:
- boa opcao para projetos pequenos e medios

#### Opcao 2. Supabase como oficial com espelho para SQLite
O que faz:
- usa Supabase/PostgreSQL como base oficial
- mantem um espelho estrutural para SQLite
Quando usar:
- projetos com backend remoto
- multiusuario
- necessidade maior de banco gerenciado
- desejo de manter rota de retorno simplificada
Valor recomendado:
- boa opcao para operacao remota e colaborativa

#### Opcao 3. Outra base escolhida pelo usuario
A IA deve perguntar:
- qual banco o projeto deseja usar como oficial?
- deseja manter um espelho estrutural?
- se sim, qual banco sera o espelho?

Exemplos:
- PostgreSQL sem Supabase
- MySQL
- MariaDB
- SQL Server
- MongoDB

### Se o projeto ja tem base existente
A IA deve:
- identificar qual e a base oficial de hoje
- identificar se existe espelho
- identificar se o espelho esta coerente
- perguntar se a pessoa deseja manter ou criar um espelho preventivo

### Regra de espelho
Se existir banco espelho, a IA deve deixar claro:
- qual e o banco oficial
- qual e o banco espelho
- que o espelho nao deve ser tratado como runtime principal, a menos que isso seja pedido
- que divergencias entre providers precisam ser documentadas

### Integracao com os prompts de migracao
Se o projeto precisar de migracao entre `SQLite` e `Supabase`, a IA pode usar ou adaptar:
- `PROMPT_MIGRACAO_SUPABASE_PARA_SQLITE.md`
- `PROMPT_MIGRACAO_SQLITE_PARA_SUPABASE.md`

Esses prompts servem como apoio operacional, mas a decisao arquitetural deve ser registrada na documentacao principal do projeto.

---

## Etapa 9. Registrar evidencias visuais quando houver mudanca de interface
Mudanca visual relevante deve gerar evidencias.

Exemplos:
- nova tela
- ajuste de layout
- melhoria mobile
- mudanca de navegacao
- dashboard revisado
- refino de responsividade
- fluxo de formulario alterado

### Registro visual-base obrigatorio quando este guia for adotado
Se este guia estiver sendo aplicado em um projeto que possui frontend, a IA deve gerar tambem um registro visual-base do estado atual da interface, mesmo que naquele momento ela ainda nao tenha feito uma mudanca visual.

Esse registro inicial serve para:
- criar uma linha de comparacao futura
- facilitar auditorias posteriores
- mostrar como o frontend estava no momento em que a organizacao foi feita
- permitir que futuros ajustes tenham um `Antes` real, mesmo em projetos que nunca documentaram imagens antes

Esse registro visual-base deve cobrir, sempre que fizer sentido:
- tela inicial
- login
- cadastro
- dashboard
- area principal de operacao
- telas administrativas importantes
- principais fluxos mobile
- principais fluxos desktop

Se o projeto for diferente, a IA deve adaptar essa lista para as telas mais importantes do contexto real.

### Regra mais util
O identificador da pasta de imagens deve ser o mesmo do commit, sempre que possivel.

Exemplo:
- `mobile/2e6d068/`
- `desktop/2e6d068/`

Dentro da pasta, usar nomes claros:
- `Dashboard-Antes.png`
- `Dashboard-Depois.png`
- `Tela-de-Login-Antes.png`
- `Tela-de-Login-Depois.png`
- `Detalhe-do-Chamado-Antes.png`
- `Detalhe-do-Chamado-Depois.png`

### Estrutura sugerida
Separar por dispositivo ou contexto visual:
- `mobile/`
- `desktop/`
- `tablet/` quando fizer sentido

Depois:
- uma pasta por mudanca
- somente imagens das telas realmente alteradas

Em outras palavras:
o pacote visual deve funcionar como um commit visual.

### Quando usar "Antes" e "Depois"
- se houve mudanca visual: registrar `Antes` e `Depois`
- se a IA esta apenas organizando o projeto e ainda nao mudou a interface: registrar ao menos o estado atual como baseline visual

Exemplos de nomes validos para baseline:
- `Dashboard-Atual.png`
- `Login-Atual.png`
- `Central-de-Chamados-Atual.png`

Se depois houver uma mudanca real nessa mesma tela, a estrutura pode evoluir para:
- `Dashboard-Antes.png`
- `Dashboard-Depois.png`

### Se o commit ainda nao existir
Usar um identificador temporario:
- `pendente-ajuste-dashboard`
- `2026-03-15-melhoria-mobile`

Depois do commit:
- renomear a pasta para o hash curto
- ou registrar em um README qual commit corresponde aquela pasta

---

## Etapa 10. Validar tecnicamente
Antes de encerrar, a IA deve validar o que foi feito.

Exemplos:
- typecheck
- lint
- testes automatizados
- build parcial
- validacao de schema
- validacao de banco
- captura de telas

Regra:
a entrega ideal nao termina em "arquivo alterado".
Ela termina em "arquivo alterado, documentado e validado".

---

## Etapa 11. Criar commit
Depois da validacao, a IA deve gerar um commit claro.

### Boas praticas
- mensagem curta e objetiva
- refletir o resultado principal
- evitar mensagens vagas

Exemplos:
- `docs: consolidate project audit and organization guide`
- `fix: improve mobile ticket detail overflow`
- `feat: reorganize phases and isolate divergences`

### Regra importante
Nao incluir lixo local no commit, a menos que seja parte real da entrega.

Exemplos de arquivos normalmente excluidos:
- cache de build
- rastros de servidor local
- arquivos temporarios
- rascunhos de teste local

---

## Etapa 12. Fazer push
Quando o fluxo do projeto permitir, a IA deve concluir com `push`.

Motivo:
- evita trabalho local esquecido
- protege o historico no remoto
- facilita rollback
- conecta codigo, documentacao e evidencias visuais

---

## Como voltar uma mudanca depois
Se o processo foi bem seguido, a pessoa responsavel consegue:

### Pelo Git
- abrir o historico
- localizar o commit
- comparar com o anterior
- restaurar ou reverter

### Pelas evidencias visuais
- abrir a pasta do commit
- comparar `Antes` e `Depois`
- localizar visualmente a mudanca

### Pela documentacao
- entender o motivo da alteracao
- ver em qual fase ou tarefa aquilo entrou
- decidir se o rollback deve ser total ou parcial

---

## Estrutura minima recomendada

### Para projetos com fases
- fase ou equivalente
- tarefas ou equivalente
- atualizacao dos arquivos centrais
- relatorio de divergencias quando houver auditoria
- evidencias visuais quando aplicavel
- commit
- push

### Para projetos sem fases formais
- documento de contexto ou changelog tecnico
- alguma estrutura de tarefas rastreaveis
- atualizacao dos arquivos centrais
- relatorio de divergencias quando aplicavel
- evidencias visuais quando aplicavel
- commit
- push

---

## Checklist universal do auditor e organizador
- [ ] A estrutura atual do projeto foi mapeada
- [ ] A base oficial de frontend, backend, banco e documentacao foi identificada
- [ ] O executado foi comparado com o planejado
- [ ] Arquivos `.md` soltos foram analisados
- [ ] O que ja foi executado foi absorvido na documentacao oficial
- [ ] O que nao foi executado ou diverge foi separado na area de divergencias
- [ ] A estrutura de fases e tarefas foi organizada ou reorganizada
- [ ] Um sumario da estrutura organizada foi produzido quando necessario
- [ ] Os arquivos centrais do projeto foram atualizados
- [ ] A estrategia de banco foi documentada
- [ ] As evidencias visuais foram geradas quando houve mudanca de interface
- [ ] A validacao tecnica foi executada
- [ ] O commit foi criado
- [ ] O push foi realizado quando o fluxo permitiu

---

## Regra operacional sugerida para IA
Se uma IA for instruida a auditar, organizar e entregar um projeto, ela deve assumir por padrao que:

1. precisa entender a base oficial antes de reorganizar qualquer coisa
2. o codigo real tem prioridade sobre planos antigos
3. uma fase pode ter varias tarefas
4. a estrutura exata de fases e tarefas pode variar, mas deve existir
5. arquivos `.md` soltos precisam ser analisados, nao ignorados
6. o que foi executado deve ser consolidado
7. o que diverge deve ser separado
8. mudancas visuais precisam de evidencias antes e depois
9. a pasta visual idealmente deve usar o mesmo identificador do commit
10. a estrategia de banco deve ser explicitada, inclusive quando houver espelho
11. a entrega ideal termina em validacao, commit e push quando isso for permitido
12. se o projeto tiver frontend, deve existir um registro visual-base das telas principais mesmo antes de novos ajustes
13. este guia nao deve apenas orientar: ele deve ser executado pela IA quando adotado como regra de trabalho

---

## Resultado final ideal
Se esse processo for seguido corretamente, o projeto passa a ter:
- estrutura mais limpa
- documentacao confiavel
- fases coerentes
- tarefas rastreaveis
- divergencias isoladas
- banco documentado de forma clara
- historico visual reutilizavel
- maior facilidade de manutencao

Em resumo:
uma boa auditoria e organizacao com IA nao so arruma arquivos.
Ela transforma o projeto em algo compreensivel, rastreavel e pronto para continuar evoluindo com seguranca.
