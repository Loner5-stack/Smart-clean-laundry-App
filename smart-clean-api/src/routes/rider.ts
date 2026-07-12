import { FastifyInstance } from "fastify";
import { verifyAuth, requireRole } from "../middleware/auth";
import { PrismaClient, Order } from "@prisma/client";

type TransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

/**
 * Rider routes — all require RIDER role.
 * Riders can only see their own assigned orders and update their status.
 */
export async function riderRoutes(server: FastifyInstance) {
  /**
   * GET /api/rider/tasks
   * Returns all orders currently assigned to this rider.
   */
  server.get(
    "/api/rider/tasks",
    { preHandler: [verifyAuth, requireRole("RIDER")] },
    async (request, reply) => {
      const { id: userId } = request.user;

      const rider = await server.prisma.rider.findUnique({
        where: { userId },
      });

      if (!rider) {
        return reply.status(404).send({ error: "Rider profile not found" });
      }

      const tasks = await server.prisma.order.findMany({
        where: { riderId: rider.id },
        orderBy: { updatedAt: "desc" },
      });

      return reply.send(tasks);
    }
  );

  /**
   * PATCH /api/rider/tasks/:id
   * Allows a rider to advance an order's status (e.g., PICKUP_ASSIGNED → AT_HUB).
   * The admin is the source of truth — riders can only move forward, never back.
   */
  server.patch(
    "/api/rider/tasks/:id",
    { preHandler: [verifyAuth, requireRole("RIDER")] },
    async (request, reply) => {
      const { id: userId } = request.user;
      const { id } = request.params as { id: string };
      const { status } = request.body as { status: Order["status"] };

      const rider = await server.prisma.rider.findUnique({
        where: { userId },
      });

      if (!rider) {
        return reply.status(404).send({ error: "Rider profile not found" });
      }

      const ALLOWED_RIDER_STATUSES = ["AT_HUB", "OUT_FOR_DELIVERY", "COMPLETED"];
      if (!ALLOWED_RIDER_STATUSES.includes(status)) {
        return reply.status(400).send({
          error: `Riders can only set status to: ${ALLOWED_RIDER_STATUSES.join(", ")}`,
        });
      }

      const result = await server.prisma.$transaction(async (tx: TransactionClient) => {
        const order = await tx.order.update({
          where: { id, riderId: rider.id },
          data: { status },
        });

        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            status: order.status as any,
            changedBy: userId,
            note: `Status updated by rider`,
          },
        });

        await tx.notification.create({
          data: {
            userId: order.customerId,
            type: "ORDER_UPDATE",
            title: "Order Update",
            message: `Your order ${order.orderNumber} is now ${status}.`,
            orderId: order.id,
          },
        });

        return order;
      });

      return reply.send(result);
    }
  );
}
