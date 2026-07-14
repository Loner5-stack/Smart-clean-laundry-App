"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function loginAction(formData: FormData) {
  try {
    const ip = await getClientIp();
    const email = formData.get("email") as string;

    // 1. Rate limit by IP (Prevents sweeping enumeration across many accounts)
    const ipLimit = await checkRateLimit(`ip_${ip}`);
    if (!ipLimit.success) {
      return { success: false, error: `Too many attempts from this IP. Please try again in ${ipLimit.retryAfter} seconds.` };
    }

    // 2. Rate limit by Email (Prevents brute-forcing a single account from multiple IPs)
    if (email) {
      const emailLimit = await checkRateLimit(`email_${email}`);
      if (!emailLimit.success) {
        return { success: false, error: `Too many attempts for this account. Please try again in ${emailLimit.retryAfter} seconds.` };
      }
    }

    const password = formData.get("password");
    // NextAuth requires the provider and the credentials payload
    await signIn("credentials", {
      email,
      password,
      redirect: false // We will handle the redirect manually on the client
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      // In NextAuth v5, custom errors thrown in authorize are wrapped
      // inside error.cause?.err?.message
      const customMessage = (error.cause as any)?.err?.message;

      if (customMessage) {
        return { success: false, error: customMessage };
      }

      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid credentials." };
        default:
          return { success: false, error: "Something went wrong." };
      }
    }
    // Next.js redirect() throws a special error that we must re-throw
    throw error;
  }
}