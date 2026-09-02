"use client";

import { Bell, Search, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function AdminTopHeader() {
  return (
    <header className="h-16 bg-white dark:bg-[#111827] border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-6 z-10 shrink-0 sticky top-0">
      {/* Global Search */}
      <div className="flex-1 max-w-md relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />
        <input
          type="text"
          placeholder="Search orders, customers, or riders..."
          className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-transparent focus:bg-white dark:focus:bg-[#111827] focus:border-gray-200 dark:focus:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        <button className="relative p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <Bell size={20} />
          {/* Notification Badge */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#111827]"></span>
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-2"></div>
      </div>
    </header>
  );
}
