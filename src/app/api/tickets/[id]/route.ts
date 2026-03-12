import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { calculateSLA, calculateBusinessMinutes } from "@/lib/sla"
import { differenceInMinutes } from "date-fns"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) return new NextResponse("Não autorizado", { status: 401 })

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        requester: true,
        assignee: true,
        attachments: true,
        transitions: {
          include: { performedBy: true },
          orderBy: { createdAt: "desc" }
        },
        comments: {
          include: { author: true },
          orderBy: { createdAt: "desc" }
        }
      }
    })

    if (!ticket) return new NextResponse("Não encontrado", { status: 404 })

    return NextResponse.json(ticket)
  } catch (error) {
    return new NextResponse("Erro interno", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Não autorizado", { status: 401 })

  try {
    const body = await req.json()
    const { status, assigneeId, comment } = body

    const currentTicket = await prisma.ticket.findUnique({
      where: { id: params.id }
    })

    if (!currentTicket) return new NextResponse("Não encontrado", { status: 404 })

    const updatedTicket = await prisma.$transaction(async (tx) => {
      let slaData: any = {}
      const now = new Date()

      // Lógica de Pausa de SLA (Pendente Usuário)
      if (status && status !== currentTicket.status) {
        // Entrando em PENDENTE USUÁRIO
        if (status === "PENDING_USER") {
          slaData = {
            slaPaused: true,
            lastSlaPauseAt: now
          }
        } 
        // Saindo de PENDENTE USUÁRIO
        else if (currentTicket.status === "PENDING_USER") {
          const pauseStart = currentTicket.lastSlaPauseAt || currentTicket.updatedAt
          const realPausedMinutes = differenceInMinutes(now, pauseStart)
          const businessPausedMinutes = calculateBusinessMinutes(pauseStart, now)
          
          slaData = {
            slaPaused: false,
            totalPausedTime: currentTicket.totalPausedTime + realPausedMinutes,
            lastSlaPauseAt: null,
            // Adiciona os minutos de horário comercial ao prazo original
            responseTimeDue: currentTicket.responseTimeDue 
              ? calculateSLA(currentTicket.responseTimeDue, businessPausedMinutes) 
              : null,
            resolutionTimeDue: currentTicket.resolutionTimeDue 
              ? calculateSLA(currentTicket.resolutionTimeDue, businessPausedMinutes) 
              : null
          }
        }
      }

      const ticket = await tx.ticket.update({
        where: { id: params.id },
        data: {
          status: status || currentTicket.status,
          assigneeId: assigneeId || currentTicket.assigneeId,
          ...slaData
        }
      })

      if (status && status !== currentTicket.status) {
        await tx.ticketTransition.create({
          data: {
            ticketId: params.id,
            fromStatus: currentTicket.status,
            toStatus: status,
            performedById: session.user.id!,
            comment: comment || `Status alterado de ${currentTicket.status} para ${status}.`
          }
        })
      }

      return ticket
    })

    return NextResponse.json(updatedTicket)
  } catch (error) {
    console.error("[TICKET_PATCH]", error)
    return new NextResponse("Erro interno", { status: 500 })
  }
}
