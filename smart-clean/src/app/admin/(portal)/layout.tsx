import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopHeader } from "@/components/admin/top-header";

export const metadata = {
  title: "Admin Portal | Smart-Clean",
  description: "Administrative control center",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F7F8FA] dark:bg-[#090B11] overflow-hidden font-sans">
      {/* Desktop Sidebar (Fixed 240px wide) */}
      <AdminSidebar />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Top Bar (64px) */}
        <AdminTopHeader />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* Centered with Max Width 1440px and 24px padding */}
          <div className="max-w-[1440px] mx-auto w-full p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
