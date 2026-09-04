import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { cookies } from "next/headers";

/**
 * GET /api/debug-session
 * Returns current session state and all auth-related cookies.
 * DELETE THIS FILE before going to full production.
 */
export async function GET() {
  const session = await auth();
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const authCookies = allCookies
    .filter(c => c.name.includes("authjs") || c.name.includes("next-auth") || c.name.includes("sc_admin"))
    .map(c => ({ name: c.name, valueLength: c.value.length, hasValue: !!c.value }));

  return NextResponse.json({
    hasSession: !!session,
    sessionUser: session?.user ? {
      id: session.user.id,
      email: session.user.email,
      role: (session.user as any)?.role,
      onboardingComplete: (session.user as any)?.onboardingComplete,
    } : null,
    authCookies,
    totalCookies: allCookies.length,
    env: {
      hasAuthSecret: !!process.env.AUTH_SECRET,
      authUrl: process.env.AUTH_URL,
      nodeEnv: process.env.NODE_ENV,
    }
  });
}
