const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const acc = await prisma.account.findFirst({ where: { user: { email: 'admin@dorm.com' } } });
  console.log(acc);
}
main().finally(() => prisma.$disconnect());
