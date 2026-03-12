import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { calculateSLA } from "@/lib/sla"

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse("Não autorizado", { status: 401 })
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
      return new NextResponse("Campos obrigatórios ausentes", { status: 400 })
    }

    // Lógica ITIL simplificada de prioridade
    let priority = "MEDIUM"
    if (impact === "CRITICAL" || urgency === "CRITICAL") priority = "CRITICAL"
    else if (impact === "HIGH" && urgency === "HIGH") priority = "HIGH"
    else if (impact === "LOW" && urgency === "LOW") priority = "LOW"

    // Buscar regras de SLA no banco
    const slaRule = await prisma.sLARule.findUnique({
      where: { priority }
    })

    const now = new Date()
    const responseDue = slaRule ? calculateSLA(now, slaRule.responseTime) : null
    const resolutionDue = slaRule ? calculateSLA(now, slaRule.resolutionTime) : null

    const ticket = await prisma.$transaction(async (tx) => {
      // 1. Criar o Ticket
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
          requesterId: session.user.id!,
          status: "NEW",
          responseTimeDue: responseDue,
          resolutionTimeDue: resolutionDue
        }
      })

      // 2. Registrar Transição Inicial (Audit Trail)
      await tx.ticketTransition.create({
        data: {
          ticketId: newTicket.id,
          fromStatus: "NONE",
          toStatus: "NEW",
          performedById: session.user.id!,
          comment: "Abertura automática pelo sistema."
        }
      })

      // 3. Processar Anexos (Local Storage)
      if (files.length > 0) {
        const uploadDir = path.join(process.cwd(), "public", "uploads", newTicket.id)
        await mkdir(uploadDir, { recursive: true })

        for (const file of files) {
          if (file.size === 0) continue
          
          const bytes = await file.arrayBuffer()
          const buffer = Buffer.from(bytes)
          const filePath = path.join(uploadDir, file.name)
          
          await writeFile(filePath, buffer)

          await tx.attachment.create({
            data: {
              filename: file.name,
              fileUrl: `/uploads/${newTicket.id}/${file.name}`,
              mimeType: file.type,
              size: file.size,
              ticketId: newTicket.id,
              uploadedById: session.user.id!
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
  
  if (!session?.user?.id) {
    return new NextResponse("Não autorizado", { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        // Se não for ADMIN/AGENT, vê apenas os próprios
        requesterId: (session.user as any).role === "USER" ? session.user.id : undefined,
        status: status || undefined
      },
      include: {
        category: true,
        requester: {
          select: { name: true, email: true }
        },
        assignee: {
          select: { name: true, email: true }
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
