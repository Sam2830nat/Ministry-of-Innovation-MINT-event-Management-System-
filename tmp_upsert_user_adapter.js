const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

(async () => {
    try {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
        const role = await prisma.role.findFirst({ where: { roleName: 'GUEST' } });
        const dept = await prisma.department.findFirst({ where: { name: 'Software Engineering' } });
        const pwHash = 'testhash';
        const seDate = new Date();
        const u = {
            email: 'copilot-test@example.com',
            fullName: 'Copilot Test',
            roleId: role.id,
            departmentId: dept.id,
            passwordHash: pwHash,
            isEmailVerified: true,
            emailVerifiedAt: seDate,
        };
        const res = await prisma.user.upsert({ where: { email: u.email }, update: {}, create: u });
        console.log('UPSERT_OK', res.id);
        await prisma.$disconnect();
        await pool.end();
    } catch (err) {
        console.error('UPSERT_ERR', err);
        process.exit(1);
    }
})();
