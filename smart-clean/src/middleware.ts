import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// We initialize auth using ONLY the edge-compatible config for the middleware.
const { auth } = NextAuth(authConfig);

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback_secret_for_development_only"
);

export default auth(async (request) => {
  const { nextUrl, auth: session } = request;
  const isLoggedIn = !!session;
  const path = nextUrl.pathname;

  if (path.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    // @ts-expect-error - session.user.role is not fully typed
    if (session?.user?.role && session.user.role !== "CUSTOMER") {
      // If an Admin or Rider somehow has a legacy NextAuth session, destroy it and kick them out
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
      await jwtVerify(adminToken, SECRET);
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
      // If a non-customer is logged in via NextAuth (e.g. via Google), 
      // don't let them access customer pages. 
      // If they are on a customer auth page, maybe redirect them to their respective portals
      if (path === "/login" || path === "/signup") {
        // Clear the invalid session and let them view the login page normally
        const response = NextResponse.next();
        response.cookies.delete("authjs.session-token");
        response.cookies.delete("__Secure-authjs.session-token");
        return response;
      }
    } else {
      // If they haven't completed onboarding and they are NOT on the onboarding page
      // and NOT trying to log out (which hits /api/auth/signout)
      if (!onboardingComplete && !isOnboardingRoute && !path.startsWith("/api/auth")) {
        return NextResponse.redirect(new URL("/onboarding", nextUrl));
      }

      // If they HAVE completed onboarding, they shouldn't be on the onboarding page
      if (onboardingComplete && isOnboardingRoute) {
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }

      // Don't let logged-in customers go to login/signup screens
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