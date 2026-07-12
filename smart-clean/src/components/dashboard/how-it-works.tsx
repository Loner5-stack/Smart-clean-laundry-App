"use client";
import { motion, Variants } from "framer-motion";
import { Calendar, Shirt, Truck, LucideIcon } from "lucide-react";
import { howItWorksSteps } from "@/data/mock-dashboard";

const iconMap: Record<string, LucideIcon> = {
  Calendar,
  Shirt,
  Truck,
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export function HowItWorks() {
  return (
    <section>
      {/* Section Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          How it Works
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
          Simple 3-step process for effortless freshness.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {howItWorksSteps.map((step, i) => {
          const Icon = iconMap[step.icon] ?? Calendar;
          return (
            <motion.div
              key={step.step}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              style={{ transitionDelay: `${i * 0.1}s` }}
              className="relative bg-white dark:bg-[#111827] rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
            >
              {/* Step number watermark */}
              <span className="absolute top-4 right-5 text-6xl font-black text-gray-100 dark:text-white/5 select-none leading-none transition-all duration-300 group-hover:text-gray-200 dark:group-hover:text-white/10">
                {step.step}
              </span>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-brand-cobalt/10 dark:bg-brand-cobalt/20 flex items-center justify-center mb-4">
                <Icon size={20} className="text-brand-cobalt" />
              </div>

              {/* Text */}
              <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1.5">
                {step.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
