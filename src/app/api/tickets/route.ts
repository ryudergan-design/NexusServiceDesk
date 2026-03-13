import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { calculateSLA } from "@/lib/sla"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse("Nao autorizado", { status: 401 })
  }

  try {
    const formData = await req.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const categoryId = formData.get("categoryId") as string
    const subcategoryId = formData.get("subcategoryId") as string
    const type = formData.get("type") as string
    const impact = formData.get("impact") as string
    const urgency = formData.get("urgency") as string
    const files = formData.getAll("attachments") as File[]

    if (!title || !description || !categoryId) {
      return new NextResponse("Campos obrigatorios ausentes", { status: 400 })
    }

    let priority = "MEDIUM"
    if (impact === "CRITICAL" || urgency === "CRITICAL") priority = "CRITICAL"
    else if (impact === "HIGH" && urgency === "HIGH") priority = "HIGH"
    else if (impact === "LOW" && urgency === "LOW") priority = "LOW"

    const slaRule = await prisma.sLARule.findUnique({
      where: { priority }
    })

    const now = new Date()
    const responseDue = slaRule ? calculateSLA(now, slaRule.responseTime) : null
    const resolutionDue = slaRule ? calculateSLA(now, slaRule.resolutionTime) : null

    const ticket = await prisma.$transaction(async (tx) => {
      const newTicket = await tx.ticket.create({
        data: {
          title,
          description,
          type,
          categoryId,
          subcategoryId: subcategoryId || null,
          impact,
          urgency,
          priority,
          requesterId: (session.user as any).id!,
          status: "NEW",
          responseTimeDue: responseDue,
          resolutionTimeDue: resolutionDue
        }
      })

      await tx.ticketTransition.create({
        data: {
          ticketId: newTicket.id,
          fromStatus: "NONE",
          toStatus: "NEW",
          performedById: (session.user as any).id!,
          comment: "Abertura automatica pelo sistema."
        }
      })

      if (files.length > 0) {
        for (const file of files) {
          if (file.size === 0) continue
          
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          const base64 = buffer.toString('base64')

          await tx.attachment.create({
            data: {
              filename: file.name,
              content: base64,
              mimeType: file.type,
              size: file.size,
              ticketId: newTicket.id,
              uploadedById: (session.user as any).id!
            }
          })
        }
      }

      return newTicket
    })

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("TICKET_POST", error)
    return new NextResponse("Erro interno", { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await auth()
  const user = session?.user as any
  
  if (!session?.user?.id) {
    return new NextResponse("Nao autorizado", { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const unassigned = searchParams.get("unassigned") === "true"
  const agentId = searchParams.get("agentId")
  
  try {
    const activeRole = user?.activeRole || user?.role
    const isUserMode = activeRole === "USER"
    const view = searchParams.get("view")

    // Lógica de Fila: 
    // 1. Se for modo Cliente -> Vê os que ele abriu (requesterId)
    // 2. Se houver agentId na URL -> Vê a fila daquele atendente específico (supervisão)
    // 3. Se for fila 'unassigned' -> Vê os sem atendente
    // 4. Se houver um view específico (assigned) -> Filtra por user.id
    // 5. Caso contrário (Todos os Chamados) -> Não filtra assigneeId (vê tudo)

    let assigneeFilter: any = undefined
    
    if (!isUserMode) {
      if (unassigned) {
        assigneeFilter = null
      } else if (agentId) {
        assigneeFilter = agentId
      } else if (view === "assigned") {
        assigneeFilter = user.id
      }
      // Se não houver nenhum dos acima, assigneeFilter continua undefined (vê tudo)
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        requesterId: isUserMode ? user.id : undefined,
        status: status || undefined,
        assigneeId: assigneeFilter
      },
      include: {
        category: true,
        requester: {
          select: { name: true, email: true, id: true }
        },
        assignee: {
          select: { name: true, email: true, id: true, isAI: true }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(tickets)
  } catch (error) {
    console.error("TICKETS_GET", error)
    return new NextResponse("Erro interno", { status: 500 })
  }
}
