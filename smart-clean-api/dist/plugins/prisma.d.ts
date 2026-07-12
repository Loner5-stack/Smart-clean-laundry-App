import { FastifyPluginAsync } from "fastify";
import { PrismaClient } from "@prisma/client";
/**
 * Registers a single shared PrismaClient instance on the Fastify server.
 * Prisma v7 requires a driver adapter — we use @prisma/adapter-pg with a
 * connection pool. The pool is torn down cleanly on server close.
 */
declare const prismaPlugin: FastifyPluginAsync;
export default prismaPlugin;
declare module "fastify" {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}
//# sourceMappingURL=prisma.d.ts.map