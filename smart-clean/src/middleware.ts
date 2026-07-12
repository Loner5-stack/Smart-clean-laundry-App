// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 💡 This function runs BEFORE any page loads.
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect /admin routes (except /admin/login)
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_token");
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect /rider routes (except /rider/login)
  if (path.startsWith("/rider") && !path.startsWith("/rider/login")) {
    const token = request.cookies.get("rider_token");
    if (!token) {
      return NextResponse.redirect(new URL("/rider/login", request.url));
    }
  }

  // Protect /dashboard routes (except /login or other public pages)
  if (path.startsWith("/dashboard")) {
    const token = request.cookies.get("auth_token");
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*", "/dashboard/:path*", "/rider/:path*"],
};
