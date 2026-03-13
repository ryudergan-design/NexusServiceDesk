import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Configurando 10 Agentes de IA (Groq & Gemini) ---')
  
  const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  const groqKey = process.env.GROQ_API_KEY
  const password = await bcrypt.hash('nexus-bot-password', 10)

  const bots = [
    // 5 BOTS GROQ (Velocidade)
    {
      name: 'Groq Triagem Ultra',
      email: 'triagem-groq@nexus.ai',
      model: 'llama-3.3-70b-versatile',
      key: groqKey,
      instructions: 'Você é um agente de triagem ultra-rápido. Sua função é classificar o chamado e dar as boas-vindas ao cliente de forma instantânea.'
    },
    {
      name: 'Groq Suporte N1',
      email: 'suporte-n1-groq@nexus.ai',
      model: 'llama-3.3-70b-versatile',
      key: groqKey,
      instructions: 'Suporte de primeiro nível. Resolva dúvidas rápidas e problemas comuns de interface SaaS.'
    },
    {
      name: 'Groq Analista de Bugs',
      email: 'bugs-groq@nexus.ai',
      model: 'llama-3.3-70b-versatile',
      key: groqKey,
      instructions: 'Analise erros de código e logs. Seja direto e técnico.'
    },
    {
      name: 'Groq Dev Especialista',
      email: 'dev-groq@nexus.ai',
      model: 'llama-3.3-70b-versatile',
      key: groqKey,
      instructions: 'Ajude com integrações de API e lógica de backend.'
    },
    {
      name: 'Groq Arquiteto Ágil',
      email: 'arquiteto-groq@nexus.ai',
      model: 'llama-3.3-70b-versatile',
      key: groqKey,
      instructions: 'Sugira melhorias de performance e estrutura de banco de dados.'
    },
    // 5 BOTS GEMINI (Raciocínio/Contexto)
    {
      name: 'Gemini Analista de Negócio',
      email: 'biz-gemini@nexus.ai',
      model: 'gemini-1.5-pro',
      key: geminiKey,
      instructions: 'Analise solicitações de novos módulos sob a ótica de ROI e valor de negócio para o SaaS.'
    },
    {
      name: 'Gemini Consultor Estratégico',
      email: 'consultor-gemini@nexus.ai',
      model: 'gemini-1.5-pro',
      key: geminiKey,
      instructions: 'Forneça consultoria profunda sobre o roadmap do produto do cliente.'
    },
    {
      name: 'Gemini Security Auditor',
      email: 'security-gemini@nexus.ai',
      model: 'gemini-1.5-flash',
      key: geminiKey,
      instructions: 'Analise vulnerabilidades e sugira correções de segurança (OWASP).'
    },
    {
      name: 'Gemini Documentador',
      email: 'doc-gemini@nexus.ai',
      model: 'gemini-1.5-flash',
      key: geminiKey,
      instructions: 'Crie documentação técnica e guias de uso baseados nas conversas do chamado.'
    },
    {
      name: 'Gemini UX Architect',
      email: 'ux-gemini@nexus.ai',
      model: 'gemini-1.5-pro',
      key: geminiKey,
      instructions: 'Analise a experiência do usuário e sugira fluxos de interface modernos.'
    }
  ]

  for (const bot of bots) {
    await prisma.user.upsert({
      where: { email: bot.email },
      update: {
        isAI: true,
        aiApiKey: bot.key,
        aiModel: bot.model,
        aiInstructions: bot.instructions,
        approved: true,
        role: 'AGENT'
      },
      create: {
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
    console.log(`✅ Bot Pronto: ${bot.name} [${bot.model}]`)
  }

  console.log('\n--- Carga de 10 Bots Concluída ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
