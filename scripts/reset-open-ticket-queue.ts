import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type OpenStatus =
  | 'NEW'
  | 'TRIAGE'
  | 'DEVELOPMENT'
  | 'TEST'
  | 'AWAITING_APPROVAL'
  | 'PENDING_USER'

type TicketType =
  | 'INCIDENT'
  | 'REQUEST'
  | 'BUG'
  | 'SUGGESTION'
  | 'QUESTION'
  | 'ACCESS'
  | 'PROJECT'
  | 'FINANCIAL'
  | 'MAINTENANCE'

type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
type Impact = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
type Urgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

interface ScenarioTemplate {
  title: string
  description: string
  categoryName: string
  subcategoryHint?: string
  type: TicketType
  impact: Impact
  urgency: Urgency
  priority: Priority
  requesterFollowUp: string
  triageReply: string
  internalNote: string
  pendingQuestion: string
  testingReply: string
  budgetPublic: string
  budgetInternal: string
}

const statusPlan: OpenStatus[] = [
  ...Array.from({ length: 18 }, () => 'NEW' as const),
  ...Array.from({ length: 20 }, () => 'TRIAGE' as const),
  ...Array.from({ length: 24 }, () => 'DEVELOPMENT' as const),
  ...Array.from({ length: 16 }, () => 'TEST' as const),
  ...Array.from({ length: 10 }, () => 'AWAITING_APPROVAL' as const),
  ...Array.from({ length: 12 }, () => 'PENDING_USER' as const),
]

const scenarioTemplates: ScenarioTemplate[] = [
  {
    title: 'Webhook de pagamento nao dispara apos confirmacao no gateway',
    description:
      'Desde a ultima atualizacao, os pedidos aprovados no gateway nao estao gerando o webhook de confirmacao no Nexus. Isso esta travando a liberacao automatica do servico e gerando retrabalho manual na equipe financeira.',
    categoryName: 'Integrações',
    subcategoryHint: 'Webhooks',
    type: 'INCIDENT',
    impact: 'HIGH',
    urgency: 'HIGH',
    priority: 'HIGH',
    requesterFollowUp: 'Validamos com o gateway e o retorno esta saindo normalmente do lado deles. O problema parece estar mesmo na nossa recepcao.',
    triageReply: 'Recebi o caso e iniciei a triagem. Vou validar logs de entrada, assinatura do payload e fila de processamento.',
    internalNote: 'Primeira analise indica quebra na validacao de assinatura do webhook apos mudanca de header. Precisa ajuste no endpoint.',
    pendingQuestion: 'Pode me confirmar qual evento do gateway esta falhando primeiro e, se possivel, enviar um exemplo do payload recebido?',
    testingReply: 'Ajuste aplicado em homologacao. Estamos validando reprocessamento de eventos antes de publicar para producao.',
    budgetPublic: 'Levantamos uma necessidade de ajuste estrutural na integracao. Vou encaminhar a estimativa para sua aprovacao.',
    budgetInternal: 'Estimativa para ajuste da integracao com revisao de seguranca, reprocessamento e homologacao completa.',
  },
  {
    title: 'Dashboard administrativo leva mais de 12 segundos para abrir',
    description:
      'A tela principal de acompanhamento esta abrindo muito lenta desde ontem. O problema afeta principalmente filtros por periodo e o modulo de indicadores, com reclamação recorrente da equipe operacional.',
    categoryName: 'Infraestrutura & Cloud',
    subcategoryHint: 'Performance',
    type: 'INCIDENT',
    impact: 'HIGH',
    urgency: 'MEDIUM',
    priority: 'HIGH',
    requesterFollowUp: 'Nos navegadores da operacao o problema acontece com e sem cache limpo. Em abas anonimas tambem ficou lento.',
    triageReply: 'Iniciei a triagem de performance. Vou comparar consultas, payload da API e tempo de renderizacao no front.',
    internalNote: 'Consulta agregada esta varrendo volume alto sem indice util para filtro de periodo. Existe gargalo misto em banco e serializacao.',
    pendingQuestion: 'Voce consegue informar qual intervalo de datas e qual perfil de usuario mais sente a lentidao?',
    testingReply: 'Otimizamos a consulta e estamos validando tempo de resposta em ambiente de testes com base similar.',
    budgetPublic: 'Foi identificado um trabalho maior de otimizacao e acompanhamento. Vou formalizar a estimativa para sua aprovacao.',
    budgetInternal: 'Estimativa para otimizacao de consulta, indice, ajuste de cache e testes de carga controlados.',
  },
  {
    title: 'Botao de salvar perfil nao responde na tela de preferencias',
    description:
      'Ao editar assinatura de e-mail e configuracoes de notificacao, o botao salvar nao conclui a operacao. O usuario permanece na mesma tela sem feedback e as alteracoes nao persistem.',
    categoryName: 'Desenvolvimento de SaaS',
    subcategoryHint: 'Frontend/UI',
    type: 'BUG',
    impact: 'MEDIUM',
    urgency: 'MEDIUM',
    priority: 'MEDIUM',
    requesterFollowUp: 'O erro acontece com dois usuarios do time comercial e tambem comigo. Testamos em Chrome e Edge.',
    triageReply: 'Estou analisando validacao do formulario, requisicao enviada e resposta da API para localizar a quebra.',
    internalNote: 'Evento de submit esta sendo bloqueado por estado inconsistente no formulario de preferencias. Ajuste no fluxo de submit necessario.',
    pendingQuestion: 'Pode me dizer se o problema acontece ao alterar qualquer campo ou somente quando a assinatura de e-mail e editada?',
    testingReply: 'Correcao aplicada em homologacao e validacao em curso com cenarios de preferencia e assinatura.',
    budgetPublic: 'O ajuste completo envolve revisao da tela e testes em navegadores diferentes. Vou encaminhar a estimativa para avaliacao.',
    budgetInternal: 'Estimativa para correcao do fluxo de formulario, validacao cruzada e testes multiplos de navegador.',
  },
  {
    title: 'Novo modulo de onboarding para clientes enterprise',
    description:
      'Precisamos estruturar um modulo dedicado de onboarding para contas enterprise com checklist, status por etapa, aceite do cliente e visao gerencial do progresso.',
    categoryName: 'Desenvolvimento de SaaS',
    subcategoryHint: 'Novo Módulo',
    type: 'PROJECT',
    impact: 'HIGH',
    urgency: 'MEDIUM',
    priority: 'HIGH',
    requesterFollowUp: 'O objetivo e reduzir dependencia de planilhas externas e centralizar acompanhamento no proprio sistema.',
    triageReply: 'Iniciei levantamento funcional e tecnico para separar o que e modulo novo, o que pode ser reaproveitado e o esforco estimado.',
    internalNote: 'Escopo indica necessidade de modelo novo, fluxo de etapas, permissoes e painel de acompanhamento. Demanda de projeto estruturante.',
    pendingQuestion: 'Para seguir com o desenho, consegue confirmar se o onboarding precisa ter responsavel por etapa e prazo por milestone?',
    testingReply: 'Protótipo funcional e primeiros fluxos foram enviados para homologacao interna de produto.',
    budgetPublic: 'Como se trata de um modulo novo, vou encaminhar uma estimativa de projeto para sua aprovacao.',
    budgetInternal: 'Estimativa de descoberta, prototipo, desenvolvimento full stack e homologacao assistida do novo modulo.',
  },
  {
    title: 'Usuario sem permissao para visualizar contratos da propria unidade',
    description:
      'Alguns usuarios com perfil de gestor local nao estao conseguindo abrir contratos da propria unidade. A mensagem exibida informa falta de permissao, mesmo com papel correto.',
    categoryName: 'Segurança & Privacidade',
    type: 'ACCESS',
    impact: 'HIGH',
    urgency: 'HIGH',
    priority: 'HIGH',
    requesterFollowUp: 'Conferimos os papeis cadastrados e a associacao do usuario com a unidade, mas a tela continua bloqueada.',
    triageReply: 'Vou revisar regra de autorizacao, heranca de perfis e filtro por unidade aplicado na consulta.',
    internalNote: 'Ha forte indicio de falha na regra de escopo por unidade apos ajuste recente de RBAC. Exige revisao de middleware e consulta.',
    pendingQuestion: 'Pode me enviar o e-mail de um usuario afetado e a unidade em que a falha ocorre para eu reproduzir com exatidao?',
    testingReply: 'Ajuste de permissao aplicado em homologacao e testes de escopo por unidade em andamento.',
    budgetPublic: 'Foi identificado um ajuste estrutural na camada de permissao. Vou formalizar uma estimativa para aprovacao.',
    budgetInternal: 'Estimativa para revisao de RBAC, testes de unidade, matriz de perfis e validacao de seguranca.',
  },
  {
    title: 'Duvida sobre uso do campo de renovacao automatica no plano anual',
    description:
      'Nossa equipe comercial precisa entender o comportamento do campo de renovacao automatica nos contratos anuais para orientar os clientes corretamente e evitar divergencias na assinatura.',
    categoryName: 'Suporte ao Usuário',
    type: 'QUESTION',
    impact: 'LOW',
    urgency: 'MEDIUM',
    priority: 'MEDIUM',
    requesterFollowUp: 'A documentacao interna ficou inconclusiva e dois clientes fizeram a mesma pergunta nesta semana.',
    triageReply: 'Vou validar a regra atual do produto e alinhar a orientacao mais segura para a equipe comercial.',
    internalNote: 'Caso aparenta ser mais orientativo, mas vale revisar texto atual e comportamento do fluxo de renovacao para evitar ruído.',
    pendingQuestion: 'Voce precisa dessa orientacao somente para o time comercial ou tambem quer que eu revise o texto exibido ao cliente na tela?',
    testingReply: 'Atualizamos a orientacao e estamos validando o texto final exibido nas telas de contrato.',
    budgetPublic: 'A revisao solicitada pode evoluir para melhoria de fluxo e texto. Se quiser, formalizo uma estimativa antes de seguir.',
    budgetInternal: 'Estimativa para revisao de copy, regra de negocio e testes de experiencia do fluxo de renovacao.',
  },
  {
    title: 'Conciliacao de faturas esta com divergencia de centavos em lote',
    description:
      'Na conciliacao do faturamento, alguns titulos estao retornando com diferenca de centavos quando comparados com o extrato processado. Isso esta atrasando o fechamento mensal.',
    categoryName: 'Financeiro & Faturamento',
    type: 'FINANCIAL',
    impact: 'HIGH',
    urgency: 'HIGH',
    priority: 'HIGH',
    requesterFollowUp: 'Percebemos o problema em lotes processados apos a virada do mes, principalmente em contas com desconto proporcional.',
    triageReply: 'Iniciei a analise do calculo financeiro, arredondamento e importacao do extrato para localizar a divergencia.',
    internalNote: 'Possivel inconsistência entre regra de arredondamento do sistema e valores importados do extrato. Requer analise numerica e validacao por lote.',
    pendingQuestion: 'Pode me informar um lote e uma fatura exemplo onde a diferenca apareceu para eu validar o calculo exato?',
    testingReply: 'Ajuste de arredondamento foi aplicado em homologacao e estamos conciliando lotes reais para confirmacao.',
    budgetPublic: 'Identificamos uma melhoria mais ampla na rotina de conciliacao. Posso encaminhar a estimativa para aprovacao.',
    budgetInternal: 'Estimativa para revisao do motor de calculo, conciliacao por lote e homologacao com base real.',
  },
  {
    title: 'Mapeamento de arquitetura para separar clientes por cluster',
    description:
      'Precisamos definir uma arquitetura de escalabilidade para separar grupos de clientes enterprise em clusters dedicados sem perder a operacao centralizada do produto.',
    categoryName: 'Consultoria & Estratégia',
    subcategoryHint: 'Escalabilidade',
    type: 'PROJECT',
    impact: 'HIGH',
    urgency: 'MEDIUM',
    priority: 'HIGH',
    requesterFollowUp: 'O objetivo e preparar o ambiente para crescimento dos proximos seis meses e reduzir ruido entre contas maiores e menores.',
    triageReply: 'Vou estruturar uma analise inicial de requisitos de escalabilidade, isolamento, custo e operacao.',
    internalNote: 'Demanda consultiva com impacto arquitetural. Precisa discovery tecnico e visao de custo/operacao antes da proposta.',
    pendingQuestion: 'Voce quer separar por cluster somente banco e aplicacao, ou tambem fila, cache e rotinas assicronas?',
    testingReply: 'Primeira proposta arquitetural foi validada internamente e alguns cenarios de carga estao em simulacao.',
    budgetPublic: 'Esse estudo exige discovery e recomendacao estruturada. Posso encaminhar uma proposta de consultoria para aprovacao.',
    budgetInternal: 'Estimativa de discovery arquitetural, desenho de referencia e parecer tecnico com recomendacoes de escalabilidade.',
  },
  {
    title: 'Sincronizacao com CRM externo nao atualiza etapa do funil',
    description:
      'Quando a oportunidade avanca no CRM, o Nexus nao atualiza a etapa correspondente. O time de CS esta corrigindo manualmente varios registros por dia.',
    categoryName: 'Integrações Nexus',
    type: 'REQUEST',
    impact: 'MEDIUM',
    urgency: 'HIGH',
    priority: 'HIGH',
    requesterFollowUp: 'O problema foi notado primeiro no pipeline enterprise, mas tambem apareceu em contas SMB.',
    triageReply: 'Vou validar mapeamento de etapas, autenticacao da integracao e processamento dos eventos de sincronizacao.',
    internalNote: 'Falha pode estar em mapeamento de stage names e nao necessariamente no transporte. Precisa revisar regra de conversao.',
    pendingQuestion: 'Consegue me informar quais etapas do CRM estao sem correspondencia e se isso ocorre em um pipeline especifico?',
    testingReply: 'Novo mapeamento de etapas e rotina de sincronizacao estao em validacao com registros de homologacao.',
    budgetPublic: 'A melhoria completa da sincronizacao envolve revisao de regra e homologacao com o CRM. Posso enviar uma estimativa.',
    budgetInternal: 'Estimativa para revisão de mapeamento, reprocessamento da fila e homologacao da integracao com CRM.',
  },
  {
    title: 'Manutencao preventiva do banco principal antes da virada fiscal',
    description:
      'Precisamos planejar uma manutencao preventiva no banco principal antes da virada fiscal, incluindo analise de crescimento, vacuum, indices e janela segura de execucao.',
    categoryName: 'Infraestrutura & Cloud',
    subcategoryHint: 'Banco de Dados',
    type: 'MAINTENANCE',
    impact: 'MEDIUM',
    urgency: 'MEDIUM',
    priority: 'MEDIUM',
    requesterFollowUp: 'A ideia e fazer com risco minimo e sem pegar o horario de fechamento financeiro.',
    triageReply: 'Vou levantar o estado atual do banco, janela recomendada e impacto esperado para montar o plano de manutencao.',
    internalNote: 'Trabalho preventivo com necessidade de checklist, janela e testes de rollback. Pode ser executado sem urgencia critica.',
    pendingQuestion: 'Voce prefere uma janela noturna em dia util ou execucao no fim de semana para reduzir impacto operacional?',
    testingReply: 'Checklist de manutencao e roteiro de validacao pos-execucao foram preparados e estao em revisao.',
    budgetPublic: 'Se quiser que a equipe execute toda a manutencao assistida, posso encaminhar a estimativa antes do agendamento.',
    budgetInternal: 'Estimativa para manutencao preventiva, revisao de indices, analise de crescimento e acompanhamento pos-janela.',
  },
  {
    title: 'Sugestao de melhoria para salvar filtros frequentes no painel de SLA',
    description:
      'Nossa equipe de operacao gostaria de salvar combinacoes de filtros usadas diariamente no painel de SLA para evitar reconfiguracao manual a cada acesso e ganhar produtividade no acompanhamento.',
    categoryName: 'Customer Success',
    type: 'SUGGESTION',
    impact: 'MEDIUM',
    urgency: 'LOW',
    priority: 'MEDIUM',
    requesterFollowUp: 'Hoje o time repete os mesmos filtros varias vezes por dia e isso esta gerando perda de tempo no acompanhamento da fila.',
    triageReply: 'Vou avaliar o encaixe da sugestao na experiencia atual e levantar impacto tecnico para implementacao.',
    internalNote: 'Melhoria com potencial de alto valor operacional. Pode exigir persistencia por usuario, ajustes de interface e validacao de usabilidade.',
    pendingQuestion: 'Voce quer salvar filtros por usuario individualmente ou prefere um conjunto compartilhado para a equipe?',
    testingReply: 'Protótipo da melhoria foi preparado e estamos validando o comportamento com cenarios reais de operacao.',
    budgetPublic: 'A melhoria tem escopo claro e posso encaminhar uma estimativa de implementacao para sua aprovacao.',
    budgetInternal: 'Estimativa para persistencia de filtros, ajustes no painel e homologacao com usuarios-chave.',
  },
]

function pick<T>(items: T[], index: number) {
  return items[index % items.length]
}

function calculatePriority(impact: Impact, urgency: Urgency): Priority {
  if (impact === 'CRITICAL' || urgency === 'CRITICAL') return 'CRITICAL'
  if (impact === 'HIGH' && urgency === 'HIGH') return 'HIGH'
  if (impact === 'LOW' && urgency === 'LOW') return 'LOW'
  return 'MEDIUM'
}

function plusHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000)
}

function plusDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}

async function main() {
  const [users, categories, slaRules] = await Promise.all([
    prisma.user.findMany({
      where: { approved: true },
      select: { id: true, name: true, email: true, role: true, isAI: true },
      orderBy: { name: 'asc' },
    }),
    prisma.category.findMany({
      include: { subcategories: true },
      orderBy: { name: 'asc' },
    }),
    prisma.sLARule.findMany(),
  ])

  const jeferson = users.find((user) => user.email === 'jefrsonsales@outlook.com')
  const luiz = users.find((user) => user.email === 'luizkaz175@gmail.com')
  const requesters = users.filter((user) => user.role === 'USER' && !user.isAI)

  if (!jeferson || !luiz) {
    throw new Error('Nao encontrei Jefrson Sales e Luiz Kaz na base.')
  }

  if (requesters.length < 10) {
    throw new Error('Nao encontrei solicitantes suficientes para montar a fila realista.')
  }

  const categoryByName = new Map(categories.map((category) => [category.name, category]))
  const slaByPriority = new Map(slaRules.map((rule) => [rule.priority, rule]))

  console.log('Limpando chamados atuais...')

  await prisma.$transaction([
    prisma.attachment.deleteMany({}),
    prisma.ticketComment.deleteMany({}),
    prisma.ticketTransition.deleteMany({}),
    prisma.satisfactionSurvey.deleteMany({}),
    prisma.aILog.deleteMany({ where: { ticketId: { not: null } } }),
    prisma.notification.deleteMany({}),
    prisma.ticket.deleteMany({}),
  ])

  console.log('Gerando 100 novos chamados realistas...')

  for (let index = 0; index < 100; index++) {
    const status = statusPlan[index]
    const scenario = pick(scenarioTemplates, index)
    const requester = pick(requesters, index * 3)
    const assignee =
      status === 'NEW'
        ? null
        : status === 'TRIAGE' && index % 4 === 0
          ? null
          : index % 2 === 0
            ? jeferson
            : luiz

    const category =
      categoryByName.get(scenario.categoryName) ||
      categories[index % categories.length]

    const subcategory =
      category.subcategories.find((item) =>
        scenario.subcategoryHint
          ? item.name.toLowerCase().includes(scenario.subcategoryHint.toLowerCase().replace(/[^\w\s]/g, ''))
          : false
      ) || category.subcategories[index % Math.max(category.subcategories.length, 1)] || null

    const createdAt = plusDays(new Date(), -(index % 22) - 1)
    const triageAt = plusHours(createdAt, 4)
    const developmentAt = plusHours(triageAt, 6)
    const testingAt = plusHours(developmentAt, 12)
    const pendingAt = plusHours(triageAt, 8)
    const approvalAt = plusHours(triageAt, 10)

    const priority = calculatePriority(scenario.impact, scenario.urgency)
    const slaRule = slaByPriority.get(priority)
    const responseTimeDue = slaRule ? plusHours(createdAt, slaRule.responseTime) : plusHours(createdAt, 8)

    const plannedStartDate =
      status === 'NEW'
        ? null
        : status === 'TRIAGE'
          ? plusDays(createdAt, 1)
          : status === 'DEVELOPMENT'
            ? plusDays(createdAt, 1)
            : status === 'TEST'
              ? plusDays(createdAt, 2)
              : status === 'AWAITING_APPROVAL'
                ? plusDays(createdAt, 2)
                : plusDays(createdAt, 1)

    const plannedDueDate =
      status === 'NEW'
        ? null
        : status === 'TRIAGE'
          ? plusDays(createdAt, 4)
          : status === 'DEVELOPMENT'
            ? plusDays(createdAt, 6)
            : status === 'TEST'
              ? plusDays(createdAt, 7)
              : status === 'AWAITING_APPROVAL'
                ? plusDays(createdAt, 5)
                : plusDays(createdAt, 3)

    const resolutionTimeDue = plannedDueDate || plusDays(createdAt, 3)

    const budgetAmount =
      status === 'AWAITING_APPROVAL'
        ? 1800 + (index % 5) * 650
        : null
    const budgetDescription =
      status === 'AWAITING_APPROVAL'
        ? scenario.budgetInternal
        : null

    const ticket = await prisma.ticket.create({
      data: {
        title: `${scenario.title} - ${requester.name}`,
        description: scenario.description,
        type: scenario.type,
        status,
        priority,
        impact: scenario.impact,
        urgency: scenario.urgency,
        requesterId: requester.id,
        assigneeId: assignee?.id || null,
        categoryId: category.id,
        subcategoryId: subcategory?.id || null,
        budgetAmount,
        budgetDescription,
        createdAt,
        updatedAt:
          status === 'NEW'
            ? createdAt
            : status === 'TRIAGE'
              ? triageAt
              : status === 'DEVELOPMENT'
                ? developmentAt
                : status === 'TEST'
                  ? testingAt
                  : status === 'AWAITING_APPROVAL'
                    ? approvalAt
                    : pendingAt,
        responseTimeDue,
        resolutionTimeDue,
        plannedStartDate,
        plannedDueDate,
      },
    })

    await prisma.ticketTransition.create({
      data: {
        ticketId: ticket.id,
        fromStatus: 'NONE',
        toStatus: 'NEW',
        performedById: requester.id,
        comment: 'Chamado aberto pelo cliente no portal.',
        createdAt,
      },
    })

    const comments: Array<{
      authorId: string
      content: string
      createdAt: Date
      isInternal?: boolean
      isPrivate?: boolean
      timeSpent?: number
    }> = []

    if (status === 'TRIAGE' || status === 'DEVELOPMENT' || status === 'TEST' || status === 'AWAITING_APPROVAL' || status === 'PENDING_USER') {
      comments.push({
        authorId: requester.id,
        content: scenario.requesterFollowUp,
        createdAt: plusHours(createdAt, 2),
      })
    }

    if (assignee) {
      await prisma.ticketTransition.create({
        data: {
          ticketId: ticket.id,
          fromStatus: 'NEW',
          toStatus: 'TRIAGE',
          performedById: assignee.id,
          comment: `Chamado assumido por ${assignee.name} para analise inicial.`,
          createdAt: triageAt,
        },
      })

      if (status !== 'NEW') {
        comments.push({
          authorId: assignee.id,
          content: scenario.triageReply,
          createdAt: plusHours(triageAt, 1),
          timeSpent: 18 + (index % 20),
        })

        comments.push({
          authorId: assignee.id,
          content: scenario.internalNote,
          createdAt: plusHours(triageAt, 2),
          isInternal: true,
          isPrivate: true,
          timeSpent: 12 + (index % 15),
        })
      }
    }

    if (status === 'DEVELOPMENT' || status === 'TEST') {
      if (!assignee) throw new Error('Status de execucao requer atendente atribuido.')

      await prisma.ticketTransition.create({
        data: {
          ticketId: ticket.id,
          fromStatus: 'TRIAGE',
          toStatus: 'DEVELOPMENT',
          performedById: assignee.id,
          comment: 'Escopo confirmado e trabalho tecnico iniciado.',
          createdAt: developmentAt,
        },
      })

      comments.push({
        authorId: assignee.id,
        content: 'Identificamos a causa principal e iniciamos o ajuste tecnico no ambiente de desenvolvimento.',
        createdAt: plusHours(developmentAt, 1),
        timeSpent: 34 + (index % 22),
      })
    }

    if (status === 'TEST') {
      if (!assignee) throw new Error('Status de testes requer atendente atribuido.')

      await prisma.ticketTransition.create({
        data: {
          ticketId: ticket.id,
          fromStatus: 'DEVELOPMENT',
          toStatus: 'TEST',
          performedById: assignee.id,
          comment: 'Ajuste concluido e enviado para validacao.',
          createdAt: testingAt,
        },
      })

      comments.push({
        authorId: assignee.id,
        content: scenario.testingReply,
        createdAt: plusHours(testingAt, 1),
        timeSpent: 22 + (index % 12),
      })
    }

    if (status === 'AWAITING_APPROVAL') {
      if (!assignee) throw new Error('Status de aprovacao requer atendente atribuido.')

      await prisma.ticketTransition.create({
        data: {
          ticketId: ticket.id,
          fromStatus: 'TRIAGE',
          toStatus: 'AWAITING_APPROVAL',
          performedById: assignee.id,
          comment: 'Estimativa preparada e enviada para aprovacao do cliente.',
          createdAt: approvalAt,
        },
      })

      comments.push({
        authorId: assignee.id,
        content: scenario.budgetPublic,
        createdAt: plusHours(approvalAt, 1),
        timeSpent: 28 + (index % 10),
      })

      comments.push({
        authorId: assignee.id,
        content: `Estimativa registrada em ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(budgetAmount || 0)}. ${scenario.budgetInternal}`,
        createdAt: plusHours(approvalAt, 2),
        isInternal: true,
        isPrivate: true,
        timeSpent: 16 + (index % 8),
      })
    }

    if (status === 'PENDING_USER') {
      if (!assignee) throw new Error('Status pendente cliente requer atendente atribuido.')

      await prisma.ticketTransition.create({
        data: {
          ticketId: ticket.id,
          fromStatus: 'TRIAGE',
          toStatus: 'PENDING_USER',
          performedById: assignee.id,
          comment: 'Aguardando retorno do cliente para continuidade.',
          createdAt: pendingAt,
        },
      })

      comments.push({
        authorId: assignee.id,
        content: scenario.pendingQuestion,
        createdAt: plusHours(pendingAt, 1),
        timeSpent: 14 + (index % 10),
      })
    }

    for (const comment of comments) {
      await prisma.ticketComment.create({
        data: {
          ticketId: ticket.id,
          authorId: comment.authorId,
          content: comment.content,
          createdAt: comment.createdAt,
          isInternal: comment.isInternal ?? false,
          isPrivate: comment.isPrivate ?? false,
          timeSpent: comment.timeSpent ?? 0,
        },
      })
    }
  }

  const summary = await prisma.ticket.groupBy({
    by: ['status', 'assigneeId'],
    _count: { _all: true },
  })

  console.log('Carga concluida com sucesso.')
  console.log(JSON.stringify(summary, null, 2))
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
