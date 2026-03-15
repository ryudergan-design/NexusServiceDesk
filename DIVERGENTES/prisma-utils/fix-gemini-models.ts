import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Corrigindo Nomes dos Modelos Gemini ---')
  
  const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY

  // Atualizar Assistant (Flash) para o nome que funcionou no seu curl
  await prisma.user.updateMany({
    where: { email: 'assistant-flash@nexus.ai' },
    data: { aiModel: 'gemini-1.5-flash-latest' }
  })

  // Atualizar Specialist (Pro) para o nome mais estável
  await prisma.user.updateMany({
    where: { email: 'specialist-pro@nexus.ai' },
    data: { aiModel: 'gemini-1.5-pro-latest' }
  })

  console.log('✅ Modelos Gemini atualizados para versões "latest".')
}

main().finally(() => prisma.$disconnect())
