"use server";

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

import { auth } from "@/auth";
import { revalidateTag } from "next/cache";

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
} from "@/data/shared-data";

import { type GarmentItem, garmentItems, getItemsForService, timeSlots, PICKUP_FEE, stainTypes } from "@/data/order-wizard-data";

// ------------------------------------------------------------------
// SECURE FETCH UTILITY
// ------------------------------------------------------------------

import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// NOTE: Environment variable validation has intentionally been moved INSIDE
// fetchFromAPI() below. Top-level throws crash the entire module at build time,
// silently dropping every page that imports api.ts from the Vercel build output.

const JWT_SECRET_VALUE = process.env.AUTH_SECRET;
const TECH_PASSKEY = process.env.TECH_PASSKEY || "";

async function fetchFromAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // ── Validate environment variables at call time, not module load time ──────
  const API_SECRET = process.env.API_SECRET;
  if (!API_SECRET) {
    throw new Error("API_SECRET is not defined in environment variables.");
  }
  if (!JWT_SECRET_VALUE) {
    throw new Error("AUTH_SECRET is not defined in environment variables.");
  }
  const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_VALUE);
  let userId = "";
  let userRole = "CUSTOMER";

  const cookieStore = await cookies();
  const adminToken = cookieStore.get("sc_admin_session")?.value;
  const isAdminEndpoint = endpoint.startsWith("/admin") || endpoint.startsWith("/tech");

  // 1. Try Admin Custom JWT (sc_admin_session) if accessing an admin endpoint
  if (isAdminEndpoint && adminToken) {
    try {
      const { payload } = await jwtVerify(adminToken, JWT_SECRET, {
        issuer: "smart-clean-admin",
        audience: "smart-clean-admin",
      });
      if (payload && payload.id) {
        userId = String(payload.id);
        userRole = (payload.role as string) || "ADMIN";
      }
    } catch (err) {
      console.error("JWT Verify Error in api.ts:", err);
    }
  }

  // 2. Fallback to NextAuth (Customers)
  if (!userId) {
    const session = await auth();
    if (session?.user?.id) {
      userId = session.user.id;
      // @ts-ignore
      userRole = session.user.role || "CUSTOMER";
    }
  }

  if (!userId) {
    throw new Error("Unauthorized: No session found");
  }

  const headers = new Headers(options.headers);
  headers.set("X-API-Secret", API_SECRET);
  headers.set("X-User-Id", userId);
  headers.set("X-User-Role", userRole);
  if (options.body) {
    headers.set("Content-Type", "application/json");
  }
  // Only send the tech passkey on tech/admin routes — not on customer-facing endpoints
  if (TECH_PASSKEY && isAdminEndpoint) {
    headers.set("X-Tech-Passkey", TECH_PASSKEY);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    cache: options.cache || "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error on ${endpoint}: ${response.status} ${errorText}`);
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

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

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ------------------------------------------------------------------
// ADMIN — ORDERS
// ------------------------------------------------------------------

/** Fetch all orders for the admin pipeline and order table. */
export async function getOrders(
  page: number = 1,
  limit: number = 50,
  search: string = "",
  status: string = "",
  dateFilter: string = "All Time",
  unassignedOnly: boolean = false,
  todayOnly: boolean = false
): Promise<PaginatedResponse<AdminOrder>> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) query.append("search", search);
  if (status && status !== "All Statuses" && status !== "all") query.append("status", status);
  if (dateFilter && dateFilter !== "All Time") query.append("dateFilter", dateFilter);
  if (unassignedOnly) query.append("unassignedOnly", "true");
  if (todayOnly) query.append("todayOnly", "true");

  return fetchFromAPI<PaginatedResponse<AdminOrder>>(`/admin/orders?${query.toString()}`);
}

/** 
 * Fetch a single order by ID. 
 * // TODO: wire to backend
 */
export async function getOrderById(id: string): Promise<AdminOrder | null> {
  await simulateDelay();
  return mockAdminOrders.find((o) => o.id === id) ?? null;
}

/** 
 * Update an order's status. Returns the updated order. 
 * // TODO: wire to backend
 */
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

/** 
 * Assign a rider to an order. 
 * // TODO: wire to backend
 */
export async function assignRiderToOrder(
  orderId: string,
  riderId: string
): Promise<AdminOrder | null> {
  await simulateDelay();
  // When backend is live: PATCH /api/orders/:id/rider
  const order = mockAdminOrders.find((o) => o.id === orderId);
  const rider = mockAdminRiders.find((r) => r.id === riderId);
  return order ? { ...order, rider: rider?.name || "Assigned Rider", status: "PICKUP_ASSIGNED" } : null;
}

// ------------------------------------------------------------------
// ADMIN — CUSTOMERS
// ------------------------------------------------------------------

/** Fetch all customers for the admin customers table. */
export async function getCustomers(
  page: number = 1,
  limit: number = 50,
  search: string = ""
): Promise<PaginatedResponse<AdminCustomer>> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) query.append("search", search);

  return fetchFromAPI<PaginatedResponse<AdminCustomer>>(`/admin/users?${query.toString()}`);
}

/** Fetch a single customer's profile by ID. */
export async function getCustomerById(id: string): Promise<{ customer: AdminCustomer; recentOrders: AdminOrder[] } | null> {
  try {
    return await fetchFromAPI<{ customer: AdminCustomer; recentOrders: AdminOrder[] }>(`/admin/users/${id}`);
  } catch (error) {
    console.error("Failed to fetch customer details:", error);
    return null;
  }
}

// ------------------------------------------------------------------
// ADMIN — RIDERS
// ------------------------------------------------------------------

/** 
 * Fetch all riders for the admin rider fleet table. 
 * // TODO: wire to backend
 */
export async function getRiders(): Promise<AdminRider[]> {
  await simulateDelay();
  return mockAdminRiders;
}

/** 
 * Fetch a single rider's profile by ID. 
 * // TODO: wire to backend
 */
export async function getRiderById(id: string): Promise<AdminRider | null> {
  await simulateDelay();
  return mockAdminRiders.find((r) => r.id === id) ?? null;
}

// ------------------------------------------------------------------
// ADMIN — SERVICES
// ------------------------------------------------------------------

/** Fetch all services for the admin service catalogue. */
export async function getServices(): Promise<AdminService[]> {
  // Using the new public endpoint
  return fetchFromAPI<AdminService[]>("/services", {
    cache: "force-cache",
    next: { tags: ["services"] }
  });
}

export async function getPopularServices(): Promise<AdminService[]> {
  return fetchFromAPI<AdminService[]>("/services/popular", {
    cache: "force-cache",
    next: { tags: ["services"] }
  });
}

export async function getServiceById(id: string): Promise<AdminService> {
  return fetchFromAPI<AdminService>(`/admin/services/${id}`);
}

/** Create a new service. */
export async function createService(data: Partial<AdminService>): Promise<AdminService | null> {
  const result = await fetchFromAPI<AdminService>("/admin/services", {
    method: "POST",
    body: JSON.stringify(data),
  });
  // @ts-expect-error: Next 16 types issue
  if (result) revalidateTag("services");
  return result;
}

/** Update an existing service. */
export async function updateService(id: string, data: Partial<AdminService>): Promise<AdminService | null> {
  const result = await fetchFromAPI<AdminService>(`/admin/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  // @ts-expect-error: Next 16 types issue
  if (result) revalidateTag("services");
  return result;
}

/** Reorder services. */
export async function reorderServices(items: { id: string; displayOrder: number }[]): Promise<boolean> {
  const res = await fetchFromAPI<{ success: boolean }>("/admin/services/reorder", {
    method: "PUT",
    body: JSON.stringify({ items }),
  });
  // @ts-expect-error: Next 16 types issue
  if (res) revalidateTag("services");
  return !!res;
}

/** Delete a service. */
export async function deleteService(id: string): Promise<boolean> {
  const res = await fetchFromAPI<{ success: boolean }>(`/admin/services/${id}`, {
    method: "DELETE",
  });
  // @ts-expect-error: Next 16 types issue
  if (res) revalidateTag("services");
  return !!res;
}

// ------------------------------------------------------------------
// ADMIN — SUBSCRIPTIONS
// ------------------------------------------------------------------

/** Fetch all subscriber records for the admin subscriptions table. */
export async function getSubscriptions(): Promise<AdminSubscription[]> {
  return fetchFromAPI<AdminSubscription[]>("/admin/subscriptions");
}

// ------------------------------------------------------------------
// SHARED — SUBSCRIPTION PLANS
// ------------------------------------------------------------------

/** 
 * Fetch the canonical subscription plans used by both customer and admin pages. 
 * // TODO: wire to backend
 */
export async function getSubscriptionPlans(): Promise<SharedPlan[]> {
  await simulateDelay();
  return sharedSubscriptionPlans;
}

// ------------------------------------------------------------------
// SHARED — LOYALTY CONFIG
// ------------------------------------------------------------------

/** 
 * Fetch the loyalty tier configuration used for tier display and calculations. 
 * // TODO: wire to backend
 */
export async function getLoyaltyConfig(): Promise<LoyaltyTier[]> {
  await simulateDelay();
  return sharedLoyaltyConfig;
}

// ------------------------------------------------------------------
// CUSTOMER — DASHBOARD
// ------------------------------------------------------------------

/** 
 * Fetch the current user's profile data. 
 * // TODO: wire to backend
 */
export async function getCurrentUser(): Promise<typeof mockUser> {
  await simulateDelay();
  return mockUser;
}

/** 
 * Fetch the current user's dashboard stats (order counts, reward points etc.). 
 * // TODO: wire to backend
 */
export async function getDashboardStats(): Promise<typeof mockStats> {
  await simulateDelay();
  return mockStats;
}

/** 
 * Fetch the customer's active (in-progress) order, or null if none. 
 * // TODO: wire to backend
 */
export async function getActiveOrder(): Promise<ActiveOrder | null> {
  await simulateDelay();
  return mockActiveOrder;
}

/** Fetch the customer's full order history. */
export async function getOrderHistory(): Promise<Order[]> {
  return fetchFromAPI<Order[]>("/orders");
}

/** Fetch a single customer order by ID (for the tracking page). */
export async function getCustomerOrderById(id: string): Promise<Order | null> {
  return fetchFromAPI<Order>(`/orders/${id}`);
}

// ------------------------------------------------------------------
// ORDER WIZARD — REFERENCE DATA
// ------------------------------------------------------------------

/** 
 * Fetch garment items with pricing for the order wizard. 
 */
export async function getGarmentItems(): Promise<typeof garmentItems> {
  return fetchFromAPI<typeof garmentItems>("/garments", {
    cache: "force-cache",
    next: { tags: ["garments"] }
  });
}

/** Fetch all garments for the admin dashboard (including inactive). */
export async function getAdminGarmentItems(): Promise<GarmentItem[]> {
  return fetchFromAPI<GarmentItem[]>("/admin/garments", {
    cache: "no-store"
  });
}

/** Create a new garment. */
export async function createGarment(data: Partial<GarmentItem>): Promise<GarmentItem | null> {
  const result = await fetchFromAPI<GarmentItem>("/admin/garments", {
    method: "POST",
    body: JSON.stringify(data),
  });
  // @ts-expect-error: Next 16 types issue
  if (result) revalidateTag("garments");
  return result;
}

/** Update an existing garment. */
export async function updateGarment(id: string, data: Partial<GarmentItem>): Promise<GarmentItem | null> {
  const result = await fetchFromAPI<GarmentItem>(`/admin/garments/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  // @ts-expect-error: Next 16 types issue
  if (result) revalidateTag("garments");
  return result;
}


/**
 * Fetch the allowed garment items for a specific service ID.
 * Used in Step 2 of the order wizard to show per-service item lists.
 * // TODO: wire to backend
 */
export async function getItemsForServiceId(serviceId: string): Promise<typeof garmentItems> {
  await simulateDelay();
  const service = await getServiceById(serviceId);
  const garments = await getGarmentItems();
  return getItemsForService(service, garments);
}

/** 
 * Fetch available pickup time slots for Step 3 of the order wizard. 
 * // TODO: wire to backend
 */
export async function getTimeSlots(): Promise<typeof timeSlots> {
  await simulateDelay();
  return timeSlots;
}

/** Submit a completed order from the wizard. Returns the new order ID. */
export async function placeOrder(orderPayload: any) {
  return fetchFromAPI("/orders", {
    method: "POST",
    body: JSON.stringify(orderPayload),
  });
}
