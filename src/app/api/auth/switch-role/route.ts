import { NextResponse } from "next/server"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Não autorizado", { status: 401 })

  try {
    const { targetRole } = await req.json()
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { role: true }
    })

    if (!user) return new NextResponse("Usuário não encontrado", { status: 404 })

    // Validação: Só pode mudar para ADMIN/AGENT se o usuário realmente possuir esse role no banco
    if (targetRole !== "USER" && user.role === "USER") {
      return new NextResponse("Permissão insuficiente", { status: 403 })
    }

    // Nota: No NextAuth v5 (Beta), a atualização da sessão no cliente é feita via update()
    // Esta rota valida a possibilidade e o cliente chama o update.
    return NextResponse.json({ success: true, activeRole: targetRole })
  } catch (error) {
    return new NextResponse("Erro ao trocar papel", { status: 500 })
  }
}
