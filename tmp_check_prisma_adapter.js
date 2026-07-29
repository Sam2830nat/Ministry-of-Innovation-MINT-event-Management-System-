const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

(async () => {
    try {
        console.log('DATABASE_URL=', process.env.DATABASE_URL || 'undefined');
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const prisma = new PrismaClient({ adapter: new PrismaPg(pool), log: ['warn', 'error'] });
        const user = await prisma.user.findUnique({ where: { email: 'testuser+copilot@example.com' } });
        console.log('RESULT', user);
        await prisma.$disconnect();
        await pool.end();
    } catch (err) {
        console.error('PRISMA_ERR', err);
        process.exit(1);
    }
})();
