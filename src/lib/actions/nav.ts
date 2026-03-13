"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function getNavCounts() {
  const session = await auth()
  if (!session?.user?.id) return null

  const userId = (session.user as any).id
  const role = ((session.user as any) as any).role

  const isAgentOrAdmin = role === "ADMIN" || role === "AGENT"

  const [unassigned, assignedToMe, awaitingUser, awaitingApproval, myTickets, myAwaitingApproval, myAwaitingResponse] = await Promise.all([
    // Chamados sem atendente (Apenas para staff)
    isAgentOrAdmin ? prisma.ticket.count({
      where: { assigneeId: null, status: { not: "COMPLETED" } }
    }) : 0,

    // AtribuÃ­dos a mim (Apenas para staff)
    isAgentOrAdmin ? prisma.ticket.count({
      where: { assigneeId: userId, status: { not: "COMPLETED" } }
    }) : 0,

    // Aguardando Cliente (Apenas para staff)
    isAgentOrAdmin ? prisma.ticket.count({
      where: { status: "PENDING_USER" }
    }) : 0,

    // OrÃ§amento / AprovaÃ§Ã£o (Apenas para staff)
    isAgentOrAdmin ? prisma.ticket.count({
      where: { status: "BUDGET_APPROVAL" }
    }) : 0,

    // Criados por mim (Minhas SolicitaÃ§Ãµes - Para todos)
    prisma.ticket.count({
      where: { requesterId: userId, status: { not: "COMPLETED" } }
    }),

    // Minhas AprovaÃ§Ãµes Pendentes (Para cliente)
    prisma.ticket.count({
      where: { requesterId: userId, status: "BUDGET_APPROVAL" }
    }),

    // Minhas Respostas Pendentes (Para cliente)
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
