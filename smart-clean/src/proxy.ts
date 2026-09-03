import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// We initialize auth using ONLY the edge-compatible config for the proxy.
const { auth } = NextAuth(authConfig);

// NOTE: AUTH_SECRET validation is deferred to request time (inside the handler)
// to avoid crashing the edge runtime at module load when env vars are absent
// during Vercel's build/prerender phase.

export default auth(async (request) => {
  const { nextUrl, auth: session } = request;
  const isLoggedIn = !!session;
  const path = nextUrl.pathname;

  // Resolve AUTH_SECRET at request time — never at module load
  const authSecret = process.env.AUTH_SECRET;
  if (!authSecret) {
    console.error("AUTH_SECRET is not set — blocking all protected routes");
    return NextResponse.redirect(new URL("/login", nextUrl));
  }
  const SECRET = new TextEncoder().encode(authSecret);

  if (path.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    // @ts-expect-error - session.user.role is not fully typed
    if (session?.user?.role && session.user.role !== "CUSTOMER") {
      const response = NextResponse.redirect(new URL("/login", nextUrl));
      response.cookies.delete("authjs.session-token");
      response.cookies.delete("__Secure-authjs.session-token");
      return response;
    }
  }

  if (path.startsWith("/admin") && !path.startsWith("/admin/login") && !path.startsWith("/admin/tech-login")) {
    const adminToken = request.cookies.get("sc_admin_session")?.value;

    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", nextUrl));
    }

    try {
      await jwtVerify(adminToken, SECRET, {
        issuer: "smart-clean-admin",
        audience: "smart-clean-admin",
      });
    } catch (err) {
      return NextResponse.redirect(new URL("/admin/login", nextUrl));
    }
  }

  if (path.startsWith("/rider") && !path.startsWith("/rider/login")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/rider/login", nextUrl));
    }
    // @ts-expect-error - session.user.role is not fully typed
    if (session?.user?.role !== "RIDER") {
      return NextResponse.redirect(new URL("/rider/login", nextUrl));
    }
  }

  // --- Onboarding Logic ---
  // @ts-expect-error - session.user.onboardingComplete is not fully typed
  const onboardingComplete = session?.user?.onboardingComplete;
  const isOnboardingRoute = path.startsWith("/onboarding");

  if (isLoggedIn) {
    // @ts-expect-error - session.user.role is not fully typed
    const isCustomer = !session?.user?.role || session.user.role === "CUSTOMER";

    if (!isCustomer) {
      if (path === "/login" || path === "/signup") {
        const response = NextResponse.next();
        response.cookies.delete("authjs.session-token");
        response.cookies.delete("__Secure-authjs.session-token");
        return response;
      }
    } else {
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
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
