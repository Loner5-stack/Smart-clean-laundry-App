import { PrismaClient } from '@prisma/client';
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const garmentItems = [
  { id: "g-01", name: "Shirt",       emoji: "👔", basePrice: 1500, unit: "pc" },
  { id: "g-02", name: "T-Shirt",     emoji: "👕", basePrice: 1000, unit: "pc" },
  { id: "g-03", name: "Trouser",     emoji: "👖", basePrice: 1500, unit: "pc" },
  { id: "g-04", name: "Suit (2pc)",  emoji: "🤵", basePrice: 8000, unit: "pc" },
  { id: "g-05", name: "Suit (3pc)",  emoji: "🤵", basePrice: 10000, unit: "pc" },
  { id: "g-06", name: "Jacket",      emoji: "🧥", basePrice: 4000, unit: "pc" },
  { id: "g-07", name: "Dress",       emoji: "👗", basePrice: 3000, unit: "pc" },
  { id: "g-08", name: "Skirt",       emoji: "👗", basePrice: 1500, unit: "pc" },
  { id: "g-09", name: "Blouse",      emoji: "👚", basePrice: 1200, unit: "pc" },
  { id: "g-10", name: "Shorts",      emoji: "🩳", basePrice: 1000, unit: "pc" },
  { id: "g-11", name: "Jeans",       emoji: "👖", basePrice: 2000, unit: "pc" },
  { id: "g-12", name: "Underwear",   emoji: "🩲", basePrice: 500,  unit: "pc" },
  { id: "g-13", name: "Socks (pair)",emoji: "🧦", basePrice: 300,  unit: "pair" },
  { id: "g-14", name: "Towel",       emoji: "🪣", basePrice: 1500, unit: "pc" },
  { id: "g-15", name: "Bedsheet",    emoji: "🛏️", basePrice: 3000, unit: "pc" },
  { id: "g-16", name: "Pillowcase",  emoji: "🛏️", basePrice: 800,  unit: "pc" },
  { id: "g-17", name: "Curtain",     emoji: "🪟", basePrice: 5000, unit: "pc" },
  { id: "g-18", name: "Carpet",      emoji: "🪵", basePrice: 8000, unit: "sqm" },
  { id: "g-19", name: "Duvet",       emoji: "🛌", basePrice: 6000, unit: "pc" },
  { id: "g-20", name: "Blanket",     emoji: "🧸", basePrice: 4000, unit: "pc" },
  { id: "g-21", name: "Wedding Dress", emoji: "👰‍♀️", basePrice: 45000, unit: "pc" },
  { id: "g-22", name: "Shoe (pair)", emoji: "👟", basePrice: 5000, unit: "pair" },
  { id: "g-23", name: "Handbag",     emoji: "👜", basePrice: 7000, unit: "pc" },
];

async function main() {
  for (const garment of garmentItems) {
    await prisma.garmentItem.upsert({
      where: { id: garment.id },
      update: {},
      create: {
        id: garment.id,
        name: garment.name,
        emoji: garment.emoji,
        basePrice: garment.basePrice,
        unit: garment.unit,
      },
    });
  }
  console.log("Seeded garments.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
