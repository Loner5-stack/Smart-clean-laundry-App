"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const prisma_1 = __importDefault(require("./plugins/prisma"));
const health_1 = require("./routes/health");
const orders_1 = require("./routes/orders");
const rider_1 = require("./routes/rider");
const admin_1 = require("./routes/admin");
const catalog_1 = require("./routes/catalog");
const server = (0, fastify_1.default)({
    logger: {
        level: process.env.NODE_ENV === "production" ? "warn" : "info",
    },
});
async function start() {
    // ── CORS ─────────────────────────────────────────────────────────────
    // Only accept requests from our trusted domains (Vercel + local dev).
    await server.register(cors_1.default, {
        origin: [
            "http://localhost:3000",
            process.env.FRONTEND_URL ?? "https://smart-clean.vercel.app",
        ],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization", "X-API-Secret", "X-User-Id", "X-User-Role", "X-Tech-Passkey"],
    });
    // ── JWT ──────────────────────────────────────────────────────────────
    // Must match the AUTH_SECRET used to sign tokens on the frontend.
    if (!process.env.AUTH_SECRET) {
        throw new Error("AUTH_SECRET environment variable is required");
    }
    await server.register(jwt_1.default, {
        secret: process.env.AUTH_SECRET,
    });
    // ── Prisma ───────────────────────────────────────────────────────────
    await server.register(prisma_1.default);
    // ── Routes ───────────────────────────────────────────────────────────
    await server.register(health_1.healthRoutes);
    await server.register(orders_1.orderRoutes);
    await server.register(rider_1.riderRoutes);
    await server.register(admin_1.adminRoutes);
    await server.register(catalog_1.catalogRoutes);
    // ── Start ─────────────────────────────────────────────────────────────
    const port = parseInt(process.env.PORT ?? "3001", 10);
    await server.listen({ port, host: "0.0.0.0" });
    server.log.info(`Smart-Clean API running on port ${port}`);
}
start().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map