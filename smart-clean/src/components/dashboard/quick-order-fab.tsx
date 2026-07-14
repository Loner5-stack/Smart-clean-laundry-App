"use client";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

/** Single-tap FAB — always expanded, springs in on load, navigates on tap. */
export function QuickOrderFab() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-20 lg:bottom-6 right-5 z-50"
    >
      <button
        onClick={() => router.push("/dashboard/orders/new")}
        aria-label="New Order"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#2a62ff] text-white shadow-[0_8px_30px_rgb(42,98,255,0.3)] hover:brightness-110 hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <Plus size={24} />
      </button>
    </motion.div>
  );
}
