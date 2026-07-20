import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  const orders = await prisma.order.findMany({
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true, address: true } },
    },
  });
  
  const customer = orders[0].customer;
  console.log(customer?.address);
}
