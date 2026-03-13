import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Configurando 5 Bots Finais (3 Groq, 2 Gemini) ---')
  
  const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  const groqKey = process.env.GROQ_API_KEY
  const password = await bcrypt.hash('nexus-bot-password', 10)

  // Limpar bots antigos
  await prisma.user.deleteMany({
    where: { 
      isAI: true,
      email: { contains: '@nexus.ai' }
    }
  })

  const bots = [
    // 3 BOTS GROQ (Llama 3.3 - Alta Velocidade)
    {
      name: 'Nexus Turbo Groq (Triagem)',
      email: 'turbo-triagem@nexus.ai',
      model: 'llama-3.3-70b-versatile',
      key: groqKey,
      instructions: 'Você é o Nexus Turbo. Sua função é triagem rápida. Se o problema for simples, resolva. Se não, direcione para o suporte humano movendo para TRIAGE.'
    },
    {
      name: 'Nexus Suporte Ágil (Groq)',
      email: 'suporte-agil@nexus.ai',
      model: 'llama-3.3-70b-versatile',
      key: groqKey,
      instructions: 'Especialista em resolução técnica rápida. Tente dar a solução em um passo. Se conseguir resolver, sugira finalizar o chamado.'
    },
    {
      name: 'Nexus Dev Bot (Groq)',
      email: 'dev-bot@nexus.ai',
      model: 'llama-3.3-70b-versatile',
      key: groqKey,
      instructions: 'Focado em bugs e APIs. Analise o erro e dê o caminho da correção. Se for complexo demais, transfira para o humano.'
    },
    // 2 BOTS GEMINI
    {
      name: 'Nexus Specialist (Gemini Pro)',
      email: 'specialist-pro@nexus.ai',
      model: 'gemini-1.5-pro',
      key: geminiKey,
      instructions: 'Você é o cérebro do sistema. Analise profundamente. Você tem permissão para planejar datas e propor soluções arquiteturais complexas.'
    },
    {
      name: 'Nexus Assistant (Gemini Flash)',
      email: 'assistant-flash@nexus.ai',
      model: 'gemini-1.5-flash',
      key: geminiKey,
      instructions: 'Assistente versátil. Ótimo para documentação e suporte geral. Mantenha o cliente informado e educado.'
    }
  ]

  for (const bot of bots) {
    await prisma.user.create({
      data: {
        name: bot.name,
        email: bot.email,
        password: password,
        isAI: true,
        aiApiKey: bot.key,
        aiModel: bot.model,
        aiInstructions: bot.instructions,
        approved: true,
        role: 'AGENT',
        jobTitle: 'Agente de IA'
      }
    })
    console.log(`✅ Bot Configurado: ${bot.name}`)
  }

  console.log('\n--- Carga de 5 Bots Finalizada ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
