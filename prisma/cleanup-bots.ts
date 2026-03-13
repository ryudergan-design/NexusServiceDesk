import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Iniciando Limpeza de Bots Antigos ---')
  
  const activeBotsEmails = [
    'turbo-triagem@nexus.ai',
    'suporte-agil@nexus.ai',
    'dev-bot@nexus.ai',
    'specialist-pro@nexus.ai',
    'assistant-flash@nexus.ai',
    'global-bot@nexus.ai'
  ]

  // 1. Encontrar todos os usuários marcados como AI que NÃO estão na lista ativa
  const legacyBots = await prisma.user.findMany({
    where: {
      isAI: true,
      email: {
        notIn: activeBotsEmails
      }
    }
  })

  console.log(`Encontrados ${legacyBots.length} bots antigos para processar.`)

  for (const bot of legacyBots) {
    try {
      // Tenta deletar (só funcionará se não houver vínculos de chave estrangeira)
      await prisma.user.delete({
        where: { id: bot.id }
      })
      console.log(`🗑️ Bot deletado: ${bot.name} (${bot.email})`)
    } catch (e) {
      // Se houver vínculo, apenas removemos a flag de IA e desativamos o acesso
      await prisma.user.update({
        where: { id: bot.id },
        data: {
          isAI: false,
          approved: false,
          name: `[LEGACY] ${bot.name}`
        }
      })
      console.log(`⚠️ Bot arquivado (possui vínculos): ${bot.name} (${bot.email})`)
    }
  }

  console.log('\n--- Limpeza Concluída! Apenas os 6 Bots Nexus estão ativos. ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
