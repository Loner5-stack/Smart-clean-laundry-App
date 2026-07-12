"use client";
import { motion } from "framer-motion";
import { useAuthLayout } from "@/context/login-auth-layout-context";

export function AuthLayoutInner({ children }: { children: React.ReactNode }) {
  const { isExpanded, setIsExpanded } = useAuthLayout();

  return (
    <motion.div
      initial={false}
      animate={{ y: isExpanded ? -120 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      drag="y"
      dragConstraints={{ top: -120, bottom: 0 }}
      dragElastic={0.1}
      onDragEnd={(_, info) => {
        if (info.offset.y < -50) setIsExpanded(true);
        else if (info.offset.y > 50) setIsExpanded(false);
      }}
      className="w-full lg:max-w-170 shrink-0 relative z-10 lg:static lg:mt-0"
      style={{ touchAction: isExpanded ? "auto" : "none" }}
    >
      {/* Drag Handle for Mobile */}
      <div
        className="lg:hidden w-full flex justify-center py-1 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-16 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-[#CBA974] transition-colors" />
      </div>

      {/* The main content container */}
      <div
        className={`relative bg-[#FFFFFF] dark:bg-[#090B11] p-8 md:p-10 rounded-[3rem] lg:rounded-[2.5rem] shadow-2xl border border-[#CBA974]/70 dark:border-[#CBA974]/70 ${isExpanded ? "min-h-170" : "min-h-170"} lg:min-h-0 transition-all duration-500`}
      >
        {children}
      </div>
    </motion.div>
  );
}
