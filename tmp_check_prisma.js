const { PrismaClient } = require('@prisma/client');

(async () => {
    try {
        console.log('DATABASE_URL=', process.env.DATABASE_URL || 'undefined');
        const prisma = new PrismaClient();
        const user = await prisma.user.findUnique({ where: { email: 'testuser+copilot@example.com' } });
        console.log('RESULT', user);
        await prisma.$disconnect();
    } catch (err) {
        console.error('PRISMA_ERR', err);
        process.exit(1);
    }
})();
