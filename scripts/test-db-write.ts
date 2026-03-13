import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export {};

async function main() {
  console.log("🚀 Iniciando teste de gravação SQL (MODO LOCAL)...");
  
  try {
    const ticket = await prisma.ticket.findFirst();
    if (!ticket) {
      console.log("❌ Nenhum ticket encontrado.");
      return;
    }

    console.log(`📝 Testando gravação no Ticket ID: ${ticket.id}`);
    
    const now = new Date();
    const updated = await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        plannedStartDate: now,
        plannedDueDate: new Date(now.getTime() + 86400000),
      }
    });

    console.log("✅ SUCESSO! O BANCO LOCAL GRAVOU AS INFORMAÇÕES.");
    console.log("Datas:", { start: updated.plannedStartDate, due: updated.plannedDueDate });

  } catch (error) {
    console.error("❌ ERRO NO BANCO LOCAL:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
