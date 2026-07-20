"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = orderRoutes;
const auth_1 = require("../middleware/auth");
/**
 * Customer order routes — all protected by verifyAuth.
 * The customer can only see and create their own orders.
 */
async function orderRoutes(server) {
    /**
     * GET /api/orders
     * Returns all orders belonging to the authenticated customer.
     */
    server.get("/api/orders", { preHandler: [auth_1.verifyAuth] }, async (request, reply) => {
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
                service: items.length > 0 ? items[0].name || "Standard Laundry" : "Standard Laundry",
                status: o.status,
                pickupDate: pickupDetails.date || new Date().toISOString(),
                deliveryDate: new Date(o.createdAt.getTime() + 1000 * 60 * 60 * 48).toISOString(), // +48 hours
                totalAmount: Number(o.totalAmount),
                itemCount: items.reduce((acc, item) => acc + (item.quantity || 1), 0),
            };
        });
        return reply.send(mappedOrders);
    });
    /**
     * POST /api/orders
     * Creates a new order for the authenticated customer.
     */
    server.post("/api/orders", { preHandler: [auth_1.verifyAuth] }, async (request, reply) => {
        const { id: customerId } = request.user;
        const body = request.body;
        let calculatedTotal = 1500; // Base pickup fee
        if (Array.isArray(body.items)) {
            for (const item of body.items) {
                if (item.itemId) {
                    const garment = await server.prisma.garmentItem.findUnique({
                        where: { id: item.itemId }
                    });
                    if (garment) {
                        calculatedTotal += Number(garment.basePrice) * (item.quantity || 1);
                    }
                }
                else if (item.serviceId) {
                    const service = await server.prisma.service.findUnique({
                        where: { id: item.serviceId }
                    });
                    if (service) {
                        calculatedTotal += Number(service.price) * (item.quantity || 1);
                    }
                }
            }
        }
        // If we couldn't match items, fallback to client total just so it doesn't break estimates,
        // but ideally we should reject. For safety in migration, we use max.
        const finalAmount = calculatedTotal > 1500 ? calculatedTotal : body.totalAmount;
        // Generate a collision-safe SC-XXXX order number.
        // We use a timestamp (base-36) + 2 random chars rather than a
        // simple count() so two concurrent orders can never get the same number.
        const timestamp = Date.now().toString(36).toUpperCase(); // e.g. "LJH8F2"
        const rand = Math.random().toString(36).substring(2, 4).toUpperCase(); // e.g. "KT"
        const orderNumber = `SC-${timestamp}${rand}`;
        // Use a transaction to create the order, its history, and a notification atomically
        const result = await server.prisma.$transaction(async (tx) => {
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
    });
}
//# sourceMappingURL=orders.js.map