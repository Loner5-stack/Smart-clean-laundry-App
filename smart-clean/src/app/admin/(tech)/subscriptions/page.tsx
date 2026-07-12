"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, CreditCard, LayoutTemplate, Plus, MoreHorizontal, Calendar, X, Eye, Ban } from "lucide-react";
import { mockAdminSubscriptions } from "@/data/mock-admin";
import { sharedSubscriptionPlans } from "@/data/mock-shared";

export default function AdminSubscriptions() {
  const [activeTab, setActiveTab] = useState<"plans" | "subscribers">("plans");
  const [search, setSearch] = useState("");
  const [showEditPlanModal, setShowEditPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const MOCK_PLANS = sharedSubscriptionPlans;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Subscriptions</h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">Manage recurring plans and active subscribers.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-2xl w-full max-w-[400px]">
        {[
          { id: "plans", icon: LayoutTemplate, label: "Manage Plans" },
          { id: "subscribers", icon: CreditCard, label: "Active Subscribers" }
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

      <AnimatePresence mode="wait">
        {activeTab === "plans" && (
          <motion.div key="plans" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex justify-end">
               <button className="flex items-center gap-2 px-4 py-2 bg-brand-cobalt text-white rounded-xl text-sm font-bold shadow-sm shadow-brand-cobalt/20 hover:brightness-110 transition-all">
                <Plus size={16} />
                Create New Plan
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOCK_PLANS.map((plan, i) => (
                <div key={plan.id} className={`bg-white dark:bg-[#111827] rounded-3xl p-6 border ${plan.isPopular ? 'border-brand-cobalt shadow-md' : 'border-gray-100 dark:border-white/5 shadow-sm'} flex flex-col relative overflow-hidden`}>
                  {plan.isPopular && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-brand-cobalt" />
                  )}
                  
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      {plan.isPopular && <span className="text-[10px] font-bold text-brand-cobalt uppercase tracking-wider mb-1 block">Most Popular</span>}
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">{plan.name}</h3>
                    </div>
                    <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-3xl font-black text-gray-900 dark:text-white">₦{plan.price.toLocaleString()}</p>
                    <p className="text-sm font-semibold text-gray-500">per {plan.cycle?.toLowerCase() || 'monthly'}</p>
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Active Subscribers</p>
                      <p className="font-bold text-gray-900 dark:text-white">{plan.activeSubs || 0}</p>
                    </div>
                    <button onClick={() => { setEditingPlan(plan); setShowEditPlanModal(true); }} className="text-sm font-bold text-brand-cobalt hover:underline">Edit Details</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "subscribers" && (
          <motion.div key="subscribers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            
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
                      <th className="p-4">Billing</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {mockAdminSubscriptions.map((sub, i) => (
                      <motion.tr 
                        key={sub.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-gray-50/50 dark:hover:bg-white-[0.02] transition-colors"
                      >
                        <td className="p-4 pl-6">
                          <div className="font-bold text-gray-900 dark:text-white text-sm">{sub.customerName}</div>
                          <div className="text-xs font-semibold text-gray-500 mt-0.5">{sub.customerEmail}</div>
                        </td>
                        <td className="p-4">
                          <span className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-md text-xs font-bold inline-block mb-1">
                            {sub.planName}
                          </span>
                          <div className="text-xs font-semibold text-gray-500">Renews: {new Date(sub.nextRenewalDate).toLocaleDateString()}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-gray-900 dark:text-white text-sm">₦{sub.amount.toLocaleString()}</div>
                          <div className="text-xs font-semibold text-gray-500 mt-0.5">{sub.billingCycle}</div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            sub.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" :
                            "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6">
                          <div className="relative">
                            <button 
                              onClick={() => setOpenDropdownId(openDropdownId === sub.id ? null : sub.id)}
                              className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2"
                            >
                              <MoreHorizontal size={18} />
                            </button>
                            <AnimatePresence>
                              {openDropdownId === sub.id && (
                                <>
                                  <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)} />
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }} 
                                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }} 
                                    className="absolute right-0 top-10 w-48 bg-white dark:bg-[#1f2937] border border-gray-100 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                                  >
                                    <button className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                      <Eye size={14} /> View Customer
                                    </button>
                                    <div className="h-px bg-gray-100 dark:bg-white/5" />
                                    <button onClick={() => { alert('Subscription Cancelled'); setOpenDropdownId(null); }} className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                      <Ban size={14} /> Cancel Subscription
                                    </button>
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Plan Modal */}
      <AnimatePresence>
        {showEditPlanModal && editingPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditPlanModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-[#111827] w-full max-w-md rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <LayoutTemplate size={18} className="text-brand-cobalt" /> Edit {editingPlan.name}
                </h3>
                <button onClick={() => setShowEditPlanModal(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Plan Name</label>
                  <input type="text" defaultValue={editingPlan.name} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-cobalt" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Price (₦)</label>
                  <input type="number" defaultValue={editingPlan.price} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-cobalt" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Billing Cycle</label>
                  <select defaultValue={editingPlan.cycle} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-cobalt">
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Yearly</option>
                  </select>
                </div>
              </div>
              <div className="p-5 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex gap-3">
                <button onClick={() => setShowEditPlanModal(false)} className="flex-1 py-2.5 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
                <button onClick={() => { setShowEditPlanModal(false); alert("Plan Updated"); }} className="flex-1 py-2.5 bg-brand-cobalt text-white font-bold rounded-xl text-sm hover:brightness-110 transition-all">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
