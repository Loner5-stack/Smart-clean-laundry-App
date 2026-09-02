import { RiderBottomNav } from "@/components/rider/bottom-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export const metadata = {
  title: "Rider Portal | Smart-Clean",
  description: "Rider dashboard for deliveries",
};

export default function RiderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-[#F7F8FA] dark:bg-[#090B11] overflow-hidden relative">
      {/* Rider Top Header (Mobile optimized) */}
      <header className="absolute top-0 left-0 right-0 h-16 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-cobalt/10 flex items-center justify-center">
            <span className="text-brand-cobalt font-bold text-xs">JD</span>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900 dark:text-white">
              John Doe
            </p>
            <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16 pb-16 custom-scrollbar">
        {children}
      </main>

      {/* Bottom Nav */}
      <RiderBottomNav />
    </div>
  );
}
