"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, Info } from "lucide-react";
import type { OrderState } from "@/types/order-wizard";
import { AdminService } from "@/data/mock-admin";

function formatNaira(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

interface Props {
  order: OrderState;
  onChange: (patch: Partial<OrderState>) => void;
  onSelectService?: (index: number) => void;
  services: AdminService[];
}

export function StepService(props: Props) {
  const { order, onChange, services } = props;
  const [activeInfo, setActiveInfo] = useState<string | null>(null);

  const standardServices = services.filter((s) => s.category === "Standard");
  const premiumServices = services.filter((s) => s.category === "Premium");

  useEffect(() => {
    const handleClickOutside = () => setActiveInfo(null);
    if (activeInfo) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeInfo]);

  const toggleService = (id: string, name: string) => {
    const isSelected = order.serviceIds.includes(id);
    let targetIndex = order.serviceIds.length;
    if (!isSelected) {
      onChange({
        serviceIds: [...order.serviceIds, id],
        serviceNames: [...order.serviceNames, name],
      });
    } else {
      targetIndex = order.serviceIds.indexOf(id);
    }
    // Always advance to the next step, whether they just added it or tapped an existing one
    if (props.onSelectService) {
      props.onSelectService(targetIndex);
    }
  };

  const renderCard = (service: AdminService) => {
    const isSelected = order.serviceIds.includes(service.id);
    return (
      <div
        key={service.id}
        onClick={() => toggleService(service.id, service.name)}
        className={`relative flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer select-none ${
          isSelected
            ? "border-brand-cobalt bg-brand-cobalt/5 dark:bg-brand-cobalt/10 shadow-md"
            : "border-gray-100 dark:border-white/10 bg-white dark:bg-[#111827] hover:border-brand-cobalt/40"
        }`}
      >
        {/* Thumbnail */}
        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-50 dark:bg-white/5">
          {service.imagePath ? (
            <Image
              src={service.imagePath}
              alt={service.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl">
              {"✨"}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1 relative">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {service.name}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent toggling the card
                setActiveInfo(activeInfo === service.id ? null : service.id);
              }}
              className="p-1 -ml-1 rounded-full text-gray-400 hover:text-brand-cobalt hover:bg-brand-cobalt/10 transition-colors"
            >
              <Info size={14} />
            </button>

            {service.category === "Premium" && (
              <span className="shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 text-[9px] font-bold">
                <Sparkles size={8} /> Premium
              </span>
            )}
          </div>

          <AnimatePresence>
            {activeInfo === service.id && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()} // prevent toggling if user clicks the tooltip text
                className="absolute z-50 left-0 top-7 w-55 p-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs rounded-xl shadow-xl leading-relaxed"
              >
                {service.description}
                <div className="absolute -top-1 left-5 w-3 h-3 bg-gray-900 dark:bg-white rotate-45 rounded-sm" />
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs text-brand-cobalt font-bold">
            from {formatNaira(service.price)}/{service.unit}
          </p>
        </div>

        {/* Checkmark */}
        {isSelected && (
          <div className="shrink-0 w-5 h-5 rounded-full bg-brand-cobalt flex items-center justify-center">
            <Check size={11} className="text-white" strokeWidth={3} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
        What would you like to clean?
      </h2>
      <p className="text-sm text-gray-400 mb-1">
        Tap a service to continue. You can add more on the next screen.
      </p>
      <p className="text-xs text-gray-300 dark:text-gray-600 mb-5">
        Most customers start with <strong className="text-gray-600 dark:text-gray-300">Wash &amp; Fold</strong>.
      </p>

      {/* Everyday Laundry */}
      <div className="mb-6">
        <p className="text-[11px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
          Everyday Laundry
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {standardServices.map(renderCard)}
        </div>
      </div>

      {/* Specialist Care */}
      <div>
        <p className="text-[11px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
          Specialist Care
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {premiumServices.map(renderCard)}
        </div>
      </div>
    </div>
  );
}
