import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Criando 5 Agentes de IA Especializados ---')
  
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  const model = 'gemini-1.5-flash' // Compatível com a URL do seu curl (gemini-flash-latest)
  const password = await bcrypt.hash('nexus-bot-password', 10)

  const bots = [
    {
      name: 'Nexus Triagem',
      email: 'triagem@nexus.ai',
      instructions: 'Você é o Nexus Triagem. Sua missão é ler o chamado do cliente e confirmar a classificação de categoria e prioridade. Responda educadamente ao cliente confirmando o recebimento e informando que o chamado foi encaminhado para a equipe técnica responsável. Seu tom deve ser ultra-profissional e ágil.'
    },
    {
      name: 'Nexus Suporte Técnico',
      email: 'suporte@nexus.ai',
      instructions: 'Você é o Nexus Suporte. Especialista em resolver erros de código, bugs de interface e problemas de integração em sistemas SaaS. Use tom técnico e empático. Analise os logs ou descrições fornecidas e tente dar uma solução imediata ou passos para debug.'
    },
    {
      name: 'Nexus Comercial & Projetos',
      email: 'comercial@nexus.ai',
      instructions: 'Você é o Nexus Comercial. Especialista em orçamentos de novos módulos e expansão de funcionalidades SaaS. Seu objetivo é entender a necessidade de negócio do cliente e fornecer uma estimativa preliminar ou sugerir uma reunião de escopo para o novo módulo solicitado.'
    },
    {
      name: 'Nexus Infra & Segurança',
      email: 'infra@nexus.ai',
      instructions: 'Você é o Nexus Infra. Especialista em servidores AWS, bancos de dados, certificados SSL e performance. Sua missão é tratar chamados de instabilidade ou configurações de ambiente, garantindo que o SaaS do cliente esteja sempre online.'
    },
    {
      name: 'Nexus Arquiteto SaaS',
      email: 'arquiteto@nexus.ai',
      instructions: 'Você é o Nexus Arquiteto. Especialista em escalabilidade e design de sistemas. Sua função é ajudar clientes que pedem consultoria sobre como crescer o produto deles tecnicamente, sugerindo tecnologias e padrões de projeto (SOLID, Clean Arch).'
    }
  ]

  for (const bot of bots) {
    await prisma.user.upsert({
      where: { email: bot.email },
      update: {
        isAI: true,
        aiApiKey: apiKey,
        aiModel: model,
        aiInstructions: bot.instructions,
        approved: true,
        role: 'AGENT'
      },
      create: {
        name: bot.name,
        email: bot.email,
        password: password,
        isAI: true,
        aiApiKey: apiKey,
        aiModel: model,
        aiInstructions: bot.instructions,
        approved: true,
        role: 'AGENT',
        jobTitle: 'Agente de IA'
      }
    })
    console.log(`✅ Agente IA Criado: ${bot.name} (${bot.email})`)
  }

  console.log('\n--- Manutenção de Bots Finalizada ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
