import { NextResponse } from "next/server";

/**
 * GET /api/health
 * Diagnostic endpoint — bypasses the proxy entirely.
 * Used to verify Vercel routing is working at all.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      hasAuthSecret: !!process.env.AUTH_SECRET,
      hasApiSecret: !!process.env.API_SECRET,
      hasDbUrl: !!process.env.DATABASE_URL,
      apiUrl: process.env.NEXT_PUBLIC_API_URL || "not set",
      authUrl: process.env.AUTH_URL || "not set",
      nodeEnv: process.env.NODE_ENV,
    },
  });
}
