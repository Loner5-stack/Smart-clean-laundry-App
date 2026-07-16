"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarPlus } from "lucide-react";

export function HeroBanner({ isFirstTimeUser = false, userName = "" }: { isFirstTimeUser?: boolean; userName?: string }) {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const names = userName.split(" ");
  const secondName = names.length > 1 ? names[1] : names[0] || "Customer";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl bg-brand-cobalt min-h-[220px] md:min-h-[260px] flex items-center"
    >
      {/* Background glow blobs and two-tone background */}
      <div className="absolute inset-0 pointer-events-none flex">
        <div className="w-[55%]" /> {/* Left side solid cobalt */}
        <div className="w-[45%] h-full bg-white/15" /> {/* Right side lighter blue block */}
      </div>

      {/* Text Content */}
      <div className="relative z-10 flex-1 px-7 md:px-10 py-8 max-w-md lg:max-w-lg">
        {/* Tag */}
        <span className="inline-block px-3 py-1 mb-4 rounded-full bg-white/15 text-white/90 text-[11px] font-bold uppercase tracking-widest backdrop-blur-sm border border-white/20">
          Premium Care
        </span>

        {/* Headline */}
        <h2 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold leading-[1.1] tracking-tight mb-5">
          <span className="text-white block">Say goodbye to</span>
          <span className="text-white/60 block mt-1">laundry day.</span>
        </h2>

        {/* Subtext */}
        <p className="text-sm md:text-[15px] text-white/60 font-semibold max-w-sm md:max-w-md mb-8 leading-relaxed">
          Schedule a pickup in 30 seconds. We collect, clean, and deliver.
        </p>

        {/* CTA */}
        <Link
          href="/dashboard/orders/new"
          className="inline-flex items-center justify-center min-w-[220px] px-6 py-3.5 rounded-full bg-white text-brand-cobalt text-sm font-bold shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          style={{ perspective: "1000px" }}
        >
          <AnimatePresence mode="wait">
            {showWelcome ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, rotateX: -90, transformOrigin: "top" }}
                animate={{ opacity: 1, rotateX: 0 }}
                exit={{ opacity: 0, rotateX: 90, transformOrigin: "bottom" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex items-center gap-2"
              >
                <span className="text-xl leading-none">👋</span>
                Welcome, {secondName}!
              </motion.div>
            ) : (
              <motion.div
                key="cta"
                initial={{ opacity: 0, rotateX: -90, transformOrigin: "top" }}
                animate={{ opacity: 1, rotateX: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex items-center gap-2"
              >
                <CalendarPlus size={18} strokeWidth={2.5} />
                {isFirstTimeUser ? "Start Your First Order" : "Continue Ordering"}
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Van Illustration */}
      <div className="absolute right-0 bottom-0 w-64 md:w-80 lg:w-[45%] h-full flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <Image
          src="/images/hero-van.png"
          alt="Delivery Van"
          width={600}
          height={600}
          className="object-cover w-full h-full mix-blend-multiply opacity-90 object-right"
          priority
        />
      </div>
    </motion.div>
  );
}
