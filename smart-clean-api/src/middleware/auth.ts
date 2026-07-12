import { FastifyRequest, FastifyReply } from "fastify";
import { timingSafeEqual } from "crypto";
import { UserRole } from "@prisma/client";

/**
 * Encodes a string as a Buffer for constant-time comparison.
 * Using timingSafeEqual prevents timing-based secret enumeration attacks.
 */
function safeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  // Lengths must match first — early-return here is safe because
  // length is not considered secret (the attacker already sent the header).
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

/**
 * Verifies:
 * 1. X-API-Secret header matches our shared server-to-server secret
 * 2. Authorization: Bearer <jwt> is present and valid (signed by NextAuth)
 *
 * Attaches decoded user payload to request.user for use in route handlers.
 */
export async function verifyAuth(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const apiSecret = process.env.API_SECRET;
  if (!apiSecret) {
    request.log.error("API_SECRET env variable is not set");
    return reply.status(500).send({ error: "Server misconfiguration" });
  }

  // ── 1. Validate shared API secret ─────────────────────────────────
  const incomingSecret = request.headers["x-api-secret"];
  if (typeof incomingSecret !== "string" || !safeCompare(incomingSecret, apiSecret)) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  // ── 2. Verify NextAuth JWT ─────────────────────────────────────────
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({ error: "Invalid or expired token" });
  }
}

/**
 * Role-based guard factory.
 * Usage: preHandler: [verifyAuth, requireRole("ADMIN")]
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { role?: UserRole };
    if (!user?.role || !allowedRoles.includes(user.role)) {
      return reply.status(403).send({ error: "Forbidden" });
    }
  };
}

/**
 * Technical Passkey guard.
 * Validates the X-Tech-Passkey header against the TECH_PASSKEY env variable.
 * Must be used AFTER verifyAuth so we know they are authenticated first.
 */
export async function requireTechPasskey(request: FastifyRequest, reply: FastifyReply) {
  const techPasskey = process.env.TECH_PASSKEY;
  if (!techPasskey) {
    request.log.error("TECH_PASSKEY env variable is not set");
    return reply.status(500).send({ error: "Server misconfiguration" });
  }

  const incomingPasskey = request.headers["x-tech-passkey"];
  if (typeof incomingPasskey !== "string" || !safeCompare(incomingPasskey, techPasskey)) {
    return reply.status(403).send({ error: "Technical passkey required" });
  }
}

// Extend the Fastify JWT user type
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: string; email: string; role: UserRole };
    user: { id: string; email: string; role: UserRole };
  }
}
