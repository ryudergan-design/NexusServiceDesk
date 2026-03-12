import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    console.error("[TICKET_COMMENT_POST] Sessão inválida ou sem ID de usuário")
    return new NextResponse("Não autorizado", { status: 401 })
  }

  try {
    const { id } = await params
    const ticketId = parseInt(id)

    if (isNaN(ticketId)) {
      return new NextResponse("ID Inválido", { status: 400 })
    }

    console.log("[TICKET_COMMENT_POST] Iniciando registro para ticket:", ticketId)

    const body = await req.json()
    const { content, isInternal, timeSpent } = body
    console.log("[TICKET_COMMENT_POST] Body recebido:", { content: content?.substring(0, 20), isInternal, timeSpent })

    if (!content) {
      return new NextResponse("O conteúdo do comentário é obrigatório.", { status: 400 })
    }

    const userRole = (session.user as any).role || "USER"
    const isInternalNote = userRole === "USER" ? false : !!isInternal

    const comment = await prisma.$transaction(async (tx) => {
      // 1. Criar o comentário
      const newComment = await tx.ticketComment.create({
        data: {
          content,
          isInternal: isInternalNote,
          isPrivate: isInternalNote,
          timeSpent: parseInt(timeSpent) || 0,
          ticketId: ticketId,
          authorId: session.user.id!
        },
        include: { author: true }
      })

      // 2. Lógica de Auto-Retorno (Softdesk Workflow)
      const ticket = await tx.ticket.findUnique({
        where: { id: ticketId },
        select: { status: true, requesterId: true }
      })

      if (ticket?.status === "PENDING_USER" && session.user.id === ticket.requesterId) {
        // Se o solicitante respondeu, volta para TRIAGE automaticamente
        await tx.ticket.update({
          where: { id: ticketId },
          data: { status: "TRIAGE" }
        })

        // Registrar transição automática
        await tx.ticketTransition.create({
          data: {
            ticketId: ticketId,
            fromStatus: "PENDING_USER",
            toStatus: "TRIAGE",
            performedById: session.user.id!,
            comment: "Retorno automático após resposta do solicitante."
          }
        })
      }

      return newComment
    })

    console.log("[TICKET_COMMENT_POST] Comentário e possível auto-retorno concluídos:", comment.id)
    return NextResponse.json(comment)
  } catch (error: any) {
    console.error("[TICKET_COMMENT_POST] Erro Fatal:", error)
    return new NextResponse(`Erro interno: ${error.message}`, { status: 500 })
  }
}
