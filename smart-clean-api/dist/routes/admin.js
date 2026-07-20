"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = adminRoutes;
const auth_1 = require("../middleware/auth");
/**
 * Admin routes — all require ADMIN role.
 * Full operational visibility across all orders, customers, and riders.
 */
async function adminRoutes(server) {
    /**
     * GET /api/admin/orders
     * Returns all orders in the system with customer and rider info.
     */
    server.get("/api/admin/orders", { preHandler: [auth_1.verifyAuth, (0, auth_1.requireRole)("ADMIN")] }, async (_request, reply) => {
        const orders = await server.prisma.order.findMany({
            include: {
                customer: { select: { id: true, name: true, email: true, phone: true, address: true } },
                rider: { select: { id: true, user: { select: { name: true } } } },
            },
            orderBy: { createdAt: "desc" },
        });
        const mappedOrders = orders.map(o => {
            const items = Array.isArray(o.items) ? o.items : [];
            const pickupDetails = typeof o.pickupDetails === 'object' && o.pickupDetails !== null ? o.pickupDetails : {};
            return {
                id: o.orderNumber,
                customerName: o.customer?.name || "Unknown",
                customerPhone: o.customer?.phone || "Unknown",
                customerAddress: o.customer?.address || "Unknown",
                services: items.length > 0 ? items.map((i) => i.name || "Standard") : ["Standard"],
                status: o.status,
                rider: o.rider?.user?.name || null,
                pickupDate: pickupDetails.date || new Date().toISOString(),
                pickupTimeSlot: pickupDetails.time || "Anytime",
                totalAmount: Number(o.totalAmount),
                placedAt: o.createdAt.toISOString(),
                paymentStatus: o.paymentStatus === "PAID" ? "Paid" : "Pending",
                paymentMethod: o.paymentMethod || "Card",
                items: items,
                bagSelections: [],
                notes: []
            };
        });
        return reply.send(mappedOrders);
    });
    /**
     * PATCH /api/admin/orders/:id
     * Admin can set any order status (they are the source of truth).
     * Can also assign a rider to an order.
     */
    server.patch("/api/admin/orders/:id", { preHandler: [auth_1.verifyAuth, (0, auth_1.requireRole)("ADMIN")] }, async (request, reply) => {
        const { id: adminId } = request.user;
        const { id } = request.params;
        const body = request.body;
        const existingOrder = await server.prisma.order.findUnique({
            where: { id },
            select: { customerId: true, status: true, riderId: true, orderNumber: true },
        });
        if (!existingOrder) {
            return reply.status(404).send({ error: "Order not found" });
        }
        const result = await server.prisma.$transaction(async (tx) => {
            const order = await tx.order.update({
                where: { id },
                data: {
                    ...(body.status && { status: body.status }),
                    ...(body.riderId !== undefined && { riderId: body.riderId }),
                },
            });
            if (body.status && body.status !== existingOrder.status) {
                await tx.orderStatusHistory.create({
                    data: {
                        orderId: order.id,
                        status: order.status,
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
    });
    /**
     * GET /api/admin/users
     * Returns all customers.
     */
    server.get("/api/admin/users", { preHandler: [auth_1.verifyAuth, (0, auth_1.requireRole)("ADMIN"), auth_1.requireTechPasskey] }, async (_request, reply) => {
        const users = await server.prisma.user.findMany({
            where: { role: "CUSTOMER" },
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
        });
        const mappedCustomers = users.map(user => {
            const totalOrders = user.orders.length;
            const totalSpend = user.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
            let loyaltyTier = "Tier 1";
            if (totalOrders > 30)
                loyaltyTier = "Tier 3";
            else if (totalOrders > 10)
                loyaltyTier = "Tier 2";
            return {
                id: user.id,
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
                activeSubscription: user.subscriptions[0]?.plan?.name || null
            };
        });
        return reply.send(mappedCustomers);
    });
    /**
     * GET /api/admin/riders
     * Returns all riders with their profile stats.
     */
    server.get("/api/admin/riders", { preHandler: [auth_1.verifyAuth, (0, auth_1.requireRole)("ADMIN")] }, async (_request, reply) => {
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
    });
    /**
     * GET /api/admin/services
     * Returns all services for the admin catalogue.
     */
    server.get("/api/admin/services", { preHandler: [auth_1.verifyAuth, (0, auth_1.requireRole)("ADMIN")] }, async (_request, reply) => {
        const services = await server.prisma.service.findMany({
            orderBy: { createdAt: "desc" },
        });
        const mappedServices = services.map(s => ({
            id: s.id,
            name: s.name,
            category: s.category,
            price: Number(s.price),
            unit: s.unit,
            description: s.description,
            isActive: s.isActive,
            orderCount: 0 // Mocked for now until order items schema relates to services
        }));
        return reply.send(mappedServices);
    });
    /**
     * POST /api/admin/services
     * Create a new service.
     */
    server.post("/api/admin/services", { preHandler: [auth_1.verifyAuth, (0, auth_1.requireRole)("ADMIN")] }, async (request, reply) => {
        const body = request.body;
        const newService = await server.prisma.service.create({
            data: {
                name: body.name || "New Service",
                category: body.category || "Standard",
                price: body.price || 0,
                unit: body.unit || "per item",
                description: body.description || "",
            },
        });
        return reply.status(201).send({
            ...newService,
            price: Number(newService.price),
        });
    });
    /**
     * GET /api/admin/services/:id
     * Get a single service
     */
    server.get("/api/admin/services/:id", { preHandler: [auth_1.verifyAuth, (0, auth_1.requireRole)("ADMIN")] }, async (request, reply) => {
        const { id } = request.params;
        const service = await server.prisma.service.findUnique({
            where: { id },
        });
        if (!service)
            return reply.status(404).send({ error: "Service not found" });
        return reply.send({
            ...service,
            price: Number(service.price)
        });
    });
    /**
     * PUT /api/admin/services/:id
     * Update a service
     */
    server.put("/api/admin/services/:id", { preHandler: [auth_1.verifyAuth, (0, auth_1.requireRole)("ADMIN")] }, async (request, reply) => {
        const { id } = request.params;
        const body = request.body;
        const updatedService = await server.prisma.service.update({
            where: { id },
            data: {
                name: body.name,
                category: body.category,
                price: body.price,
                unit: body.unit,
                description: body.description,
                isActive: body.isActive,
            },
        });
        return reply.send({
            ...updatedService,
            price: Number(updatedService.price),
        });
    });
    /**
     * GET /api/admin/garments
     * Returns all garment items for the admin catalogue.
     */
    server.get("/api/admin/garments", { preHandler: [auth_1.verifyAuth, (0, auth_1.requireRole)("ADMIN")] }, async (_request, reply) => {
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
    });
    /**
     * POST /api/admin/garments
     * Create a new garment item.
     */
    server.post("/api/admin/garments", { preHandler: [auth_1.verifyAuth, (0, auth_1.requireRole)("ADMIN")] }, async (request, reply) => {
        const body = request.body;
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
    });
    /**
     * GET /api/admin/subscriptions
     * Returns all subscriptions in the system.
     */
    server.get("/api/admin/subscriptions", { preHandler: [auth_1.verifyAuth, (0, auth_1.requireRole)("ADMIN")] }, async (_request, reply) => {
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
    });
}
//# sourceMappingURL=admin.js.map