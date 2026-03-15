import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const passwordValue = 'nexus-bot-password'

async function main() {
  console.log('--- Configurando 10 Agentes Gemini ---')

  const password = await bcrypt.hash(passwordValue, 10)

  const bots = [
    {
      name: 'Triagem Ultra',
      email: 'triagem-gemini@nexus.ai',
      model: 'gemini-3.1-flash-lite-preview',
      instructions: 'Voce e um agente de triagem rapido. Sua funcao e classificar o chamado e dar as boas-vindas ao cliente.',
    },
    {
      name: 'Suporte N1',
      email: 'suporte-n1-gemini@nexus.ai',
      model: 'gemini-3.1-flash-lite-preview',
      instructions: 'Suporte de primeiro nivel. Resolva duvidas rapidas e problemas comuns de interface SaaS.',
    },
    {
      name: 'Analista de Bugs',
      email: 'bugs-gemini@nexus.ai',
      model: 'gemini-3.1-flash-lite-preview',
      instructions: 'Analise erros de codigo e logs. Seja direto e tecnico.',
    },
    {
      name: 'Dev Especialista',
      email: 'dev-gemini@nexus.ai',
      model: 'gemini-3.1-flash-lite-preview',
      instructions: 'Ajude com integracoes de API e logica de backend.',
    },
    {
      name: 'Arquiteto Agil',
      email: 'arquiteto-gemini@nexus.ai',
      model: 'gemini-3.1-flash-lite-preview',
      instructions: 'Sugira melhorias de performance e estrutura de banco de dados.',
    },
    {
      name: 'Analista de Negocio',
      email: 'biz-gemini@nexus.ai',
      model: 'gemini-3.1-flash-lite-preview',
      instructions: 'Analise solicitacoes de novos modulos sob a otica de ROI e valor de negocio para o SaaS.',
    },
    {
      name: 'Consultor Estrategico',
      email: 'consultor-gemini@nexus.ai',
      model: 'gemini-3.1-flash-lite-preview',
      instructions: 'Forneca consultoria profunda sobre o roadmap do produto do cliente.',
    },
    {
      name: 'Security Auditor',
      email: 'security-gemini@nexus.ai',
      model: 'gemini-3.1-flash-lite-preview',
      instructions: 'Analise vulnerabilidades e sugira correcoes de seguranca.',
    },
    {
      name: 'Documentador',
      email: 'doc-gemini@nexus.ai',
      model: 'gemini-3.1-flash-lite-preview',
      instructions: 'Crie documentacao tecnica e guias de uso baseados nas conversas do chamado.',
    },
    {
      name: 'UX Architect',
      email: 'ux-gemini@nexus.ai',
      model: 'gemini-3.1-flash-lite-preview',
      instructions: 'Analise a experiencia do usuario e sugira fluxos de interface modernos.',
    },
  ]

  for (const bot of bots) {
    await prisma.user.upsert({
      where: { email: bot.email },
      update: {
        isAI: true,
        aiApiKey: null,
        aiModel: bot.model,
        aiInstructions: bot.instructions,
        approved: true,
        role: 'AGENT',
        jobTitle: 'Agente Gemini',
      },
      create: {
        name: bot.name,
        email: bot.email,
        password,
        isAI: true,
        aiApiKey: null,
        aiModel: bot.model,
        aiInstructions: bot.instructions,
        approved: true,
        role: 'AGENT',
        jobTitle: 'Agente Gemini',
      },
    })
    console.log(`Bot pronto: ${bot.name} [${bot.model}]`)
  }

  console.log('--- Carga de 10 Bots Gemini concluida ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
