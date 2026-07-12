/**
 * src/lib/api.ts
 *
 * API Data Access Layer — Smart Clean
 *
 * This file is the single seam between the frontend UI and the backend API.
 * Currently, all functions return mock data from the local data files.
 *
 * When the Fastify backend on Render is ready, replace each function body
 * with a fetch() call to the corresponding Render endpoint. No component
 * changes will be required — only this file needs to be updated.
 *
 * Pattern:
 *   BEFORE (mock):  return mockAdminOrders;
 *   AFTER (backend): return fetchFromAPI<AdminOrder[]>("/api/orders");
 */

import {
  mockAdminOrders,
  mockAdminCustomers,
  mockAdminRiders,
  mockAdminServices,
  mockAdminSubscriptions,
  type AdminOrder,
  type AdminCustomer,
  type AdminRider,
  type AdminService,
  type AdminSubscription,
} from "@/data/mock-admin";

import {
  mockActiveOrder,
  mockOrders,
  mockStats,
  mockUser,
  type ActiveOrder,
  type Order,
} from "@/data/mock-dashboard";

import {
  sharedSubscriptionPlans,
  sharedLoyaltyConfig,
  type SharedPlan,
  type LoyaltyTier,
} from "@/data/mock-shared";

import { garmentItems, getItemsForService, timeSlots, PICKUP_FEE, stainTypes } from "@/data/order-wizard-data";

// ------------------------------------------------------------------
// INTERNAL HELPER (replace with real fetch when backend is live)
// ------------------------------------------------------------------

/**
 * Simulates a small network delay to mimic real API behaviour.
 * Remove this in production when real fetch() calls are used.
 */
function simulateDelay(ms = 50): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ------------------------------------------------------------------
// ADMIN — ORDERS
// ------------------------------------------------------------------

/** Fetch all orders for the admin pipeline and order table. */
export async function getOrders(): Promise<AdminOrder[]> {
  await simulateDelay();
  return mockAdminOrders;
}

/** Fetch a single order by ID. */
export async function getOrderById(id: string): Promise<AdminOrder | null> {
  await simulateDelay();
  return mockAdminOrders.find((o) => o.id === id) ?? null;
}

/** Update an order's status. Returns the updated order. */
export async function updateOrderStatus(
  id: string,
  status: AdminOrder["status"]
): Promise<AdminOrder | null> {
  await simulateDelay();
  // NOTE: In mock mode this does NOT persist — the component manages local state.
  // When backend is live: PATCH /api/orders/:id/status
  const order = mockAdminOrders.find((o) => o.id === id);
  return order ? { ...order, status } : null;
}

/** Assign a rider to an order. */
export async function assignRiderToOrder(
  orderId: string,
  riderName: string
): Promise<AdminOrder | null> {
  await simulateDelay();
  // When backend is live: PATCH /api/orders/:id/rider
  const order = mockAdminOrders.find((o) => o.id === orderId);
  return order ? { ...order, rider: riderName, status: "PICKUP_ASSIGNED" } : null;
}

// ------------------------------------------------------------------
// ADMIN — CUSTOMERS
// ------------------------------------------------------------------

/** Fetch all customers for the admin customers table. */
export async function getCustomers(): Promise<AdminCustomer[]> {
  await simulateDelay();
  return mockAdminCustomers;
}

/** Fetch a single customer's profile by ID. */
export async function getCustomerById(id: string): Promise<AdminCustomer | null> {
  await simulateDelay();
  return mockAdminCustomers.find((c) => c.id === id) ?? null;
}

// ------------------------------------------------------------------
// ADMIN — RIDERS
// ------------------------------------------------------------------

/** Fetch all riders for the admin rider fleet table. */
export async function getRiders(): Promise<AdminRider[]> {
  await simulateDelay();
  return mockAdminRiders;
}

/** Fetch a single rider's profile by ID. */
export async function getRiderById(id: string): Promise<AdminRider | null> {
  await simulateDelay();
  return mockAdminRiders.find((r) => r.id === id) ?? null;
}

// ------------------------------------------------------------------
// ADMIN — SERVICES
// ------------------------------------------------------------------

/** Fetch all services for the admin service catalogue. */
export async function getServices(): Promise<AdminService[]> {
  await simulateDelay();
  return mockAdminServices;
}

// ------------------------------------------------------------------
// ADMIN — SUBSCRIPTIONS
// ------------------------------------------------------------------

/** Fetch all subscriber records for the admin subscriptions table. */
export async function getSubscriptions(): Promise<AdminSubscription[]> {
  await simulateDelay();
  return mockAdminSubscriptions;
}

// ------------------------------------------------------------------
// SHARED — SUBSCRIPTION PLANS
// ------------------------------------------------------------------

/** Fetch the canonical subscription plans used by both customer and admin pages. */
export async function getSubscriptionPlans(): Promise<SharedPlan[]> {
  await simulateDelay();
  return sharedSubscriptionPlans;
}

// ------------------------------------------------------------------
// SHARED — LOYALTY CONFIG
// ------------------------------------------------------------------

/** Fetch the loyalty tier configuration used for tier display and calculations. */
export async function getLoyaltyConfig(): Promise<LoyaltyTier[]> {
  await simulateDelay();
  return sharedLoyaltyConfig;
}

// ------------------------------------------------------------------
// CUSTOMER — DASHBOARD
// ------------------------------------------------------------------

/** Fetch the current user's profile data. */
export async function getCurrentUser(): Promise<typeof mockUser> {
  await simulateDelay();
  return mockUser;
}

/** Fetch the current user's dashboard stats (order counts, reward points etc.). */
export async function getDashboardStats(): Promise<typeof mockStats> {
  await simulateDelay();
  return mockStats;
}

/** Fetch the customer's active (in-progress) order, or null if none. */
export async function getActiveOrder(): Promise<ActiveOrder | null> {
  await simulateDelay();
  return mockActiveOrder;
}

/** Fetch the customer's full order history. */
export async function getOrderHistory(): Promise<Order[]> {
  await simulateDelay();
  return mockOrders;
}

/** Fetch a single customer order by ID (for the tracking page). */
export async function getCustomerOrderById(id: string): Promise<Order | null> {
  await simulateDelay();
  return mockOrders.find((o) => o.id === id) ?? null;
}

// ------------------------------------------------------------------
// ORDER WIZARD — REFERENCE DATA
// ------------------------------------------------------------------

/** Fetch garment items with pricing for the order wizard. */
export async function getGarmentItems(): Promise<typeof garmentItems> {
  await simulateDelay();
  return garmentItems;
}

/**
 * Fetch the allowed garment items for a specific service ID.
 * Used in Step 2 of the order wizard to show per-service item lists.
 */
export async function getItemsForServiceId(serviceId: string): Promise<typeof garmentItems> {
  await simulateDelay();
  return getItemsForService(serviceId);
}

/** Fetch available pickup time slots for Step 3 of the order wizard. */
export async function getTimeSlots(): Promise<typeof timeSlots> {
  await simulateDelay();
  return timeSlots;
}

/** Submit a completed order from the wizard. Returns the new order ID. */
export async function placeOrder(
  orderPayload: Record<string, unknown>
): Promise<{ orderId: string }> {
  await simulateDelay(300); // Simulate longer network call for order submission
  // When backend is live: POST /api/orders with orderPayload
  console.log("[api.ts] placeOrder called with:", orderPayload);
  return { orderId: `SC-${Math.floor(4000 + Math.random() * 999)}` };
}
