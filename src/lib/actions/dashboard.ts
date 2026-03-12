"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function getDashboardStats() {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  const user = session.user as any
  const activeRole = user.activeRole || user.role
  const userId = user.id

  if (activeRole === "USER") {
    // Stats específicas para Solicitante
    const [total, awaitingApproval, awaitingResponse, closed] = await Promise.all([
      prisma.ticket.count({ where: { requesterId: userId } }),
      prisma.ticket.count({ where: { requesterId: userId, status: "AWAITING_APPROVAL" } }),
      prisma.ticket.count({ where: { requesterId: userId, status: "PENDING_USER" } }),
      prisma.ticket.count({ where: { requesterId: userId, status: "COMPLETED" } })
    ])

    return {
      total,
      awaitingApproval,
      awaitingResponse,
      closed,
      isStaff: false
    }
  } else {
    // Stats para Staff (Admin/Agent)
    const [total, open, closed, users] = await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: { in: ["NEW", "TRIAGE", "DEVELOPMENT", "TEST", "PENDING_USER", "AWAITING_APPROVAL"] } } }),
      prisma.ticket.count({ where: { status: "COMPLETED" } }),
      prisma.user.count({ where: { approved: true } })
    ])

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { tickets: true }
        }
      }
    })

    return {
      total,
      open,
      closed,
      users,
      categoryStats: categories.map(cat => ({
        name: cat.name,
        value: cat._count.tickets
      })),
      isStaff: true
    }
  }
}
