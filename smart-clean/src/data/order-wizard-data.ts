/**
 * Static data for the New Order Wizard.
 * Replace with API calls when backend is ready.
 */

// ── Garment Items ────────────────────────────────────────────────
export interface GarmentItem {
  id: string;
  name: string;
  emoji: string;
  basePrice: number; // price per piece in Naira
  unit: string;
}

export const garmentItems: GarmentItem[] = [
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

// ── Service to Item Mapping ──────────────────────────────────────
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

export function getItemsForService(serviceId: string): GarmentItem[] {
  const allowedIds = serviceItemMap[serviceId] || standardGarmentIds;
  return garmentItems.filter(item => allowedIds.includes(item.id));
}

// ── Time Slots ───────────────────────────────────────────────────
export interface TimeSlot {
  id: string;
  label: string;
  range: string;
}

export const timeSlots: TimeSlot[] = [
  { id: "ts-1", label: "Morning",   range: "8:00 AM – 12:00 PM" },
  { id: "ts-2", label: "Afternoon", range: "12:00 PM – 4:00 PM" },
];

// ── Pickup fee ───────────────────────────────────────────────────
export const PICKUP_FEE = 500;

// ── Stain Types ──────────────────────────────────────────────────
export const stainTypes = [
  "Coffee / Tea",
  "Oil / Grease",
  "Ink / Pen",
  "Blood",
  "Wine / Juice",
  "Sweat",
  "Mud / Dirt",
  "Other",
];
