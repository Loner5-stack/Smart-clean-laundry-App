import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * proxy.ts — Smart-Clean Route Protection
 *
 * We do NOT use NextAuth()'s auth() wrapper here because calling NextAuth()
 * at module load time in the edge runtime causes cold-start failures — Vercel's
 * CDN catches the throw and returns 404: NOT_FOUND before the app loads.
 *
 * Instead, we manually decode the NextAuth JWT cookie directly using jose,
 * which is the same lightweight approach NextAuth uses internally. This is
 * fully edge-compatible and has zero cold-start risk.
 */

export async function proxy(request: NextRequest) {
  try {
    return await handleProxy(request);
  } catch (err) {
    // Safety net: if the proxy itself throws for any reason,
    // pass the request through rather than returning a 404.
    console.error("[proxy] Unhandled error — passing through:", err);
    return NextResponse.next();
  }
}

async function handleProxy(request: NextRequest) {
  const { nextUrl } = request;
  const path = nextUrl.pathname;

  // Resolve secrets at request time — never at module load
  const authSecret = process.env.AUTH_SECRET;
  if (!authSecret) {
    // Can't verify any session — let public routes through, block protected ones
    if (
      path.startsWith("/dashboard") ||
      path.startsWith("/onboarding") ||
      path.startsWith("/rider")
    ) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    return NextResponse.next();
  }

  const SECRET = new TextEncoder().encode(authSecret);

  // ── Decode NextAuth session JWT ──────────────────────────────────────────
  // NextAuth v5 stores the session in "authjs.session-token" (dev) or
  // "__Secure-authjs.session-token" (production https)
  const sessionCookie =
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value;

  let sessionPayload: { id?: string; role?: string; onboardingComplete?: boolean } = {};
  let isLoggedIn = false;

  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, SECRET);
      sessionPayload = payload as typeof sessionPayload;
      isLoggedIn = true;
    } catch {
      // Invalid or expired session — treat as logged out
      isLoggedIn = false;
    }
  }

  const userRole = sessionPayload?.role || null;
  const onboardingComplete = sessionPayload?.onboardingComplete ?? false;

  // ── /dashboard — CUSTOMER only ───────────────────────────────────────────
  if (path.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (userRole && userRole !== "CUSTOMER") {
      const response = NextResponse.redirect(new URL("/login", nextUrl));
      response.cookies.delete("authjs.session-token");
      response.cookies.delete("__Secure-authjs.session-token");
      return response;
    }
  }

  // ── /admin — Admin JWT cookie only ──────────────────────────────────────
  if (
    path.startsWith("/admin") &&
    !path.startsWith("/admin/login") &&
    !path.startsWith("/admin/tech-login")
  ) {
    const adminToken = request.cookies.get("sc_admin_session")?.value;
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", nextUrl));
    }
    try {
      await jwtVerify(adminToken, SECRET, {
        issuer: "smart-clean-admin",
        audience: "smart-clean-admin",
      });
    } catch {
      return NextResponse.redirect(new URL("/admin/login", nextUrl));
    }
  }

  // ── /rider — RIDER role only ─────────────────────────────────────────────
  if (path.startsWith("/rider") && !path.startsWith("/rider/login")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/rider/login", nextUrl));
    }
    if (userRole !== "RIDER") {
      return NextResponse.redirect(new URL("/rider/login", nextUrl));
    }
  }

  // ── Onboarding gate (CUSTOMER only) ─────────────────────────────────────
  const isOnboardingRoute = path.startsWith("/onboarding");

  if (isLoggedIn && (!userRole || userRole === "CUSTOMER")) {
    if (!onboardingComplete && !isOnboardingRoute && !path.startsWith("/api/auth")) {
      return NextResponse.redirect(new URL("/onboarding", nextUrl));
    }
    if (onboardingComplete && isOnboardingRoute) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    if (path === "/login" || path === "/signup") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  // ── Non-customer logged in on auth pages — clear stale session ──────────
  if (isLoggedIn && userRole && userRole !== "CUSTOMER") {
    if (path === "/login" || path === "/signup") {
      const response = NextResponse.next();
      response.cookies.delete("authjs.session-token");
      response.cookies.delete("__Secure-authjs.session-token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
