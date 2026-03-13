import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Iniciando Limpeza de Base ---')
  await prisma.ticketComment.deleteMany({})
  await prisma.ticketTransition.deleteMany({})
  await prisma.attachment.deleteMany({})
  await prisma.satisfactionSurvey.deleteMany({})
  await prisma.ticket.deleteMany({})
  await prisma.subcategory.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.notification.deleteMany({})
  await prisma.auditLog.deleteMany({})
  await prisma.accessLog.deleteMany({})
  await prisma.aILog.deleteMany({})
  await prisma.user.deleteMany({
    where: {
      email: {
        notIn: ['jefrsonsales@outlook.com', 'luizkaz175@gmail.com']
      }
    }
  })

  console.log('--- Criando Administradores ---')
  const adminPassword1 = await bcrypt.hash('Fal.990544', 10)
  const adminPassword2 = await bcrypt.hash('Luiz8521@', 10)

  await prisma.user.upsert({
    where: { email: 'jefrsonsales@outlook.com' },
    update: { password: adminPassword1, role: 'ADMIN', approved: true },
    create: {
      email: 'jefrsonsales@outlook.com',
      name: 'Jefrson Sales',
      password: adminPassword1,
      role: 'ADMIN',
      approved: true,
      jobTitle: 'System Admin'
    }
  })

  await prisma.user.upsert({
    where: { email: 'luizkaz175@gmail.com' },
    update: { password: adminPassword2, role: 'ADMIN', approved: true },
    create: {
      email: 'luizkaz175@gmail.com',
      name: 'Luiz Kaz',
      password: adminPassword2,
      role: 'ADMIN',
      approved: true,
      jobTitle: 'Project Manager'
    }
  })

  console.log('--- Criando Categorias de SaaS ---')
  const categoriesData = [
    {
      name: 'Desenvolvimento de SaaS',
      subcategories: ['Novo Módulo', 'Refatoração', 'Frontend/UI', 'Backend/API']
    },
    {
      name: 'Integrações',
      subcategories: ['Webhooks', 'Meios de Pagamento', 'CRMs', 'ERP Externo']
    },
    {
      name: 'Infraestrutura & Cloud',
      subcategories: ['Deploy/CI-CD', 'Banco de Dados', 'SSL/Domínios', 'Performance']
    },
    {
      name: 'Suporte Ténico',
      subcategories: ['Erro de Execução', 'Dúvida de Uso', 'Recuperação de Dados']
    },
    {
      name: 'Consultoria & Estratégia',
      subcategories: ['Arquitetura', 'Segurança (Audit)', 'Escalabilidade']
    }
  ]

  const categories = []
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.create({
      data: {
        name: cat.name,
        subcategories: {
          create: cat.subcategories.map(name => ({ name }))
        }
      },
      include: { subcategories: true }
    })
    categories.push(createdCat)
  }

  console.log('--- Gerando 50 Clientes ---')
  const clientNames = [
    'TechFlow Solutions', 'Nexus Digital', 'CloudNine SaaS', 'InnovateSoft', 'Prime Systems',
    'Global Dev', 'Alpha Code', 'Stellar Apps', 'DataStream', 'Vortex IT',
    'Quantum Soft', 'Horizon Digital', 'Peak Performance', 'SmartLogic', 'BlueSky Tech',
    'Matrix Software', 'Zenith Apps', 'Velocity Dev', 'Ironclad Systems', 'Neon Digital',
    'FutureProof', 'Titan SaaS', 'Evolve Tech', 'Core Logic', 'Syncro Soft',
    'Aura Digital', 'Pulse Systems', 'Apex Code', 'Swift SaaS', 'Nova Tech',
    'Infinity Soft', 'Eagle Eye IT', 'Orion Digital', 'Phoenix Apps', 'Atlas Tech',
    'Falcon Dev', 'Guardian Systems', 'Legacy Tech', 'NextGen SaaS', 'Prism Digital',
    'Rune Software', 'Solaris Tech', 'Terra Soft', 'Unity Dev', 'Vector IT',
    'Wizard SaaS', 'Xcel Systems', 'Yield Tech', 'Zion Digital', 'Oasis Software'
  ]

  const clients = []
  for (let i = 0; i < 50; i++) {
    const company = clientNames[i]
    const slug = company.toLowerCase().replace(/ /g, '')
    const email = `${slug}@nexuservicedesk.com`
    const password = await bcrypt.hash(slug, 10)
    
    const user = await prisma.user.create({
      data: {
        email,
        name: company,
        password,
        role: 'USER',
        approved: true,
        department: 'Cliente Externo',
        jobTitle: 'Proprietário'
      }
    })
    clients.push(user)
  }

  console.log('--- Gerando 70 Chamados ---')
  const statuses = ['NEW', 'TRIAGE', 'DEVELOPMENT', 'TESTING', 'BUDGET_APPROVAL', 'PENDING_USER', 'COMPLETED']
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
  const impacts = ['LOW', 'MEDIUM', 'HIGH']
  
  const titles = [
    'Necessidade de novo módulo de assinatura',
    'Erro na integração com gateway de pagamento',
    'Lentidão no carregamento do dashboard',
    'Solicitação de orçamento para App Mobile',
    'Problema com certificado SSL no subdomínio',
    'Dúvida sobre exportação de relatórios em PDF',
    'Ajuste no design da tela de login',
    'Integração com API do WhatsApp',
    'Erro de permissão no módulo financeiro',
    'Configuração de Webhooks para notificações',
    'Upgrade de plano e faturamento',
    'Migração de banco de dados para AWS',
    'Suporte para autenticação em dois fatores (2FA)',
    'Otimização de consultas SQL',
    'Correção de bug no upload de arquivos'
  ]

  for (let i = 0; i < 70; i++) {
    const client = clients[Math.floor(Math.random() * clients.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const subcategory = category.subcategories[Math.floor(Math.random() * category.subcategories.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const priority = priorities[Math.floor(Math.random() * priorities.length)]
    
    await prisma.ticket.create({
      data: {
        title: `${titles[i % titles.length]} - #${i + 1}`,
        description: `Solicitação detalhada vinda da empresa ${client.name}. Precisamos avaliar o impacto técnico e o prazo de entrega para este item de ${category.name}.`,
        status,
        priority,
        type: Math.random() > 0.3 ? 'SERVICE_REQUEST' : 'INCIDENT',
        impact: impacts[Math.floor(Math.random() * impacts.length)],
        urgency: impacts[Math.floor(Math.random() * impacts.length)],
        requesterId: client.id,
        categoryId: category.id,
        subcategoryId: subcategory.id,
        budgetAmount: status === 'BUDGET_APPROVAL' ? (Math.random() * 5000 + 500) : null,
        budgetDescription: status === 'BUDGET_APPROVAL' ? 'Desenvolvimento de funcionalidade customizada conforme escopo.' : null
      }
    })
  }

  console.log('--- Seed Nexus ServiceDesk Finalizado ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
