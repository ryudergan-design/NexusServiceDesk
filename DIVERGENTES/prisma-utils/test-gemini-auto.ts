import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Testando Modelo models/Auto para o Gemini Pro ---')
  
  await prisma.user.updateMany({
    where: { email: 'specialist-pro@nexus.ai' },
    data: { aiModel: 'models/Auto' }
  })

  console.log('✅ Bot Specialist atualizado para models/Auto.')
}

main().finally(() => prisma.$disconnect())
