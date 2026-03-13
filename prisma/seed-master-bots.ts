import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('--- RECONSTRUINDO OS 6 BOTS NEXUS OFICIAIS ---')
  
  const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  const groqKey = process.env.GROQ_API_KEY
  const openRouterKey = process.env.OPENROUTER_API_KEY
  const password = await bcrypt.hash('nexus-bot-password', 10)

  const bots = [
    {
      name: 'Nexus Triagem Expressa',
      email: 'turbo-triagem@nexus.ai',
      model: 'llama-3.3-70b-versatile',
      key: groqKey,
      instructions: 'Você é o Nexus Triagem. Sua missão é dar as boas-vindas e classificar o chamado rapidamente.'
    },
    {
      name: 'Nexus Suporte Técnico',
      email: 'suporte-agil@nexus.ai',
      model: 'llama-3.3-70b-versatile',
      key: groqKey,
      instructions: 'Especialista em resolver erros e bugs de sistema. Tom empático e resolutivo.'
    },
    {
      name: 'Nexus Especialista em APIs',
      email: 'dev-bot@nexus.ai',
      model: 'llama-3.3-70b-versatile',
      key: groqKey,
      instructions: 'Analista técnico focado em integrações, Webhooks e Backend.'
    },
    {
      name: 'Nexus Arquiteto de Projetos',
      email: 'specialist-pro@nexus.ai',
      model: 'gemini-3.1-flash-lite-preview',
      key: geminiKey,
      instructions: 'Planejador de alto nível. Focado em cronogramas e arquitetura SaaS.'
    },
    {
      name: 'Nexus Consultor Geral',
      email: 'assistant-flash@nexus.ai',
      model: 'gemini-3.1-flash-lite-preview',
      key: geminiKey,
      instructions: 'Assistente para dúvidas gerais, documentação e guias de uso.'
    },
    {
      name: 'Nexus Global Intelligence',
      email: 'global-bot@nexus.ai',
      model: 'gemini-3.1-flash-lite-preview',
      key: geminiKey,
      instructions: 'Inteligência avançada para casos complexos e transversais.'
    }
  ]

  for (const bot of bots) {
    await prisma.user.upsert({
      where: { email: bot.email },
      update: {
        name: bot.name,
        isAI: true,
        aiApiKey: bot.key,
        aiModel: bot.model,
        aiInstructions: bot.instructions,
        approved: true,
        role: 'AGENT'
      },
      create: {
        name: bot.name,
        email: bot.email,
        password: password,
        isAI: true,
        aiApiKey: bot.key,
        aiModel: bot.model,
        aiInstructions: bot.instructions,
        approved: true,
        role: 'AGENT',
        jobTitle: 'Nexus AI'
      }
    })
    console.log(`✅ Bot Sincronizado: ${bot.name}`)
  }

  // Desativar qualquer outro bot que não esteja na lista acima
  const emails = bots.map(b => b.email)
  await prisma.user.updateMany({
    where: {
      isAI: true,
      email: { notIn: emails }
    },
    data: { isAI: false, approved: false }
  })

  console.log('\n--- Sincronização Finalizada! ---')
}

main().finally(() => prisma.$disconnect())
