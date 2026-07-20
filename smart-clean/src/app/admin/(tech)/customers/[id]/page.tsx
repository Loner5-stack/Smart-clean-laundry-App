"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, Phone, MapPin, Mail, Star, CreditCard, ShoppingBag, Settings, History, Calendar, Ban } from "lucide-react";
import { mockAdminCustomers, mockAdminOrders } from "@/data/mock-admin";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CustomerProfile() {
  const params = useParams();
  const id = params?.id as string;
  const customer = mockAdminCustomers.find(c => c.id === id) || mockAdminCustomers[0];
  
  const [activeTab, setActiveTab] = useState<"history" | "loyalty" | "settings">("history");
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const customerOrders = mockAdminOrders.filter(o => o.customerName === customer.name);

  return (
    <div className="space-y-6">
      {/* Top Nav */}
      <div className="flex items-center gap-4">
        <Link href="/admin/customers" className="w-10 h-10 rounded-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Customer Profile</h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">{customer.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-brand-cobalt/10 flex items-center justify-center text-brand-cobalt font-black text-2xl mb-4">
                {customer.name.charAt(0)}
              </div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white">{customer.name}</h2>
              <span className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                customer.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" :
                "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
              }`}>
                {customer.status}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-gray-400 shrink-0" />
                <span className="font-semibold text-gray-700 dark:text-gray-300 truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-gray-400 shrink-0" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">{customer.phone}</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                <span className="font-semibold text-gray-700 dark:text-gray-300 leading-tight">{customer.address}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Orders</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white">{customer.totalOrders}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Spend</p>
                  <p className="text-xl font-black text-brand-cobalt">${customer.totalSpend > 0 ? (customer.totalSpend / 1000) + 'k' : '0'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tabs & Content */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-2xl w-full max-w-md">
            {[
              { id: "history", icon: History, label: "Order History" },
              { id: "loyalty", icon: Star, label: "Loyalty & Subs" },
              { id: "settings", icon: Settings, label: "Settings" }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
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
            {activeTab === "history" && (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 p-6">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">Recent Orders</h3>
                  
                  {customerOrders.length > 0 ? (
                    <div className="space-y-4">
                      {customerOrders.map(order => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-cobalt/10 flex items-center justify-center text-brand-cobalt">
                              <ShoppingBag size={18} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-sm">{order.id} • {order.services.join(", ")}</p>
                              <p className="text-xs font-semibold text-gray-500 mt-0.5">{isMounted ? new Date(order.placedAt).toLocaleString() : '...'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-gray-900 dark:text-white text-sm">${order.totalAmount.toLocaleString()}</p>
                            <span className="text-[10px] font-bold text-gray-500">{order.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10">
                      <ShoppingBag size={32} className="mx-auto text-gray-400 mb-3" />
                      <p className="font-bold text-gray-900 dark:text-white">No orders yet</p>
                      <p className="text-xs font-semibold text-gray-500 mt-1">This customer hasn't placed any orders.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "loyalty" && (
              <motion.div key="loyalty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-500/10 dark:to-yellow-500/5 rounded-3xl border border-yellow-200 dark:border-yellow-500/20 p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-wider mb-1">Current Tier</h3>
                    <div className="flex items-center gap-2">
                      <Star size={24} className="fill-yellow-500 text-yellow-500" />
                      <span className="text-2xl font-black text-yellow-900 dark:text-yellow-400">{customer.loyaltyTier}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-wider mb-1">Points Balance</p>
                    <span className="text-2xl font-black text-yellow-900 dark:text-yellow-400">1,240</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 p-6">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">Active Subscription</h3>
                  {customer.activeSubscription ? (
                    <div className="p-4 bg-brand-cobalt/5 border border-brand-cobalt/20 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-cobalt text-white flex items-center justify-center">
                          <Calendar size={24} />
                        </div>
                        <div>
                          <p className="font-black text-brand-cobalt text-lg">{customer.activeSubscription}</p>
                          <p className="text-xs font-semibold text-gray-500 mt-0.5">Renews on {isMounted ? new Date(new Date().getTime() + 1000*60*60*24*15).toLocaleDateString() : '...'}</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold text-sm rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                        Manage
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-2xl text-center">
                      <p className="font-bold text-gray-900 dark:text-white">No active subscription</p>
                    </div>
                  )}
                </div>

              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 p-6">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">Account Controls</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">Send Password Reset</p>
                        <p className="text-xs font-semibold text-gray-500 mt-0.5">Email a secure password reset link to the customer.</p>
                      </div>
                      <button className="px-4 py-2 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-white/10 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
                        Send Email
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20">
                      <div>
                        <p className="font-bold text-red-900 dark:text-red-400 text-sm">Suspend Account</p>
                        <p className="text-xs font-semibold text-red-700 dark:text-red-500/70 mt-0.5">Prevent customer from placing new orders.</p>
                      </div>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors shadow-sm flex items-center gap-2">
                        <Ban size={16} />
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
