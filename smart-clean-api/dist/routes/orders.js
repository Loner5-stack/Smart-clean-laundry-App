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
        return reply.send(orders);
    });
    /**
     * POST /api/orders
     * Creates a new order for the authenticated customer.
     */
    server.post("/api/orders", { preHandler: [auth_1.verifyAuth] }, async (request, reply) => {
        const { id: customerId } = request.user;
        const body = request.body;
        // Generate a SC-XXXX order number
        const count = await server.prisma.order.count();
        const orderNumber = `SC-${String(count + 1).padStart(4, "0")}`;
        // Use a transaction to create the order, its history, and a notification atomically
        const result = await server.prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    orderNumber,
                    customerId,
                    items: body.items,
                    pickupDetails: body.pickupDetails,
                    totalAmount: body.totalAmount,
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