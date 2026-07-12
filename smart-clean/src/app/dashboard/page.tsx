import { HeroBanner } from "@/components/dashboard/hero-banner";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ActiveOrderTracker } from "@/components/dashboard/active-order-tracker";
import { HowItWorks } from "@/components/dashboard/how-it-works";
import { PopularServices } from "@/components/dashboard/popular-services";
import { QuickOrderFab } from "@/components/dashboard/quick-order-fab";
import { mockStats } from "@/data/mock-dashboard";

/** When a user has no order history we show a simplified onboarding home.
 *  Replace with a real auth/session check when the backend is ready. */
const isFirstTimeUser = mockStats.totalOrders === 0;

export default function DashboardPage() {
  return (
    <>
      <div className="px-4 md:px-6 py-6 space-y-8 max-w-6xl mx-auto">
        {/* Hero Banner — always visible */}
        <HeroBanner isFirstTimeUser={isFirstTimeUser} />

        {/* Returning user: show live stats + active order */}
        {!isFirstTimeUser && (
          <>
            <StatsCards />
            <ActiveOrderTracker />
          </>
        )}

        {/* How It Works — given hero treatment for new users */}
        <HowItWorks />

        {/* Popular Services */}
        <PopularServices />
      </div>

      {/* Floating Quick Order Button */}
      <QuickOrderFab />
    </>
  );
}
