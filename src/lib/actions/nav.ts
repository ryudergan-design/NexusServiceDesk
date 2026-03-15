"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { CLOSED_TICKET_STATUSES } from "@/lib/ticket-status"

export async function getNavCounts() {
  const session = await auth()
  if (!session?.user?.id) return null

  const userId = (session.user as any).id
  const role = ((session.user as any) as any).role
  const isAgentOrAdmin = role === "ADMIN" || role === "AGENT"

  const openStatusFilter = { notIn: [...CLOSED_TICKET_STATUSES] }

  const [unassigned, assignedToMe, awaitingUser, awaitingApproval, myTickets, myAwaitingApproval, myAwaitingResponse] = await Promise.all([
    isAgentOrAdmin
      ? prisma.ticket.count({
          where: { assigneeId: null, status: openStatusFilter },
        })
      : 0,

    isAgentOrAdmin
      ? prisma.ticket.count({
          where: { assigneeId: userId, status: openStatusFilter },
        })
      : 0,

    isAgentOrAdmin
      ? prisma.ticket.count({
          where: { status: "PENDING_USER" },
        })
      : 0,

    isAgentOrAdmin
      ? prisma.ticket.count({
          where: { status: "AWAITING_APPROVAL" },
        })
      : 0,

    prisma.ticket.count({
      where: { requesterId: userId, status: openStatusFilter },
    }),

    prisma.ticket.count({
      where: { requesterId: userId, status: "AWAITING_APPROVAL" },
    }),

    prisma.ticket.count({
      where: { requesterId: userId, status: "PENDING_USER" },
    }),
  ])

  return {
    unassigned,
    assignedToMe,
    awaitingUser,
    awaitingApproval,
    myTickets,
    myAwaitingApproval,
    myAwaitingResponse,
  }
}
