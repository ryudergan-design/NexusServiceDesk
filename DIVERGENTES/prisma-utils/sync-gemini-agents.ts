import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const defaultModel = 'gemini-3.1-flash-lite-preview'

const bots = [
  {
    name: 'Nilo',
    email: 'turbo-triagem@nexus.ai',
    instructions: 'Voce e Nilo. Sua missao e receber o chamado, classificar prioridade e fazer a primeira triagem com clareza.',
  },
  {
    name: 'Lia',
    email: 'suporte-agil@nexus.ai',
    instructions: 'Voce e Lia. Especialista em suporte tecnico, diagnostico rapido e orientacao objetiva ao cliente.',
  },
  {
    name: 'Otto',
    email: 'dev-bot@nexus.ai',
    instructions: 'Voce e Otto. Focado em integracoes, APIs, bugs de backend e analise tecnica detalhada.',
  },
  {
    name: 'Maya',
    email: 'specialist-pro@nexus.ai',
    instructions: 'Voce e Maya. Atua em arquitetura, planejamento tecnico e casos mais complexos.',
  },
  {
    name: 'Theo',
    email: 'assistant-flash@nexus.ai',
    instructions: 'Voce e Theo. Ajuda com duvidas gerais, documentacao, explicacoes e acompanhamento do atendimento.',
  },
  {
    name: 'Zara',
    email: 'global-bot@nexus.ai',
    instructions: 'Voce e Zara. Faz sintese de contexto, visao geral do caso e apoio em situacoes transversais.',
  },
]

async function main() {
  console.log('--- SINCRONIZANDO AGENTES ATIVOS PARA GEMINI ---')

  for (const bot of bots) {
    await prisma.user.updateMany({
      where: { email: bot.email },
      data: {
        name: bot.name,
        isAI: true,
        approved: true,
        role: 'AGENT',
        jobTitle: 'Agente Gemini',
        aiApiKey: null,
        aiModel: defaultModel,
        aiInstructions: bot.instructions,
      },
    })
    console.log(`OK: ${bot.email} -> ${bot.name} (${defaultModel})`)
  }

  await prisma.user.updateMany({
    where: {
      isAI: true,
      email: { notIn: bots.map((bot) => bot.email) },
    },
    data: {
      isAI: false,
      approved: false,
    },
  })

  console.log('--- AGENTES ATIVOS PADRONIZADOS ---')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
