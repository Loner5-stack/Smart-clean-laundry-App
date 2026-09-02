import { FastifyInstance } from "fastify";

export async function catalogRoutes(server: FastifyInstance) {
  /**
   * GET /api/services
   * Returns all active services (publicly accessible or just needs valid auth).
   */
  server.get("/api/services", async (_request, reply) => {
    const services = await server.prisma.service.findMany({
      where: { isActive: true, isArchived: false },
      orderBy: { displayOrder: "asc" },
      include: { garmentItems: { select: { id: true } } }
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
      garmentItemIds: s.garmentItems.map(g => g.id),
    }));

    return reply.send(mappedServices);
  });

  /**
   * GET /api/services/popular
   * Returns active services marked as popular
   */
  server.get("/api/services/popular", async (_request, reply) => {
    const services = await server.prisma.service.findMany({
      where: { isActive: true, isPopular: true, isArchived: false },
      orderBy: { displayOrder: "asc" },
      include: { garmentItems: { select: { id: true } } }
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
      garmentItemIds: s.garmentItems.map(g => g.id),
    }));

    return reply.send(mappedServices);
  });

  /**
   * GET /api/garments
   * Returns all active garment items.
   */
  server.get("/api/garments", async (_request, reply) => {
    const garments = await server.prisma.garmentItem.findMany({
      where: { isActive: true },
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
}
