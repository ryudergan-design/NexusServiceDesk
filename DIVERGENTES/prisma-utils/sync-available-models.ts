import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Sincronizando Bots com Modelos Disponíveis na Conta ---')
  
  // Modelos confirmados via script de listagem na sua chave:
  const flashModel = 'gemini-2.0-flash'
  const proModel = 'gemini-pro-latest'

  await prisma.user.updateMany({
    where: { email: 'assistant-flash@nexus.ai' },
    data: { aiModel: flashModel }
  })

  await prisma.user.updateMany({
    where: { email: 'specialist-pro@nexus.ai' },
    data: { aiModel: proModel }
  })

  console.log(`✅ Nexus Assistant configurado para: ${flashModel}`)
  console.log(`✅ Nexus Specialist configurado para: ${proModel}`)
}

main().finally(() => prisma.$disconnect())
