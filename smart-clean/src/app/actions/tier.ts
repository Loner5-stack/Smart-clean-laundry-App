"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserTierData(userId: string) {
  try {
    // 1. Get total completed orders for the user
    const completedOrders = await prisma.order.count({
      where: {
        customerId: userId,
        status: "COMPLETED",
      },
    });

    // 2. Fetch all tiers from the database
    let tiers = await prisma.tierSetting.findMany({
      orderBy: { minOrders: "desc" },
    });

    // 3. Fallback to default tiers if none exist in DB yet
    if (tiers.length === 0) {
      await seedDefaultTiers();
      tiers = await prisma.tierSetting.findMany({
        orderBy: { minOrders: "desc" },
      });
    }

    // 4. Determine user's tier
    const userTier = tiers.find((tier) => completedOrders >= tier.minOrders);

    return {
      success: true,
      tierName: userTier?.name || "Bronze",
      completedOrders,
      nextTier: getNextTier(completedOrders, tiers),
    };
  } catch (error) {
    console.error("Error fetching user tier data:", error);
    return { success: false, tierName: "Bronze", completedOrders: 0 };
  }
}

export async function updateTierThresholds(updates: { id: string; minOrders: number }[]) {
  try {
    for (const update of updates) {
      await prisma.tierSetting.update({
        where: { id: update.id },
        data: { minOrders: update.minOrders },
      });
    }
    revalidatePath("/admin/settings");
    revalidatePath("/dashboard/account");
    return { success: true };
  } catch (error) {
    console.error("Error updating tier thresholds:", error);
    return { success: false, error: "Failed to update tiers." };
  }
}

async function seedDefaultTiers() {
  const defaultTiers = [
    { level: 1, name: "Bronze", minOrders: 0, maxOrders: 10, discountPercentage: 0, perks: ["Standard Queue", "Live Tracking"] },
    { level: 2, name: "Silver", minOrders: 11, maxOrders: 30, discountPercentage: 1, perks: ["Standard Queue", "Live Tracking", "Dedicated Support"] },
    { level: 3, name: "Gold", minOrders: 31, maxOrders: null, discountPercentage: 2, perks: ["Priority Service Queue", "Live Tracking", "Premium Care Kit"] },
  ];

  for (const t of defaultTiers) {
    await prisma.tierSetting.upsert({
      where: { level: t.level },
      update: {},
      create: t,
    });
  }
}

function getNextTier(currentOrders: number, allTiers: any[]) {
  // Tiers are sorted descending by minOrders (e.g., Gold, Silver, Bronze)
  // We want to find the lowest tier that is strictly > currentOrders
  // Sort ascending for easier comparison
  const sortedAsc = [...allTiers].sort((a, b) => a.minOrders - b.minOrders);
  const next = sortedAsc.find((t) => t.minOrders > currentOrders);
  if (!next) return null;
  return {
    name: next.name,
    ordersNeeded: next.minOrders - currentOrders,
  };
}

export async function getTiers() {
  let tiers = await prisma.tierSetting.findMany({
    orderBy: { minOrders: "asc" },
  });

  if (tiers.length === 0) {
    await seedDefaultTiers();
    tiers = await prisma.tierSetting.findMany({
      orderBy: { minOrders: "asc" },
    });
  }

  return tiers;
}
