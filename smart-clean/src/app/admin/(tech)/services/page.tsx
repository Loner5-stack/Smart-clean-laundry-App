"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Plus, Settings2, MoreHorizontal, ShoppingBag, X, GripVertical, Check, Trash2, AlertTriangle, Star } from "lucide-react";
import { AdminService } from "@/data/mock-admin";
import { CustomSelect } from "@/components/ui/custom-select";
import { getServices, createService, reorderServices, deleteService, updateService } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { uploadImageAction } from "@/app/actions/upload";

export default function AdminServices() {
  const router = useRouter();
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState({ name: "", category: "Standard", imageFile: null as File | null });
  const [isCreating, setIsCreating] = useState(false);
  const [services, setServices] = useState<AdminService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [showOrderToast, setShowOrderToast] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<{id: string, name: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getServices().then(data => {
      setServices(data);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  const handleCreateService = async () => {
    console.log("handleCreateService called with:", newServiceForm);
    setIsCreating(true);
    try {
      let finalImagePath = null;
      if (newServiceForm.imageFile) {
        console.log("Uploading image...");
        const formData = new FormData();
        formData.append("image", newServiceForm.imageFile);
        const uploadRes = await uploadImageAction(formData);
        console.log("Upload response:", uploadRes);
        if (uploadRes.success) {
          finalImagePath = uploadRes.filePath;
        } else {
          alert(uploadRes.error || "Failed to upload image");
          setIsCreating(false);
          return;
        }
      }

      console.log("Final image path to save:", finalImagePath);

      const newService = await createService({
        name: newServiceForm.name,
        category: newServiceForm.category as any,
        price: 0,
        unit: "per item",
        description: "New Service Description",
        isActive: false,
        imagePath: finalImagePath || undefined
      });

      if (newService) {
        setShowNewServiceModal(false);
        router.push(`/admin/services/${newService.id}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create service");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteService = (id: string, name: string) => {
    setServiceToDelete({ id, name });
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    setIsDeleting(true);
    try {
      await deleteService(serviceToDelete.id);
      setServices(services.filter(s => s.id !== serviceToDelete.id));
      setServiceToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete service");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePopular = async (service: AdminService) => {
    const updatedStatus = !service.isPopular;
    // Optimistic UI update
    setServices(services.map(s => s.id === service.id ? { ...s, isPopular: updatedStatus } : s));
    try {
      await updateService(service.id, { isPopular: updatedStatus });
    } catch (err) {
      console.error(err);
      // Revert on failure
      setServices(services.map(s => s.id === service.id ? { ...s, isPopular: !updatedStatus } : s));
      alert("Failed to update popular status");
    }
  };

  const handleReorder = async (newOrder: AdminService[]) => {
    setServices(newOrder); // Optimistic UI update
    
    // Prepare payload
    const items = newOrder.map((s, index) => ({
      id: s.id,
      displayOrder: index
    }));

    setIsSavingOrder(true);
    try {
      await reorderServices(items);
      setShowOrderToast(true);
      setTimeout(() => setShowOrderToast(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to save new order");
    } finally {
      setIsSavingOrder(false);
    }
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
        {/* Add New Placeholder Card */}
        <motion.div 
          onClick={() => setShowNewServiceModal(true)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-cobalt/5 dark:bg-brand-cobalt/10 rounded-3xl p-6 border-2 border-dashed border-brand-cobalt/30 flex flex-col items-center justify-center min-h-[120px] hover:bg-brand-cobalt/10 transition-colors cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-white dark:bg-[#111827] flex items-center justify-center shadow-sm text-brand-cobalt group-hover:scale-110 transition-transform mb-2">
            <Plus size={20} />
          </div>
          <h3 className="font-bold text-brand-cobalt text-sm">Create New Service</h3>
        </motion.div>

        {/* Total Services Metric */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-100 dark:border-white/5 flex flex-col items-start justify-center min-h-[120px] shadow-sm relative overflow-hidden"
        >
          <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-brand-cobalt/5 dark:bg-brand-cobalt/10 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-sm font-bold text-gray-500 mb-1">Total Services Listed</h3>
          <div className="text-4xl font-black text-gray-900 dark:text-white flex items-baseline gap-2">
            {!isLoading ? services.length : "..."}
            <span className="text-sm font-semibold text-gray-400">active items</span>
          </div>
        </motion.div>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-white/5">
        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4">Reorder Services</h2>
        <p className="text-xs font-semibold text-gray-500 mb-6">Drag and drop using the handle to arrange how services appear for customers.</p>
        
        {isLoading ? (
          <div className="py-12 text-center text-gray-500 font-bold">Loading services...</div>
        ) : (
          <Reorder.Group 
            as="div" 
            axis="y" 
            values={services} 
            onReorder={handleReorder} 
            className="space-y-4"
          >
            {services.map((service, i) => (
              <Reorder.Item 
                as="div"
                key={service.id} 
                value={service}
                className="bg-white dark:bg-[#111827] rounded-2xl p-4 md:p-6 border border-gray-100 dark:border-white/5 shadow-sm flex flex-col md:flex-row md:items-center gap-4 cursor-grab active:cursor-grabbing relative"
              >
                {/* Drag Handle */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 hidden md:flex items-center justify-center">
                  <GripVertical size={20} />
                </div>
                
                <div className="md:ml-8 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        service.category === "Premium" 
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400" 
                          : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300"
                      }`}>
                        {service.category}
                      </div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white">{service.name}</h3>
                    </div>
                    <p className="text-sm font-semibold text-gray-500 line-clamp-1">{service.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-8">
                    <div className="text-left md:text-right">
                      <p className="text-lg font-black text-brand-cobalt">₦{service.price.toLocaleString()} <span className="text-xs text-gray-500 font-semibold">{service.unit}</span></p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleTogglePopular(service)}
                        title={service.isPopular ? "Remove from Popular" : "Add to Popular"}
                        className={`p-2 rounded-xl transition-colors ${service.isPopular ? 'bg-yellow-100 text-yellow-500 dark:bg-yellow-500/20' : 'bg-gray-50 text-gray-400 hover:text-yellow-500 dark:bg-white/5 dark:text-gray-500 dark:hover:text-yellow-500'}`}
                      >
                        <Star size={16} fill={service.isPopular ? "currentColor" : "none"} />
                      </button>
                      <div className={`w-10 h-5 rounded-full transition-colors relative ${service.isActive ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${service.isActive ? 'left-[22px]' : 'left-0.5'}`} />
                      </div>
                      <Link href={`/admin/services/${service.id}`} className="p-2 bg-gray-50 dark:bg-white/5 rounded-xl text-brand-cobalt hover:bg-brand-cobalt/10 transition-colors">
                        <Settings2 size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDeleteService(service.id, service.name)} 
                        className="p-2 bg-red-50 dark:bg-red-500/10 rounded-xl text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="md:hidden text-gray-300 cursor-grab active:cursor-grabbing">
                        <GripVertical size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>

      {/* Order Save Toast */}
      <AnimatePresence>
        {showOrderToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-50 flex items-center gap-2 px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl shadow-xl font-bold text-sm"
          >
            <Check size={16} className="text-emerald-400 dark:text-emerald-600" />
            Display order saved!
          </motion.div>
        )}
      </AnimatePresence>

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
                  <input type="text" placeholder="e.g. Shoe Cleaning" value={newServiceForm.name} onChange={(e) => setNewServiceForm(prev => ({...prev, name: e.target.value}))} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-cobalt" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Category</label>
                  <CustomSelect
                    value={newServiceForm.category}
                    onChange={(val) => setNewServiceForm(prev => ({...prev, category: val as string}))}
                    options={[
                      { value: "Standard", label: "Standard" },
                      { value: "Premium", label: "Premium" }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Service Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setNewServiceForm(prev => ({...prev, imageFile: file}));
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-cobalt/10 file:text-brand-cobalt hover:file:bg-brand-cobalt/20 transition-all cursor-pointer" 
                  />
                </div>
              </div>
              <div className="p-5 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex gap-3">
                <button onClick={() => setShowNewServiceModal(false)} className="flex-1 py-2.5 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
                <button 
                  onClick={handleCreateService}
                  className="flex-1 py-2.5 bg-brand-cobalt text-white font-bold rounded-xl text-sm hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={!newServiceForm.name || isCreating}
                >
                  {isCreating ? "Creating..." : "Create & Edit"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {serviceToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setServiceToDelete(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-[#111827] w-full max-w-sm rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden text-center p-6">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 text-red-500 mx-auto flex items-center justify-center mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Delete Service</h3>
              <p className="text-sm font-semibold text-gray-500 mb-6">
                Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{serviceToDelete.name}</strong>? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button onClick={() => setServiceToDelete(null)} className="flex-1 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl text-sm hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
