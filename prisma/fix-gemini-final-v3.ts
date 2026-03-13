import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Padronizando Gemini para Modelos Funcionais ---')
  
  // Usando o nome exato que o Google Cloud Console e o seu curl validaram
  const modelId = 'gemini-1.5-flash'

  await prisma.user.updateMany({
    where: { email: { in: ['assistant-flash@nexus.ai', 'specialist-pro@nexus.ai'] } },
    data: { aiModel: modelId }
  })

  console.log(`✅ Bots Gemini configurados para: ${modelId}`)
}

main().finally(() => prisma.$disconnect())
