import { PrismaClient } from '@prisma/client';
export { Decimal } from '@prisma/client/runtime/library';
// Re-export Prisma types for use in other packages
export * from '@prisma/client';
// Singleton Prisma client with hot-reload support
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = prisma;
// Default export for convenience
export default prisma;
