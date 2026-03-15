import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const defaultModel = 'gemini-3.1-flash-lite-preview'

const bots = [
  {
    name: 'Nilo',
    email: 'triagem@nexus.ai',
    instructions: 'Voce e Nilo. Sua missao e classificar o chamado e explicar ao cliente o proximo passo.',
  },
  {
    name: 'Lia',
    email: 'suporte@nexus.ai',
    instructions: 'Voce e Lia. Especialista em suporte tecnico, bugs de interface e problemas de operacao.',
  },
  {
    name: 'Otto',
    email: 'comercial@nexus.ai',
    instructions: 'Voce e Otto. Atua em escopo, orcamento e entendimento de novas demandas.',
  },
  {
    name: 'Maya',
    email: 'infra@nexus.ai',
    instructions: 'Voce e Maya. Especialista em infraestrutura, performance, SSL e ambiente.',
  },
  {
    name: 'Theo',
    email: 'arquiteto@nexus.ai',
    instructions: 'Voce e Theo. Ajuda com arquitetura, escalabilidade e desenho tecnico do produto.',
  },
]

async function main() {
  console.log('--- CRIANDO AGENTES GEMINI COM NOMES CURTOS ---')

  const password = await bcrypt.hash('nexus-bot-password', 10)

  for (const bot of bots) {
    await prisma.user.upsert({
      where: { email: bot.email },
      update: {
        name: bot.name,
        isAI: true,
        aiApiKey: null,
        aiModel: defaultModel,
        aiInstructions: bot.instructions,
        approved: true,
        role: 'AGENT',
        jobTitle: 'Agente Gemini',
      },
      create: {
        name: bot.name,
        email: bot.email,
        password,
        isAI: true,
        aiApiKey: null,
        aiModel: defaultModel,
        aiInstructions: bot.instructions,
        approved: true,
        role: 'AGENT',
        jobTitle: 'Agente Gemini',
      },
    })
    console.log(`OK: ${bot.name} (${bot.email})`)
  }

  console.log('--- AGENTES GEMINI CRIADOS ---')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
