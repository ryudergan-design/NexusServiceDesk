import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Atualizando Gemini para Versão 3.1 Flash (Lite Preview) ---')
  
  // Modelo 3.1 Flash Lite Preview confirmado na listagem anterior da sua chave
  const targetModel = 'gemini-3.1-flash-lite-preview'

  await prisma.user.updateMany({
    where: { email: { in: ['assistant-flash@nexus.ai', 'specialist-pro@nexus.ai'] } },
    data: { aiModel: targetModel }
  })

  console.log(`✅ Bots Gemini configurados para: ${targetModel}`)
}

main().finally(() => prisma.$disconnect())
