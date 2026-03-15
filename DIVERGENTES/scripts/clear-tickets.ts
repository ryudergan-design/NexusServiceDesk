import { PrismaClient } from '@prisma/client'; 

const prisma = new PrismaClient(); 

async function main() { 
  await prisma.aILog.deleteMany();
  await prisma.ticketComment.deleteMany(); 
  await prisma.ticketTransition.deleteMany(); 
  await prisma.attachment.deleteMany(); 
  await prisma.satisfactionSurvey.deleteMany(); 
  await prisma.ticket.deleteMany(); 
  console.log('Todos os chamados foram apagados com sucesso.'); 
} 

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());