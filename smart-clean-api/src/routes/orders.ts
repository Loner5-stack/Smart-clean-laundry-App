import { FastifyInstance } from "fastify";
import { verifyAuth, requireRole } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";

type TransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">;

/**
 * Customer order routes — all protected by verifyAuth.
 * The customer can only see and create their own orders.
 */
export async function orderRoutes(server: FastifyInstance) {
  /**
   * GET /api/orders
   * Returns all orders belonging to the authenticated customer.
   */
  server.get(
    "/api/orders",
    { preHandler: [verifyAuth] },
    async (request, reply) => {
      const { id: customerId } = request.user;

      const orders = await server.prisma.order.findMany({
        where: { customerId },
        orderBy: { createdAt: "desc" },
      });

      const mappedOrders = orders.map((o) => {
        const items = Array.isArray(o.items) ? o.items : [];
        const pickupDetails = typeof o.pickupDetails === 'object' && o.pickupDetails !== null ? o.pickupDetails : {};
        
        return {
          id: o.orderNumber,
          service: items.length > 0 ? (items[0] as any).name || "Standard Laundry" : "Standard Laundry",
          status: o.status,
          pickupDate: (pickupDetails as any).date || new Date().toISOString(),
          deliveryDate: new Date(o.createdAt.getTime() + 1000 * 60 * 60 * 48).toISOString(), // +48 hours
          totalAmount: Number(o.totalAmount),
          itemCount: items.reduce((acc, item: any) => acc + (item.quantity || 1), 0),
        };
      });

      return reply.send(mappedOrders);
    }
  );

  /**
   * GET /api/orders/:id
   * Returns a single order by orderNumber, ensuring it belongs to the authenticated customer.
   */
  server.get(
    "/api/orders/:id",
    { preHandler: [verifyAuth] },
    async (request, reply) => {
      const { id: customerId } = request.user;
      const { id } = request.params as { id: string };

      const order = await server.prisma.order.findFirst({
        where: { orderNumber: id, customerId },
        include: {
          rider: { select: { id: true, user: { select: { name: true, phone: true } } } },
        }
      });

      if (!order) {
        return reply.status(404).send({ error: "Order not found" });
      }

      const items = Array.isArray(order.items) ? order.items : [];
      const pickupDetails = typeof order.pickupDetails === 'object' && order.pickupDetails !== null ? order.pickupDetails : {};

      const mappedOrder = {
        id: order.orderNumber,
        service: items.length > 0 ? (items[0] as any).name || "Standard Laundry" : "Standard Laundry",
        status: order.status,
        pickupDate: (pickupDetails as any).date || new Date().toISOString(),
        deliveryDate: new Date(order.createdAt.getTime() + 1000 * 60 * 60 * 48).toISOString(), // +48 hours
        totalAmount: Number(order.totalAmount),
        itemCount: items.reduce((acc, item: any) => acc + (item.quantity || 1), 0),
        items: items,
        pickupDetails: pickupDetails,
        rider: order.rider ? {
          name: order.rider.user.name,
          phone: order.rider.user.phone,
          initials: order.rider.user.name?.split(" ").map((n: string) => n[0]).join("") || "R"
        } : null
      };

      return reply.send(mappedOrder);
    }
  );

  /**
   * POST /api/orders
   * Creates a new order for the authenticated customer.
   */
  server.post(
    "/api/orders",
    { preHandler: [verifyAuth] },
    async (request, reply) => {
      const { id: customerId } = request.user;
      const body = request.body as {
        items: any[];
        pickupDetails: object;
        totalAmount: number;
        paymentMethod: string;
      };

      let calculatedTotal = 1500; // Base pickup fee

      if (Array.isArray(body.items) && body.items.length > 0) {
        // Collect all unique IDs
        const garmentIds = [...new Set(body.items.filter((i: any) => i.itemId).map((i: any) => i.itemId as string))];
        const serviceIds = [...new Set(body.items.filter((i: any) => i.serviceId).map((i: any) => i.serviceId as string))];

        // Fetch all relevant garments and services in parallel
        const [garments, services] = await Promise.all([
          garmentIds.length > 0 ? server.prisma.garmentItem.findMany({ where: { id: { in: garmentIds } } }) : Promise.resolve([]),
          serviceIds.length > 0 ? server.prisma.service.findMany({ where: { id: { in: serviceIds } } }) : Promise.resolve([])
        ]);

        // Create lookups for fast access
        const garmentMap = new Map(garments.map(g => [g.id, Number(g.basePrice)]));
        const serviceMap = new Map(services.map(s => [s.id, Number(s.price)]));

        // Calculate total in memory
        for (const item of body.items) {
          if (item.itemId && garmentMap.has(item.itemId)) {
            calculatedTotal += garmentMap.get(item.itemId)! * (item.quantity || 1);
          } else if (item.serviceId && serviceMap.has(item.serviceId)) {
            calculatedTotal += serviceMap.get(item.serviceId)! * (item.quantity || 1);
          }
        }
      }

      // We DO NOT trust the client's body.totalAmount under any circumstances.
      // The server independently calculates the total based on the IDs provided.
      // If the client provides bogus IDs, the total defaults to the base 1500 pickup fee,
      // and they get exactly zero items washed.
      const finalAmount = calculatedTotal;

      // Generate a collision-safe SC-XXXX order number.
      // We use a timestamp (base-36) + 3 secure random hex chars.
      const timestamp = Date.now().toString(36).toUpperCase(); // e.g. "LJH8F2"
      const rand = require("crypto").randomBytes(2).toString("hex").toUpperCase().substring(0, 3); // e.g. "A4F"
      const orderNumber = `SC-${timestamp}${rand}`;

      // Use a transaction to create the order, its history, and a notification atomically
      const result = await server.prisma.$transaction(async (tx: TransactionClient) => {
        const order = await tx.order.create({
          data: {
            orderNumber,
            customerId,
            items: body.items,
            pickupDetails: body.pickupDetails,
            totalAmount: finalAmount,
            paymentMethod: body.paymentMethod,
          },
        });

        await tx.orderStatusHistory.create({
          data: {
            orderId: order.id,
            status: "PENDING",
            changedBy: customerId,
            note: "Order created by customer",
          },
        });

        await tx.notification.create({
          data: {
            userId: customerId,
            type: "ORDER_UPDATE",
            title: "Order Placed",
            message: `Your order ${orderNumber} has been received and is pending assignment.`,
            orderId: order.id,
          },
        });

        return order;
      });

      return reply.status(201).send(result);
    }
  );
}
