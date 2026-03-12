import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse("Não autorizado", { status: 401 })
  }

  try {
    const userId = session.user.id
    const user = session.user as any
    const activeRole = user.activeRole || user.role || "USER"

    // 1. Buscar notificações reais do banco
    const dbNotifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20
    })

    // 2. Se for solicitante, buscar chamados concluídos nos últimos 3 dias sem pesquisa
    let dynamicNotifications: any[] = []
    
    if (activeRole === "USER") {
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

      const pendingTickets = await prisma.ticket.findMany({
        where: {
          requesterId: userId,
          status: "COMPLETED",
          updatedAt: { gte: threeDaysAgo },
          survey: null
        },
        select: { id: true, title: true, updatedAt: true }
      })

      dynamicNotifications = pendingTickets.map(t => ({
        id: `pending-survey-${t.id}`,
        userId,
        title: "Pesquisa Pendente",
        message: `Por favor, avalie o atendimento do chamado: ${t.title}`,
        type: "SURVEY",
        read: false,
        link: `/dashboard/tickets/${t.id}?openSurvey=true`,
        createdAt: t.updatedAt
      }))
    }

    // Combinar e ordenar (notificações do banco tem prioridade se forem mais recentes)
    const allNotifications = [...dynamicNotifications, ...dbNotifications]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20)

    return NextResponse.json(allNotifications)
  } catch (error) {
    console.error("[NOTIFICATIONS_GET]", error)
    return new NextResponse("Erro interno", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse("Não autorizado", { status: 401 })
  }

  try {
    const { id } = await req.json()
    
    // Notificações dinâmicas não podem ser marcadas como lidas no banco
    if (id.startsWith("pending-survey-")) return new NextResponse("OK")

    if (id === "all") {
      await prisma.notification.updateMany({
        where: { userId: session.user.id, read: false },
        data: { read: true }
      })
    } else {
      await prisma.notification.update({
        where: { id, userId: session.user.id },
        data: { read: true }
      })
    }

    return new NextResponse("OK")
  } catch (error) {
    return new NextResponse("Erro ao atualizar notificação", { status: 500 })
  }
}
