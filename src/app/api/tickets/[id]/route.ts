import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { calculateSLA, calculateBusinessMinutes } from "@/lib/sla"
import { differenceInMinutes } from "date-fns"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Não autorizado", { status: 401 })

  try {
    const { id } = await params
    const ticketId = parseInt(id)
    
    if (isNaN(ticketId)) {
      return new NextResponse("ID Inválido", { status: 400 })
    }

    const user = session.user as any
    const activeRole = user.activeRole || user.role || "USER"
    
    // Buscar o chamado primeiro para validar acesso
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        category: true,
        requester: true,
        assignee: true,
        attachments: true,
        survey: true,
        transitions: {
          include: { performedBy: true },
          orderBy: { createdAt: "desc" }
        },
        comments: {
          where: activeRole === "USER" ? { isInternal: false } : {},
          include: { author: true },
          orderBy: { createdAt: "desc" }
        }
      }
    })

    if (!ticket) return new NextResponse("Chamado não encontrado", { status: 404 })

    // Segurança: Solicitante só vê o dele
    if (activeRole === "USER" && ticket.requesterId !== user.id) {
      return new NextResponse("Acesso negado a este chamado", { status: 403 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("[TICKET_GET_ERROR]", error)
    return new NextResponse("Erro interno ao carregar chamado", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Não autorizado", { status: 401 })

  try {
    const { id } = await params
    const ticketId = parseInt(id)

    if (isNaN(ticketId)) {
      return new NextResponse("ID Inválido", { status: 400 })
    }

    const body = await req.json()
    const { status, assigneeId, comment, isInternal, timeSpent, budgetAmount, budgetDescription, rating, feedback } = body

    const currentTicket = await prisma.ticket.findUnique({
      where: { id: ticketId }
    })

    if (!currentTicket) return new NextResponse("Não encontrado", { status: 404 })

    const updatedTicket = await prisma.$transaction(async (tx) => {
      let slaData: any = {}
      const now = new Date()

      const isPauseStatus = (s: string) => s === "PENDING_USER" || s === "AWAITING_APPROVAL"

      if (status && status !== currentTicket.status) {
        if (isPauseStatus(status)) {
          slaData = {
            slaPaused: true,
            lastSlaPauseAt: now
          }
        } 
        else if (isPauseStatus(currentTicket.status)) {
          const pauseStart = currentTicket.lastSlaPauseAt || currentTicket.updatedAt
          const realPausedMinutes = differenceInMinutes(now, pauseStart)
          const businessPausedMinutes = calculateBusinessMinutes(pauseStart, now)
          
          slaData = {
            slaPaused: false,
            totalPausedTime: currentTicket.totalPausedTime + realPausedMinutes,
            lastSlaPauseAt: null,
            responseTimeDue: currentTicket.responseTimeDue 
              ? calculateSLA(currentTicket.responseTimeDue, businessPausedMinutes) 
              : null,
            resolutionTimeDue: currentTicket.resolutionTimeDue 
              ? calculateSLA(currentTicket.resolutionTimeDue, businessPausedMinutes) 
              : null
          }
        }
      }

      // 1. Atualizar o Ticket
      const ticket = await tx.ticket.update({
        where: { id: ticketId },
        data: {
          status: status || currentTicket.status,
          assigneeId: assigneeId !== undefined ? assigneeId : currentTicket.assigneeId,
          budgetAmount: budgetAmount !== undefined ? parseFloat(budgetAmount) : currentTicket.budgetAmount,
          budgetDescription: budgetDescription !== undefined ? budgetDescription : currentTicket.budgetDescription,
          ...slaData
        }
      })

      // 2. Se houver avaliação (rating), gravar na nova tabela SatisfactionSurvey
      if (rating !== undefined) {
        await tx.satisfactionSurvey.upsert({
          where: { ticketId: ticketId },
          update: { rating, feedback },
          create: {
            rating,
            feedback,
            ticketId: ticketId,
            userId: session.user.id!
          }
        })
      }

      // 3. Se for reabertura (Saindo de COMPLETED para TRIAGE), remover a pesquisa
      if (currentTicket.status === "COMPLETED" && status === "TRIAGE") {
        await tx.satisfactionSurvey.deleteMany({
          where: { ticketId: ticketId }
        })
      }

      // 4. Se mudar status para COMPLETED, criar notificação de pesquisa para o solicitante
      if (status === "COMPLETED" && currentTicket.status !== "COMPLETED") {
        await tx.notification.create({
          data: {
            userId: currentTicket.requesterId,
            title: "Chamado Concluído",
            message: `O chamado #${ticketId} foi concluído. Avalie o atendimento!`,
            type: "SURVEY",
            link: `/dashboard/tickets/${ticketId}?openSurvey=true`
          }
        })
      }

      // 5. Registrar a transição
      if (status && status !== currentTicket.status) {
        await tx.ticketTransition.create({
          data: {
            ticketId: ticketId,
            fromStatus: currentTicket.status,
            toStatus: status,
            performedById: session.user.id!,
            comment: comment || `Status alterado de ${currentTicket.status} para ${status}.`
          }
        })

        if (comment) {
          await tx.ticketComment.create({
            data: {
              content: comment,
              isInternal: !!isInternal,
              isPrivate: !!isInternal,
              timeSpent: parseInt(timeSpent) || 0,
              ticketId: ticketId,
              authorId: session.user.id!
            }
          })
        }
      }

      return ticket
    })

    return NextResponse.json(updatedTicket)
  } catch (error) {
    console.error("[TICKET_PATCH]", error)
    return new NextResponse("Erro interno", { status: 500 })
  }
}
