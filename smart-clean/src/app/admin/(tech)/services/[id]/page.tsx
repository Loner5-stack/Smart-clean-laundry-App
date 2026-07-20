"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, Eye, EyeOff, Check } from "lucide-react";
import { mockAdminServices } from "@/data/mock-admin";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getServiceById, updateService } from "@/lib/api";
import { CustomSelect } from "@/components/ui/custom-select";
import { uploadImageAction } from "@/app/actions/upload";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

export default function EditService() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const [service, setService] = useState<any>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [category, setCategory] = useState("Standard");
  const [unit, setUnit] = useState("per item");
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    getServiceById(id).then(data => {
      setService(data);
      setName(data.name);
      setPrice(data.price);
      setDescription(data.description);
      setIsActive(data.isActive);
      setCategory(data.category);
      setUnit(data.unit);
      setImagePath(data.imagePath || null);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let finalImagePath = imagePath;
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadRes = await uploadImageAction(formData);
        if (uploadRes.success) {
          finalImagePath = uploadRes.filePath || null;
          setImagePath(finalImagePath);
        } else {
          alert(uploadRes.error || "Failed to upload image");
          setIsSaving(false);
          return;
        }
      }

      await updateService(id, { name, price, description, isActive, category: category as any, unit, imagePath: finalImagePath || undefined });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save service");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-12 text-center font-bold text-gray-500">Loading...</div>;
  
  if (!service) return <div className="p-12 text-center font-bold text-red-500">Service not found</div>;

  return (
    <div className="space-y-6">
      {/* Top Nav */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/services" className="w-10 h-10 rounded-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Edit Service</h1>
            <p className="text-sm font-semibold text-gray-500 mt-1">{service.id}</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-brand-cobalt text-white rounded-xl text-sm font-bold shadow-sm shadow-brand-cobalt/20 hover:brightness-110 transition-all disabled:opacity-50">
          <Save size={16} />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Left Column: Edit Form */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl">
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">Service Status</p>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">Toggle whether this service is bookable by customers.</p>
              </div>
              <button 
                onClick={() => setIsActive(!isActive)}
                className={`w-12 h-6 rounded-full relative transition-colors ${isActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isActive ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Service Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1f2937] text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Category</label>
                  <CustomSelect
                    value={category}
                    onChange={(val) => setCategory(val as any)}
                    options={[
                      { value: "Standard", label: "Standard" },
                      { value: "Premium", label: "Premium" }
                    ]}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Pricing Unit</label>
                  <input 
                    type="text" 
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1f2937] text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Base Price ($)</label>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1f2937] text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Customer Description</label>
                <textarea 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1f2937] text-sm font-semibold text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Service Image</label>
                <div className="flex items-center gap-4">
                  {(imageFile || imagePath) ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 dark:border-white/10">
                      <Image 
                        src={imageFile ? URL.createObjectURL(imageFile) : imagePath!} 
                        alt="Service Image" 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-white/5">
                      <ImageIcon size={20} />
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setImageFile(file);
                    }}
                    className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-cobalt/10 file:text-brand-cobalt hover:file:bg-brand-cobalt/20 transition-all cursor-pointer" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Customer App Preview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-brand-cobalt/10 text-brand-cobalt rounded-xl inline-flex font-bold text-sm">
            <Eye size={16} /> Live Customer Preview
          </div>
          
          <div className="bg-gray-100 dark:bg-[#090B11] rounded-[2.5rem] p-4 border-[8px] border-white dark:border-[#1f2937] shadow-xl max-w-sm mx-auto flex items-center justify-center">
            {/* Mock Mobile Screen */}
            <div className="bg-white dark:bg-[#111827] w-full h-[600px] rounded-[1.5rem] overflow-hidden shadow-inner flex flex-col relative">
              <div className="h-12 bg-gray-50 dark:bg-black flex items-center justify-center border-b border-gray-100 dark:border-white/5">
                <div className="w-1/3 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
              </div>
              
              <div className="p-4 flex-1 bg-gray-50 dark:bg-[#090B11]">
                {/* The Preview Card */}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl text-sm font-bold shadow-xl flex items-center gap-2">
                      <EyeOff size={16} /> Hidden from customers
                    </div>
                  </div>
                )}
                <div className="bg-white dark:bg-[#111827] rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 relative">
                  <div className="relative w-full h-32 bg-gray-50 dark:bg-white/5">
                    {(imageFile || imagePath) ? (
                      <Image 
                        src={imageFile ? URL.createObjectURL(imageFile) : imagePath!} 
                        alt={name} 
                        fill 
                        className="object-cover" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon size={24} className="mb-2 opacity-50" />
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">No Image</span>
                      </div>
                    )}
                    <div className={`absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md ${
                      category === "Premium" 
                        ? "bg-amber-500 text-white" 
                        : "bg-white text-gray-700 dark:bg-[#111827] dark:text-gray-300"
                    }`}>
                      {category === "Premium" ? "Premium" : category}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-black text-gray-900 dark:text-white text-lg mb-1 leading-tight">{name || "Service Name"}</h3>
                    <p className="text-xs font-semibold text-gray-500 mb-3 line-clamp-2">{description || "Service description appears here."}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-black text-brand-cobalt text-lg">₦{price.toLocaleString()} <span className="text-[10px] text-gray-500 font-semibold">/{unit}</span></p>
                    </div>
                    
                    <div className="mt-3">
                       <button className="w-full bg-brand-cobalt text-white py-2 rounded-xl text-xs font-bold pointer-events-none shadow-sm hover:brightness-110 transition-all">Add to Order</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            Service saved successfully
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
