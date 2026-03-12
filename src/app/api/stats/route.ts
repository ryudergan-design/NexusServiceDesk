import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { startOfDay, endOfDay, subDays } from "date-fns"

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return new NextResponse("Não autorizado", { status: 401 })

  try {
    const now = new Date()
    const todayStart = startOfDay(now)
    const sevenDaysAgo = subDays(now, 7)

    // 1. Contagem por Status
    const statusCounts = await prisma.ticket.groupBy({
      by: ["status"],
      _count: true
    })

    // 2. Contagem por Prioridade
    const priorityCounts = await prisma.ticket.groupBy({
      by: ["priority"],
      _count: true
    })

    // 3. Saúde do SLA (Simulado baseado nos campos due)
    const slaCompliance = await prisma.ticket.count({
      where: {
        resolutionTimeDue: { gte: now },
        status: { not: "COMPLETED" }
      }
    })
    
    const slaBreached = await prisma.ticket.count({
      where: {
        resolutionTimeDue: { lt: now },
        status: { not: "COMPLETED" }
      }
    })

    // 4. Tendência (Últimos 7 dias)
    const ticketsLast7Days = await prisma.ticket.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true }
    })

    return NextResponse.json({
      statusCounts,
      priorityCounts,
      sla: {
        compliant: slaCompliance,
        breached: slaBreached
      },
      totalActive: statusCounts.filter(s => s.status !== "COMPLETED").reduce((acc, curr) => acc + curr._count, 0)
    })
  } catch (error) {
    console.error("STATS_GET", error)
    return new NextResponse("Erro interno", { status: 500 })
  }
}
