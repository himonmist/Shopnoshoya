import { PrismaClient } from "@prisma/client";
import { seedDatabase } from "../src/lib/seedData";

const prisma = new PrismaClient();

async function main() {
  await seedDatabase(prisma, {
    adminEmail: process.env.ADMIN_EMAIL || "admin@shopnoshoya.org",
    adminPassword: process.env.ADMIN_PASSWORD || "change-this-password",
  });
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
