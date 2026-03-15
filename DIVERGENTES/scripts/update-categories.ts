import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- EXPANDINDO CATEGORIAS NEXUS ---')
  
  const categories = [
    { name: 'Infraestrutura & Cloud', description: 'Servidores, Banco de Dados e Hospedagem' },
    { name: 'Segurança & Privacidade', description: 'LGPD, Auditoria e Permissões' },
    { name: 'Desenvolvimento & APIs', description: 'Bugs de código, Webhooks e Integrações' },
    { name: 'Integrações Nexus', description: 'Conexão entre sistemas e ferramentas externas' },
    { name: 'Suporte ao Usuário', description: 'Dúvidas de uso, Treinamento e Orientações' },
    { name: 'Customer Success', description: 'Onboarding de novos clientes e Expansão' },
    { name: 'Financeiro & Faturamento', description: 'Faturas, Cobranças e Orçamentos' },
    { name: 'Jurídico & Compliance', description: 'Contratos e Termos de Uso' }
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: { description: cat.description },
      create: {
        name: cat.name,
        description: cat.description
      }
    })
    console.log(`✅ Categoria Sincronizada: ${cat.name}`)
  }

  console.log('\n--- Categorias Atualizadas! ---')
}

main().finally(() => prisma.$disconnect())
