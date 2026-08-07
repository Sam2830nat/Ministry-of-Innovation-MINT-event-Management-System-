import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("Dropping columns...");
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE "users" DROP COLUMN IF EXISTS "national_id" CASCADE;');
    await prisma.$executeRawUnsafe('ALTER TABLE "users" DROP COLUMN IF EXISTS "is_ministry_id_verified" CASCADE;');
    await prisma.$executeRawUnsafe('ALTER TABLE "users" DROP COLUMN IF EXISTS "ministry_id_verified_at" CASCADE;');
    console.log("Successfully dropped drift columns from users table.");
  } catch (error) {
    console.error("Error dropping columns:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
