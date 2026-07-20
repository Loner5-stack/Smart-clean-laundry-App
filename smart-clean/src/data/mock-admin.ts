// src/data/mock-admin.ts

export type OrderStatus = "PENDING" | "PICKUP_ASSIGNED" | "AT_HUB" | "IN_PRODUCTION" | "OUT_FOR_DELIVERY" | "COMPLETED" | "CANCELLED";
export type LoyaltyTier = "Tier 1" | "Tier 2" | "Tier 3";
export type RiderStatus = "Active: Available" | "Active: On Delivery" | "Offline" | "Suspended";
export type ServiceCategory = "Standard" | "Premium";

export interface AdminOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  services: string[];
  status: OrderStatus;
  rider: string | null; // rider name or null
  pickupDate: string;
  pickupTimeSlot: string;
  totalAmount: number;
  placedAt: string; // ISO date string
  paymentStatus: "Paid" | "Pending" | "Refunded";
  paymentMethod: "Card" | "Bank Transfer";
  items: { name: string; quantity: number; emoji?: string; price?: number; stain?: boolean }[];
  bagSelections?: { size: string; quantity: number }[];
  notes?: string[];
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpend: number;
  loyaltyTier: LoyaltyTier;
  lastOrderDate: string; // ISO
  memberSince: string; // ISO
  status: "Active" | "Suspended";
  activeSubscription?: string | null;
}

export interface AdminRider {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: RiderStatus;
  currentAssignment: string | null; // order ID or null
  deliveriesCompleted: number;
  joinDate: string; // ISO
  rating: number;
  onTimeRate: number; // percentage
}

export interface AdminService {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  unit: string;
  description: string;
  isActive: boolean;
  orderCount: number;
  imagePath?: string | null;
  displayOrder?: number;
  isPopular?: boolean;
}

export interface AdminSubscription {
  id: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  billingCycle: "Monthly" | "Quarterly";
  amount: number;
  startDate: string; // ISO
  nextRenewalDate: string; // ISO
  status: "Active" | "Cancelled" | "Payment Failed";
}

// Generate some realistic Nigerian data
const today = new Date();

export const mockAdminOrders: AdminOrder[] = [
  {
    id: "SC-4432",
    customerName: "Amaka Johnson",
    customerPhone: "0803 123 4567",
    customerAddress: "14 Admiralty Way, Lekki Phase 1",
    services: ["Wash & Fold"],
    status: "PENDING",
    rider: null,
    pickupDate: today.toISOString(),
    pickupTimeSlot: "10:00 AM - 12:00 PM",
    totalAmount: 7500,
    placedAt: new Date(today.getTime() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    paymentStatus: "Pending",
    paymentMethod: "Card",
    items: [
      { name: "Shirts", quantity: 5, emoji: "👔", price: 1000 }, 
      { name: "Trousers", quantity: 2, emoji: "👖", price: 1250, stain: true }
    ],
    bagSelections: [{ size: "Medium", quantity: 1 }],
  },
  {
    id: "SC-4431",
    customerName: "Emeka Okafor",
    customerPhone: "0812 987 6543",
    customerAddress: "8 Bourdillon Road, Ikoyi",
    services: ["Dry Cleaning", "Ironing"],
    status: "PICKUP_ASSIGNED",
    rider: "Taiwo Adeyemi",
    pickupDate: today.toISOString(),
    pickupTimeSlot: "08:00 AM - 10:00 AM",
    totalAmount: 12400,
    placedAt: new Date(today.getTime() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    paymentStatus: "Paid",
    paymentMethod: "Bank Transfer",
    items: [{ name: "Suit", quantity: 1 }, { name: "Shirts", quantity: 3 }],
  },
  {
    id: "SC-4430",
    customerName: "Zainab Bello",
    customerPhone: "0706 555 8899",
    customerAddress: "Flat 4, 1004 Estate, Victoria Island",
    services: ["Wash & Fold"],
    status: "AT_HUB",
    rider: "Samuel Oluwaseun",
    pickupDate: new Date(today.getTime() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
    pickupTimeSlot: "02:00 PM - 04:00 PM",
    totalAmount: 4500,
    placedAt: new Date(today.getTime() - 1000 * 60 * 60 * 26).toISOString(),
    paymentStatus: "Paid",
    paymentMethod: "Card",
    items: [{ name: "T-Shirts", quantity: 10 }, { name: "Shorts", quantity: 4 }],
    notes: ["Customer requested unscented detergent."],
  },
  {
    id: "SC-4429",
    customerName: "Emeka Okafor",
    customerPhone: "0812 987 6543",
    customerAddress: "45 Adeola Odeku St, Victoria Island",
    services: ["Bulk Wash", "Curtain Cleaning"],
    status: "IN_PRODUCTION",
    rider: "John Doe",
    pickupDate: new Date(today.getTime() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    pickupTimeSlot: "10:00 AM - 12:00 PM",
    totalAmount: 24500,
    placedAt: new Date(today.getTime() - 1000 * 60 * 60 * 50).toISOString(),
    paymentStatus: "Paid",
    paymentMethod: "Bank Transfer",
    items: [{ name: "Bed Sheets", quantity: 4 }, { name: "Curtains", quantity: 2 }],
  },
  {
    id: "SC-4428",
    customerName: "Zainab Bello",
    customerPhone: "0706 555 8899",
    customerAddress: "22 Ozumba Mbadiwe Ave, Victoria Island",
    services: ["Dry Cleaning", "Leather Care"],
    status: "OUT_FOR_DELIVERY",
    rider: "Taiwo Adeyemi",
    pickupDate: new Date(today.getTime() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    pickupTimeSlot: "04:00 PM - 06:00 PM",
    totalAmount: 18900,
    placedAt: new Date(today.getTime() - 1000 * 60 * 60 * 75).toISOString(),
    paymentStatus: "Paid",
    paymentMethod: "Card",
    items: [{ name: "Leather Jacket", quantity: 1 }, { name: "Dresses", quantity: 3 }],
  },
  {
    id: "SC-4427",
    customerName: "Amaka Johnson",
    customerPhone: "0803 123 4567",
    customerAddress: "19 Alexander Ave, Ikoyi",
    services: ["Wash & Fold"],
    status: "COMPLETED",
    rider: "Samuel Oluwaseun",
    pickupDate: new Date(today.getTime() - 1000 * 60 * 60 * 96).toISOString(),
    pickupTimeSlot: "12:00 PM - 02:00 PM",
    totalAmount: 6200,
    placedAt: new Date(today.getTime() - 1000 * 60 * 60 * 100).toISOString(),
    paymentStatus: "Paid",
    paymentMethod: "Card",
    items: [{ name: "Trousers", quantity: 3 }, { name: "Towels", quantity: 5 }],
  },
];

export const mockAdminCustomers: AdminCustomer[] = [
  {
    id: "CUST-001",
    name: "Amaka Johnson",
    email: "amaka.j@example.com",
    phone: "0803 123 4567",
    address: "14 Admiralty Way, Lekki Phase 1",
    totalOrders: 12,
    totalSpend: 87500,
    loyaltyTier: "Tier 2",
    lastOrderDate: today.toISOString(),
    memberSince: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 180).toISOString(), // 6 months ago
    status: "Active",
    activeSubscription: "Premium Family",
  },
  {
    id: "CUST-002",
    name: "Emeka Okafor",
    email: "emeka.o@example.com",
    phone: "0812 987 6543",
    address: "8 Bourdillon Road, Ikoyi",
    totalOrders: 4,
    totalSpend: 32400,
    loyaltyTier: "Tier 1",
    lastOrderDate: today.toISOString(),
    memberSince: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    status: "Active",
  },
  {
    id: "CUST-003",
    name: "Zainab Bello",
    email: "zainab.b@example.com",
    phone: "0706 555 8899",
    address: "Flat 4, 1004 Estate, Victoria Island",
    totalOrders: 31,
    totalSpend: 245000,
    loyaltyTier: "Tier 3",
    lastOrderDate: new Date(today.getTime() - 1000 * 60 * 60 * 24).toISOString(),
    memberSince: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 365).toISOString(),
    status: "Active",
    activeSubscription: "Standard",
  },
  {
    id: "CUST-004",
    name: "David Nwachukwu",
    email: "david.n@example.com",
    phone: "0908 777 6655",
    address: "Plot 12, Banana Island",
    totalOrders: 0,
    totalSpend: 0,
    loyaltyTier: "Tier 1",
    lastOrderDate: new Date(0).toISOString(),
    memberSince: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "Suspended",
  },
];

export const mockAdminRiders: AdminRider[] = [
  {
    id: "RIDER-01",
    name: "Taiwo Adeyemi",
    phone: "0809 111 2222",
    email: "taiwo.a@smartclean.ng",
    status: "Active: On Delivery",
    currentAssignment: "SC-4431",
    deliveriesCompleted: 452,
    joinDate: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 200).toISOString(),
    rating: 4.8,
    onTimeRate: 94,
  },
  {
    id: "RIDER-02",
    name: "Samuel Oluwaseun",
    phone: "0813 444 5555",
    email: "samuel.o@smartclean.ng",
    status: "Active: Available",
    currentAssignment: null,
    deliveriesCompleted: 310,
    joinDate: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 150).toISOString(),
    rating: 4.6,
    onTimeRate: 89,
  },
  {
    id: "RIDER-03",
    name: "John Doe",
    phone: "0701 999 8888",
    email: "john.d@smartclean.ng",
    status: "Offline",
    currentAssignment: null,
    deliveriesCompleted: 89,
    joinDate: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    rating: 4.9,
    onTimeRate: 98,
  },
  {
    id: "RIDER-04",
    name: "Aliyu Musa",
    phone: "0805 666 7777",
    email: "aliyu.m@smartclean.ng",
    status: "Suspended",
    currentAssignment: null,
    deliveriesCompleted: 12,
    joinDate: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    rating: 3.2,
    onTimeRate: 65,
  },
];

export const mockAdminServices: AdminService[] = [
  {
    id: "SVC-01",
    name: "Wash & Fold",
    category: "Standard",
    price: 2500,
    unit: "per kg",
    description: "Everyday laundry washed, dried, and neatly folded.",
    isActive: true,
    orderCount: 1432,
  },
  {
    id: "SVC-02",
    name: "Dry Cleaning",
    category: "Premium",
    price: 3500,
    unit: "per piece",
    description: "Professional dry cleaning for delicate fabrics and suits.",
    isActive: true,
    orderCount: 894,
  },
  {
    id: "SVC-03",
    name: "Ironing Only",
    category: "Standard",
    price: 1000,
    unit: "per piece",
    description: "Crisp, professional ironing for your pre-washed clothes.",
    isActive: true,
    orderCount: 562,
  },
  {
    id: "SVC-04",
    name: "Carpet Cleaning",
    category: "Premium",
    price: 15000,
    unit: "per sqm",
    description: "Deep steam cleaning for area rugs and carpets.",
    isActive: false,
    orderCount: 12,
  },
];

export const mockAdminSubscriptions: AdminSubscription[] = [
  {
    id: "SUB-001",
    customerName: "Amaka Johnson",
    customerEmail: "amaka.j@example.com",
    planName: "Premium Family",
    billingCycle: "Monthly",
    amount: 45000,
    startDate: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    nextRenewalDate: new Date(today.getTime() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    status: "Active",
  },
  {
    id: "SUB-002",
    customerName: "Zainab Bello",
    customerEmail: "zainab.b@example.com",
    planName: "Standard",
    billingCycle: "Quarterly",
    amount: 54000,
    startDate: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 120).toISOString(),
    nextRenewalDate: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "Payment Failed",
  },
];

// Reusable status colors for Admin
export const adminStatusColors: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  PICKUP_ASSIGNED: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  AT_HUB: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  IN_PRODUCTION: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  OUT_FOR_DELIVERY: "bg-brand-cobalt/10 text-brand-cobalt",
  COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};
