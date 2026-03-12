import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  if (!session || (session.user as any).role === "USER") {
    return new NextResponse("Não autorizado", { status: 401 })
  }

  try {
    const logs = await prisma.auditLog.findMany({
      include: {
        user: {
          select: { name: true }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 20
    })

    return NextResponse.json(logs)
  } catch (error) {
    return new NextResponse("Erro interno", { status: 500 })
  }
}
