import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * proxy.ts — TEMPORARILY SIMPLIFIED FOR DEBUGGING
 * Passing all requests through to verify the app itself loads correctly.
 * Auth logic will be re-added once the app is confirmed working on Vercel.
 */
export async function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
