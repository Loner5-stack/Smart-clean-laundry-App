"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, Phone, Mail, Star, Bike, Activity, Settings, Map, Clock, CheckCircle, MapPin, XCircle, Calendar } from "lucide-react";
import { mockAdminRiders, mockAdminOrders } from "@/data/mock-admin";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, YAxis, Cell, LineChart, Line } from "recharts";

const performanceData = [
  { name: "Mon", deliveries: 12, onTime: 95 },
  { name: "Tue", deliveries: 15, onTime: 92 },
  { name: "Wed", deliveries: 9, onTime: 100 },
  { name: "Thu", deliveries: 18, onTime: 88 },
  { name: "Fri", deliveries: 14, onTime: 96 },
  { name: "Sat", deliveries: 25, onTime: 90 },
  { name: "Sun", deliveries: 20, onTime: 94 },
];

export default function RiderProfile() {
  const params = useParams();
  const id = params?.id as string;
  const rider = mockAdminRiders.find(r => r.id === id) || mockAdminRiders[0];
  
  const [activeTab, setActiveTab] = useState<"active" | "history" | "performance" | "settings">("active");
  
  const currentOrder = rider.currentAssignment ? mockAdminOrders.find(o => o.id === rider.currentAssignment) : null;
  const deliveryHistory = mockAdminOrders.filter(o => o.rider === rider.name && o.status === "COMPLETED");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active: Available": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
      case "Active: On Delivery": return "bg-brand-cobalt/10 text-brand-cobalt";
      case "Offline": return "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400";
      case "Suspended": return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active: Available": return <CheckCircle size={12} />;
      case "Active: On Delivery": return <Bike size={12} />;
      case "Offline": return <Clock size={12} />;
      case "Suspended": return <XCircle size={12} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Nav */}
      <div className="flex items-center gap-4">
        <Link href="/admin/riders" className="w-10 h-10 rounded-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Rider Profile</h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">{rider.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-brand-cobalt/10 flex items-center justify-center text-brand-cobalt font-black text-2xl mb-4">
                {rider.name.charAt(0)}
              </div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white">{rider.name}</h2>
              <span className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusColor(rider.status)}`}>
                {getStatusIcon(rider.status)} {rider.status}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-gray-400 shrink-0" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">{rider.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-gray-400 shrink-0" />
                <span className="font-semibold text-gray-700 dark:text-gray-300 truncate">{rider.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={16} className="text-gray-400 shrink-0" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">Joined {new Date(rider.joinDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</span>
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-yellow-500 text-yellow-500" />
                  <span className="font-black text-gray-900 dark:text-white">{rider.rating}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">On-Time</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">{rider.onTimeRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabs & Content */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-2xl w-full max-w-[600px] overflow-x-auto custom-scrollbar">
            {[
              { id: "active", icon: Map, label: "Active Assignment" },
              { id: "history", icon: Activity, label: "Delivery History" },
              { id: "performance", icon: Star, label: "Performance" },
              { id: "settings", icon: Settings, label: "Settings" }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? "bg-white dark:bg-[#111827] text-gray-900 dark:text-white shadow-sm" 
                      : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            
            {activeTab === "active" && (
              <motion.div key="active" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 p-6 min-h-[400px]">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Map size={20} className="text-brand-cobalt" />
                    Current Route
                  </h3>
                  
                  {currentOrder ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 p-5 rounded-2xl">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
                            <Link href={`/admin/orders/${currentOrder.id}`} className="text-lg font-black text-brand-cobalt hover:underline">
                              {currentOrder.id}
                            </Link>
                          </div>
                          <span className="bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 px-2.5 py-1 rounded-full text-[10px] font-bold">
                            {currentOrder.status.replace("_", " ")}
                          </span>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-sm">Delivery Address</p>
                              <p className="text-xs font-semibold text-gray-500">{currentOrder.customerAddress}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <User size={16} className="text-gray-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-sm">Customer</p>
                              <p className="text-xs font-semibold text-gray-500">{currentOrder.customerName} • {currentOrder.customerPhone}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10 flex gap-3">
                          <button className="flex-1 py-2 bg-brand-cobalt text-white rounded-xl text-xs font-bold hover:bg-brand-cobalt/90 shadow-sm transition-colors">
                            Contact Rider
                          </button>
                          <button className="flex-1 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                            Reassign
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl relative overflow-hidden flex items-center justify-center min-h-[300px]">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]" />
                        <div className="absolute w-4 h-4 bg-brand-cobalt rounded-full shadow-[0_0_15px_rgba(42,98,255,0.5)] animate-pulse top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        <p className="relative z-10 text-gray-500 dark:text-gray-400 font-medium text-sm bg-white/80 dark:bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Live Tracking Map Placeholder</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Bike size={24} className="text-gray-400" />
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">No Active Assignment</p>
                      <p className="text-sm font-semibold text-gray-500 mt-1 mb-6">This rider is currently available or offline.</p>
                      <Link href="/admin/orders?filter=unassigned">
                        <button className="px-6 py-2 bg-brand-cobalt text-white rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">
                          Assign an Order
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 p-6">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">Delivery History</h3>
                  
                  {deliveryHistory.length > 0 ? (
                    <div className="space-y-3">
                      {deliveryHistory.map(order => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                              <CheckCircle size={18} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-sm">{order.id}</p>
                              <p className="text-xs font-semibold text-gray-500 mt-0.5">{order.customerAddress}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900 dark:text-white text-sm">{new Date(order.placedAt).toLocaleDateString()}</p>
                            <span className="text-[10px] font-bold text-emerald-600">Delivered On-Time</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="font-bold text-gray-900 dark:text-white">No deliveries yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "performance" && (
              <motion.div key="performance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Deliveries</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white mb-2">{rider.deliveriesCompleted}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold">
                      <span className="text-brand-cobalt bg-brand-cobalt/10 px-2 py-0.5 rounded">Fleet Avg: {Math.round(rider.deliveriesCompleted * 0.85)}</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Avg Rating</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white mb-2">{rider.rating}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold">
                      <span className={rider.rating >= 4.8 ? "text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded" : "text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded"}>Fleet Avg: 4.8</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">On-Time %</p>
                    <p className="text-2xl font-black text-emerald-600 mb-2">{rider.onTimeRate}%</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold">
                      <span className={rider.onTimeRate >= 92 ? "text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded" : "text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded"}>Fleet Avg: 92%</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Earnings</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white mb-2">$42k</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold">
                      <span className="text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded">Fleet Avg: $38k</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 p-6 h-[400px] flex flex-col">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">Delivery Volume (7 Days)</h3>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 700 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 700 }} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(42, 98, 255, 0.05)' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-gray-900 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-xl">
                                  <p>{payload[0].value} Deliveries</p>
                                  <p className="text-emerald-400 font-semibold text-[10px] mt-0.5">{payload[0].payload.onTime}% On-Time</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="deliveries" radius={[4, 4, 0, 0]} barSize={24} fill="#2a62ff" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 p-6">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">Rider Account Controls</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">Force Offline Status</p>
                        <p className="text-xs font-semibold text-gray-500 mt-0.5">Disconnects the rider app and prevents new assignments.</p>
                      </div>
                      <button className="px-4 py-2 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-white/10 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
                        Set Offline
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20">
                      <div>
                        <p className="font-bold text-red-900 dark:text-red-400 text-sm">Suspend Rider</p>
                        <p className="text-xs font-semibold text-red-700 dark:text-red-500/70 mt-0.5">Completely revoke access to the logistics app.</p>
                      </div>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors shadow-sm flex items-center gap-2">
                        <XCircle size={16} />
                        Suspend
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
