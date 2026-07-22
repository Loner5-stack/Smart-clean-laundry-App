"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 font-sans relative overflow-hidden bg-neutral-50 text-neutral-900">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200/50 via-neutral-50 to-neutral-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-200/50 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        
        {/* Left Content Column */}
        <div className="flex flex-col items-start text-left order-2 lg:order-1">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 font-serif text-neutral-900"
          >
            Error 500
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="text-base md:text-xl lg:text-2xl mb-6 md:mb-10 max-w-lg leading-relaxed text-neutral-600"
          >
            We couldn't reach our servers. This is usually caused by a lost internet connection or a temporary network outage. Please check your connection and try again.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          >
            <button
              onClick={() => reset()}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#084ba5] text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 shadow-[0_0_20px_rgba(8,75,165,0.2)] hover:shadow-[0_0_30px_rgba(8,75,165,0.4)]"
            >
              <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Reload Page
            </button>
          </motion.div>
        </div>

        {/* Right Illustration Column */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square order-1 lg:order-2 flex items-center justify-center"
        >
          <Image
            src="/images/error-illustration.png"
            alt="Broken Connection Illustration"
            fill
            className="object-contain drop-shadow-2xl lg:scale-[1.15] origin-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}
