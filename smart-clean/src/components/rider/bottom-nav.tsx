"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, ListTodo, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/rider", icon: Map, label: "Map" },
  { href: "/rider/deliveries", icon: ListTodo, label: "Tasks" },
  { href: "/rider/profile", icon: User, label: "Profile" },
];

export function RiderBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111827] border-t border-gray-100 dark:border-white/5 pb-safe z-50 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around px-2 h-16">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center w-full h-full space-y-1"
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand-cobalt rounded-b-full" />
              )}
              <Icon
                size={22}
                className={isActive ? "text-brand-cobalt" : "text-gray-400"}
              />
              <span
                className={`text-[10px] font-semibold ${
                  isActive ? "text-brand-cobalt" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
