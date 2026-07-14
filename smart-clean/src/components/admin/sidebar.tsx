"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  Database, 
  LogOut,
  Bike,
  Briefcase,
  CreditCard,
  Phone,
  Lock,
  Repeat
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_SECTIONS = [
  {
    title: "OPERATIONS",
    items: [
      { href: "/admin", icon: LayoutDashboard, label: "Overview" },
      { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
      { href: "/admin/riders", icon: Bike, label: "Riders" },
      { href: "/admin/subscribers", icon: Repeat, label: "Subscribers" },
      { href: "/admin/support", icon: Phone, label: "Support" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-[#111827] border-r border-gray-200 dark:border-white/10 flex flex-col h-full shadow-[4px_0_24px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-20 shrink-0">
      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-gray-200 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-[#2a62ff] w-8 h-8 rounded-lg flex items-center justify-center">
            <Database className="text-white" size={16} />
          </div>
          <span className="font-extrabold text-lg text-gray-900 dark:text-white tracking-tight">
            Control Center
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto custom-scrollbar">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider mb-2">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href || pathname.startsWith(`${href}/`);
                // Special exception for /admin so it doesn't match everything
                const isExact = href === "/admin" ? pathname === "/admin" : isActive;
                
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all group ${
                      isExact
                        ? "bg-[#2a62ff] text-white shadow-md"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon size={18} className={isExact ? "text-white" : "text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Area */}
      <div className="p-4 border-t border-gray-200 dark:border-white/10 shrink-0 space-y-2">
        <Link
          href="/admin/tech-login"
          className="w-full flex items-center justify-between px-3 py-3 rounded-xl font-bold text-sm bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Lock size={18} />
            Tech Access
          </div>
        </Link>

        <button 
          onClick={() => {
            document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/admin/login";
          }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <LogOut size={18} className="text-gray-400" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
