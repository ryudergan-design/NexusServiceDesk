import path from "path"
import dotenv from "dotenv"

// Carregar explicitamente do diretório raiz
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const adminEmail = "jefrsonsales@outlook.com"
  const hashedPassword = await bcrypt.hash("Fal.990544", 10)

  console.log("🌱 Iniciando Seed...")

  // 1. Criar Administrador
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      name: "Jefrson Sales",
      password: hashedPassword,
      role: "ADMIN",
      approved: true,
      department: "TI / Gestão",
      jobTitle: "Administrador do Sistema",
      phone: "(11) 99999-9999"
    },
  })
  console.log(`✅ Administrador criado: ${admin.email}`)

  // 1.1 Criar Usuário Luiz (Admin)
  const luizPassword = await bcrypt.hash("Luiz8521@", 10)
  const luiz = await prisma.user.upsert({
    where: { email: "luizkaz175@gmail.com" },
    update: { password: luizPassword },
    create: {
      email: "luizkaz175@gmail.com",
      name: "Luiz",
      password: luizPassword,
      role: "ADMIN",
      approved: true,
      department: "TI / Suporte",
      jobTitle: "Administrador",
      phone: "(11) 99999-0000"
    },
  })
  console.log(`✅ Luiz criado: ${luiz.email}`)

  // 1.2 Criar Solicitante Padrão
  const requester = await prisma.user.upsert({
    where: { email: "solicitante@outlook.com" },
    update: { password: hashedPassword },
    create: {
      email: "solicitante@outlook.com",
      name: "Solicitante Teste",
      password: hashedPassword,
      role: "USER",
      approved: true,
      department: "Vendas",
      jobTitle: "Consultor",
      phone: "(11) 88888-8888"
    },
  })
  console.log(`✅ Solicitante criado: ${requester.email}`)

  // 2. Criar Categorias e Subcategorias SaaS
  const categories = [
    {
      name: "Suporte Técnico",
      subcategories: ["Erro no Sistema (Bug)", "Dúvida de Uso", "Problema de Acesso"]
    },
    {
      name: "Financeiro / Assinatura",
      subcategories: ["Fatura / Pagamento", "Upgrade de Plano", "Cancelamento"]
    },
    {
      name: "Sugestão de Melhoria",
      subcategories: ["Nova Funcionalidade", "Ajuste de UX", "Integração"]
    },
    {
      name: "Implantação / Onboarding",
      subcategories: ["Configuração Inicial", "Treinamento", "Migração de Dados"]
    }
  ]

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        name: cat.name,
        subcategories: {
          create: cat.subcategories.map(name => ({ name }))
        }
      }
    })
    console.log(`✅ Categoria criada: ${category.name}`)
  }

  // 3. Criar Regras de SLA (Estendidas conforme Discussão)
  const slaRules = [
    { priority: "LOW", responseTime: 24, resolutionTime: 120 },      // 24h Resposta / 5 dias Resolução
    { priority: "MEDIUM", responseTime: 8, resolutionTime: 48 },     // 8h Resposta / 48h Resolução
    { priority: "HIGH", responseTime: 4, resolutionTime: 24 },       // 4h Resposta / 24h Resolução
    { priority: "CRITICAL", responseTime: 1, resolutionTime: 4 }     // 1h Resposta / 4h Resolução
  ]

  for (const rule of slaRules) {
    await prisma.sLARule.upsert({
      where: { priority: rule.priority },
      update: rule,
      create: rule
    })
    console.log(`✅ Regra SLA criada: ${rule.priority}`)
  }

  console.log("🌱 Seed finalizado com sucesso!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
