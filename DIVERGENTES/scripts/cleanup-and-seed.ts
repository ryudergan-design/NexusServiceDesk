import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Blueprint = {
  title: string
  description: string
  type: string
  category: string
  subcategory?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  impact: 'LOW' | 'MEDIUM' | 'HIGH'
  urgency: 'LOW' | 'MEDIUM' | 'HIGH'
}

const blueprints: Blueprint[] = [
  {
    title: 'Dúvida sobre configuração de SPF e DKIM',
    description: 'Nossa equipe comercial começou a enviar campanhas pelo módulo de e-mail, mas queremos confirmar quais registros SPF e DKIM precisam ser publicados no DNS para melhorar a entrega. Se possível, orientar com passo a passo simples.',
    type: 'QUESTION',
    category: 'Suporte Ténico',
    subcategory: 'Dúvida de Uso',
    priority: 'MEDIUM',
    impact: 'LOW',
    urgency: 'MEDIUM'
  },
  {
    title: 'Webhook do CRM não está trazendo novos leads',
    description: 'Integramos o CRM com o SaaS via webhook, porém desde ontem os novos leads não aparecem no painel. O endpoint continua respondendo 200, então precisamos ajuda para validar payload, headers e possíveis causas mais comuns.',
    type: 'INCIDENT',
    category: 'Integrações',
    subcategory: 'Webhooks',
    priority: 'HIGH',
    impact: 'MEDIUM',
    urgency: 'HIGH'
  },
  {
    title: 'Como exportar relatório de uso por cliente',
    description: 'Precisamos enviar para nosso cliente final um relatório com acessos, usuários ativos e volume de transações do mês. Onde geramos isso dentro da plataforma e qual o melhor filtro para fechar o período?',
    type: 'QUESTION',
    category: 'Suporte Ténico',
    subcategory: 'Dúvida de Uso',
    priority: 'LOW',
    impact: 'LOW',
    urgency: 'LOW'
  },
  {
    title: 'Pedido de melhoria no filtro da tela de contratos',
    description: 'Seria útil incluir um filtro por status do contrato e faixa de vencimento na tela principal. Não é algo urgente, mas queremos entender se já existe configuração nativa ou se isso entra como melhoria simples.',
    type: 'REQUEST',
    category: 'Desenvolvimento de SaaS',
    subcategory: 'Frontend/UI',
    priority: 'LOW',
    impact: 'LOW',
    urgency: 'LOW'
  },
  {
    title: 'Erro ao anexar PDF em proposta comercial',
    description: 'Ao anexar um PDF de aproximadamente 4 MB na proposta comercial, a tela mostra falha no upload sem mensagem detalhada. Testamos em dois navegadores. Precisamos de orientação de limite, formato aceito e procedimento recomendado.',
    type: 'INCIDENT',
    category: 'Suporte Ténico',
    subcategory: 'Erro de Execução',
    priority: 'MEDIUM',
    impact: 'MEDIUM',
    urgency: 'MEDIUM'
  },
  {
    title: 'Solicitação de orçamento para integração com ERP externo',
    description: 'Queremos integrar pedidos aprovados do SaaS com nosso ERP. Antes de seguir, precisamos de uma estimativa inicial de esforço, dependências e faixa de investimento para integração padrão via API.',
    type: 'REQUEST',
    category: 'Integrações',
    subcategory: 'ERP Externo',
    priority: 'MEDIUM',
    impact: 'MEDIUM',
    urgency: 'LOW'
  },
  {
    title: 'Lentidão leve na dashboard de métricas',
    description: 'A dashboard principal demora entre 6 e 8 segundos para abrir quando selecionamos período de 90 dias. Gostaria de saber se existe filtro recomendado, limite ideal ou alguma otimização rápida que possamos aplicar na rotina de uso.',
    type: 'INCIDENT',
    category: 'Infraestrutura & Cloud',
    subcategory: 'Performance',
    priority: 'MEDIUM',
    impact: 'MEDIUM',
    urgency: 'MEDIUM'
  },
  {
    title: 'Como habilitar acesso somente leitura para financeiro',
    description: 'Precisamos permitir que o time financeiro visualize cobranças e comprovantes sem editar nenhuma configuração. Existe perfil pronto ou algum conjunto de permissões recomendado?',
    type: 'QUESTION',
    category: 'Suporte Ténico',
    subcategory: 'Dúvida de Uso',
    priority: 'LOW',
    impact: 'LOW',
    urgency: 'MEDIUM'
  },
  {
    title: 'Ajuste simples no texto do e-mail de onboarding',
    description: 'Queremos trocar o texto padrão do e-mail de onboarding para um tom mais comercial e adicionar um link para a base de ajuda. Isso pode ser feito por configuração? Se sim, preciso do caminho exato.',
    type: 'REQUEST',
    category: 'Customer Success',
    priority: 'LOW',
    impact: 'LOW',
    urgency: 'LOW'
  },
  {
    title: 'Falha de login para usuário recém-criado',
    description: 'Criamos um usuário novo para o time de vendas, mas ele recebe mensagem de acesso inválido logo no primeiro login. Já redefinimos a senha uma vez. Precisamos checar ativação, perfil e causa provável sem intervenção complexa.',
    type: 'INCIDENT',
    category: 'Suporte Ténico',
    subcategory: 'Erro de Execução',
    priority: 'HIGH',
    impact: 'MEDIUM',
    urgency: 'HIGH'
  },
  {
    title: 'Dúvida sobre cobrança proporcional no upgrade',
    description: 'Um cliente nosso vai trocar de plano no meio do ciclo e queremos confirmar como o sistema calcula cobrança proporcional e quando a nova franquia entra em vigor.',
    type: 'QUESTION',
    category: 'Financeiro & Faturamento',
    priority: 'MEDIUM',
    impact: 'LOW',
    urgency: 'MEDIUM'
  },
  {
    title: 'Pequena melhoria no formulário de cadastro de lead',
    description: 'Precisamos incluir um campo opcional de segmento da empresa no formulário de lead. Queremos entender se isso já pode ser feito por configuração ou se depende de ajuste simples de formulário.',
    type: 'REQUEST',
    category: 'Desenvolvimento de SaaS',
    subcategory: 'Frontend/UI',
    priority: 'LOW',
    impact: 'LOW',
    urgency: 'LOW'
  },
  {
    title: 'Integração com gateway de pagamento marcando assinatura como pendente',
    description: 'Algumas assinaturas pagas via cartão estão ficando como pendentes por alguns minutos antes da ativação. Precisamos validar se isso é esperado, se depende do webhook ou se existe fila de reconciliação.',
    type: 'INCIDENT',
    category: 'Integrações',
    subcategory: 'Meios de Pagamento',
    priority: 'HIGH',
    impact: 'HIGH',
    urgency: 'HIGH'
  },
  {
    title: 'Como configurar domínio próprio no portal do cliente',
    description: 'Queremos publicar o portal do cliente em um subdomínio nosso. Precisamos do checklist de DNS, SSL e prazo de propagação para fazer isso sem erro.',
    type: 'QUESTION',
    category: 'Infraestrutura & Cloud',
    subcategory: 'SSL/Domínios',
    priority: 'MEDIUM',
    impact: 'LOW',
    urgency: 'MEDIUM'
  },
  {
    title: 'Solicitação de melhoria leve em notificação de renovação',
    description: 'Gostaríamos que a notificação de renovação fosse enviada 14 dias antes, além do aviso atual. Queremos saber se existe configuração pronta ou se entra como pequena customização.',
    type: 'REQUEST',
    category: 'Customer Success',
    priority: 'LOW',
    impact: 'LOW',
    urgency: 'LOW'
  },
  {
    title: 'Erro ao importar planilha de usuários',
    description: 'Ao subir a planilha de usuários, o sistema rejeita algumas linhas sem explicar qual coluna está inválida. Precisamos de ajuda para validar formato, colunas obrigatórias e boas práticas de importação.',
    type: 'INCIDENT',
    category: 'Suporte Ténico',
    subcategory: 'Erro de Execução',
    priority: 'MEDIUM',
    impact: 'MEDIUM',
    urgency: 'MEDIUM'
  },
  {
    title: 'Consulta sobre LGPD e exclusão de conta',
    description: 'Um cliente pediu exclusão definitiva da conta e queremos confirmar o fluxo correto para anonimizar dados, manter histórico financeiro obrigatório e registrar a solicitação conforme LGPD.',
    type: 'QUESTION',
    category: 'Segurança & Privacidade',
    priority: 'MEDIUM',
    impact: 'MEDIUM',
    urgency: 'MEDIUM'
  },
  {
    title: 'Pedido de orçamento para novo dashboard executivo',
    description: 'Precisamos de um dashboard executivo com MRR, churn e conversão por etapa do funil. Antes de abrir projeto, queremos uma estimativa inicial baseada em algo próximo do que a plataforma já entrega.',
    type: 'REQUEST',
    category: 'Consultoria & Estratégia',
    subcategory: 'Arquitetura',
    priority: 'MEDIUM',
    impact: 'MEDIUM',
    urgency: 'LOW'
  },
  {
    title: 'Pequeno bug no campo de busca de clientes',
    description: 'Ao pesquisar clientes com acento no nome, alguns resultados não aparecem. Queremos saber se existe configuração de busca aproximada ou correção simples já conhecida.',
    type: 'INCIDENT',
    category: 'Desenvolvimento de SaaS',
    subcategory: 'Backend/API',
    priority: 'MEDIUM',
    impact: 'LOW',
    urgency: 'MEDIUM'
  },
  {
    title: 'Dúvida sobre automação de follow-up comercial',
    description: 'Gostaríamos de montar uma automação simples de follow-up para leads sem resposta em 3 dias. Existe fluxo nativo ou uma configuração recomendada para isso?',
    type: 'QUESTION',
    category: 'Customer Success',
    priority: 'LOW',
    impact: 'LOW',
    urgency: 'LOW'
  }
]

function rotate<T>(items: T[], index: number) {
  return items[index % items.length]
}

async function run() {
  console.log('--- LIMPANDO CHAMADOS PARA NOVA MASSA DE TESTE IA ---')
  await prisma.ticketTransition.deleteMany()
  await prisma.attachment.deleteMany()
  await prisma.ticketComment.deleteMany()
  await prisma.satisfactionSurvey.deleteMany()
  await prisma.ticket.deleteMany()
  console.log('Base de chamados limpa.')

  const clients = await prisma.user.findMany({
    where: { role: 'USER', isAI: false },
    orderBy: { createdAt: 'asc' }
  })

  const categories = await prisma.category.findMany({
    include: { subcategories: true },
    orderBy: { name: 'asc' }
  })

  if (clients.length === 0 || categories.length === 0) {
    throw new Error('É preciso ter clientes e categorias cadastrados antes de gerar os chamados.')
  }

  const categoryMap = new Map(categories.map((category) => [category.name, category]))

  console.log(`--- CRIANDO 100 CHAMADOS DE CLIENTES SaaS ATENDÍVEIS POR IA ---`)

  for (let i = 0; i < 100; i++) {
    const blueprint = rotate(blueprints, i)
    const client = rotate(clients, i)
    const category = categoryMap.get(blueprint.category) || categories[0]
    const subcategory = blueprint.subcategory
      ? category.subcategories.find((item) => item.name === blueprint.subcategory)
      : null

    const title = `${blueprint.title} #${i + 1}`
    const description = [
      `Empresa: ${client.name}.`,
      blueprint.description,
      'Objetivo do chamado: obter uma orientação objetiva, resposta operacional ou encaminhamento claro sem depender de investigação pesada.',
      `Contexto de teste IA: lote SaaS ${i + 1}.`
    ].join('\n\n')

    await prisma.ticket.create({
      data: {
        title,
        description,
        type: blueprint.type,
        status: 'NEW',
        priority: blueprint.priority,
        impact: blueprint.impact,
        urgency: blueprint.urgency,
        requesterId: client.id,
        categoryId: category.id,
        subcategoryId: subcategory?.id || null,
        assigneeId: null
      }
    })

    if ((i + 1) % 20 === 0) {
      console.log(`${i + 1} chamados criados...`)
    }
  }

  console.log('✅ 100 chamados SaaS gerados com foco em atendimento por IA.')
}

run()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
