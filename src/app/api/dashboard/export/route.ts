import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  if (!session || (session.user as any).role === "USER") {
    return new NextResponse("Não autorizado", { status: 401 })
  }

  try {
    // Buscar tickets com informações relevantes
    const tickets = await prisma.ticket.findMany({
      include: {
        category: true,
        requester: { select: { name: true } },
        assignee: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" }
    })

    // Cabeçalho do CSV
    const header = "ID,Titulo,Status,Prioridade,Tipo,Categoria,Solicitante,Atendente,Data Criacao,Vencimento Resolucao\n"
    
    // Linhas do CSV
    const rows = tickets.map(t => {
      const id = t.id.toString()
      const title = t.title.replace(/,/g, " ") // Remover vírgulas para não quebrar CSV
      const status = t.status
      const priority = t.priority
      const type = t.type
      const category = t.category.name
      const requester = t.requester.name
      const assignee = t.assignee?.name || "N/A"
      const createdAt = new Date(t.createdAt).toLocaleString()
      const dueAt = t.resolutionTimeDue ? new Date(t.resolutionTimeDue).toLocaleString() : "N/A"
      
      return `${id},${title},${status},${priority},${type},${category},${requester},${assignee},${createdAt},${dueAt}`
    }).join("\n")

    const csv = header + rows

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=relatorio-chamados-${new Date().toISOString().split('T')[0]}.csv`
      }
    })
  } catch (error) {
    return new NextResponse("Erro ao gerar relatório", { status: 500 })
  }
}
