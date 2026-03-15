import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const logs = await prisma.aILog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  })
  
  console.log('--- Últimos 5 Logs de IA ---')
  console.table(logs)
}

main().finally(() => prisma.$disconnect())
