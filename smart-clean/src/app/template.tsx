// app/template.tsx
"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Inside the dashboard the sidebar and nav are persistent — no full-page
  // transition needed. A subtle fade on the content area is enough and avoids
  // the flash caused by AnimatePresence remounting on every route change.
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) {
    return (
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="flex flex-col min-h-screen"
      >
        {children}
      </motion.div>
    );
  }

  // For auth / landing pages a slightly longer cross-fade is fine.
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col min-h-screen"
    >
      {children}
    </motion.div>
  );
}
