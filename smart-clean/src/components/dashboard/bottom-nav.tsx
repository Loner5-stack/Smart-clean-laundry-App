"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  PiHouseDuotone,
  PiTagDuotone,
  PiClipboardTextDuotone,
  PiUserCirclePlusDuotone
} from "react-icons/pi";

const mainTabs = [
  { id: "home", href: "/dashboard", label: "Home", icon: PiHouseDuotone },
  { id: "services", href: "/dashboard/services", label: "Services", icon: PiTagDuotone },
  { id: "orders", href: "/dashboard/orders", label: "Orders", icon: PiClipboardTextDuotone },
  { id: "account", href: "/dashboard/account", label: "Account", icon: PiUserCirclePlusDuotone },
];

export function BottomNav() {
  const pathname = usePathname();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    // Hide the bottom nav when an input or textarea is focused on mobile
    const handleFocus = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        setIsKeyboardOpen(true);
      }
    };
    const handleBlur = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        setIsKeyboardOpen(false);
      }
    };

    window.addEventListener("focusin", handleFocus);
    window.addEventListener("focusout", handleBlur);

    return () => {
      window.removeEventListener("focusin", handleFocus);
      window.removeEventListener("focusout", handleBlur);
    };
  }, []);
  
  if (pathname.startsWith("/dashboard/orders/new") || pathname.startsWith("/dashboard/orders/confirmed")) {
    return null;
  }

  if (isKeyboardOpen) {
    return null;
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#0D1117] border-t border-gray-100 dark:border-white/5 flex items-center justify-around px-2 pt-1.5 pb-2 safe-area-pb">
      {mainTabs.map(({ href, label, icon: Icon, id }) => {
        // Simple active check. If it's the home route, must match exactly.
        // Otherwise, match the path prefix.
        const isActive =
          href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(href);

        return (
          <Link
            key={id}
            href={href}
            className="flex flex-col items-center gap-0.5 px-4 pt-1 pb-0.5 rounded-xl transition-all w-[80px]"
          >
            <Icon
              size={26}
              className={isActive ? "text-brand-cobalt" : "text-gray-400 dark:text-gray-500"}
            />
            <span
              className={`text-[10px] font-semibold ${
                isActive ? "text-brand-cobalt" : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
