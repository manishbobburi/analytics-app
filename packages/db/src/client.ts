import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Prisma } from '../generated/prisma/client.js';

const connectionString = '';

const adapter = new PrismaPg({
  connectionString,
});

export const prisma = new PrismaClient({ adapter });
export { Prisma };
