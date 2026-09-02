"use client";
import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Check, X, ShieldAlert } from "lucide-react";
import { getAdminGarmentItems, createGarment, updateGarment } from "@/lib/api";
import { GarmentItem } from "@/data/order-wizard-data";
import { IconPicker, DynamicIcon } from "@/components/admin/icon-picker";

export default function GarmentsPage() {
  const [garments, setGarments] = useState<GarmentItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGarment, setEditingGarment] = useState<GarmentItem | null>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("👕"); // Default emoji
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadGarments();
  }, []);

  const loadGarments = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminGarmentItems();
      setGarments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGarments = garments.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (garment?: GarmentItem) => {
    if (garment) {
      setEditingGarment(garment);
      setName(garment.name);
      setEmoji(garment.emoji || "👕");
      setIsActive(garment.isActive !== false); // default true if undefined
    } else {
      setEditingGarment(null);
      setName("");
      setEmoji("👕");
      setIsActive(true);
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      const payload = {
        name,
        emoji,
        basePrice: 0, // Defaults to 0, pricing inherits from service dynamically
        unit: "pc",
        isActive,
      };

      if (editingGarment) {
        await updateGarment(editingGarment.id, payload);
      } else {
        await createGarment(payload);
      }
      
      await loadGarments();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save garment.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Garments Catalog</h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">Manage all default wear types and their icons.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-cobalt text-white rounded-xl text-sm font-bold shadow-sm hover:brightness-110 transition-all"
        >
          <Plus size={16} strokeWidth={3} /> Add Garment
        </button>
      </div>

      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search garments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-brand-cobalt transition-colors"
          />
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-gray-500 font-bold">Loading garments...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredGarments.map((garment) => (
              <div
                key={garment.id}
                className={`relative group rounded-2xl border p-4 flex flex-col items-center justify-center gap-3 transition-all ${
                  garment.isActive !== false
                    ? "border-gray-200 dark:border-white/10 bg-white dark:bg-[#1f2937]"
                    : "border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-black/20 opacity-75"
                }`}
              >
                <button
                  onClick={() => openModal(garment)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-brand-cobalt opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Edit2 size={14} />
                </button>
                
                {garment.isActive === false && (
                  <div className="absolute top-2 left-2 text-xs font-bold text-red-500 flex items-center gap-1">
                    <ShieldAlert size={12} /> Hidden
                  </div>
                )}

                <div className="w-14 h-14 rounded-full bg-brand-cobalt/10 flex items-center justify-center text-brand-cobalt">
                  {/* Handle legacy emoji data gracefully */}
                  {garment.emoji.length <= 2 || /\p{Emoji}/u.test(garment.emoji) ? (
                    <span className="text-2xl">{garment.emoji}</span>
                  ) : (
                    <DynamicIcon name={garment.emoji} size={28} />
                  )}
                </div>
                
                <div className="text-center">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">{garment.name}</h3>
                </div>
              </div>
            ))}
            
            {filteredGarments.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 font-semibold">
                No garments found matching your search.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                {editingGarment ? "Edit Garment" : "Add Garment"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Icon</label>
                <IconPicker value={emoji} onChange={setEmoji} />
                <p className="text-[10px] text-gray-500 mt-1 font-semibold">Click to search and select an icon.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Garment Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. T-Shirt"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1f2937] text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">Active</p>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">Toggle visibility for this garment.</p>
                </div>
                <button 
                  onClick={() => setIsActive(!isActive)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${isActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isActive ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleSave}
                disabled={isSaving || !name.trim()}
                className="w-full py-3 bg-brand-cobalt text-white rounded-xl font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Garment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
