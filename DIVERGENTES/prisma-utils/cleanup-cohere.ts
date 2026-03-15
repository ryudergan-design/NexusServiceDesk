import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Removendo Bot Cohere e Mantendo 5 Bots Oficiais ---')
  
  // E-mail do bot Cohere
  const cohereEmail = 'cohere-bot@nexus.ai'

  try {
    // Tenta deletar
    await prisma.user.delete({
      where: { email: cohereEmail }
    })
    console.log('🗑️ Bot Cohere removido com sucesso.')
  } catch (e) {
    // Se tiver vínculos, apenas desativa
    await prisma.user.update({
      where: { email: cohereEmail },
      data: { isAI: false, approved: false, name: '[INATIVO] Cohere Bot' }
    })
    console.log('⚠️ Bot Cohere arquivado (possuía vínculos).')
  }

  console.log('\n--- Sistema Limpo: 5 Bots Ativos (Groq & Gemini) ---')
}

main().finally(() => prisma.$disconnect())
