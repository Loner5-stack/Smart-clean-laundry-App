import "dotenv/config";
import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";

import prismaPlugin from "./plugins/prisma";
import { healthRoutes } from "./routes/health";
import { orderRoutes } from "./routes/orders";
import { riderRoutes } from "./routes/rider";
import { adminRoutes } from "./routes/admin";
import { catalogRoutes } from "./routes/catalog";

const server = Fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "warn" : "info",
  },
});

async function start() {
  // ── CORS ─────────────────────────────────────────────────────────────
  // Only accept requests from our trusted domains (Vercel + local dev).
  await server.register(fastifyCors, {
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
  await server.register(fastifyJwt, {
    secret: process.env.AUTH_SECRET,
  });

  // ── Prisma ───────────────────────────────────────────────────────────
  await server.register(prismaPlugin);

  // ── Routes ───────────────────────────────────────────────────────────
  await server.register(healthRoutes);
  await server.register(orderRoutes);
  await server.register(riderRoutes);
  await server.register(adminRoutes);
  await server.register(catalogRoutes);

  // ── Start ─────────────────────────────────────────────────────────────
  const port = parseInt(process.env.PORT ?? "3001", 10);
  await server.listen({ port, host: "0.0.0.0" });
  server.log.info(`Smart-Clean API running on port ${port}`);
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
