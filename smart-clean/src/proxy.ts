import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * proxy.ts — Smart-Clean Route Protection
 *
 * We manually decode the NextAuth JWT cookie directly using jose rather than
 * wrapping with NextAuth(). This is fully edge-compatible and avoids the
 * cold-start failures that occur when NextAuth() is called at module load time.
 *
 * The outer try/catch is a hard safety net: if the proxy throws for ANY reason,
 * the request passes through rather than returning 404. This means in the
 * absolute worst case, a user can reach a page but won't have auth enforced —
 * the page-level auth checks (auth() calls in layouts/pages) will still protect
 * sensitive data.
 */

export async function proxy(request: NextRequest) {
  try {
    return await handleProxy(request);
  } catch (err) {
    console.error("[proxy] Unhandled error — passing through:", err);
    return NextResponse.next();
  }
}

async function handleProxy(request: NextRequest) {
  const { nextUrl } = request;
  const path = nextUrl.pathname;

  // ── Resolve AUTH_SECRET at request time ────────────────────────────────────
  const authSecret = process.env.AUTH_SECRET;
  if (!authSecret) {
    // No secret means we can't verify any session.
    // Block protected routes, allow everything else.
    if (
      path.startsWith("/dashboard") ||
      path.startsWith("/onboarding") ||
      (path.startsWith("/rider") && !path.startsWith("/rider/login"))
    ) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    return NextResponse.next();
  }

  const SECRET = new TextEncoder().encode(authSecret);

  // ── Decode NextAuth session JWT ─────────────────────────────────────────────
  // NextAuth v5 stores the JWT in one of these two cookie names depending on
  // whether the site is served over HTTPS (production) or HTTP (dev).
  const sessionCookie =
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value;

  let userRole: string | null = null;
  let onboardingComplete = false;
  let isLoggedIn = false;

  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, SECRET);
      userRole = (payload?.role as string) || null;
      onboardingComplete = (payload?.onboardingComplete as boolean) ?? false;
      isLoggedIn = true;
    } catch {
      // Expired or invalid token — treat as logged out
      isLoggedIn = false;
    }
  }

  // ── /dashboard — CUSTOMER only ──────────────────────────────────────────────
  if (path.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (userRole && userRole !== "CUSTOMER") {
      // Wrong role — clear stale NextAuth cookie and redirect to login
      const response = NextResponse.redirect(new URL("/login", nextUrl));
      response.cookies.delete("authjs.session-token");
      response.cookies.delete("__Secure-authjs.session-token");
      return response;
    }
  }

  // ── /admin — Admin JWT cookie only ─────────────────────────────────────────
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

  // ── /rider — RIDER role only ────────────────────────────────────────────────
  if (path.startsWith("/rider") && !path.startsWith("/rider/login")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/rider/login", nextUrl));
    }
    if (userRole !== "RIDER") {
      return NextResponse.redirect(new URL("/rider/login", nextUrl));
    }
  }

  // ── Onboarding gate — CUSTOMER only ────────────────────────────────────────
  const isOnboardingRoute = path.startsWith("/onboarding");
  const isCustomer = !userRole || userRole === "CUSTOMER";

  if (isLoggedIn && isCustomer) {
    // Redirect to onboarding if not yet complete
    if (
      !onboardingComplete &&
      !isOnboardingRoute &&
      !path.startsWith("/api/auth")
    ) {
      return NextResponse.redirect(new URL("/onboarding", nextUrl));
    }

    // Redirect away from onboarding if already complete
    if (onboardingComplete && isOnboardingRoute) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    // Don't let logged-in customers land on login/signup
    if (path === "/login" || path === "/signup") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  // ── Non-customer on auth pages — clear stale session ───────────────────────
  if (isLoggedIn && userRole && !isCustomer) {
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
