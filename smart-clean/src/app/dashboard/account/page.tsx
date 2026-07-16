import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AccountPageContent } from "./account-page-content";
import { getUserTierData } from "@/app/actions/tier";

export default async function AccountPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      image: true,
    },
  });

  if (!dbUser) {
    redirect("/login");
  }

  const tierData = await getUserTierData(session.user.id);

  return <AccountPageContent user={dbUser} tierData={tierData} />;
}
