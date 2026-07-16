"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Plus, MoreHorizontal, UserCheck, Star, Truck, UserPlus, CheckCircle, Clock, XCircle, X, Bike } from "lucide-react";
import { mockAdminRiders, AdminRider } from "@/data/mock-admin";
import { CustomSelect } from "@/components/ui/custom-select";
import Link from "next/link";

export default function AdminRiders() {
  const [search, setSearch] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", phone: "", vehicleType: "Motorcycle" });

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Riders</h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">Manage the logistics fleet and track performance.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-cobalt text-white rounded-xl text-sm font-bold shadow-sm shadow-brand-cobalt/20 hover:brightness-110 transition-all"
          >
            <UserPlus size={16} />
            Invite Rider
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-4 flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by name, email, or phone..." 
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

      {/* Riders Table */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-4 pl-6">Rider</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4">Current Assignment</th>
                <th className="p-4">Performance</th>
                <th className="p-4 pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {mockAdminRiders.map((rider, i) => (
                <motion.tr 
                  key={rider.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-50/50 dark:hover:bg-white-[0.02] transition-colors"
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-cobalt/10 flex items-center justify-center text-brand-cobalt font-bold text-sm">
                        {rider.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm">{rider.name}</div>
                        <div className="text-xs font-semibold text-gray-500 mt-0.5">{rider.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{rider.phone}</div>
                    <div className="text-xs font-semibold text-gray-500 mt-0.5">{rider.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusColor(rider.status)}`}>
                      {getStatusIcon(rider.status)} {rider.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {rider.currentAssignment ? (
                      <Link href={`/admin/orders/${rider.currentAssignment}`} className="text-sm font-bold text-brand-cobalt hover:underline">
                        {rider.currentAssignment}
                      </Link>
                    ) : (
                      <span className="text-xs font-semibold text-gray-400 italic">None</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Star size={12} className="fill-yellow-500 text-yellow-500" />
                      <span className="font-bold text-gray-900 dark:text-white text-sm">{rider.rating}</span>
                    </div>
                    <div className="text-xs font-semibold text-gray-500">{rider.deliveriesCompleted} deliveries • {rider.onTimeRate}% on-time</div>
                  </td>
                  <td className="p-4 pr-6">
                    <Link href={`/admin/riders/${rider.id}`}>
                      <button className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors shadow-sm">
                        View Profile
                      </button>
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Rider Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowInviteModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-[#111827] w-full max-w-md rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <UserPlus size={18} className="text-brand-cobalt" /> Invite New Rider
                </h3>
                <button onClick={() => setShowInviteModal(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Full Name</label>
                  <input type="text" placeholder="e.g. John Doe" value={inviteForm.name} onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-cobalt" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Email Address</label>
                    <input type="email" placeholder="john@example.com" value={inviteForm.email} onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-cobalt" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Phone Number</label>
                    <input type="tel" placeholder="080..." value={inviteForm.phone} onChange={(e) => setInviteForm({...inviteForm, phone: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-cobalt" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Vehicle Type</label>
                  <CustomSelect
                    value={inviteForm.vehicleType}
                    onChange={(val) => setInviteForm({...inviteForm, vehicleType: val})}
                    options={[
                      { value: "Motorcycle", label: "Motorcycle" },
                      { value: "Mini-Van", label: "Mini-Van" },
                      { value: "Bicycle", label: "Bicycle" }
                    ]}
                  />
                </div>
              </div>
              <div className="p-5 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex gap-3">
                <button onClick={() => setShowInviteModal(false)} className="flex-1 py-2.5 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
                <button 
                  onClick={() => { setShowInviteModal(false); alert("Invitation sent to " + inviteForm.email); setInviteForm({name: "", email: "", phone: "", vehicleType: "Motorcycle"}); }} 
                  className="flex-1 py-2.5 bg-brand-cobalt text-white font-bold rounded-xl text-sm hover:brightness-110 transition-all disabled:opacity-50"
                  disabled={!inviteForm.name || !inviteForm.email || !inviteForm.phone}
                >
                  Send Invitation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
