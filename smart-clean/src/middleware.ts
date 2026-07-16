import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

// We initialize auth using ONLY the edge-compatible config for the middleware.
const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { nextUrl, auth: session } = request;
  const isLoggedIn = !!session;
  const path = nextUrl.pathname;

  if (path.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", nextUrl));
    }
    // @ts-expect-error
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", nextUrl));
    }
  }

  if (path.startsWith("/rider") && !path.startsWith("/rider/login")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/rider/login", nextUrl));
    }
    // @ts-expect-error
    if (session?.user?.role !== "RIDER") {
      return NextResponse.redirect(new URL("/rider/login", nextUrl));
    }
  }

  // --- Onboarding Logic ---
  // @ts-expect-error
  const onboardingComplete = session?.user?.onboardingComplete;
  const isOnboardingRoute = path.startsWith("/onboarding");

  if (isLoggedIn) {
    // If they haven't completed onboarding and they are NOT on the onboarding page
    // and NOT trying to log out (which hits /api/auth/signout)
    if (!onboardingComplete && !isOnboardingRoute && !path.startsWith("/api/auth")) {
      return NextResponse.redirect(new URL("/onboarding", nextUrl));
    }

    // If they HAVE completed onboarding, they shouldn't be on the onboarding page
    if (onboardingComplete && isOnboardingRoute) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    // Don't let logged-in users go to login/signup screens
    if (path === "/login" || path === "/signup") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};