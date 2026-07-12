"use client";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MainScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide the extra bottom padding on screens where BottomNav is also hidden
  const hidePadding = pathname.startsWith("/dashboard/orders/new") || pathname.startsWith("/dashboard/orders/confirmed");

  return (
    <ScrollArea className="flex-1 min-h-0">
      <main
        className={`lg:pb-6 ${
          hidePadding ? "pb-0" : "pb-20"
        }`}
      >
        {children}
      </main>
    </ScrollArea>
  );
}
