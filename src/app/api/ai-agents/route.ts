import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse("Não autorizado", { status: 401 })
  }

  try {
    const agents = await prisma.user.findMany({
      where: {
        isAI: true,
        role: "AGENT",
        approved: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        aiModel: true
      }
    })

    return NextResponse.json(agents)
  } catch (error) {
    console.error("AI_AGENTS_GET", error)
    return new NextResponse("Erro interno", { status: 500 })
  }
}
