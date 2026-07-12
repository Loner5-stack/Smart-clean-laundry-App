"use client";
import { motion } from "framer-motion";
import { ClipboardList, Clock, CheckCircle2, Star } from "lucide-react";
import Link from "next/link";
import { mockStats } from "@/data/mock-dashboard";

interface StatCard {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  href: string;
  iconBg: string;
  iconColor: string;
  valueSuffix?: string;
}

const cards: StatCard[] = [
  {
    label: "Total Orders",
    value: mockStats.totalOrders,
    sub: "All time",
    icon: ClipboardList,
    href: "/dashboard/orders",
    iconBg: "bg-brand-cobalt/10 dark:bg-brand-cobalt/20",
    iconColor: "text-brand-cobalt",
  },
  {
    label: "Pending",
    value: mockStats.pendingOrders,
    sub: "In progress",
    icon: Clock,
    href: "/dashboard/orders",
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  {
    label: "Completed",
    value: mockStats.completedOrders,
    sub: "Successfully delivered",
    icon: CheckCircle2,
    href: "/dashboard/orders",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    label: "Reward Points",
    value: mockStats.rewardPoints,
    valueSuffix: "pts",
    sub: `${mockStats.rewardTier} tier`,
    icon: Star,
    href: "/dashboard/account",
    iconBg: "bg-yellow-50 dark:bg-yellow-500/10",
    iconColor: "text-yellow-500",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
          >
            <Link
              href={card.href}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 group"
            >
              {/* Icon */}
              <div
                className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${card.iconBg} transition-transform duration-200 group-hover:scale-110`}
              >
                <Icon size={18} className={card.iconColor} />
              </div>

              {/* Text Content */}
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 truncate">
                  {card.label}
                </p>
                <p className="text-sm font-extrabold text-gray-900 dark:text-white leading-tight mt-0.5">
                  {card.value}
                  {card.valueSuffix && (
                    <span className="text-[10px] font-bold text-gray-400 ml-0.5 uppercase tracking-wider">
                      {card.valueSuffix}
                    </span>
                  )}
                </p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
