import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * Registers a single shared PrismaClient instance on the Fastify server.
 * Prisma v7 requires a driver adapter — we use @prisma/adapter-pg with a
 * connection pool. The pool is torn down cleanly on server close.
 */
const prismaPlugin: FastifyPluginAsync = fp(async (server) => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  // Create a PostgreSQL connection pool pointing at our Supabase PgBouncer URL
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  // Wire the pool into Prisma via the official driver adapter
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  await prisma.$connect();

  // Make `server.prisma` available across all route handlers
  server.decorate("prisma", prisma);

  server.addHook("onClose", async () => {
    await prisma.$disconnect();
    await pool.end();
  });
});

export default prismaPlugin;

// Extend the Fastify type namespace so TypeScript knows about server.prisma
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
