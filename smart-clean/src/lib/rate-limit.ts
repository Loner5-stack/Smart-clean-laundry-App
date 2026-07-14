import { headers } from "next/headers";

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 5; // 5 attempts allowed
const WINDOW_MS = 60 * 1000; // 1 minute window

export async function checkRateLimit(identifier: string) {
  const now = Date.now();
  const windowData = rateLimitMap.get(identifier);

  // If identifier doesn't exist or window expired, reset it
  if (!windowData || now - windowData.lastReset > WINDOW_MS) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return { success: true };
  }

  // If they exceeded the limit
  if (windowData.count >= LIMIT) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - windowData.lastReset)) / 1000);
    return { success: false, retryAfter };
  }

  // Increment attempts
  windowData.count += 1;
  return { success: true };
}

// Extract the client's IP address from headers
export async function getClientIp() {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  if (realIp) return realIp.trim();
  return "unknown-ip";
}
