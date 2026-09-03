/**
 * mock-shared.tsx
 *
 * UI-enriched plan data with React icon nodes for client components.
 * Import this in UI components (subscription pages, plan cards, etc.).
 *
 * For server-safe data (api.ts, Server Actions), import mock-shared.ts instead.
 */

import React from "react";
import { Check, Shirt, Truck, Clock } from "lucide-react";
import {
  sharedSubscriptionPlans as basePlans,
  type SharedPlan as BaseSharedPlan,
} from "./mock-shared";

// Re-export everything from the server-safe file so UI files only need one import
export * from "./mock-shared";

// Extend the base plan type with React icon nodes for UI rendering
export interface SharedPlanWithIcons extends BaseSharedPlan {
  features: { icon: React.ReactNode; text: string }[];
}

/**
 * Subscription plans with Lucide icon nodes attached to each feature.
 * Use this in client components that render the plan cards.
 */
export const sharedSubscriptionPlansWithIcons: SharedPlanWithIcons[] =
  basePlans.map((plan) => ({
    ...plan,
    features: plan.featureTexts.map((text, i) => ({
      text,
      icon: getIconForFeature(text, i),
    })),
  }));

function getIconForFeature(text: string, index: number): React.ReactNode {
  if (text.toLowerCase().includes("piece")) return <Shirt size={16} />;
  if (text.toLowerCase().includes("pickup")) return <Truck size={16} />;
  if (text.toLowerCase().includes("turnaround")) return <Clock size={16} />;
  return <Check size={16} />;
}
