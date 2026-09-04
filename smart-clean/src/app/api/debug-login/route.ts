import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { cookies } from "next/headers";

/**
 * GET /api/debug-login
 * 
 * Returns the exact state of the session and cookies on the server.
 * Use this immediately after a login attempt to see what the server sees.
 * REMOVE THIS FILE before going to production.
 */
export async function GET() {
  const session = await auth();
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  return NextResponse.json({
    hasSession: !!session,
    sessionUser: session?.user ? {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      // @ts-ignore
      role: session.user.role,
      // @ts-ignore
      onboardingComplete: session.user.onboardingComplete,
    } : null,
    cookies: allCookies.map(c => ({
      name: c.name,
      // Only show if the cookie exists, not its value (security)
      exists: true,
      isAuthCookie: c.name.includes("authjs") || c.name.includes("next-auth"),
    })),
    timestamp: new Date().toISOString(),
    env: {
      authUrl: process.env.AUTH_URL || "NOT SET",
      nodeEnv: process.env.NODE_ENV,
    }
  });
}
