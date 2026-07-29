const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

(async () => {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const prisma = new PrismaClient({
        adapter: new PrismaPg(pool),
        log: [
            { emit: 'event', level: 'query' },
            { emit: 'event', level: 'error' }
        ],
    });

    prisma.$on('query', (e) => {
        console.log('PRISMA_QUERY', e.query);
        console.log('PRISMA_PARAMS', e.params);
    });

    prisma.$on('error', (e) => {
        console.error('PRISMA_LOG_ERROR', e.message);
    });

    try {
        const user = await prisma.user.findUnique({ where: { email: 'testuser+copilot@example.com' } });
        console.log('RESULT', user);
    } catch (err) {
        console.error('PRISMA_ERR', err);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
})();
