import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

const ticketDetailsInclude = {
  category: true,
  requester: true,
  assignee: true,
  attachments: true,
  survey: true,
  transitions: { include: { performedBy: true }, orderBy: { createdAt: "desc" as const } },
  comments: { include: { author: true }, orderBy: { createdAt: "desc" as const } }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  try {
    const { id } = await params
    const ticketId = parseInt(id)
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: ticketDetailsInclude
    })

    if (!ticket) return NextResponse.json({ error: "Não encontrado" }, { status: 404 })
    return NextResponse.json(ticket)
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  try {
    const { id } = await params
    const ticketId = parseInt(id)
    const body = await req.json()
    const user = session.user as any

    const {
      status,
      assigneeId,
      budgetAmount,
      budgetDescription,
      comment,
      plannedStartDate,
      plannedDueDate
    } = body

    const currentTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { status: true, assigneeId: true }
    })

    if (!currentTicket) {
      return NextResponse.json({ error: "Não encontrado" }, { status: 404 })
    }

    const data: any = {}
    if (status !== undefined) data.status = status
    if (assigneeId !== undefined) data.assigneeId = assigneeId
    if (budgetDescription !== undefined) data.budgetDescription = budgetDescription
    if (budgetAmount !== undefined) data.budgetAmount = budgetAmount ? parseFloat(budgetAmount) : null

    if (plannedStartDate !== undefined) {
      data.plannedStartDate = plannedStartDate ? new Date(plannedStartDate) : null
    }

    if (plannedDueDate !== undefined) {
      const dueDate = plannedDueDate ? new Date(plannedDueDate) : null
      data.plannedDueDate = dueDate
      if (dueDate) data.resolutionTimeDue = dueDate
    }

    await prisma.$transaction(async (tx) => {
      await tx.ticket.update({
        where: { id: ticketId },
        data,
      })

      if (assigneeId !== undefined && assigneeId !== currentTicket.assigneeId) {
        const assignee = assigneeId
          ? await tx.user.findUnique({
              where: { id: assigneeId },
              select: { name: true },
            })
          : null

        await tx.ticketComment.create({
          data: {
            ticketId,
            authorId: user.id,
            isInternal: true,
            isPrivate: true,
            content: comment || `Encaminhado para ${assignee?.name || "fila geral"}.`,
          },
        })
      }

      if (status !== undefined && status !== currentTicket.status) {
        await tx.ticketTransition.create({
          data: {
            ticketId,
            fromStatus: currentTicket.status,
            toStatus: status,
            comment: comment || null,
            performedById: user.id,
          },
        })
      }
    })

    const updated = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: ticketDetailsInclude
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    const errorMsg = error.message || "Erro desconhecido no banco de dados"
    console.error("[CRITICAL_PATCH_ERROR]", errorMsg)

    return NextResponse.json({
      error: "Falha na gravação SQL",
      details: errorMsg,
      code: error.code || "UNKNOWN"
    }, { status: 500 })
  }
}
