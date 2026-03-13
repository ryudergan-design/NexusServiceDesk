import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- GERANDO 100 CHAMADOS COERENTES PARA TREINAMENTO IA ---')

  const client = await prisma.user.findFirst({ where: { role: 'USER', isAI: false } })
  if (!client) {
    console.error('Erro: Nenhum usuário cliente encontrado para ser o solicitante.')
    return
  }

  const categories = await prisma.category.findMany()
  const catMap = categories.reduce((acc: any, cat) => {
    acc[cat.name] = cat.id
    return acc
  }, {})

  const blueprints = [
    {
      title: 'Erro de Autenticação via API',
      description: 'Estamos recebendo erro 401 constante ao tentar autenticar no endpoint /v1/auth, mesmo com a chave correta.',
      type: 'BUG',
      category: 'Desenvolvimento & APIs',
      impact: 'HIGH',
      urgency: 'HIGH'
    },
    {
      title: 'Solicitação de Orçamento: Integração SAP',
      description: 'Gostaríamos de conectar o Nexus ao nosso ERP SAP. Preciso de uma estimativa de custo e prazo para este projeto.',
      type: 'REQUEST',
      category: 'Financeiro & Faturamento',
      impact: 'MEDIUM',
      urgency: 'LOW'
    },
    {
      title: 'Instabilidade no Servidor de Produção',
      description: 'O sistema está apresentando lentidão extrema e quedas intermitentes nos últimos 15 minutos.',
      type: 'INCIDENT',
      category: 'Infraestrutura & Cloud',
      impact: 'CRITICAL',
      urgency: 'CRITICAL'
    },
    {
      title: 'Dúvida sobre Relatórios de LGPD',
      description: 'Onde consigo extrair o log de acesso dos usuários conforme exigido pela nova política de privacidade?',
      type: 'QUESTION',
      category: 'Segurança & Privacidade',
      impact: 'LOW',
      urgency: 'MEDIUM'
    },
    {
      title: 'Sugestão: Dashboard em Tempo Real',
      description: 'Seria excelente se os gráficos da home atualizassem via websocket sem precisar dar F5 na página.',
      type: 'SUGGESTION',
      category: 'Customer Success',
      impact: 'LOW',
      urgency: 'LOW'
    },
    {
      title: 'Acesso negado ao Módulo Financeiro',
      description: 'O usuário financeiro@empresa.com não está conseguindo visualizar a aba de faturas.',
      type: 'ACCESS',
      category: 'Segurança & Privacidade',
      impact: 'MEDIUM',
      urgency: 'HIGH'
    },
    {
      title: 'Erro na Emissão de Nota Fiscal',
      description: 'Ao tentar finalizar a venda, o sistema retorna erro de schema XML na comunicação com a SEFAZ.',
      type: 'BUG',
      category: 'Desenvolvimento & APIs',
      impact: 'HIGH',
      urgency: 'CRITICAL'
    },
    {
      title: 'Manutenção de Banco de Dados',
      description: 'Gostaria de agendar uma limpeza de logs antigos para otimizar a performance do banco.',
      type: 'MAINTENANCE',
      category: 'Infraestrutura & Cloud',
      impact: 'LOW',
      urgency: 'LOW'
    }
  ]

  let createdCount = 0
  for (let i = 1; i <= 100; i++) {
    const bp = blueprints[i % blueprints.length]
    const title = `${bp.title} #${i}`
    const description = `${bp.description}\n\n[Referência de Teste: Chamado de Treinamento IA ${i}]`

    await prisma.ticket.create({
      data: {
        title,
        description,
        type: bp.type,
        categoryId: catMap[bp.category] || categories[0].id,
        impact: bp.impact,
        urgency: bp.urgency,
        status: 'NEW',
        priority: bp.impact === 'CRITICAL' || bp.urgency === 'CRITICAL' ? 'CRITICAL' : bp.impact === 'HIGH' ? 'HIGH' : 'MEDIUM',
        requesterId: client.id
      }
    })
    
    if (i % 10 === 0) console.log(`🚀 ${i} chamados criados...`)
    createdCount++
  }

  console.log(`\n✅ Sucesso! ${createdCount} chamados inseridos com sucesso na fila aberta.`) 
}

main().finally(() => prisma.$disconnect())
