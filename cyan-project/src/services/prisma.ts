import { PrismaClient } from '@prisma/client';

// Force delete cached global prisma instance to reload environment variables
if (typeof global !== 'undefined' && (global as any).prisma) {
  try {
    (global as any).prisma.$disconnect();
  } catch (e) {}
  delete (global as any).prisma;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
export default prisma;
