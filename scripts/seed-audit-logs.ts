import { PrismaClient } from "../src/generated/client"

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  const tickets = await prisma.ticket.findMany()

  if (users.length === 0 || tickets.length === 0) {
    console.log("Crie usuários e tickets primeiro.")
    return
  }

  const actions = ["CREATE", "UPDATE", "UPDATE_STATUS"]
  const entities = ["Ticket", "User"]

  for (let i = 0; i < 10; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const ticket = tickets[Math.floor(Math.random() * tickets.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]

    await prisma.auditLog.create({
      data: {
        action,
        entity: "Ticket",
        entityId: ticket.id,
        userId: user.id,
        createdAt: new Date(Date.now() - i * 1000 * 60 * 60) // Logs em diferentes horas
      }
    })
  }

  console.log("✅ Logs de auditoria gerados.")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
