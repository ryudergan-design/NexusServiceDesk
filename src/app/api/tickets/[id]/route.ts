import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

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
      include: {
        category: true,
        requester: true,
        assignee: true,
        attachments: true,
        survey: true,
        transitions: { include: { performedBy: true }, orderBy: { createdAt: "desc" } },
        comments: { include: { author: true }, orderBy: { createdAt: "desc" } }
      }
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
    
    const { 
      status, assigneeId, budgetAmount, budgetDescription, 
      plannedStartDate, plannedDueDate 
    } = body

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

    // Gravação direta com inclusão de relações para o frontend
    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data,
      include: {
        category: true,
        requester: true,
        assignee: true,
        attachments: true,
        survey: true,
        transitions: { include: { performedBy: true }, orderBy: { createdAt: "desc" } },
        comments: { include: { author: true }, orderBy: { createdAt: "desc" } }
      }
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    // Garantir que a mensagem de erro chegue ao frontend
    const errorMsg = error.message || "Erro desconhecido no banco de dados"
    console.error("[CRITICAL_PATCH_ERROR]", errorMsg)
    
    return NextResponse.json({ 
      error: "Falha na Gravação SQL", 
      details: errorMsg,
      code: error.code || "UNKNOWN"
    }, { status: 500 })
  }
}
