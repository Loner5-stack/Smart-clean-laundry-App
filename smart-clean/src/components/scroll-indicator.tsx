"use client";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const ScrollIndicator = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      // Flow naturally below the text — no absolute positioning
      className="relative flex items-center gap-3 w-fit mt-3 group cursor-pointer"
      aria-label="Scroll to About"
    >
      {/* The glowing pill border that breathes */}
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative p-2.5 rounded-full border border-white/30 dark:border-white/15 backdrop-blur-md bg-white/5 group-hover:bg-white/20 transition-colors overflow-hidden"
      >
        {/* Inner glow ring that pulses */}
        <motion.span
          animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-brand-cobalt/30"
        />
        {/* The chevron bounces independently */}
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown
            className="text-white dark:text-brand-paper relative z-10"
            size={22}
            strokeWidth={2.5}
          />
        </motion.div>
      </motion.div>

      {/* Label */}
      <motion.span
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-xs font-medium text-white/60 dark:text-brand-paper/60 uppercase tracking-widest group-hover:text-white transition-colors"
      >
        Discover more
      </motion.span>
    </motion.button>
  );
};
