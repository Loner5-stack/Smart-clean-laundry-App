"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plus, Sparkles, Image as ImageIcon } from "lucide-react";
import { getServices } from "@/lib/api";
import { AdminService } from "@/data/mock-admin";
import { Spinner } from "@/components/ui/spinner";

type FilterTab = "all" | "standard" | "premium";

/** Format a number as Nigerian Naira */
function formatNaira(amount: number): string {
  return `\u20A6${amount.toLocaleString("en-NG")}`;
}

const tabs: { label: string; value: FilterTab }[] = [
  { label: "All Services", value: "all" },
  { label: "Standard", value: "standard" },
  { label: "Premium", value: "premium" },
];

function ServiceCard({ service, index }: { service: AdminService; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ delay: Math.min(index * 0.04, 0.2), duration: 0.3, ease: "easeOut" }}
      className="group bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative w-full h-44 bg-gray-50 dark:bg-white/5 overflow-hidden">
        {service.imagePath ? (
          <Image
            src={service.imagePath}
            alt={service.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-400">
            <ImageIcon size={32} className="mb-2 opacity-50" />
            <span className="text-xs font-bold uppercase tracking-wider opacity-50">No Image</span>
          </div>
        )}

        {/* Premium badge */}
        {service.category.toLowerCase() === "premium" && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold tracking-wide shadow-md">
            <Sparkles size={10} />
            Premium
          </div>
        )}

        {/* Add button */}
        <Link
          href={`/dashboard/orders/new?service=${service.id}`}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-brand-cobalt flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform duration-200"
          aria-label={`Order ${service.name}`}
        >
          <Plus size={15} className="text-white" />
        </Link>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
            {service.name}
          </h3>
          <span className="shrink-0 text-xs font-extrabold text-brand-cobalt whitespace-nowrap">
            {formatNaira(service.price)}
            <span className="text-gray-400 font-medium">/{service.unit}</span>
          </span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2">
          {service.description}
        </p>

        {/* CTA */}
        <Link
          href={`/dashboard/orders/new?service=${service.id}`}
          className="mt-3.5 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-brand-cobalt/5 dark:bg-brand-cobalt/10 hover:bg-brand-cobalt hover:text-white text-brand-cobalt text-xs font-bold transition-all duration-200 group/btn"
        >
          <Plus size={13} className="transition-transform group-hover/btn:rotate-90 duration-200" />
          Add to Order
        </Link>
      </div>
    </motion.div>
  );
}

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const tabsRef = useRef<HTMLDivElement>(null);
  const [services, setServices] = useState<AdminService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then((data) => {
        setServices(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load services:", err);
        setIsLoading(false);
      });
  }, []);

  const filtered =
    activeTab === "all"
      ? services
      : services.filter((s) => s.category.toLowerCase() === activeTab);

  return (
    <div className="px-4 md:px-6 py-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Our Services
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Choose a service to start a new order. Premium services have higher care standards.
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <div
        ref={tabsRef}
        className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.value
                ? "bg-brand-cobalt text-white shadow-md"
                : "bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10"
            }`}
          >
            {tab.label}
            <span
              className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab.value
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 dark:bg-white/10 text-gray-400"
              }`}
            >
              {tab.value === "all"
                ? services.length
                : services.filter((s) => s.category.toLowerCase() === tab.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="w-full flex items-center justify-center py-24">
          <Spinner size={32} className="text-brand-cobalt" />
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filtered.map((service, idx) => (
              <ServiceCard key={service.id} service={service} index={idx} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
