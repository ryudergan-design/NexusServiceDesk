import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Configurando Agente IA (Cohere) ---')
  
  const cohereKey = process.env.COHERE_API_KEY
  const password = await bcrypt.hash('nexus-bot-password', 10)

  // 1. Desativar o bot antigo do OpenRouter se existir
  await prisma.user.updateMany({
    where: { email: 'global-bot@nexus.ai' },
    data: { isAI: false, approved: false, name: '[INATIVO] Nexus Global (OpenRouter)' }
  })

  // 2. Criar ou Atualizar o bot do Cohere
  await prisma.user.upsert({
    where: { email: 'cohere-bot@nexus.ai' },
    update: {
      name: 'Nexus Intelligence (Cohere)',
      isAI: true,
      aiApiKey: cohereKey,
      aiModel: 'cohere/command-r-03-2025',
      aiInstructions: 'Você é o Nexus Intelligence, alimentado pela tecnologia da Cohere. Especialista em raciocínio lógico e suporte de alto nível. Analise o contexto e forneça respostas precisas e elegantes.',
      approved: true,
      role: 'AGENT'
    },
    create: {
      name: 'Nexus Intelligence (Cohere)',
      email: 'cohere-bot@nexus.ai',
      password: password,
      isAI: true,
      aiApiKey: cohereKey,
      aiModel: 'cohere/command-r-03-2025',
      aiInstructions: 'Você é o Nexus Intelligence, alimentado pela tecnologia da Cohere. Especialista em raciocínio lógico e suporte de alto nível. Analise o contexto e forneça respostas precisas e elegantes.',
      approved: true,
      role: 'AGENT',
      jobTitle: 'Nexus AI Specialist'
    }
  })

  console.log('✅ Bot Cohere Configurado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
