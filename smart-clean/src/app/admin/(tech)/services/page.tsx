"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Settings2, MoreHorizontal, ShoppingBag, X } from "lucide-react";
import { mockAdminServices } from "@/data/mock-admin";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminServices() {
  const router = useRouter();
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState({ name: "", category: "Standard" });

  const handleCreateService = () => {
    const newId = `SVC-${Math.floor(Math.random() * 1000)}`;
    // In a real app this would be an API call. Here we simulate it.
    setShowNewServiceModal(false);
    router.push(`/admin/services/${newId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Services Catalogue</h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">Manage pricing, availability, and descriptions for all services.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowNewServiceModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-cobalt text-white rounded-xl text-sm font-bold shadow-sm shadow-brand-cobalt/20 hover:brightness-110 transition-all"
          >
            <Plus size={16} />
            New Service
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAdminServices.map((service, i) => (
          <motion.div 
            key={service.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                service.category === "Premium" 
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400" 
                  : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300"
              }`}>
                {service.category}
              </div>
              <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>

            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1">{service.name}</h3>
            <p className="text-sm font-semibold text-gray-500 line-clamp-2 mb-6 min-h-[40px]">{service.description}</p>
            
            <div className="flex items-end justify-between mt-auto mb-6">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pricing</p>
                <p className="text-lg font-black text-brand-cobalt">₦{service.price.toLocaleString()} <span className="text-xs text-gray-500 font-semibold">{service.unit}</span></p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Orders</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1 justify-end">
                  <ShoppingBag size={12} /> {service.orderCount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-white/5">
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900 dark:text-white">Active</span>
                <button className={`w-12 h-6 rounded-full transition-colors relative ${service.isActive ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${service.isActive ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              <div className="w-px h-6 bg-gray-200 dark:bg-white/10" />
              <Link href={`/admin/services/${service.id}`} className="text-sm font-bold text-brand-cobalt hover:underline flex items-center gap-1">
                <Settings2 size={14} /> Edit
              </Link>
            </div>
          </motion.div>
        ))}

        {/* Add New Placeholder Card */}
        <motion.div 
          onClick={() => setShowNewServiceModal(true)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: mockAdminServices.length * 0.05 }}
          className="bg-gray-50 dark:bg-white/[0.02] rounded-3xl p-6 border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center min-h-[300px] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-white dark:bg-[#111827] flex items-center justify-center shadow-sm text-brand-cobalt group-hover:scale-110 transition-transform mb-4">
            <Plus size={24} />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">Create Service</h3>
          <p className="text-sm font-semibold text-gray-500 mt-1">Add a new offering to your catalogue.</p>
        </motion.div>
      </div>

      {/* New Service Modal */}
      <AnimatePresence>
        {showNewServiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewServiceModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-[#111827] w-full max-w-md rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/5">
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Plus size={18} className="text-brand-cobalt" /> Create New Service
                </h3>
                <button onClick={() => setShowNewServiceModal(false)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Service Name</label>
                  <input type="text" placeholder="e.g. Shoe Cleaning" value={newServiceForm.name} onChange={(e) => setNewServiceForm({...newServiceForm, name: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-cobalt" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Category</label>
                  <select value={newServiceForm.category} onChange={(e) => setNewServiceForm({...newServiceForm, category: e.target.value})} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-cobalt">
                    <option>Standard</option>
                    <option>Premium</option>
                  </select>
                </div>
              </div>
              <div className="p-5 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex gap-3">
                <button onClick={() => setShowNewServiceModal(false)} className="flex-1 py-2.5 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
                <button 
                  onClick={handleCreateService}
                  className="flex-1 py-2.5 bg-brand-cobalt text-white font-bold rounded-xl text-sm hover:brightness-110 transition-all disabled:opacity-50"
                  disabled={!newServiceForm.name}
                >
                  Create & Edit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
