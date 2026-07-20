import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const mockServices = [
  {
    id: "svc-1",
    name: "Wash & Fold",
    price: 2500,
    unit: "kg",
    description: "Perfect for daily essentials. Separated by color and dried with care.",
    imagePath: "/images/services/wash-and-fold.png",
    category: "Standard",
  },
  {
    id: "svc-13",
    name: "Wash, Iron & Fold",
    price: 4000,
    unit: "kg",
    imagePath: "/images/services/wash-iron-fold.png",
    description: "Complete care including washing, steam pressing, and neat folding.",
    category: "Standard",
  },
  {
    id: "svc-2",
    name: "Eco Dry Clean",
    price: 4500,
    unit: "pc",
    description: "Gentle, non-toxic dry cleaning for delicate fabrics and suits.",
    imagePath: "/images/services/dry-cleaning.png",
    category: "Premium",
  },
  {
    id: "svc-3",
    name: "Iron Only",
    price: 1500,
    unit: "pc",
    description: "Professional steam pressing for crisp, wrinkle-free garments.",
    imagePath: "/images/services/iron-only.png",
    category: "Standard",
  },
  {
    id: "svc-4",
    name: "Stain Removal",
    price: 3500,
    unit: "pc",
    description: "Advanced spot treatment targeting tough, set-in stains.",
    imagePath: "/images/services/stain-removal.png",
    category: "Premium",
  },
  {
    id: "svc-5",
    name: "Wedding Dress Care",
    price: 45000,
    unit: "pc",
    description: "Specialized cleaning and preservation for bridal gowns.",
    imagePath: "/images/services/wedding-dress.png",
    category: "Premium",
  },
  {
    id: "svc-6",
    name: "Suit Preservation",
    price: 12000,
    unit: "pc",
    description: "Deep clean and structure-safe pressing for formal wear.",
    imagePath: "/images/services/suit-care.png",
    category: "Premium",
  },
  {
    id: "svc-7",
    name: "Shoe Cleaning",
    price: 5000,
    unit: "pair",
    description: "Hand-cleaning for sneakers, leather, and suede shoes.",
    imagePath: "/images/services/shoe-cleaning.png",
    category: "Standard",
  },
  {
    id: "svc-8",
    name: "Bag Cleaning",
    price: 7000,
    unit: "pc",
    description: "Interior and exterior care for handbags and backpacks.",
    imagePath: "/images/services/bag-cleaning.png",
    category: "Standard",
  },
  {
    id: "svc-9",
    name: "Curtain Cleaning",
    price: 5000,
    unit: "pc",
    description: "Dust and allergen removal for heavy and sheer curtains.",
    imagePath: "/images/services/curtains.png",
    category: "Standard",
  },
  {
    id: "svc-10",
    name: "Carpet Cleaning",
    price: 8000,
    unit: "sqm",
    description: "Deep extraction cleaning for rugs and fitted carpets.",
    imagePath: "/images/services/carpet.png",
    category: "Premium",
  },
  {
    id: "svc-11",
    name: "Duvet & Blankets",
    price: 6000,
    unit: "pc",
    description: "High-capacity washing and thorough drying for bedding.",
    imagePath: "/images/services/duvet.png",
    category: "Standard",
  },
  {
    id: "svc-12",
    name: "Office Uniforms",
    price: 3500,
    unit: "pc",
    description: "Bulk rate daily uniform cleaning and sharp pressing.",
    imagePath: "/images/services/uniform.png",
    category: "Standard",
  }
];

const mockGarments = [
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

const serviceItemMap: Record<string, string[]> = {
  "svc-5": ["g-21"], // Wedding Dress Care
  "svc-6": ["g-04", "g-05", "g-06"], // Suit Preservation
  "svc-7": ["g-22"], // Shoe Cleaning
  "svc-8": ["g-23"], // Bag Cleaning
  "svc-9": ["g-17"], // Curtain Cleaning
  "svc-10": ["g-18"], // Carpet Cleaning
  "svc-11": ["g-19", "g-20"], // Blanket Cleaning
  "svc-12": ["g-01", "g-03", "g-04", "g-08", "g-09"], // Office Uniform
};

const standardGarmentIds = [
  "g-01", "g-02", "g-03", "g-04", "g-05", "g-06", "g-07", "g-08", "g-09", 
  "g-10", "g-11", "g-12", "g-13", "g-14", "g-15", "g-16"
];

async function main() {
  console.log('Seeding Services and Garments...');

  for (const s of mockServices) {
    const allowedIds = serviceItemMap[s.id] || standardGarmentIds;

    await prisma.service.upsert({
      where: { id: s.id },
      update: {
        name: s.name,
        category: s.category,
        price: s.price,
        unit: s.unit,
        description: s.description,
        imagePath: s.imagePath,
      },
      create: {
        id: s.id,
        name: s.name,
        category: s.category,
        price: s.price,
        unit: s.unit,
        description: s.description,
        imagePath: s.imagePath,
      }
    });
  }

  for (const g of mockGarments) {
    await prisma.garmentItem.upsert({
      where: { id: g.id },
      update: {
        name: g.name,
        emoji: g.emoji,
        basePrice: g.basePrice,
        unit: g.unit,
      },
      create: {
        id: g.id,
        name: g.name,
        emoji: g.emoji,
        basePrice: g.basePrice,
        unit: g.unit,
      }
    });
  }
  
  // Create mappings
  for (const s of mockServices) {
    const allowedIds = serviceItemMap[s.id] || standardGarmentIds;
    
    for (const gid of allowedIds) {
      await prisma.service.update({
        where: { id: s.id },
        data: {
          garments: {
            connect: { id: gid }
          }
        }
      });
    }
  }

  console.log('Successfully seeded Services and Garments!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
