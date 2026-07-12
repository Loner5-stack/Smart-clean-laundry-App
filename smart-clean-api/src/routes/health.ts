import { FastifyInstance } from "fastify";

/**
 * GET /health
 * No auth required — used by Render for health checks.
 * Returns 200 OK with a timestamp so we can confirm the server is live.
 */
export async function healthRoutes(server: FastifyInstance) {
  server.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });
}
