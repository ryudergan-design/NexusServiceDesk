import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const bots = await prisma.user.findMany({
    where: { isAI: true },
    select: { id: true, name: true, email: true, aiModel: true, isAI: true }
  })
  
  console.log('--- Bots Ativos no Banco ---')
  console.table(bots)
  
  const allUsers = await prisma.user.count()
  console.log('Total de usuários:', allUsers)
}

main().finally(() => prisma.$disconnect())
