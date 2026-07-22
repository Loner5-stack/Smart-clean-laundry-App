import { FastifyInstance } from "fastify";
import { verifyAuth, requireRole } from "../middleware/auth";
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
    async (request, reply) => {
      const { 
        page = "1", 
        limit = "50", 
        search = "", 
        status = "",
        dateFilter = "All Time",
        unassignedOnly = "false",
        todayOnly = "false"
      } = request.query as any;

      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 50;
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};
      if (status && status !== "All Statuses" && status !== "all") {
        where.status = status;
      }
      if (search) {
        where.OR = [
          { orderNumber: { contains: search, mode: "insensitive" } },
          { customer: { name: { contains: search, mode: "insensitive" } } }
        ];
      }
      if (unassignedOnly === "true") {
        where.riderId = null;
      }
      
      const today = new Date();
      if (dateFilter !== "All Time") {
        if (dateFilter === "Today") {
          const start = new Date(today.setHours(0,0,0,0));
          const end = new Date(today.setHours(23,59,59,999));
          where.createdAt = { gte: start, lte: end };
        } else if (dateFilter === "Yesterday") {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          const start = new Date(yesterday.setHours(0,0,0,0));
          const end = new Date(yesterday.setHours(23,59,59,999));
          where.createdAt = { gte: start, lte: end };
        } else if (dateFilter === "Last 7 Days") {
          const last7 = new Date(today);
          last7.setDate(last7.getDate() - 7);
          where.createdAt = { gte: last7 };
        } else if (dateFilter === "Last 30 Days") {
          const last30 = new Date(today);
          last30.setDate(last30.getDate() - 30);
          where.createdAt = { gte: last30 };
        }
      }

      if (todayOnly === "true") {
        const todayStr = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
        where.pickupDetails = {
          path: ['date'],
          string_contains: todayStr
        };
      }
      const [orders, total] = await Promise.all([
        server.prisma.order.findMany({
          where,
          include: {
            customer: { select: { id: true, name: true, email: true, phone: true, address: true } },
            rider: { select: { id: true, user: { select: { name: true } } } },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limitNum,
        }),
        server.prisma.order.count({ where })
      ]);

      const mappedOrders = orders.map(o => {
        const items = Array.isArray(o.items) ? o.items : [];
        const pickupDetails = typeof o.pickupDetails === 'object' && o.pickupDetails !== null ? o.pickupDetails : {};
        
        return {
          id: o.orderNumber,
          customerName: o.customer?.name || "Unknown",
          customerPhone: o.customer?.phone || "Unknown",
          customerAddress: o.customer?.address || "Unknown",
          services: items.length > 0 ? items.map((i: any) => i.name || "Standard") : ["Standard"],
          status: o.status,
          rider: o.rider?.user?.name || null,
          pickupDate: (pickupDetails as any).date || new Date().toISOString(),
          pickupTimeSlot: (pickupDetails as any).time || "Anytime",
          totalAmount: Number(o.totalAmount),
          placedAt: o.createdAt.toISOString(),
          paymentStatus: o.paymentStatus === "PAID" ? "Paid" : "Pending",
          paymentMethod: o.paymentMethod || "Card",
          items: items,
          bagSelections: [],
          notes: []
        };
      });

      return reply.send({
        data: mappedOrders,
        meta: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      });
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
    { preHandler: [verifyAuth, requireRole("ADMIN")] },
    async (request, reply) => {
      const { page = "1", limit = "50", search = "" } = request.query as { page?: string; limit?: string; search?: string };
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 50;
      const skip = (pageNum - 1) * limitNum;

      const where: any = { role: "CUSTOMER" };
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } }
        ];
      }

      const [users, total, tiers] = await Promise.all([
        server.prisma.user.findMany({
          where,
          include: {
            orders: {
              select: { totalAmount: true, createdAt: true },
              orderBy: { createdAt: "desc" }
            },
            subscriptions: {
              where: { status: "ACTIVE" },
              include: { plan: true },
              take: 1
            }
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limitNum,
        }),
        server.prisma.user.count({ where }),
        server.prisma.tierSetting.findMany({ orderBy: { minOrders: "asc" } })
      ]);
      
      const mappedCustomers = users.map(user => {
        const totalOrders = user.orders.length;
        const totalSpend = user.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
        
        let loyaltyTier: string | null = null;
        let ordersToNextTier: number | null = null;

        if (tiers && tiers.length > 0) {
          // Find the highest tier the user qualifies for
          let currentTierIndex = -1;
          for (let i = tiers.length - 1; i >= 0; i--) {
            if (totalOrders >= tiers[i].minOrders) {
              currentTierIndex = i;
              loyaltyTier = tiers[i].name;
              break;
            }
          }

          if (currentTierIndex === -1 && tiers.length > 0) {
            // User hasn't even hit the lowest tier? Default to lowest.
            loyaltyTier = tiers[0].name;
            ordersToNextTier = tiers[0].minOrders - totalOrders;
            if (ordersToNextTier < 0) ordersToNextTier = 0;
          } else if (currentTierIndex < tiers.length - 1) {
            // Has a next tier
            ordersToNextTier = tiers[currentTierIndex + 1].minOrders - totalOrders;
          } else {
            // Max tier
            ordersToNextTier = 0;
          }
        } else {
          // No fallback - if no tiers exist, return null
          loyaltyTier = null;
          ordersToNextTier = null;
        }

        return {
          id: user.id,
          customerNumber: user.customerNumber,
          name: user.name || "Unknown",
          email: user.email || "No Email",
          phone: user.phone || "No Phone",
          address: user.address || "No Address",
          totalOrders: totalOrders,
          totalSpend: totalSpend,
          loyaltyTier: loyaltyTier,
          lastOrderDate: user.orders[0]?.createdAt.toISOString() || new Date(0).toISOString(),
          memberSince: user.createdAt.toISOString(),
          status: "Active", // Or derived from metadata
          activeSubscription: user.subscriptions[0]?.plan?.name || null,
          ordersToNextTier: ordersToNextTier
        };
      });

      return reply.send({
        data: mappedCustomers,
        meta: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    }
  );

  /**
   * GET /api/admin/users/:id
   * Returns a specific customer with their recent orders and subscriptions.
   */
  server.get(
    "/api/admin/users/:id",
    { preHandler: [verifyAuth, requireRole("ADMIN")] },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const [user, tiers] = await Promise.all([
        server.prisma.user.findUnique({
          where: { id },
          include: {
            orders: {
              orderBy: { createdAt: "desc" },
              include: {
                rider: { select: { id: true, user: { select: { name: true } } } }
              }
            },
            subscriptions: {
              where: { status: "ACTIVE" },
              include: { plan: true },
              take: 1
            }
          }
        }),
        server.prisma.tierSetting.findMany({ orderBy: { minOrders: "asc" } })
      ]);

      if (!user) {
        return reply.status(404).send({ error: "Customer not found" });
      }

      const totalOrders = user.orders.length;
      const totalSpend = user.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
      
      let loyaltyTier: string | null = null;
      let ordersToNextTier: number | null = null;

      if (tiers && tiers.length > 0) {
        // Find the highest tier the user qualifies for
        let currentTierIndex = -1;
        for (let i = tiers.length - 1; i >= 0; i--) {
          if (totalOrders >= tiers[i].minOrders) {
            currentTierIndex = i;
            loyaltyTier = tiers[i].name;
            break;
          }
        }

        if (currentTierIndex === -1 && tiers.length > 0) {
          loyaltyTier = tiers[0].name;
          ordersToNextTier = tiers[0].minOrders - totalOrders;
          if (ordersToNextTier < 0) ordersToNextTier = 0;
        } else if (currentTierIndex < tiers.length - 1) {
          ordersToNextTier = tiers[currentTierIndex + 1].minOrders - totalOrders;
        } else {
          ordersToNextTier = 0;
        }
      } else {
        // No fallback
        loyaltyTier = null;
        ordersToNextTier = null;
      }

      const customerProfile = {
        id: user.id,
        customerNumber: user.customerNumber,
        name: user.name || "Unknown",
        email: user.email || "No Email",
        phone: user.phone || "No Phone",
        address: user.address || "No Address",
        totalOrders: totalOrders,
        totalSpend: totalSpend,
        loyaltyTier: loyaltyTier,
        lastOrderDate: user.orders[0]?.createdAt.toISOString() || new Date(0).toISOString(),
        memberSince: user.createdAt.toISOString(),
        status: "Active", // Or derived from metadata
        activeSubscription: user.subscriptions[0]?.plan?.name || null,
        ordersToNextTier: ordersToNextTier
      };

      const recentOrders = user.orders.map(o => {
        const items = Array.isArray(o.items) ? o.items : [];
        const pickupDetails = typeof o.pickupDetails === 'object' && o.pickupDetails !== null ? o.pickupDetails : {};
        
        return {
          id: o.orderNumber,
          customerName: user.name || "Unknown",
          customerPhone: user.phone || "Unknown",
          customerAddress: user.address || "Unknown",
          services: items.map((i: any) => i.name),
          status: o.status,
          rider: o.rider?.user?.name || null,
          pickupDate: (pickupDetails as any).date || "Unknown",
          pickupTimeSlot: (pickupDetails as any).timeSlot || "Unknown",
          totalAmount: Number(o.totalAmount),
          placedAt: o.createdAt.toISOString(),
          paymentStatus: o.paymentStatus,
          paymentMethod: o.paymentMethod || "Card",
          items: items as any,
          bagSelections: [],
          notes: []
        };
      });

      return reply.send({
        customer: customerProfile,
        recentOrders: recentOrders
      });
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
          assignedOrders: {
            where: { status: { in: ["PICKUP_ASSIGNED", "AT_HUB", "OUT_FOR_DELIVERY"] } },
            select: { orderNumber: true },
            take: 1
          }
        },
        orderBy: { createdAt: "desc" },
      });
      
      const mappedRiders = riders.map(rider => ({
        id: rider.id,
        name: rider.user?.name || "Unknown",
        phone: rider.user?.phone || "No Phone",
        email: rider.user?.email || "No Email",
        status: rider.availabilityStatus,
        currentAssignment: rider.assignedOrders.length > 0 ? rider.assignedOrders[0].orderNumber : null,
        deliveriesCompleted: rider.deliveriesCompleted,
        joinDate: rider.createdAt.toISOString(),
        rating: rider.rating,
        onTimeRate: 100 // Hardcoded for now until schema supports it
      }));

      return reply.send(mappedRiders);
    }
  );

  /**
   * GET /api/admin/services
   * Returns all services for the admin catalogue.
   */
  server.get(
    "/api/admin/services",
    { preHandler: [verifyAuth, requireRole("ADMIN")] },
    async (_request, reply) => {
      const services = await server.prisma.service.findMany({
        where: { isArchived: false },
        orderBy: { displayOrder: "asc" },
      });
      
      const mappedServices = services.map(s => ({
        id: s.id,
        name: s.name,
        category: s.category,
        price: Number(s.price),
        unit: s.unit,
        description: s.description,
        isActive: s.isActive,
        imagePath: s.imagePath,
        displayOrder: s.displayOrder,
        isPopular: s.isPopular,
        orderCount: 0 // Mocked for now until order items schema relates to services
      }));

      return reply.send(mappedServices);
    }
  );

  /**
   * POST /api/admin/services
   * Create a new service.
   */
  server.post(
    "/api/admin/services",
    { preHandler: [verifyAuth, requireRole("ADMIN")] },
    async (request, reply) => {
      const body = request.body as {
        name: string;
        category: string;
        price: number;
        unit: string;
        description: string;
        imagePath?: string;
      };

      // Generate ID in format svc-X optimally
      let maxNum = 0;
      try {
        // Query the max number natively in Postgres
        const result: any[] = await server.prisma.$queryRawUnsafe(`
          SELECT MAX(CAST(SUBSTRING(id FROM 5) AS INTEGER)) as max_num 
          FROM "Service" 
          WHERE id LIKE 'svc-%' AND id ~ '^svc-[0-9]+$'
        `);
        if (result && result.length > 0 && result[0].max_num) {
          maxNum = Number(result[0].max_num);
        }
      } catch (e) {
        request.log.warn("Failed to generate optimized ID, falling back to simple count", e);
        maxNum = await server.prisma.service.count();
      }
      const newId = `svc-${maxNum + 1}`;

      const newService = await server.prisma.service.create({
        data: {
          id: newId,
          name: body.name || "New Service",
          category: body.category || "Standard",
          price: body.price || 0,
          unit: body.unit || "per item",
          description: body.description || "",
          imagePath: body.imagePath || null,
          isPopular: false,
        },
      });

      return reply.status(201).send({
        ...newService,
        price: Number(newService.price),
      });
    }
  );

  /**
   * GET /api/admin/services/:id
   * Get a single service
   */
  server.get(
    "/api/admin/services/:id",
    { preHandler: [verifyAuth, requireRole("ADMIN")] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const service = await server.prisma.service.findUnique({
        where: { id },
      });
      if (!service) return reply.status(404).send({ error: "Service not found" });

      return reply.send({
        ...service,
        price: Number(service.price)
      });
    }
  );

  /**
   * PUT /api/admin/services/:id
   * Update a service
   */
  server.put(
    "/api/admin/services/:id",
    { preHandler: [verifyAuth, requireRole("ADMIN")] },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = request.body as {
        name: string;
        category: string;
        price: number;
        unit: string;
        description: string;
        isActive: boolean;
        imagePath?: string;
        isPopular?: boolean;
      };

      const updatedService = await server.prisma.service.update({
        where: { id },
        data: {
          name: body.name,
          category: body.category,
          price: body.price,
          unit: body.unit,
          description: body.description,
          isActive: body.isActive,
          imagePath: body.imagePath,
          isPopular: body.isPopular,
        },
      });

      return reply.send({
        ...updatedService,
        price: Number(updatedService.price),
      });
    }
  );

  /**
   * DELETE /api/admin/services/:id
   * Delete a service
   */
  server.delete(
    "/api/admin/services/:id",
    { preHandler: [verifyAuth, requireRole("ADMIN")] },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        await server.prisma.service.update({
          where: { id },
          data: { isArchived: true, isActive: false },
        });
        return reply.send({ success: true });
      } catch (err: any) {
        request.log.error(err);
        return reply.status(500).send({ error: "Failed to delete service", details: err.message });
      }
    }
  );

  /**
   * PUT /api/admin/services/reorder
   * Bulk update service display orders
   */
  server.put(
    "/api/admin/services/reorder",
    { preHandler: [verifyAuth, requireRole("ADMIN")] },
    async (request, reply) => {
      try {
        const { items } = request.body as { items: { id: string; displayOrder: number }[] };

        if (!items || !Array.isArray(items)) {
          return reply.status(400).send({ error: "Invalid payload" });
        }

        await Promise.all(
          items.map((item) =>
            server.prisma.service.update({
              where: { id: item.id },
              data: { displayOrder: item.displayOrder },
            })
          )
        );

        return reply.send({ success: true });
      } catch (err: any) {
        request.log.error(err);
        return reply.status(500).send({ error: "Internal Server Error", details: err.message });
      }
    }
  );

  /**
   * GET /api/admin/garments
   * Returns all garment items for the admin catalogue.
   */
  server.get(
    "/api/admin/garments",
    { preHandler: [verifyAuth, requireRole("ADMIN")] },
    async (_request, reply) => {
      const garments = await server.prisma.garmentItem.findMany({
        orderBy: { createdAt: "desc" },
      });
      
      const mappedGarments = garments.map(g => ({
        id: g.id,
        name: g.name,
        emoji: g.emoji,
        basePrice: Number(g.basePrice),
        unit: g.unit,
        isActive: g.isActive,
      }));

      return reply.send(mappedGarments);
    }
  );

  /**
   * POST /api/admin/garments
   * Create a new garment item.
   */
  server.post(
    "/api/admin/garments",
    { preHandler: [verifyAuth, requireRole("ADMIN")] },
    async (request, reply) => {
      const body = request.body as {
        name: string;
        emoji: string;
        basePrice: number;
        unit: string;
      };

      const newGarment = await server.prisma.garmentItem.create({
        data: {
          name: body.name,
          emoji: body.emoji,
          basePrice: body.basePrice,
          unit: body.unit,
        },
      });

      return reply.status(201).send({
        ...newGarment,
        basePrice: Number(newGarment.basePrice),
      });
    }
  );

  /**
   * GET /api/admin/subscriptions
   * Returns all subscriptions in the system.
   */
  server.get(
    "/api/admin/subscriptions",
    { preHandler: [verifyAuth, requireRole("ADMIN")] },
    async (_request, reply) => {
      const subscriptions = await server.prisma.subscription.findMany({
        include: {
          customer: { select: { name: true, email: true } },
          plan: { select: { name: true, priceKobo: true, billingCycle: true } }
        },
        orderBy: { createdAt: "desc" },
      });
      
      const mappedSubscriptions = subscriptions.map(sub => ({
        id: sub.id,
        customerName: sub.customer?.name || "Unknown",
        customerEmail: sub.customer?.email || "Unknown",
        planName: sub.plan?.name || "Unknown",
        billingCycle: sub.plan?.billingCycle === "yearly" ? "Annually" : "Monthly",
        amount: (sub.plan?.priceKobo || 0) / 100,
        startDate: sub.createdAt.toISOString(),
        nextRenewalDate: sub.renewalDate.toISOString(),
        status: sub.status === "ACTIVE" ? "Active" : sub.status === "CANCELLED" ? "Cancelled" : "Payment Failed"
      }));

      return reply.send(mappedSubscriptions);
    }
  );
}
