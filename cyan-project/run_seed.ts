import { seedPrismaIfNeeded } from './src/app/api/dbHelper';

async function main() {
  await seedPrismaIfNeeded();
  console.log("Seeding done!");
}

main().catch(err => console.error(err));
