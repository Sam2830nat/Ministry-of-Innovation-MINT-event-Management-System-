console.log('cwd', process.cwd());
console.log('env DATABASE_URL', process.env.DATABASE_URL);
try {
    const p = require('@prisma/client');
    console.log('export keys', Object.keys(p));
    console.log('PrismaClient type', typeof p.PrismaClient);
    console.log('PrismaClient props', Object.getOwnPropertyNames(p.PrismaClient));
    console.log('Prisma version', p.PrismaClient ? p.PrismaClient.name : 'none');
} catch (err) {
    console.error('REQUIRE_ERR', err);
    process.exit(1);
}
