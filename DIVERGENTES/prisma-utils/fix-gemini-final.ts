import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Ajustando Modelos Gemini para Estabilidade Máxima ---')
  
  // O seu curl usou 'gemini-flash-latest', vamos seguir esse padrão que já funcionou
  
  await prisma.user.updateMany({
    where: { email: 'assistant-flash@nexus.ai' },
    data: { aiModel: 'gemini-1.5-flash' } 
  })

  await prisma.user.updateMany({
    where: { email: 'specialist-pro@nexus.ai' },
    data: { aiModel: 'gemini-1.5-pro' }
  })

  console.log('✅ Modelos Gemini resetados para IDs estáveis.')
}

main().finally(() => prisma.$disconnect())
