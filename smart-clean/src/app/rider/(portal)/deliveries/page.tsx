"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Package, MapPin, CheckCircle2, Clock } from "lucide-react";

import { mockAdminOrders } from "@/data/mock-admin";

export default function RiderDeliveries() {
  const [filter, setFilter] = useState<"pending" | "completed">("pending");

  // Mock Rider Context: Taiwo Adeyemi
  const myTasks = mockAdminOrders
    .filter(order => order.rider === "Taiwo Adeyemi")
    .map(order => ({
      id: order.id,
      type: order.status === "PICKUP_ASSIGNED" ? "pickup" : "delivery",
      name: order.customerName,
      address: order.customerAddress,
      status: order.status === "COMPLETED" ? "completed" : "pending",
      time: order.pickupTimeSlot.split(" - ")[0], // e.g. "08:00 AM"
    }));

  const filteredTasks = myTasks.filter(task => task.status === filter);

  return (
    <div className="min-h-full bg-[#F7F8FA] dark:bg-[#090B11] p-4">
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
        Today's Tasks
      </h1>

      {/* Tabs */}
      <div className="flex bg-gray-200/50 dark:bg-white/5 p-1 rounded-xl mb-6">
        <button
          onClick={() => setFilter("pending")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            filter === "pending" 
              ? "bg-white dark:bg-[#111827] text-brand-cobalt shadow-sm" 
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            filter === "completed" 
              ? "bg-white dark:bg-[#111827] text-brand-cobalt shadow-sm" 
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10">
            <CheckCircle2 size={40} className="mx-auto text-gray-300 dark:text-white/20 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No {filter} tasks.</p>
          </div>
        ) : (
          filteredTasks.map((task, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={task.id}
              className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-gray-100 dark:border-white/5 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md ${
                    task.type === "pickup" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                  }`}>
                    {task.type}
                  </span>
                  <span className="text-xs font-bold text-gray-400">#{task.id}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold">
                  <Clock size={12} />
                  {task.time}
                </div>
              </div>

              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{task.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5 mt-1.5 mb-4">
                <MapPin size={14} className="shrink-0 text-brand-cobalt" />
                {task.address}
              </p>

              {filter === "pending" && (
                <button 
                  onClick={() => alert(`Status update for ${task.id} (Coming Soon)`)}
                  className="w-full bg-brand-cobalt/10 hover:bg-brand-cobalt/20 text-brand-cobalt font-bold text-sm py-3 rounded-xl transition-colors"
                >
                  Update Status
                </button>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
