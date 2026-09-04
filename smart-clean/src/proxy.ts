import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * proxy.ts — Smart-Clean Route Protection
 *
 * IMPORTANT: NextAuth v5 signs JWTs with a derived key (HKDF), not the raw
 * AUTH_SECRET. We cannot verify the JWT ourselves without reproducing the
 * same key derivation. Instead, we read the session by checking the cookie
 * existence and trusting the server-side auth() calls in layouts/pages for
 * actual validation.
 *
 * For route protection we use a lightweight approach:
 * - Presence of __Secure-authjs.session-token (or authjs.session-token in dev)
 *   indicates an authenticated user.
 * - The actual session contents (role, onboardingComplete) are validated by
 *   the server components/layouts that call auth() directly.
 * - Admin routes are protected by our own sc_admin_session JWT which we DO
 *   sign with the raw secret.
 */

import { jwtVerify } from "jose";

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

  // ── Check session cookie presence (not content) ─────────────────────────
  // NextAuth v5 uses HKDF key derivation so we cannot verify the JWT here.
  // We only check if the cookie exists to determine logged-in state.
  // Page-level auth() calls in Server Components enforce actual authorization.
  const sessionCookie =
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value;

  const isLoggedIn = !!sessionCookie;

  // ── /admin — protected by our own JWT (sc_admin_session) ────────────────
  if (
    path.startsWith("/admin") &&
    !path.startsWith("/admin/login") &&
    !path.startsWith("/admin/tech-login")
  ) {
    const adminToken = request.cookies.get("sc_admin_session")?.value;
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", nextUrl));
    }

    const authSecret = process.env.AUTH_SECRET;
    if (!authSecret) {
      return NextResponse.redirect(new URL("/admin/login", nextUrl));
    }

    try {
      await jwtVerify(
        adminToken,
        new TextEncoder().encode(authSecret),
        { issuer: "smart-clean-admin", audience: "smart-clean-admin" }
      );
    } catch {
      return NextResponse.redirect(new URL("/admin/login", nextUrl));
    }
  }

  // ── /dashboard — requires session cookie ────────────────────────────────
  if (path.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    // Role and onboarding checks are handled by the dashboard layout
    // via server-side auth() which can actually read the JWT correctly.
  }

  // ── /rider — requires session cookie ────────────────────────────────────
  if (path.startsWith("/rider") && !path.startsWith("/rider/login")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/rider/login", nextUrl));
    }
  }

  // ── /onboarding — requires session cookie ───────────────────────────────
  if (path.startsWith("/onboarding")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
  }

  // ── Redirect logged-in users away from auth pages ───────────────────────
  if (isLoggedIn && (path === "/login" || path === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
