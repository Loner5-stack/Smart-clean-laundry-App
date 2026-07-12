"use client";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Bike, AlertTriangle, Clock, ArrowUpRight, ArrowDownRight, Activity, Users } from "lucide-react";
import { mockAdminOrders, adminStatusColors, OrderStatus } from "@/data/mock-admin";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, YAxis, Cell } from "recharts";
import Link from "next/link";

const PIPELINE_STAGES: { id: OrderStatus; label: string }[] = [
  { id: "PENDING", label: "Pending" },
  { id: "PICKUP_ASSIGNED", label: "Rider Assigned" },
  { id: "AT_HUB", label: "At Hub" },
  { id: "IN_PRODUCTION", label: "In Production" },
  { id: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { id: "COMPLETED", label: "Completed" },
];

// Mock Revenue Data for Chart
const revenueData = [
  { name: "Mon", amount: 45000, orders: 12 },
  { name: "Tue", amount: 52000, orders: 15 },
  { name: "Wed", amount: 38000, orders: 9 },
  { name: "Thu", amount: 65000, orders: 18 },
  { name: "Fri", amount: 48000, orders: 14 },
  { name: "Sat", amount: 89000, orders: 25 },
  { name: "Sun", amount: 72000, orders: 20 },
];

export default function AdminDashboard() {
  const todayRevenue = 75000;
  const todayOrders = 21;
  const activeRiders = 4;
  const totalRiders = 6;
  const needsActionCount = 2; // Mock stuck orders

  const getStageOrders = (status: OrderStatus) => mockAdminOrders.filter(o => o.status === status);

  return (
    <div className="space-y-8">
      {/* Top Row — 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Orders Today */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }} className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 rounded-lg bg-brand-cobalt/10 flex items-center justify-center text-brand-cobalt">
              <ShoppingBag size={20} />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight size={12} /> +12%
            </div>
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Orders Today</h3>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{todayOrders}</p>
        </motion.div>

        {/* Card 2: Revenue Today */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <TrendingUp size={20} />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400">
              <ArrowDownRight size={12} /> -3%
            </div>
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Revenue Today</h3>
          <p className="text-2xl font-black text-gray-900 dark:text-white">₦{todayRevenue.toLocaleString()}</p>
        </motion.div>

        {/* Card 3: Active Riders */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600">
              <Bike size={20} />
            </div>
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Active Riders</h3>
          <p className="text-2xl font-black text-gray-900 dark:text-white">{activeRiders} <span className="text-sm font-semibold text-gray-400">/ {totalRiders} on duty</span></p>
        </motion.div>

        {/* Card 4: Needs Action */}
        <Link href="/admin/orders?filter=needs_action" className="block outline-none">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-[#111827] rounded-2xl p-5 border-y border-r border-l-4 border-gray-100 dark:border-white/5 border-l-brand-cobalt shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand-cobalt/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start mb-2 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
                <AlertTriangle size={20} />
              </div>
            </div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 relative z-10">Needs Action</h3>
            <p className="text-2xl font-black text-gray-900 dark:text-white relative z-10">{needsActionCount} <span className="text-sm font-semibold text-gray-400">stuck orders</span></p>
          </motion.div>
        </Link>
      </div>

      {/* Middle Section — Live Order Pipeline */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Activity size={20} className="text-brand-cobalt" />
          Live Order Pipeline
        </h2>
        
        <div className="flex overflow-x-auto custom-scrollbar pb-4 -mx-2 px-2 gap-4 snap-x">
          {PIPELINE_STAGES.map((stage, i) => {
            const stageOrders = getStageOrders(stage.id);
            const isBottleneck = stageOrders.length >= 3 && stage.id !== "COMPLETED"; // Mock bottleneck logic

            return (
              <div key={stage.id} className={`flex-1 min-w-[240px] snap-center rounded-2xl p-4 border transition-colors ${
                isBottleneck 
                  ? "bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-500/20" 
                  : "bg-gray-50 dark:bg-white/[0.02] border-transparent"
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${adminStatusColors[stage.id].split(" ")[0].replace('bg-', 'bg-').replace('/10', '')} shadow-sm`} />
                    <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300">{stage.label}</h3>
                  </div>
                  <span className={`text-xl font-black ${isBottleneck ? "text-amber-600" : "text-gray-900 dark:text-white"}`}>
                    {stageOrders.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {stageOrders.slice(0, 3).map(order => (
                    <Link href={`/admin/orders/${order.id}`} key={order.id} className="block bg-white dark:bg-[#1f2937] p-3 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-brand-cobalt">{order.id}</span>
                        <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1"><Clock size={10}/> 2h</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{order.customerName}</p>
                    </Link>
                  ))}
                  {stageOrders.length === 0 && (
                    <div className="py-4 text-center border-2 border-dashed border-gray-200 dark:border-white/5 rounded-xl">
                      <p className="text-xs font-bold text-gray-400">Empty</p>
                    </div>
                  )}
                  {stageOrders.length > 3 && (
                    <Link href={`/admin/orders?status=${stage.id}`} className="block text-center text-xs font-bold text-brand-cobalt hover:underline mt-2">
                      View all {stageOrders.length}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section — Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Recent Activity Feed (60%) */}
        <div className="lg:col-span-3 bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm flex flex-col h-[400px]">
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6">Recent Activity</h2>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-6">
            
            {/* Mock Events */}
            <div className="flex gap-4 relative">
              <div className="absolute left-[19px] top-10 bottom-[-24px] w-0.5 bg-gray-100 dark:bg-white/5" />
              <div className="w-10 h-10 rounded-full bg-brand-cobalt/10 flex items-center justify-center shrink-0 z-10">
                <ShoppingBag size={16} className="text-brand-cobalt" />
              </div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white font-medium">Order <span className="font-bold text-brand-cobalt cursor-pointer hover:underline">SC-4432</span> placed by <span className="font-bold">Amaka Johnson</span></p>
                <p className="text-xs font-semibold text-gray-500 mt-1">Wash & Fold • 15 mins ago</p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="absolute left-[19px] top-10 bottom-[-24px] w-0.5 bg-gray-100 dark:bg-white/5" />
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 z-10">
                <Bike size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white font-medium">Rider <span className="font-bold">Taiwo Adeyemi</span> assigned to <span className="font-bold text-brand-cobalt cursor-pointer hover:underline">SC-4431</span></p>
                <p className="text-xs font-semibold text-gray-500 mt-1">45 mins ago</p>
              </div>
            </div>

            <div className="flex gap-4 relative">
               <div className="absolute left-[19px] top-10 bottom-[-24px] w-0.5 bg-gray-100 dark:bg-white/5" />
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 z-10">
                <Activity size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white font-medium">Order <span className="font-bold text-brand-cobalt cursor-pointer hover:underline">SC-4430</span> status updated to <span className="font-bold text-purple-600">AT HUB</span></p>
                <p className="text-xs font-semibold text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex gap-4 relative">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 z-10">
                <Users size={16} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white font-medium">New customer registered: <span className="font-bold">Chidi Eze</span></p>
                <p className="text-xs font-semibold text-gray-500 mt-1">3 hours ago</p>
              </div>
            </div>

          </div>
        </div>

        {/* Right: Revenue Chart (40%) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm flex flex-col h-[400px]">
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-2">Revenue (7 Days)</h2>
          <p className="text-sm font-semibold text-gray-500 mb-6">This week: <span className="text-gray-900 dark:text-white font-bold">₦409,000</span> across 113 orders</p>
          
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 700 }}
                  tickFormatter={(val) => `₦${val/1000}k`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(42, 98, 255, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-900 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-xl">
                          <p>₦{payload[0].value?.toLocaleString()}</p>
                          <p className="text-gray-400 font-semibold text-[10px] mt-0.5">{payload[0].payload.orders} orders</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="amount" 
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                >
                  {revenueData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.amount === Math.max(...revenueData.map(d => d.amount)) ? "#2a62ff" : "rgba(42, 98, 255, 0.3)"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
