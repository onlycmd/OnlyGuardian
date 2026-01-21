import { PrismaClient } from '@prisma/client';

/**
 * Global Prisma Client örneği.
 * Uygulama genelinde tek bir bağlantı havuzu kullanmak için.
 */
const prisma = new PrismaClient();

export * from '@prisma/client';
export { prisma };
