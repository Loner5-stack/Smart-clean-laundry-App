"use client";
import { useState, useEffect } from "react";
import { Search, Bell, Package } from "lucide-react";
import { mockUser } from "@/data/mock-dashboard";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { GooeyInput } from "@/components/ui/gooey-input";
import { allServices } from "@/data/mock-dashboard";
import Image from "next/image";

export function TopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (pathname.startsWith("/dashboard/orders/new") || pathname.startsWith("/dashboard/orders/confirmed")) {
    return null;
  }

  const filteredServices = allServices.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 py-3.5 bg-white dark:bg-[#090B11] border-b border-gray-100 dark:border-white/5">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-xs md:max-w-sm h-10 z-50">
        <GooeyInput 
          placeholder="Search services..." 
          onOpenChange={setIsSearchOpen}
          onValueChange={setSearchQuery}
        />
        
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute top-12 left-0 w-[280px] sm:w-[360px] bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/10 shadow-xl rounded-2xl overflow-hidden"
            >
              <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {filteredServices.length > 0 ? (
                  <>
                    <p className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Suggested Services
                    </p>
                    {filteredServices.map(service => (
                      <button
                        key={service.id}
                        onMouseDown={(e) => {
                          e.preventDefault(); // prevent input blur
                          router.push(`/dashboard/orders/new?service=${service.id}`);
                          setIsSearchOpen(false);
                        }}
                        className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 shrink-0 flex items-center justify-center p-1.5">
                          <Image
                            src={service.imagePath}
                            alt={service.name}
                            width={32}
                            height={32}
                            className="object-contain drop-shadow-sm"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {service.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            From ₦{service.price.toLocaleString()}
                          </p>
                        </div>
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">No services found</p>
                    <p className="text-xs text-gray-500 mt-1">Try a different search term</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 ml-4">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          <Bell size={18} className="text-gray-500 dark:text-gray-400" />
          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-cobalt border-2 border-white dark:border-[#090B11]" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
