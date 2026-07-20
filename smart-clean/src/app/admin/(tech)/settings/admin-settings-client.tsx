"use client";
import { useState, useEffect, useTransition } from "react";
import { Settings2, Bell, Shield, MapPin, Clock, Truck, ShieldAlert, LogOut, X, Check, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateTierThresholds } from "@/app/actions/tier";
import { updateAdminPasscodeAction } from "@/app/actions/admin-security";
import { Spinner } from "@/components/ui/spinner";
export default function AdminSettingsClient({ dbTiers }: { dbTiers: any[] }) {
  const [activeTab, setActiveTab] = useState<"platform" | "notifications" | "security" | "loyalty">("platform");
  const [showZonesModal, setShowZonesModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [tiersState, setTiersState] = useState(dbTiers);
  const [isPending, startTransition] = useTransition();

  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [isUpdatingPasscode, setIsUpdatingPasscode] = useState(false);
  const [passcodeError, setPasscodeError] = useState("");
  const [passcodeSuccess, setPasscodeSuccess] = useState(false);

  const handleTierChange = (id: string, field: string, value: number) => {
    setTiersState(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleSave = () => {
    setIsSaving(true);
    
    if (activeTab === "loyalty") {
      startTransition(async () => {
        const updates = tiersState.map(t => ({ id: t.id, minOrders: t.minOrders }));
        await updateTierThresholds(updates);
        setIsSaving(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      });
      return;
    }

    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 800);
  };

  const handleUpdatePasscode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdatingPasscode(true);
    setPasscodeError("");
    setPasscodeSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await updateAdminPasscodeAction(formData);

    setIsUpdatingPasscode(false);

    if (!result.success) {
      setPasscodeError(result.error ?? "Failed to update passcode.");
      return;
    }

    setPasscodeSuccess(true);
    setTimeout(() => {
      setShowPasscodeModal(false);
      setPasscodeSuccess(false);
    }, 2000);
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">System Settings</h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">Configure platform logic, notifications, and security.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-3 border border-gray-100 dark:border-white/5 shadow-sm space-y-1">
            {[
              { id: "platform", icon: Settings2, label: "Platform Rules" },
              { id: "loyalty", icon: Star, label: "Loyalty & Rewards" },
              { id: "notifications", icon: Bell, label: "Notifications" },
              { id: "security", icon: Shield, label: "Security & Logs" }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    isActive 
                      ? "bg-brand-cobalt text-white shadow-md shadow-brand-cobalt/20" 
                      : "text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            
            {activeTab === "platform" && (
              <motion.div key="platform" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                {/* Section: Operational Rules */}
                <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                      <Truck size={20} className="text-brand-cobalt" />
                      Logistics Configuration
                    </h2>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Base Delivery Fee ($)</label>
                        <input 
                          type="number" 
                          defaultValue={1500}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Free Delivery Threshold ($)</label>
                        <input 
                          type="number" 
                          defaultValue={15000}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all"
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Operating Zones</label>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <MapPin size={18} className="text-gray-400" />
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white text-sm">Active Polygons: 3</p>
                              <p className="text-xs font-semibold text-gray-500 mt-0.5">Lekki Phase 1, Victoria Island, Ikoyi</p>
                            </div>
                          </div>
                          <button onClick={() => setShowZonesModal(true)} className="text-xs font-bold text-brand-cobalt hover:underline">Edit Zones</button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Section: SLA Alerts */}
                <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                      <Clock size={20} className="text-amber-500" />
                      SLA & Bottleneck Thresholds
                    </h2>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-2xl">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">Stale Order Warning</p>
                        <p className="text-xs font-semibold text-gray-500 mt-0.5">Time an order can stay 'Pending' before triggering an alert.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          defaultValue={30}
                          className="w-20 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827] text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all"
                        />
                        <span className="text-sm font-bold text-gray-500">mins</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gray-50/50 dark:bg-white/[0.01] border-t border-gray-100 dark:border-white/5 flex justify-end">
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-all flex items-center gap-2 min-w-[140px] justify-center disabled:opacity-70"
                    >
                      {isPending ? (
                        <><Spinner size={16} className="text-current" /> Saving...</>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === "loyalty" && (
              <motion.div key="loyalty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                      <Star size={20} className="text-yellow-500 fill-yellow-500" />
                      Loyalty Tier Configuration
                    </h2>
                    <p className="text-xs font-semibold text-gray-500 mt-1">Configure the requirements and discounts for customer tiers.</p>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {tiersState.map((tier) => (
                      <div key={tier.level} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-2xl gap-4">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{tier.name}</p>
                          <p className="text-xs font-semibold text-gray-500 mt-0.5">Orders: {tier.minOrders} {tier.maxOrders ? `- ${tier.maxOrders}` : '+'}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Discount %</label>
                            <input 
                              type="number" 
                              value={tier.discountPercentage}
                              readOnly
                              disabled
                              className="w-20 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#111827]/50 text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all cursor-not-allowed"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Min Orders</label>
                            <input 
                              type="number" 
                              value={tier.minOrders}
                              onChange={(e) => handleTierChange(tier.id, "minOrders", parseInt(e.target.value) || 0)}
                              className="w-20 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111827] text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-6 bg-gray-50/50 dark:bg-white/[0.01] border-t border-gray-100 dark:border-white/5 flex justify-end">
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-all flex items-center gap-2 min-w-[140px] justify-center disabled:opacity-70"
                    >
                      {isSaving ? (
                        <><Spinner size={16} className="text-current" /> Saving...</>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm p-6">
                  <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6">Automated Messages</h2>
                  
                  <div className="space-y-4">
                    {/* Toggle Item */}
                    <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">Order Placement Success</p>
                        <p className="text-xs font-semibold text-gray-500 mt-1 mb-2">Sent to customer when an order is created.</p>
                        <code className="text-[10px] bg-gray-200 dark:bg-white/10 px-2 py-1 rounded text-gray-700 dark:text-gray-300">Push, Email</code>
                      </div>
                      <button className="w-12 h-6 rounded-full bg-emerald-500 relative transition-colors mt-1">
                        <div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white transition-transform" />
                      </button>
                    </div>

                    <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">Rider Assignment Alert</p>
                        <p className="text-xs font-semibold text-gray-500 mt-1 mb-2">Sent to rider when assigned to a pickup/delivery.</p>
                        <code className="text-[10px] bg-gray-200 dark:bg-white/10 px-2 py-1 rounded text-gray-700 dark:text-gray-300">Push</code>
                      </div>
                      <button className="w-12 h-6 rounded-full bg-emerald-500 relative transition-colors mt-1">
                        <div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm p-6">
                  <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <ShieldAlert size={20} className="text-red-500" />
                    Access & Security
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">Admin Password</p>
                        <p className="text-xs font-semibold text-gray-500 mt-0.5">Manage your system passcode</p>
                      </div>
                      <button onClick={() => setShowPasscodeModal(true)} className="px-4 py-2 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-white/10 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
                        Update
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">System Audit Log</p>
                        <p className="text-xs font-semibold text-gray-500 mt-0.5">View history of all admin actions and overrides.</p>
                      </div>
                      <button onClick={() => setShowLogsModal(true)} className="px-4 py-2 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-white/10 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-colors shadow-sm">
                        View Logs
                      </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-red-100 dark:border-red-900/30">
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                        <LogOut size={16} />
                        Force Logout All Sessions
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Save Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-50 flex items-center gap-2 px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl shadow-xl font-bold text-sm"
          >
            <Check size={16} className="text-emerald-400 dark:text-emerald-600" />
            Settings saved successfully
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zones Modal */}
      <AnimatePresence>
        {showZonesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowZonesModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-[#111827] w-full max-w-md rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col max-h-[80vh]">
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5 shrink-0">
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin size={18} className="text-brand-cobalt" /> Manage Operating Zones
                </h3>
                <button onClick={() => setShowZonesModal(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
                <div className="space-y-3">
                  {["Lekki Phase 1", "Victoria Island", "Ikoyi", "Yaba", "Surulere"].map((zone, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-xl">
                      <span className="font-bold text-sm text-gray-900 dark:text-white">{zone}</span>
                      <button className={`w-10 h-5 rounded-full transition-colors relative ${i < 3 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${i < 3 ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] shrink-0">
                <button onClick={() => setShowZonesModal(false)} className="w-full py-2.5 bg-brand-cobalt text-white font-bold rounded-xl text-sm hover:brightness-110 transition-all">Done</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Passcode Modal */}
      <AnimatePresence>
        {showPasscodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPasscodeModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-[#111827] w-full max-w-md rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col max-h-[80vh]">
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5 shrink-0">
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert size={18} className="text-brand-cobalt" /> Update Passcode
                </h3>
                <button onClick={() => setShowPasscodeModal(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleUpdatePasscode}>
                <div className="p-5 space-y-4">
                  {passcodeError && (
                    <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl">
                      {passcodeError}
                    </div>
                  )}
                  {passcodeSuccess && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-xl flex items-center gap-2">
                      <Check size={16} /> Passcode updated successfully!
                    </div>
                  )}
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Current Passcode</label>
                    <input type="password" name="currentPasscode" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-sm focus:outline-none focus:border-brand-cobalt" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">New Passcode</label>
                    <input type="password" name="newPasscode" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-sm focus:outline-none focus:border-brand-cobalt" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Confirm New Passcode</label>
                    <input type="password" name="confirmPasscode" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-sm focus:outline-none focus:border-brand-cobalt" />
                  </div>
                </div>
                <div className="p-5 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex gap-3">
                  <button type="button" onClick={() => setShowPasscodeModal(false)} className="flex-1 py-2.5 bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white font-bold rounded-xl text-sm hover:bg-gray-300 transition-all">Cancel</button>
                  <button type="submit" disabled={isUpdatingPasscode} className="px-6 py-2.5 bg-brand-cobalt text-white text-sm font-bold rounded-xl hover:bg-brand-cobalt/90 transition-colors flex items-center gap-2">
                    {isUpdatingPasscode ? <><Spinner size={16} className="text-current" /> Saving...</> : "Update"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Logs Modal */}
      <AnimatePresence>
        {showLogsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLogsModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-[#111827] w-full max-w-2xl rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col max-h-[80vh]">
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5 shrink-0">
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert size={18} className="text-brand-cobalt" /> System Audit Log
                </h3>
                <button onClick={() => setShowLogsModal(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="overflow-y-auto custom-scrollbar flex-1 p-0">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 sticky top-0">
                    <tr>
                      <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Timestamp</th>
                      <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Admin</th>
                      <th className="p-4 text-[10px] font-bold text-gray-400 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                    <tr>
                      <td className="p-4 text-gray-500 font-semibold">Today, 14:32</td>
                      <td className="p-4 font-bold text-gray-900 dark:text-white">Admin (You)</td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">Updated delivery fee to $1,500</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-gray-500 font-semibold">Today, 10:15</td>
                      <td className="p-4 font-bold text-gray-900 dark:text-white">Admin (You)</td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">Reassigned Order SC-4431 to Taiwo Adeyemi</td>
                    </tr>
                    <tr>
                      <td className="p-4 text-gray-500 font-semibold">Yesterday, 16:45</td>
                      <td className="p-4 font-bold text-gray-900 dark:text-white">System</td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">Suspended Rider Aliyu Musa (Low Rating)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-5 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] shrink-0">
                <button onClick={() => setShowLogsModal(false)} className="w-full py-2.5 bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white font-bold rounded-xl text-sm hover:bg-gray-300 dark:hover:bg-white/20 transition-all">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
