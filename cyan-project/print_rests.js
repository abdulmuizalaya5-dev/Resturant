const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const rests = await prisma.restaurant.findMany();
  console.log(JSON.stringify(rests.map(r => ({ id: r.id, name: r.name, image: r.image })), null, 2));
}

main().catch(err => console.error(err)).finally(() => prisma.$disconnect());
