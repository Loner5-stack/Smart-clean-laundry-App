"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

if (!process.env.AUTH_SECRET) {
  throw new Error("AUTH_SECRET is not defined in environment variables.");
}
const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function adminLoginAction(formData: FormData) {
  const ip = await getClientIp();
  
  // ── Rate limit by IP ─────────────────────────────────────────────────────
  const ipLimit = await checkRateLimit(`admin_login_ip_${ip}`);
  if (!ipLimit.success) {
    return { success: false, error: `Too many login attempts. Please try again in ${ipLimit.retryAfter} seconds.` };
  }

  const passcode = formData.get("passcode") as string;

  if (!passcode) {
    return { success: false, error: "Passcode is required." };
  }

  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
    });

    if (admins.length === 0) {
      return { success: false, error: "Admin account not found in the system." };
    }
    
    if (admins.length > 1) {
      return { success: false, error: "System configuration error: Multiple admins detected. Standalone login disabled." };
    }

    const adminUser = admins[0];

    if (!adminUser.password) {
      return { success: false, error: "Admin account not properly configured." };
    }

    const isMatch = await bcrypt.compare(passcode, adminUser.password);

    if (!isMatch) {
      return { success: false, error: "Invalid passcode." };
    }

    // Create a separate admin session JWT
    const token = await new SignJWT({
      id: adminUser.id,
      role: adminUser.role,
      email: adminUser.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer("smart-clean-admin")
      .setAudience("smart-clean-admin")
      .setExpirationTime("24h")
      .sign(SECRET);

    const cookieStore = await cookies();
    cookieStore.set("sc_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/admin",
    });

    return { success: true };
  } catch (error) {
    console.error("Admin login error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
