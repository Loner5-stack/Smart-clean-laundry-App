"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus } from "lucide-react";
import { getPopularServices } from "@/lib/api";
import { AdminService } from "@/data/mock-admin";

/** Format a number as Nigerian Naira */
function formatNaira(amount: number): string {
  return `\u20A6${amount.toLocaleString("en-NG")}`;
}

export function PopularServices() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [popularServices, setPopularServices] = useState<AdminService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPopularServices() {
      try {
        const data = await getPopularServices();
        setPopularServices(data);
      } catch (err) {
        console.error("Failed to load popular services", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPopularServices();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // Only scroll horizontally if we are scrolling vertically with the mouse wheel
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Popular Services
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            Tap to add to your next order.
          </p>
        </div>
        <a
          href="/dashboard/services"
          className="text-xs font-bold text-brand-cobalt hover:underline flex items-center gap-1"
        >
          View Full Menu
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      {/* Horizontally scrollable cards */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto touch-pan-x overscroll-x-contain pb-3 -mx-4 md:-mx-6 px-4 md:px-6 scroll-pl-4 md:scroll-pl-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      >
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="shrink-0 w-44 md:w-52 h-[220px] bg-gray-100 dark:bg-white/5 animate-pulse rounded-2xl" />
          ))
        ) : popularServices.length === 0 ? (
          <div className="w-full text-center py-8 text-sm font-semibold text-gray-500">
            No popular services found.
          </div>
        ) : (
          popularServices.map((service, i) => (
            <motion.div
              key={service.id}
              onClick={() => router.push(`/dashboard/orders/new?service=${service.id}`)}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: i * 0.07, duration: 0.35, ease: "easeOut" }}
              className="group relative shrink-0 w-44 md:w-52 bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden snap-start cursor-pointer flex flex-col"
            >
              {/* Service Image */}
              <div className="relative w-full h-36 bg-gray-50 dark:bg-white/5 overflow-hidden flex-shrink-0">
                {service.imagePath ? (
                  <Image
                    src={service.imagePath}
                    alt={service.name}
                    fill
                    sizes="208px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                )}
                {/* Add button overlay */}
                <button
                  aria-label={`Add ${service.name} to order`}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-brand-cobalt flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform duration-200 z-10"
                >
                  <Plus size={14} className="text-white" />
                </button>
              </div>

              {/* Info */}
              <div className="p-3.5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                    {service.name}
                  </h4>
                  <span className="text-xs font-extrabold text-brand-cobalt whitespace-nowrap">
                    {formatNaira(service.price)}<span className="font-medium text-gray-400">/{service.unit}</span>
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2 mt-auto">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
