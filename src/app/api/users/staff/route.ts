import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Não autorizado", { status: 401 })

  try {
    const staff = await prisma.user.findMany({
      where: {
        role: { in: ["ADMIN", "AGENT"] },
        approved: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      },
      orderBy: { name: "asc" }
    })

    return NextResponse.json(staff)
  } catch (error) {
    return new NextResponse("Erro ao buscar atendentes", { status: 500 })
  }
}
