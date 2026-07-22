"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error("Admin Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="w-full min-h-[80vh] flex flex-col justify-center items-center p-8 lg:p-16 font-sans relative overflow-hidden bg-neutral-50 text-neutral-900">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-[#f1ab40]/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        
        {/* Left Content Column */}
        <div className="flex flex-col items-start text-left order-2 lg:order-1">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 font-serif text-neutral-900"
          >
            System Error
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="text-lg md:text-xl lg:text-2xl mb-10 max-w-lg leading-relaxed text-neutral-600"
          >
            Something went wrong. The admin panel lost connection or the requested data could not be found.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => reset()}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#084ba5] text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 shadow-[0_0_20px_rgba(8,75,165,0.2)] hover:shadow-[0_0_30px_rgba(8,75,165,0.4)]"
            >
              <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Reload Page
            </button>

            <Link
              href="/admin"
              className="group flex items-center justify-center gap-3 px-8 py-4 font-semibold rounded-full transition-colors border bg-neutral-200 text-neutral-900 border-neutral-300 hover:bg-neutral-300"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Dashboard Home
            </Link>
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
            className="object-contain drop-shadow-xl lg:scale-[1.15] origin-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}
