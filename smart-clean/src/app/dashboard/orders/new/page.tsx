import { getServices, getGarmentItems } from "@/lib/api";
import { OrderWizardClient } from "./order-wizard-client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function NewOrderPage() {
  const [services, garments] = await Promise.all([
    getServices(),
    getGarmentItems()
  ]);

  const session = await auth();
  let userAddress = "";

  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { address: true }
    });
    userAddress = dbUser?.address || "";
  }

  return <OrderWizardClient services={services} garments={garments} userAddress={userAddress} />;
}
