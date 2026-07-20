"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback_secret_for_development_only"
);

export async function adminLoginAction(formData: FormData) {
  const passcode = formData.get("passcode") as string;

  if (!passcode) {
    return { success: false, error: "Passcode is required." };
  }

  try {
    const adminUser = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!adminUser || !adminUser.password) {
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
