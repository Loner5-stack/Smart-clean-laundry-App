/**
 * mock-shared.ts
 *
 * Pure data/types shared between server code (api.ts), admin pages, and
 * customer pages. NO JSX here — this file must be importable by Server
 * Actions and Server Components.
 *
 * For UI rendering (plan feature lists with icons), import mock-shared.tsx.
 */

// ------------------------------------------------------------------
// SUBSCRIPTION PLANS (data only — no JSX icons)
// ------------------------------------------------------------------

export interface SharedPlan {
  id: string;
  name: string;
  price: number;
  pieces: number;
  /** Plain-text feature descriptions for server-side use */
  featureTexts: string[];
  isPopular?: boolean;
  cycle?: string;
  activeSubs?: number;
}

export const sharedSubscriptionPlans: SharedPlan[] = [
  {
    id: "plan-basic",
    name: "Basic",
    price: 15000,
    pieces: 30,
    cycle: "Monthly",
    activeSubs: 243,
    featureTexts: [
      "Up to 30 pieces of clothing/month",
      "2 Scheduled Pickups",
      "Standard 48-hour turnaround",
      "Wash, Iron & Fold included",
    ],
  },
  {
    id: "plan-standard",
    name: "Standard",
    price: 25000,
    pieces: 60,
    cycle: "Monthly",
    activeSubs: 892,
    isPopular: true,
    featureTexts: [
      "Up to 60 pieces of clothing/month",
      "4 Scheduled Pickups (Weekly)",
      "Standard 48-hour turnaround",
      "Wash, Iron & Fold included",
      "Dry cleaning for up to 5 items",
    ],
  },
  {
    id: "plan-premium",
    name: "Premium Family",
    price: 45000,
    pieces: 120,
    cycle: "Quarterly",
    activeSubs: 14,
    featureTexts: [
      "Up to 120 pieces of clothing/month",
      "Unlimited Pickups",
      "Priority 24-hour turnaround",
      "All standard services included",
      "Dry cleaning for up to 15 items",
      "Free Stain treatments",
    ],
  },
];

// ------------------------------------------------------------------
// LOYALTY TIERS
// ------------------------------------------------------------------

export interface LoyaltyTier {
  level: 1 | 2 | 3;
  name: string;
  minOrders: number;
  maxOrders: number | null; // null = no upper limit
  discountPercentage: number;
  perks: string[];
}

export const sharedLoyaltyConfig: LoyaltyTier[] = [
  {
    level: 1,
    name: "Tier 1",
    minOrders: 0,
    maxOrders: 10,
    discountPercentage: 0,
    perks: ["Standard Queue", "Live Tracking"],
  },
  {
    level: 2,
    name: "Tier 2",
    minOrders: 11,
    maxOrders: 30,
    discountPercentage: 1,
    perks: ["Standard Queue", "Live Tracking", "Dedicated Support"],
  },
  {
    level: 3,
    name: "Tier 3",
    minOrders: 31,
    maxOrders: null,
    discountPercentage: 2,
    perks: ["Priority Service Queue", "Live Tracking", "Premium Care Kit"],
  },
];

// ------------------------------------------------------------------
// ORDER STATUS MAPPING
// ------------------------------------------------------------------

export type OrderStatus =
  | "PENDING"
  | "PICKUP_ASSIGNED"
  | "AT_HUB"
  | "IN_PRODUCTION"
  | "OUT_FOR_DELIVERY"
  | "COMPLETED"
  | "CANCELLED";

export const ORDER_STATUS_MAP: Record<
  OrderStatus,
  { label: string; description: string }
> = {
  PENDING: {
    label: "Pickup Scheduled",
    description: "We have received your order.",
  },
  PICKUP_ASSIGNED: {
    label: "Rider Assigned",
    description: "A rider is on the way to your location.",
  },
  AT_HUB: {
    label: "Picked Up",
    description: "Your items are on their way to our facility.",
  },
  IN_PRODUCTION: {
    label: "Cleaning",
    description: "Our experts are treating your garments.",
  },
  OUT_FOR_DELIVERY: {
    label: "Out For Delivery",
    description: "Your fresh clothes are on the way back.",
  },
  COMPLETED: {
    label: "Delivered",
    description: "Order completed successfully.",
  },
  CANCELLED: {
    label: "Cancelled",
    description: "This order was cancelled.",
  },
};

export const orderStatusFlow: OrderStatus[] = [
  "PENDING",
  "PICKUP_ASSIGNED",
  "AT_HUB",
  "IN_PRODUCTION",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
];
