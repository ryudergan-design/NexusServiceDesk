import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Padronizando Gemini para Modelo de Alta Cota (1.5 Flash) ---')
  
  // O 1.5 Flash é o que tem o maior limite de RPM (Requisições por Minuto) no plano free.
  const stableModel = 'gemini-1.5-flash'

  await prisma.user.updateMany({
    where: { email: { in: ['assistant-flash@nexus.ai', 'specialist-pro@nexus.ai'] } },
    data: { aiModel: stableModel }
  })

  console.log(`✅ Bots Gemini movidos para ${stableModel} para evitar estouro de cota.`)
}

main().finally(() => prisma.$disconnect())
