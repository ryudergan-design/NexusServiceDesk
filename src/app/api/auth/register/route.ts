import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, department, jobTitle, phone } = body

    if (!email || !password || !name) {
      return new NextResponse("Campos obrigatórios ausentes", { status: 400 })
    }

    const exists = await prisma.user.findUnique({
      where: { email }
    })

    if (exists) {
      return new NextResponse("E-mail já cadastrado", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        department,
        jobTitle,
        phone,
        role: "USER",
        approved: false // Requer aprovação do Admin conforme CONTEXT.md
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("REGISTER_ERROR", error)
    return new NextResponse("Erro interno", { status: 500 })
  }
}
