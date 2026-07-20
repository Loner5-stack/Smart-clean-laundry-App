import { auth } from "@/auth";
import { getUserTierData, getTiers } from "@/app/actions/tier";
import { redirect } from "next/navigation";
import AccountabilityPageContent from "./accountability-page-content";

export const metadata = {
  title: "Accountability | Smart-Clean",
  description: "Track your loyalty rewards and our brand pillars.",
};

export default async function AccountabilityPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [tierData, dbTiers] = await Promise.all([
    getUserTierData(session.user.id),
    getTiers(),
  ]);

  return (
    <AccountabilityPageContent
      totalOrders={tierData.completedOrders}
      currentTierName={tierData.tierName}
      nextTier={tierData.nextTier || null}
      dbTiers={dbTiers}
    />
  );
}
