import { PrismaClient } from "@prisma/client";

// Forçar o uso do cliente local da node_modules
const prismaClientSingleton = () => {
  console.log("🔌 Inicializando nova conexão local Prisma...");
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export { prisma };
export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
