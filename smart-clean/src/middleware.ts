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

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/rider/:path*"],
};