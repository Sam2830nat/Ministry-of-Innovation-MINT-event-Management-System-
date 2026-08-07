require('dotenv').config({ path: '../.env' });
(async () => {
    try {
        const { PrismaClient } = require('@prisma/client');
        const p = new PrismaClient();
        const r = await p.registrationStatus.findFirst({ where: { name: 'PENDING' } });
        console.log('RESULT', r);
        await p.$disconnect();
    } catch (e) {
        console.error('ERROR', e);
        process.exitCode = 1;
    }
})();
