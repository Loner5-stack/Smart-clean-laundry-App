import { Sidebar } from "@/components/dashboard/sidebar";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { TopHeader } from "@/components/dashboard/top-header";
import { MainScroll } from "@/components/dashboard/main-scroll";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Dashboard | Smart-Clean",
  description: "Your Smart-Clean customer portal",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  let dbUser = null;
  if (session?.user?.id) {
    dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, role: true, image: true },
    });
  }
  
  return (
    <div className="flex h-screen bg-[#F7F8FA] dark:bg-[#090B11] overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar user={dbUser || session?.user} />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Top Header */}
        <TopHeader />

        {/* Scrollable Page Content */}
        <MainScroll>
          {children}
        </MainScroll>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav user={dbUser || session?.user} />
    </div>
  );
}
