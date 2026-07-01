const { PrismaClient } = require('@prisma/client');

const connectionStrings = [
  {
    name: 'Standard SRV',
    url: 'mongodb+srv://abdulmuizalaya5:cyannnnn123@cluster0.c7cs6ji.mongodb.net/cyan_db?retryWrites=true&w=majority'
  }
];

async function testConnection(name, url) {
  console.log(`\n--- Testing Connection: ${name} ---`);
  process.env.DATABASE_URL = url;
  
  const prisma = new PrismaClient();
  try {
    const userCount = await prisma.user.count();
    console.log(`✅ Success! Count: ${userCount}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed:`, error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  await testConnection(connectionStrings[0].name, connectionStrings[0].url);
}

main();
