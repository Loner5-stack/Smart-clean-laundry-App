"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = verifyAuth;
exports.requireRole = requireRole;
exports.requireTechPasskey = requireTechPasskey;
const crypto_1 = require("crypto");
/**
 * Encodes a string as a Buffer for constant-time comparison.
 * Using timingSafeEqual prevents timing-based secret enumeration attacks.
 */
function safeCompare(a, b) {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    // Lengths must match first — early-return here is safe because
    // length is not considered secret (the attacker already sent the header).
    if (aBuf.length !== bBuf.length)
        return false;
    return (0, crypto_1.timingSafeEqual)(aBuf, bBuf);
}
/**
 * Verifies:
 * 1. X-API-Secret header matches our shared server-to-server secret
 * 2. Authorization: Bearer <jwt> is present and valid (signed by NextAuth)
 *
 * Attaches decoded user payload to request.user for use in route handlers.
 */
async function verifyAuth(request, reply) {
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
    // ── 2. Trust the BFF User Headers ─────────────────────────────────
    const userId = request.headers["x-user-id"];
    const userRole = request.headers["x-user-role"];
    if (userId && userRole) {
        // Next.js (BFF) has already authenticated the user and is passing the context
        request.user = {
            id: userId,
            email: "",
            role: userRole
        };
        return;
    }
    // ── 3. Verify NextAuth JWT (Fallback) ─────────────────────────────
    try {
        await request.jwtVerify();
    }
    catch {
        return reply.status(401).send({ error: "Invalid or missing authentication headers" });
    }
}
/**
 * Role-based guard factory.
 * Usage: preHandler: [verifyAuth, requireRole("ADMIN")]
 */
function requireRole(...allowedRoles) {
    return async function (request, reply) {
        const user = request.user;
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
async function requireTechPasskey(request, reply) {
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
//# sourceMappingURL=auth.js.map