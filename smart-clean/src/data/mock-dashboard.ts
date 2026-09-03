/**
 * Mock data for the Smart-Clean customer dashboard.
 * All prices are in Nigerian Naira (N).
 * Replace with real API calls when backend is ready.
 */

// ------------------------------------------------------------------
// USER CONTEXT
// ------------------------------------------------------------------
export const mockUser = {
  name: "Alex Sterling",
  email: "alex@example.com",
  avatarInitials: "AS",
  role: "Customer",
  currentOrderId: "4429",
  homeAddress: "45 Adeola Odeku Street, Victoria Island, Lagos",
};

// ------------------------------------------------------------------
// DASHBOARD STATS
// ------------------------------------------------------------------
export const mockStats = {
  totalOrders: 0,
  pendingOrders: 0,
  completedOrders: 0,
  rewardPoints: 450,
  rewardTier: "Bronze" as "Bronze" | "Silver" | "Gold",
};

import { OrderStatus, orderStatusFlow, ORDER_STATUS_MAP } from "./shared-data";

// ------------------------------------------------------------------
// ACTIVE ORDER TRACKER
// ------------------------------------------------------------------
export type TrackingStage = OrderStatus;

export const trackingStages: TrackingStage[] = orderStatusFlow;

export interface ActiveOrder {
  orderId: string;
  service: string;
  currentStage: TrackingStage;
  eta: string;
  rider: {
    name: string;
    phone: string;
    initials: string;
  };
  placedAt: string;
}

export const mockActiveOrder: ActiveOrder | null = {
  orderId: "SC-4429",
  service: "Wash & Fold",
  currentStage: "IN_PRODUCTION",
  eta: "Tomorrow, 10:00 AM",
  rider: {
    name: "Emeka Okafor",
    phone: "+234 803 456 7890",
    initials: "EO",
  },
  placedAt: "2026-06-26T09:30:00",
};

// ------------------------------------------------------------------
// POPULAR SERVICES
// ------------------------------------------------------------------
export interface Service {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  imagePath: string;
  category: "standard" | "premium";
}

export const allServices: Service[] = [
  // ── Standard ──────────────────────────────────────────────
  {
    id: "svc-1",
    name: "Wash & Fold",
    price: 2500,
    unit: "kg",
    description: "Perfect for daily essentials. Separated by color and dried with care.",
    imagePath: "/images/services/wash-and-fold.png",
    category: "standard",
  },
  {
    id: "svc-13",
    name: "Wash, Iron & Fold",
    price: 4000,
    unit: "kg",
    imagePath: "/images/services/wash-iron-fold.png",
    description: "Complete care including washing, steam pressing, and neat folding.",
    category: "standard",
  },
  {
    id: "svc-2",
    name: "Eco Dry Clean",
    price: 8000,
    unit: "pc",
    description: "Non-toxic treatment for delicate fabrics like silk, wool, and structured suits.",
    imagePath: "/images/services/dry-clean.png",
    category: "standard",
  },
  {
    id: "svc-3",
    name: "Steam Ironing",
    price: 3500,
    unit: "pc",
    description: "Industrial-grade steam press for a crisp, wrinkle-free professional look.",
    imagePath: "/images/services/steam-ironing.png",
    category: "standard",
  },
  {
    id: "svc-4",
    name: "Bulk Cleaning",
    price: 15000,
    unit: "load",
    description: "High-capacity cleaning for duvets, comforters, and large garments.",
    imagePath: "/images/services/bulk-cleaning.png",
    category: "standard",
  },
  // ── Premium ───────────────────────────────────────────────
  {
    id: "svc-5",
    name: "Wedding Dress Care",
    price: 45000,
    unit: "pc",
    description: "Expert preservation and deep cleaning of wedding gowns. Sealed after care.",
    imagePath: "/images/services/wedding-dress.png",
    category: "premium",
  },
  {
    id: "svc-6",
    name: "Suit Preservation",
    price: 18000,
    unit: "pc",
    description: "Structured cleaning and fabric protection to keep your suits sharp and long-lasting.",
    imagePath: "/images/services/suit-preservation.png",
    category: "premium",
  },
  {
    id: "svc-7",
    name: "Shoe Cleaning",
    price: 5000,
    unit: "pair",
    description: "Deep-clean and restoration for leather, suede, canvas, and sneakers.",
    imagePath: "/images/services/shoe-cleaning.png",
    category: "premium",
  },
  {
    id: "svc-8",
    name: "Bag Cleaning",
    price: 8500,
    unit: "pc",
    description: "Careful cleaning for designer and everyday bags. Interior and exterior treated.",
    imagePath: "/images/services/bag-cleaning.png",
    category: "premium",
  },
  {
    id: "svc-9",
    name: "Curtain Cleaning",
    price: 12000,
    unit: "set",
    description: "Full-length curtain washing, pressing, and rehang-ready packaging.",
    imagePath: "/images/services/curtain-cleaning.png",
    category: "premium",
  },
  {
    id: "svc-10",
    name: "Carpet Cleaning",
    price: 20000,
    unit: "sqm",
    description: "Heavy-duty steam and shampoo treatment for all carpet and rug types.",
    imagePath: "/images/services/carpet-cleaning.png",
    category: "premium",
  },
  {
    id: "svc-11",
    name: "Blanket Cleaning",
    price: 7500,
    unit: "pc",
    description: "Deep wash and deodorising for duvets, throws, and weighted blankets.",
    imagePath: "/images/services/blanket-cleaning.png",
    category: "premium",
  },
  {
    id: "svc-12",
    name: "Office Uniform",
    price: 4000,
    unit: "set",
    description: "Bulk uniform cleaning with priority turnaround for corporate clients.",
    imagePath: "/images/services/office-uniform.png",
    category: "premium",
  },
];

/** First 4 services shown on the dashboard popular strip */
export const popularServices: Service[] = allServices.slice(0, 4);

// ------------------------------------------------------------------
// HOW IT WORKS
// ------------------------------------------------------------------
export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
  icon: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: "01",
    title: "Schedule Pickup",
    description: "Select a convenient date and time for our concierge to collect your items from your doorstep.",
    icon: "Calendar",
  },
  {
    step: "02",
    title: "Expert Cleaning",
    description: "Our specialists treat each garment with professional-grade detergents and eco-friendly techniques.",
    icon: "Shirt",
  },
  {
    step: "03",
    title: "Express Delivery",
    description: "Receive your perfectly folded and ironed clothes back within 24-48 hours, ready to wear.",
    icon: "Truck",
  },
];

// ------------------------------------------------------------------
// ORDER HISTORY
// ------------------------------------------------------------------
// OrderStatus is now imported from mock-shared

export interface Order {
  id: string;
  service: string;
  status: OrderStatus;
  pickupDate: string;
  deliveryDate: string;
  totalAmount: number;
  itemCount: number;
}

export const mockOrders: Order[] = [
  { id: "SC-4429", service: "Wash & Fold", status: "IN_PRODUCTION", pickupDate: "2026-06-24", deliveryDate: "2026-06-26", totalAmount: 12500, itemCount: 5 },
  { id: "SC-4428", service: "Eco Dry Clean", status: "COMPLETED", pickupDate: "2026-06-20", deliveryDate: "2026-06-22", totalAmount: 32000, itemCount: 4 },
  { id: "SC-4427", service: "Steam Ironing", status: "COMPLETED", pickupDate: "2026-06-15", deliveryDate: "2026-06-16", totalAmount: 7000, itemCount: 2 },
  { id: "SC-4426", service: "Bulk Cleaning", status: "CANCELLED", pickupDate: "2026-06-10", deliveryDate: "2026-06-12", totalAmount: 15000, itemCount: 1 },
  { id: "SC-4425", service: "Wash & Fold", status: "COMPLETED", pickupDate: "2026-06-05", deliveryDate: "2026-06-07", totalAmount: 10000, itemCount: 4 },
];

// ------------------------------------------------------------------
// SPENDING CHART DATA (7-day history for Recharts)
// ------------------------------------------------------------------
export const spendingChartData = [
  { day: "Mon", amount: 0 },
  { day: "Tue", amount: 12500 },
  { day: "Wed", amount: 0 },
  { day: "Thu", amount: 32000 },
  { day: "Fri", amount: 7000 },
  { day: "Sat", amount: 0 },
  { day: "Sun", amount: 15000 },
];
