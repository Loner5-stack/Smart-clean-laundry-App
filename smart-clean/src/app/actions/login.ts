"use server";

import { AuthError } from "next-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * loginAction — validates credentials server-side only.
 * Does NOT call signIn() — that is handled client-side by next-auth/react
 * so that the session cookie is set correctly in the browser.
 */
export async function loginAction(formData: FormData) {
  try {
    const ip = await getClientIp();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { success: false, error: "Email and password are required." };
    }

    // 1. Rate limit by IP
    const ipLimit = await checkRateLimit(`ip_${ip}`);
    if (!ipLimit.success) {
      return { success: false, error: `Too many attempts from this IP. Please try again in ${ipLimit.retryAfter} seconds.` };
    }

    // 2. Rate limit by Email
    const emailLimit = await checkRateLimit(`email_${email}`);
    if (!emailLimit.success) {
      return { success: false, error: `Too many attempts for this account. Please try again in ${emailLimit.retryAfter} seconds.` };
    }

    // 3. Validate credentials against the database
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { success: false, error: "Account with this email does not exist." };
    }

    if (user.role !== "CUSTOMER") {
      return { success: false, error: "This login portal is restricted to customers only." };
    }

    if (!user.password) {
      return { success: false, error: "Please log in with Google, as this email was registered using OAuth." };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    // Credentials are valid — tell the client to proceed with signIn
    return { success: true };
  } catch (error) {
    console.error("Login Action Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unexpected server error occurred." };
  }
}