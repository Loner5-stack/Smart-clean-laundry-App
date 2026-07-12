import { FastifyInstance } from "fastify";
import { verifyAuth, requireRole, requireTechPasskey } from "../middleware/auth";
import { PrismaClient, Order } from "@prisma/client";

type TransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

/**
 * Admin routes — all require ADMIN role.
 * Full operational visibility across all orders, customers, and riders.
 */
export async function adminRoutes(server: FastifyInstance) {
  /**
   * GET /api/admin/orders
   * Returns all orders in the system with customer and rider info.
   */
  server.get(
    "/api/admin/orders",
    { preHandler: [verifyAuth, requireRole("ADMIN")] },
    async (_request, reply) => {
      const orders = await server.prisma.order.findMany({
        include: {
          customer: { select: { id: true, name: true, email: true, phone: true } },
          rider: { select: { id: true, user: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
      });
      return reply.send(orders);
    }
  );

  /**
   * PATCH /api/admin/orders/:id
   * Admin can set any order status (they are the source of truth).
   * Can also assign a rider to an order.
   */
  server.patch(
    "/api/admin/orders/:id",
    { preHandler: [verifyAuth, requireRole("ADMIN")] },
    async (request, reply) => {
      const { id: adminId } = request.user;
      const { id } = request.params as { id: string };
      const body = request.body as { status?: Order["status"]; riderId?: string };

      const existingOrder = await server.prisma.order.findUnique({
        where: { id },
        select: { customerId: true, status: true, riderId: true, orderNumber: true },
      });

      if (!existingOrder) {
        return reply.status(404).send({ error: "Order not found" });
      }

      const result = await server.prisma.$transaction(async (tx: TransactionClient) => {
        const order = await tx.order.update({
          where: { id },
          data: {
            ...(body.status && { status: body.status as never }),
            ...(body.riderId !== undefined && { riderId: body.riderId }),
          },
        });

        if (body.status && body.status !== existingOrder.status) {
          await tx.orderStatusHistory.create({
            data: {
              orderId: order.id,
              status: order.status as any,
              changedBy: adminId,
              note: `Status updated by Admin`,
            },
          });

          await tx.notification.create({
            data: {
              userId: order.customerId,
              type: "ORDER_UPDATE",
              title: "Order Update",
              message: `Your order ${order.orderNumber} is now ${order.status}.`,
              orderId: order.id,
            },
          });
        }

        if (body.riderId && body.riderId !== existingOrder.riderId) {
          const newRider = await tx.rider.findUnique({ where: { id: body.riderId } });
          if (newRider) {
             await tx.notification.create({
               data: {
                 userId: newRider.userId,
                 type: "RIDER_ASSIGNED",
                 title: "New Pickup Assigned",
                 message: `You have been assigned order ${order.orderNumber}.`,
                 orderId: order.id,
               },
             });
          }
        }

        return order;
      });

      return reply.send(result);
    }
  );

  /**
   * GET /api/admin/users
   * Returns all customers.
   */
  server.get(
    "/api/admin/users",
    { preHandler: [verifyAuth, requireRole("ADMIN"), requireTechPasskey] },
    async (_request, reply) => {
      const users = await server.prisma.user.findMany({
        where: { role: "CUSTOMER" },
        select: {
          id: true, name: true, email: true, phone: true,
          createdAt: true, _count: { select: { orders: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return reply.send(users);
    }
  );

  /**
   * GET /api/admin/riders
   * Returns all riders with their profile stats.
   */
  server.get(
    "/api/admin/riders",
    { preHandler: [verifyAuth, requireRole("ADMIN")] },
    async (_request, reply) => {
      const riders = await server.prisma.rider.findMany({
        include: {
          user: { select: { name: true, email: true, phone: true } },
          _count: { select: { assignedOrders: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return reply.send(riders);
    }
  );
}
