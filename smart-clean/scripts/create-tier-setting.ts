import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Creating TierSetting table...");
  
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "TierSetting" (
      "id" TEXT NOT NULL,
      "level" INTEGER NOT NULL,
      "name" TEXT NOT NULL,
      "minOrders" INTEGER NOT NULL DEFAULT 0,
      "maxOrders" INTEGER,
      "discountPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
      "perks" JSONB NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "TierSetting_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "TierSetting_level_key" ON "TierSetting"("level");
  `);

  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "TierSetting_name_key" ON "TierSetting"("name");
  `);

  console.log("TierSetting table created.");

  const count = await prisma.tierSetting.count();
  if (count === 0) {
    console.log("Seeding default tiers...");
    await prisma.tierSetting.createMany({
      data: [
        {
          id: "tier-bronze",
          level: 1,
          name: "Bronze",
          minOrders: 0,
          maxOrders: 5,
          discountPercentage: 0,
          perks: JSON.stringify(["Standard pickup window"]),
          updatedAt: new Date()
        },
        {
          id: "tier-silver",
          level: 2,
          name: "Silver",
          minOrders: 6,
          maxOrders: 20,
          discountPercentage: 5,
          perks: JSON.stringify(["Priority support", "5% discount on all orders"]),
          updatedAt: new Date()
        },
        {
          id: "tier-gold",
          level: 3,
          name: "Gold",
          minOrders: 21,
          maxOrders: null,
          discountPercentage: 10,
          perks: JSON.stringify(["Premium support", "10% discount on all orders", "Free same-day pickup"]),
          updatedAt: new Date()
        }
      ]
    });
    console.log("Default tiers seeded.");
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
