"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function getNavCounts() {
  const session = await auth()
  if (!session?.user?.id) return null

  const userId = session.user.id
  const role = (session.user as any).role

  const isAgentOrAdmin = role === "ADMIN" || role === "AGENT"

  const [unassigned, assignedToMe, awaitingUser, awaitingApproval, myTickets, myAwaitingApproval, myAwaitingResponse] = await Promise.all([
    // Chamados sem atendente (Apenas para staff)
    isAgentOrAdmin ? prisma.ticket.count({
      where: { assigneeId: null, status: { not: "COMPLETED" } }
    }) : 0,

    // Atribuídos a mim (Apenas para staff)
    isAgentOrAdmin ? prisma.ticket.count({
      where: { assigneeId: userId, status: { not: "COMPLETED" } }
    }) : 0,

    // Aguardando Solicitante (Apenas para staff)
    isAgentOrAdmin ? prisma.ticket.count({
      where: { status: "PENDING_USER" }
    }) : 0,

    // Aguardando Aprovação (Apenas para staff)
    isAgentOrAdmin ? prisma.ticket.count({
      where: { status: "AWAITING_APPROVAL" }
    }) : 0,

    // Criados por mim (Minhas Solicitações - Para todos)
    prisma.ticket.count({
      where: { requesterId: userId, status: { not: "COMPLETED" } }
    }),

    // Minhas Aprovações Pendentes (Para solicitante)
    prisma.ticket.count({
      where: { requesterId: userId, status: "AWAITING_APPROVAL" }
    }),

    // Minhas Respostas Pendentes (Para solicitante)
    prisma.ticket.count({
      where: { requesterId: userId, status: "PENDING_USER" }
    })
  ])

  return {
    unassigned,
    assignedToMe,
    awaitingUser,
    awaitingApproval,
    myTickets,
    myAwaitingApproval,
    myAwaitingResponse
  }
}
