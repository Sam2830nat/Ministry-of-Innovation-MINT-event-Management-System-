require('dotenv').config({ path: '../.env' });
(async () => {
    try {
        const { PrismaClient } = require('@prisma/client');
        const { PrismaPg } = require('@prisma/adapter-pg');
        const { Pool } = require('pg');
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const adapter = new PrismaPg(pool);
        const p = new PrismaClient({ adapter, log: ['warn', 'error'] });
        const r = await p.registrationStatus.findFirst({ where: { name: 'PENDING' } });
        console.log('RESULT', r);
        await p.$disconnect();
        await pool.end();
    } catch (e) {
        console.error('ERROR', e);
        process.exitCode = 1;
    }
})();
