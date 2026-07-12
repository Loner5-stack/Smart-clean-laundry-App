import React from "react";
import { Check, Sparkles, Shirt, Truck, Clock } from "lucide-react";

export interface SharedPlan {
  id: string;
  name: string;
  price: number;
  pieces: number;
  features: { icon: React.ReactNode; text: string }[];
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
    features: [
      { icon: <Shirt size={16} />, text: "Up to 30 pieces of clothing/month" },
      { icon: <Truck size={16} />, text: "2 Scheduled Pickups" },
      { icon: <Clock size={16} />, text: "Standard 48-hour turnaround" },
      { icon: <Check size={16} />, text: "Wash, Iron & Fold included" },
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
    features: [
      { icon: <Shirt size={16} />, text: "Up to 60 pieces of clothing/month" },
      { icon: <Truck size={16} />, text: "4 Scheduled Pickups (Weekly)" },
      { icon: <Clock size={16} />, text: "Standard 48-hour turnaround" },
      { icon: <Check size={16} />, text: "Wash, Iron & Fold included" },
      { icon: <Check size={16} />, text: "Dry cleaning for up to 5 items" },
    ],
  },
  {
    id: "plan-premium",
    name: "Premium Family",
    price: 45000,
    pieces: 120,
    cycle: "Quarterly",
    activeSubs: 14,
    features: [
      { icon: <Shirt size={16} />, text: "Up to 120 pieces of clothing/month" },
      { icon: <Truck size={16} />, text: "Unlimited Pickups" },
      { icon: <Clock size={16} />, text: "Priority 24-hour turnaround" },
      { icon: <Check size={16} />, text: "All standard services included" },
      { icon: <Check size={16} />, text: "Dry cleaning for up to 15 items" },
      { icon: <Check size={16} />, text: "Free Stain treatments" },
    ],
  },
];

export interface LoyaltyTier {
  level: 1 | 2 | 3;
  name: string;
  minOrders: number;
  maxOrders: number | null; // null means infinity
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
export type OrderStatus = "PENDING" | "PICKUP_ASSIGNED" | "AT_HUB" | "IN_PRODUCTION" | "OUT_FOR_DELIVERY" | "COMPLETED" | "CANCELLED";

export const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; description: string }> = {
  PENDING: {
    label: "Pickup Scheduled",
    description: "We have received your order."
  },
  PICKUP_ASSIGNED: {
    label: "Rider Assigned",
    description: "A rider is on the way to your location."
  },
  AT_HUB: {
    label: "Picked Up",
    description: "Your items are on their way to our facility."
  },
  IN_PRODUCTION: {
    label: "Cleaning",
    description: "Our experts are treating your garments."
  },
  OUT_FOR_DELIVERY: {
    label: "Out For Delivery",
    description: "Your fresh clothes are on the way back."
  },
  COMPLETED: {
    label: "Delivered",
    description: "Order completed successfully."
  },
  CANCELLED: {
    label: "Cancelled",
    description: "This order was cancelled."
  }
};

export const orderStatusFlow: OrderStatus[] = [
  "PENDING",
  "PICKUP_ASSIGNED",
  "AT_HUB",
  "IN_PRODUCTION",
  "OUT_FOR_DELIVERY",
  "COMPLETED"
];
