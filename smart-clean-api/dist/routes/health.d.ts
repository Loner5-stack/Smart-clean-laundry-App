import { FastifyInstance } from "fastify";
/**
 * GET /health
 * No auth required — used by Render for health checks.
 * Returns 200 OK with a timestamp so we can confirm the server is live.
 */
export declare function healthRoutes(server: FastifyInstance): Promise<void>;
//# sourceMappingURL=health.d.ts.map