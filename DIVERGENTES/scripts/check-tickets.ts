import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const count = await prisma.ticket.count()
  console.log("Total no banco: " + count)
  const last = await prisma.ticket.findMany({ take: 5, orderBy: { createdAt: 'desc' } })
  console.table(last.map(t => ({ id: t.id, title: t.title, status: t.status })))
}
main().finally(() => prisma.$disconnect())
