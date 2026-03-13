"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

export async function getUsers() {
  const session = await auth()
  const user = session?.user as any
  const activeRole = user?.activeRole || user?.role
  
  if (!session || (activeRole !== "ADMIN" && activeRole !== "AGENT")) {
    throw new Error("Acesso negado. Certifique-se de ter logado no modo 'Atendente'.")
  }

  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      approved: true,
      department: true,
      jobTitle: true,
      phone: true,
      createdAt: true,
      isAI: true,
      aiApiKey: true,
      aiModel: true,
      aiInstructions: true
    }
  })
}

export async function createUser(data: { 
  name: string, 
  email: string, 
  role: string, 
  department?: string, 
  jobTitle?: string,
  phone?: string,
  isAI?: boolean,
  aiApiKey?: string,
  aiModel?: string,
  aiInstructions?: string
}) {
  const session = await auth()
  const user = session?.user as any
  const activeRole = user?.activeRole || user?.role
  
  if (!session || (activeRole !== "ADMIN" && activeRole !== "AGENT")) {
    throw new Error("Não autorizado")
  }

  // Senha padrão inicial (pode ser alterada pelo usuário no perfil)
  const defaultPassword = "I9User123!"
  const hashedPassword = await bcrypt.hash(defaultPassword, 10)

  const newUser = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      approved: true // Usuários criados manualmente já nascem aprovados
    }
  })

  revalidatePath("/dashboard/admin/users")
  return newUser
}

export async function updateUser(userId: string, data: { 
  name?: string, 
  role?: string, 
  department?: string, 
  jobTitle?: string,
  phone?: string,
  approved?: boolean,
  isAI?: boolean,
  aiApiKey?: string,
  aiModel?: string,
  aiInstructions?: string
}) {
  const session = await auth()
  const user = session?.user as any
  const activeRole = user?.activeRole || user?.role
  
  if (!session || (activeRole !== "ADMIN" && activeRole !== "AGENT")) {
    throw new Error("Não autorizado")
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data
  })

  // Registrar no log de auditoria
  await prisma.auditLog.create({
    data: {
      action: "UPDATE",
      entity: "User",
      entityId: userId,
      userId: (session.user as any).id!,
      payload: JSON.stringify(data)
    }
  })

  revalidatePath("/dashboard/admin/users")
  return updatedUser
}

export async function updateUserStatus(userId: string, data: { approved?: boolean, role?: string }) {
  return await updateUser(userId, data)
}

export async function updateProfile(data: { name?: string, phone?: string, department?: string, jobTitle?: string }) {
  const session = await auth()
  const user = session?.user as any
  const activeRole = user?.activeRole || "USER"

  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  // Solicitante não pode alterar o cadastro
  if (activeRole === "USER") {
    throw new Error("Solicitantes não possuem permissão para alterar dados cadastrais.")
  }

  const updatedUser = await prisma.user.update({
    where: { id: (session.user as any).id },
    data
  })

  revalidatePath("/dashboard/profile")
  revalidatePath("/dashboard")
  return updatedUser
}

export async function updateAIPreference(enabled: boolean) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  const updatedUser = await prisma.user.update({
    where: { id: (session.user as any).id },
    data: { aiEnabled: enabled }
  })

  // Registrar no log de auditoria para fins de rastreabilidade
  await prisma.auditLog.create({
    data: {
      action: "UPDATE_AI_PREFERENCE",
      entity: "User",
      entityId: (session.user as any).id,
      userId: (session.user as any).id,
      payload: JSON.stringify({ aiEnabled: enabled })
    }
  })

  revalidatePath("/dashboard/profile")
  return updatedUser
}
