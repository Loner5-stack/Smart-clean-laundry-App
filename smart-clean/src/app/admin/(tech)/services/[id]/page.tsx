"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { mockAdminServices } from "@/data/mock-admin";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CustomSelect } from "@/components/ui/custom-select";

export default function EditService() {
  const params = useParams();
  const id = params?.id as string;
  const service = mockAdminServices.find(s => s.id === id) || mockAdminServices[0];
  
  const [name, setName] = useState(service.name);
  const [price, setPrice] = useState(service.price);
  const [description, setDescription] = useState(service.description);
  const [isActive, setIsActive] = useState(service.isActive);
  const [category, setCategory] = useState(service.category);
  const [unit, setUnit] = useState(service.unit);

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
        <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-cobalt text-white rounded-xl text-sm font-bold shadow-sm shadow-brand-cobalt/20 hover:brightness-110 transition-all">
          <Save size={16} />
          Save Changes
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
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Base Price (₦)</label>
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
                <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-white/5 relative">
                  <div className={`absolute -top-3 -right-2 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    category === "Premium" 
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400" 
                      : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300"
                  }`}>
                    {category}
                  </div>
                  <h3 className="font-black text-gray-900 dark:text-white text-lg mb-1">{name || "Service Name"}</h3>
                  <p className="text-xs font-semibold text-gray-500 mb-4">{description || "Service description appears here."}</p>
                  <p className="font-black text-brand-cobalt text-xl">₦{price.toLocaleString()} <span className="text-[10px] text-gray-500 font-semibold">{unit}</span></p>
                  
                  <div className="mt-4 flex items-center gap-2">
                     <button className="flex-1 bg-brand-cobalt text-white py-2 rounded-xl text-xs font-bold pointer-events-none">Add to Basket</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
