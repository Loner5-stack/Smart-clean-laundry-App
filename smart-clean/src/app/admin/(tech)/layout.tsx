import { TechProtectedLayout } from "@/components/admin/TechProtectedLayout";
import { TechSidebar } from "@/components/admin/tech-sidebar";

export default function TechPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TechProtectedLayout>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans">
        {/* Desktop Sidebar (Fixed 240px wide) */}
        <TechSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </TechProtectedLayout>
  );
}
