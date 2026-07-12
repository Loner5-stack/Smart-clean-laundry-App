"use client";
import { motion } from "framer-motion";
import { MapPin, Navigation2, Phone, CheckCircle2, MoreVertical } from "lucide-react";
import { mockAdminOrders } from "@/data/mock-admin";

export default function RiderDashboard() {
  // Mock Rider Context: Taiwo Adeyemi
  const myTasks = mockAdminOrders.filter(order => order.rider === "Taiwo Adeyemi");
  const nextTask = myTasks.find(t => t.status === "PICKUP_ASSIGNED" || t.status === "OUT_FOR_DELIVERY") || myTasks[0];
  const pendingCount = myTasks.filter(t => t.status !== "COMPLETED" && t.status !== "CANCELLED").length;
  return (
    <div className="flex flex-col h-full bg-[#F7F8FA] dark:bg-[#090B11]">
      {/* Map Area (Placeholder) */}
      <div className="relative w-full h-[55vh] bg-gray-200 dark:bg-gray-800">
        <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
        
        {/* Mock Map Route UI */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 border-[3px] border-dashed border-brand-cobalt/50 rounded-full animate-[spin_60s_linear_infinite]" />
          <div className="absolute w-8 h-8 bg-brand-cobalt rounded-full flex items-center justify-center shadow-lg shadow-brand-cobalt/30 animate-pulse">
            <Navigation2 size={16} className="text-white fill-current rotate-45" />
          </div>
        </div>

        {/* Floating Metrics */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-white/10 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-gray-900 dark:text-white">{pendingCount} Tasks Left</span>
          </div>
        </div>
      </div>

      {/* Current Task Bottom Sheet style */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="flex-1 bg-white dark:bg-[#111827] rounded-t-3xl -mt-6 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-gray-100 dark:border-white/5 flex flex-col p-6"
      >
        {/* Drag handle pill */}
        <div className="w-12 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full mx-auto mb-6" />

        <div className="flex items-center justify-between mb-4">
          <span className="bg-brand-cobalt/10 text-brand-cobalt text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">
            {nextTask?.status === "PICKUP_ASSIGNED" ? "Next Pickup" : "Next Delivery"}
          </span>
          <span className="text-sm font-black text-gray-900 dark:text-white">
            1.2 km
          </span>
        </div>

        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1">
          {nextTask?.customerName || "No active tasks"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-start gap-2 mb-6">
          <MapPin size={16} className="shrink-0 mt-0.5 text-gray-400" />
          {nextTask?.customerAddress || "---"}
        </p>

        {/* Actions */}
        <div className="flex gap-3 mt-auto">
          <button className="flex-1 bg-brand-cobalt hover:bg-brand-cobalt/90 text-white rounded-2xl py-3.5 font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-brand-cobalt/20 disabled:opacity-50" disabled={!nextTask}>
            <Navigation2 size={18} className="fill-current" />
            Navigate
          </button>
          <a href={nextTask ? `tel:${nextTask.customerPhone}` : "#"} className="w-14 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-2xl flex items-center justify-center transition-all active:scale-[0.98]">
            <Phone size={20} className="fill-current" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
