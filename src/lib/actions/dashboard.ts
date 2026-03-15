"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { CLOSED_TICKET_STATUSES } from "@/lib/ticket-status"

export async function getDashboardStats() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Nao autorizado")
  }

  const user = session.user as any
  const activeRole = user.activeRole || user.role
  const userId = user.id

  if (activeRole === "USER") {
    const [total, awaitingApproval, awaitingResponse, closed] = await Promise.all([
      prisma.ticket.count({ where: { requesterId: userId } }),
      prisma.ticket.count({ where: { requesterId: userId, status: "AWAITING_APPROVAL" } }),
      prisma.ticket.count({ where: { requesterId: userId, status: "PENDING_USER" } }),
      prisma.ticket.count({ where: { requesterId: userId, status: { in: [...CLOSED_TICKET_STATUSES] } } }),
    ])

    return {
      total,
      awaitingApproval,
      awaitingResponse,
      closed,
      isStaff: false,
    }
  }

  const last7Days = new Date()
  last7Days.setDate(last7Days.getDate() - 7)

  const [total, open, closed, users, aiAgents, aiTicketsActive, aiLogs7d, aiTicketsWithPlanning, categories, aiAgentUsage] =
    await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.count({
        where: {
          status: { in: ["NEW", "TRIAGE", "DEVELOPMENT", "TEST", "PENDING_USER", "AWAITING_APPROVAL"] },
        },
      }),
      prisma.ticket.count({ where: { status: { in: [...CLOSED_TICKET_STATUSES] } } }),
      prisma.user.count({ where: { approved: true } }),
      prisma.user.count({ where: { approved: true, isAI: true, aiEnabled: true } }),
      prisma.ticket.count({
        where: {
          assignee: { isAI: true },
          status: { in: ["TRIAGE", "DEVELOPMENT", "TEST", "PENDING_USER", "AWAITING_APPROVAL"] },
        },
      }),
      prisma.aILog.count({
        where: {
          createdAt: { gte: last7Days },
          ticketId: { not: null },
        },
      }),
      prisma.ticket.count({
        where: {
          assignee: { isAI: true },
          plannedStartDate: { not: null },
          plannedDueDate: { not: null },
        },
      }),
      prisma.category.findMany({
        include: {
          _count: {
            select: { tickets: true },
          },
        },
      }),
      prisma.aILog.groupBy({
        by: ["agentName"],
        _count: { _all: true },
        where: {
          createdAt: { gte: last7Days },
          ticketId: { not: null },
        },
        orderBy: {
          _count: {
            agentName: "desc",
          },
        },
        take: 3,
      }),
    ])

  return {
    total,
    open,
    closed,
    users,
    categoryStats: categories.map((cat) => ({
      name: cat.name,
      value: cat._count.tickets,
    })),
    aiOverview: {
      agents: aiAgents,
      activeTickets: aiTicketsActive,
      logsLast7Days: aiLogs7d,
      ticketsWithPlanning: aiTicketsWithPlanning,
      topAgents: aiAgentUsage.map((item) => ({
        name: item.agentName,
        count: item._count._all,
      })),
    },
    isStaff: true,
  }
}
