import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET() {
  const session = await auth()
  
  if (!session) {
    return new NextResponse("Não autorizado", { status: 401 })
  }

  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true
      },
      orderBy: {
        name: "asc"
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("CATEGORIES_GET", error)
    return new NextResponse("Erro interno", { status: 500 })
  }
}
