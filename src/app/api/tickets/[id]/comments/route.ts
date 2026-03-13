import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { assignToAIAgent } from "@/lib/actions/ai"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse("Não autorizado", { status: 401 })
  }

  try {
    const { id } = await params
    const ticketId = parseInt(id)
    const body = await req.json()
    const { content, isInternal, timeSpent } = body

    const user = session.user as any
    const isClient = user.role === "USER"

    const comment = await prisma.$transaction(async (tx) => {
      const newComment = await tx.ticketComment.create({
        data: {
          content,
          isInternal: isClient ? false : !!isInternal,
          isPrivate: isClient ? false : !!isInternal,
          timeSpent: parseInt(timeSpent) || 0,
          ticketId,
          authorId: user.id
        },
        include: { author: true }
      })

      // Auto-retorno para TRIAGE se o cliente respondeu
      const ticket = await tx.ticket.findUnique({
        where: { id: ticketId },
        select: { status: true, requesterId: true, assigneeId: true }
      })

      if (ticket?.status === "PENDING_USER" && user.id === ticket.requesterId) {
        await tx.ticket.update({ where: { id: ticketId }, data: { status: "TRIAGE" } })
        await tx.ticketTransition.create({
          data: {
            ticketId,
            fromStatus: "PENDING_USER",
            toStatus: "TRIAGE",
            performedById: user.id,
            comment: "Retorno automático após resposta do cliente."
          }
        })
      }

      return { newComment, assigneeId: ticket?.assigneeId }
    })

    // --- DINÂMICA DE IA: Se o chamado está com um robô e houve nova atividade (não vinda dele mesmo) ---
    if (comment.assigneeId && user.id !== comment.assigneeId) {
      const bot = await prisma.user.findUnique({ where: { id: comment.assigneeId } })
      if (bot?.isAI) {
        // Dispara a IA em background
        console.log(`[AUTO_IA] Acordando ${bot.name} para o ticket #${ticketId}`);
        assignToAIAgent(ticketId, bot.id).catch(err => console.error("Erro Auto-IA:", err))
      }
    }

    return NextResponse.json(comment.newComment)
  } catch (error: any) {
    return new NextResponse(`Erro interno: ${error.message}`, { status: 500 })
  }
}
