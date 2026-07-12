"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
/**
 * Registers a single shared PrismaClient instance on the Fastify server.
 * Prisma v7 requires a driver adapter — we use @prisma/adapter-pg with a
 * connection pool. The pool is torn down cleanly on server close.
 */
const prismaPlugin = (0, fastify_plugin_1.default)(async (server) => {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is required");
    }
    // Create a PostgreSQL connection pool pointing at our Supabase PgBouncer URL
    const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
    // Wire the pool into Prisma via the official driver adapter
    const adapter = new adapter_pg_1.PrismaPg(pool);
    const prisma = new client_1.PrismaClient({ adapter });
    await prisma.$connect();
    // Make `server.prisma` available across all route handlers
    server.decorate("prisma", prisma);
    server.addHook("onClose", async () => {
        await prisma.$disconnect();
        await pool.end();
    });
});
exports.default = prismaPlugin;
//# sourceMappingURL=prisma.js.map