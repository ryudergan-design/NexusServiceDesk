import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Configurando Agente IA (OpenRouter) ---')
  
  const openRouterKey = process.env.OPENROUTER_API_KEY
  const password = await bcrypt.hash('nexus-bot-password', 10)

  await prisma.user.upsert({
    where: { email: 'global-bot@nexus.ai' },
    update: {
      isAI: true,
      aiApiKey: openRouterKey,
      aiModel: 'openrouter/auto', // O sistema agora sabe tratar o prefixo 'openrouter/'
      aiInstructions: 'Você é o Nexus Global, alimentado pelo OpenRouter. Você tem acesso aos modelos mais avançados do mundo. Sua missão é resolver chamados complexos com precisão cirúrgica e elegância.',
      approved: true,
      role: 'AGENT'
    },
    create: {
      name: 'Nexus Global (OpenRouter)',
      email: 'global-bot@nexus.ai',
      password: password,
      isAI: true,
      aiApiKey: openRouterKey,
      aiModel: 'openrouter/auto',
      aiInstructions: 'Você é o Nexus Global, alimentado pelo OpenRouter. Você tem acesso aos modelos mais avançados do mundo. Sua missão é resolver chamados complexos com precisão cirúrgica e elegância.',
      approved: true,
      role: 'AGENT',
      jobTitle: 'Agente de IA Multimodel'
    }
  })

  console.log('✅ Bot OpenRouter Configurado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
