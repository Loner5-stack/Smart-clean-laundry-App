"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = healthRoutes;
/**
 * GET /health
 * No auth required — used by Render for health checks.
 * Returns 200 OK with a timestamp so we can confirm the server is live.
 */
async function healthRoutes(server) {
    server.get("/health", async () => {
        return { status: "ok", timestamp: new Date().toISOString() };
    });
}
//# sourceMappingURL=health.js.map