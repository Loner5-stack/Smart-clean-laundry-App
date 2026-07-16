"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  PiHouseDuotone,
  PiTagDuotone,
  PiClipboardTextDuotone,
  PiUserCirclePlusDuotone,
  PiSignOutDuotone
} from "react-icons/pi";
import { BrandLogo } from "@/components/brand-logo";
import { mockUser } from "@/data/mock-dashboard";

const navGroups = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", label: "Home", icon: PiHouseDuotone },
      { href: "/dashboard/services", label: "Services", icon: PiTagDuotone },
    ],
  },
  {
    label: "Manage",
    items: [
      { href: "/dashboard/orders", label: "Orders", icon: PiClipboardTextDuotone },
      { href: "/dashboard/account", label: "Account", icon: PiUserCirclePlusDuotone },
    ],
  },
];

export function Sidebar({ user }: { user?: any }) {
  const pathname = usePathname();
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };
  
  if (pathname.startsWith("/dashboard/orders/new") || pathname.startsWith("/dashboard/orders/confirmed")) {
    return null;
  }

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-white dark:bg-[#0D1117] border-r border-gray-100 dark:border-white/5 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 mb-4">
        <BrandLogo />
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-[15px] text-gray-900 dark:text-white tracking-tight">
            Smart-Clean
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-8 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
        {navGroups.map((group) => {
          return (
            <div key={group.label} className="space-y-1">
              <div className="flex items-center px-2 mb-3">
                <p className="text-[11px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {group.label}
                </p>
              </div>

              <div className="space-y-1.5">
                {group.items.map(({ href, label, icon: Icon }) => {
                  const isActive =
                    href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(href);

                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[15px] font-medium transition-all duration-200 group ${
                        isActive
                          ? "bg-brand-cobalt/10 dark:bg-[#1E253E] text-brand-cobalt shadow-none"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      {href === "/dashboard/account" && user?.image ? (
                        <div className={`w-[22px] h-[22px] rounded-full overflow-hidden border-2 ${isActive ? 'border-brand-cobalt shadow-sm' : 'border-transparent'} transition-all`}>
                          <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <Icon
                          size={22}
                          className={
                            isActive
                              ? "text-brand-cobalt"
                              : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors"
                          }
                        />
                      )}
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User Profile at Bottom */}
      <div className="px-4 py-4 border-t border-gray-100 dark:border-white/5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-cobalt flex items-center justify-center shrink-0 overflow-hidden">
            {user?.image ? (
              <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-xs font-bold">
                {getInitials(user?.name)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.name || "Customer"}
            </p>
            <p className="text-xs text-gray-400 truncate capitalize">{user?.role?.toLowerCase() || "Customer"}</p>
          </div>
        </div>

        {/* Desktop Log Out Button */}
        <button
          onClick={() => {
            // @ts-ignore - signOut is imported below, but just in case it isn't dynamically
            import("next-auth/react").then(({ signOut }) => signOut({ redirectTo: "/login" }));
          }}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <PiSignOutDuotone size={18} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
