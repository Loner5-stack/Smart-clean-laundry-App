"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, MoreHorizontal, Calendar, X, Eye, Truck, User, CreditCard } from "lucide-react";
import { mockAdminSubscriptions, mockAdminRiders, AdminSubscription } from "@/data/mock-admin";

export default function OperationalSubscribersPage() {
  const [search, setSearch] = useState("");
  const [selectedSub, setSelectedSub] = useState<AdminSubscription | null>(null);

  // Mock upcoming pickups for the selected subscriber
  const generateUpcomingPickups = (sub: AdminSubscription) => {
    const pickups = [];
    const baseDate = new Date();
    // Assuming weekly pickups for standard, monthly for others just for mock variability
    const intervalDays = sub.planName.toLowerCase().includes("premium") ? 7 : 30;

    for (let i = 1; i <= 4; i++) {
      const pDate = new Date(baseDate.getTime() + (1000 * 60 * 60 * 24 * intervalDays * i));
      pickups.push({
        id: `pickup-${i}`,
        date: pDate,
        status: i === 1 ? "Pending" : "Scheduled",
        assignedRiderId: i === 1 ? "RIDER-02" : null // pre-assign one for demo
      });
    }
    return pickups;
  };

  const [pickups, setPickups] = useState<any[]>([]);

  const openPickupManager = (sub: AdminSubscription) => {
    setSelectedSub(sub);
    setPickups(generateUpcomingPickups(sub));
  };

  const closePickupManager = () => {
    setSelectedSub(null);
    setPickups([]);
  };

  const handleAssignRider = (pickupId: string, riderId: string) => {
    setPickups(prev => prev.map(p => p.id === pickupId ? { ...p, assignedRiderId: riderId } : p));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Subscribers Logistics</h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">Manage active subscribers, view payments, and schedule pickup riders.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-4 flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search subscribers..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 border border-transparent rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-4 pl-6">Subscriber</th>
                <th className="p-4">Plan Details</th>
                <th className="p-4">Payment / Status</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {mockAdminSubscriptions.filter(s => s.customerName.toLowerCase().includes(search.toLowerCase())).map((sub, i) => (
                <motion.tr 
                  key={sub.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-cobalt/10 flex items-center justify-center text-brand-cobalt font-bold">
                        {sub.customerName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm">{sub.customerName}</div>
                        <div className="text-xs font-semibold text-gray-500 mt-0.5">{sub.customerEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-md text-xs font-bold inline-block mb-1">
                      {sub.planName}
                    </span>
                    <div className="text-xs font-semibold text-gray-500">Cycle: {sub.billingCycle}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard size={14} className="text-gray-400" />
                      <span className="font-bold text-gray-900 dark:text-white text-sm">₦{sub.amount.toLocaleString()}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      sub.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" :
                      "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button 
                      onClick={() => openPickupManager(sub)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cobalt text-white rounded-xl text-xs font-bold shadow-sm shadow-brand-cobalt/20 hover:brightness-110 transition-all"
                    >
                      <Calendar size={14} />
                      Manage Pickups
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pickup Management Modal */}
      <AnimatePresence>
        {selectedSub && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={closePickupManager} 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }} 
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white dark:bg-[#111827] h-full shadow-2xl border-l border-gray-100 dark:border-white/10 flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">Manage Pickups</h3>
                  <p className="text-sm font-semibold text-gray-500 mt-1">{selectedSub.customerName} &bull; {selectedSub.planName}</p>
                </div>
                <button 
                  onClick={closePickupManager} 
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Upcoming Schedule</h4>
                  <div className="space-y-4">
                    {pickups.map((pickup, idx) => (
                      <div key={pickup.id} className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1f2937] border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center shadow-sm">
                              <span className="text-[10px] font-bold text-gray-400 uppercase leading-none">{pickup.date.toLocaleString('default', { month: 'short' })}</span>
                              <span className="text-sm font-black text-gray-900 dark:text-white leading-tight">{pickup.date.getDate()}</span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">Scheduled Pickup</p>
                              <p className="text-xs font-semibold text-gray-500">{pickup.status}</p>
                            </div>
                          </div>
                        </div>

                        {/* Rider Assignment Dropdown for this specific pickup */}
                        <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                          <label className="block text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5">
                            <Truck size={14} /> Assign Rider for this date
                          </label>
                          <select 
                            value={pickup.assignedRiderId || ""}
                            onChange={(e) => handleAssignRider(pickup.id, e.target.value)}
                            className="w-full bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-cobalt text-gray-900 dark:text-white"
                          >
                            <option value="">-- Unassigned --</option>
                            {mockAdminRiders.map(rider => (
                              <option key={rider.id} value={rider.id}>
                                {rider.name} ({rider.status})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] shrink-0">
                <button 
                  onClick={closePickupManager}
                  className="w-full py-3 bg-brand-cobalt text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-md shadow-brand-cobalt/20"
                >
                  Save Schedule Updates
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
