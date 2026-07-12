import { FastifyRequest, FastifyReply } from "fastify";
import { UserRole } from "@prisma/client";
/**
 * Verifies:
 * 1. X-API-Secret header matches our shared server-to-server secret
 * 2. Authorization: Bearer <jwt> is present and valid (signed by NextAuth)
 *
 * Attaches decoded user payload to request.user for use in route handlers.
 */
export declare function verifyAuth(request: FastifyRequest, reply: FastifyReply): Promise<void>;
/**
 * Role-based guard factory.
 * Usage: preHandler: [verifyAuth, requireRole("ADMIN")]
 */
export declare function requireRole(...allowedRoles: UserRole[]): (request: FastifyRequest, reply: FastifyReply) => Promise<undefined>;
/**
 * Technical Passkey guard.
 * Validates the X-Tech-Passkey header against the TECH_PASSKEY env variable.
 * Must be used AFTER verifyAuth so we know they are authenticated first.
 */
export declare function requireTechPasskey(request: FastifyRequest, reply: FastifyReply): Promise<undefined>;
declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: {
            id: string;
            email: string;
            role: UserRole;
        };
        user: {
            id: string;
            email: string;
            role: UserRole;
        };
    }
}
//# sourceMappingURL=auth.d.ts.map