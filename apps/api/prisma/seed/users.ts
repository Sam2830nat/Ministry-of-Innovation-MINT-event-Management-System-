/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding Users...');

  // Get roles
  const adminRole = await prisma.role.findUnique({ where: { roleName: 'ADMIN' } });
  const guestRole = await prisma.role.findUnique({ where: { roleName: 'GUEST' } });
  const organizerRole = await prisma.role.findUnique({ where: { roleName: 'ORGANIZER' } });

  if (!adminRole || !guestRole || !organizerRole) {
    throw new Error('Roles not found. Please run `npm run script_roles` first.');
  }

  // Ensure core computing departments exist
  const computingDepts = [
    'Software Engineering',
    'Computer Science',
    'Information Systems',
    'Information Technology',
    'Data Science',
  ];
  for (const name of computingDepts) {
    const exists = await prisma.department.findFirst({ where: { name } });
    if (!exists) {
      await prisma.department.create({
        data: { name, faculty: 'College of Computing' },
      });
    }
  }

  const dept =
    (await prisma.department.findFirst({
      where: { name: 'Software Engineering' },
    })) ??
    (await prisma.department.create({
      data: {
        name: 'Software Engineering',
        faculty: 'College of Computing',
      },
    }));

  const passwordHash = await argon2.hash('Password123!', {
    type: argon2.argon2id,
  });

  const users = [
    {
      email: 'admin@mint.gov.et',
      fullName: 'System Admin',
      passwordHash,
      roleId: adminRole.id,
      departmentId: dept.id,
      phone: '+251900000001',
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      isMinistryIdVerified: true,
      ministryIdVerifiedAt: new Date(),
    },
    {
      email: 'guest@mint.gov.et',
      fullName: 'John Doe',
      passwordHash,
      roleId: guestRole.id,
      departmentId: dept.id,
      phone: '+251900000002',
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      isMinistryIdVerified: true,
      ministryIdVerifiedAt: new Date(),
    },
    {
      email: 'organizer@mint.gov.et',
      fullName: 'Jane Smith',
      passwordHash,
      roleId: organizerRole.id,
      departmentId: dept.id,
      phone: '+251900000003',
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      isMinistryIdVerified: true,
      ministryIdVerifiedAt: new Date(),
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }

  console.log('Users seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
