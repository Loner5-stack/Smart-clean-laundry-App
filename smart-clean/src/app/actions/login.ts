"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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
    // In NextAuth v5, signIn() in a Server Action throws a redirect internally.
    // We pass redirectTo so NextAuth redirects to the correct place.
    // The isRedirectError catch below re-throws it so Next.js processes the redirect.
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
    
    // This line is only reached if signIn doesn't redirect (shouldn't happen normally)
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
    
    // If it's a redirect error, we MUST re-throw it so Next.js handles it
    if (isRedirectError(error)) {
      throw error;
    }

    // Catch any other errors (like Prisma, Redis, etc) and send them to the UI
    console.error("Login Action Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unexpected server error occurred." };
  }
}