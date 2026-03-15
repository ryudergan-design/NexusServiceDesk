import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const defaultModel = 'gemini-3.1-flash-lite-preview'

const bots = [
  {
    name: 'Nilo',
    email: 'turbo-triagem@nexus.ai',
    instructions: 'Voce e Nilo. Conduz triagem inicial, classificacao e abertura do atendimento com rapidez.',
  },
  {
    name: 'Lia',
    email: 'suporte-agil@nexus.ai',
    instructions: 'Voce e Lia. Atua em suporte tecnico e resolucao orientada a proximos passos.',
  },
  {
    name: 'Otto',
    email: 'dev-bot@nexus.ai',
    instructions: 'Voce e Otto. Analisa integracoes, APIs e bugs tecnicos com profundidade.',
  },
  {
    name: 'Maya',
    email: 'specialist-pro@nexus.ai',
    instructions: 'Voce e Maya. Foca em arquitetura, planejamento e decisoes tecnicas complexas.',
  },
  {
    name: 'Theo',
    email: 'assistant-flash@nexus.ai',
    instructions: 'Voce e Theo. Da suporte geral, documentacao e acompanha a comunicacao com o cliente.',
  },
  {
    name: 'Zara',
    email: 'global-bot@nexus.ai',
    instructions: 'Voce e Zara. Consolida contexto e apoia casos mais amplos ou interdisciplinares.',
  },
]

async function main() {
  console.log('--- CONFIGURANDO AGENTES GEMINI COM NOMES SIMPLES ---')

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
    console.log(`OK: ${bot.name}`)
  }

  await prisma.user.updateMany({
    where: {
      isAI: true,
      email: { notIn: bots.map((bot) => bot.email) },
    },
    data: { isAI: false, approved: false },
  })

  console.log('--- CARGA GEMINI FINALIZADA ---')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
