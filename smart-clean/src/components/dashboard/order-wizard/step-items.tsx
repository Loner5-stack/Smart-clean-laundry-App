"use client";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  X,
  AlertCircle,
  ImagePlus,
  ChevronDown,
  Trash2,
} from "lucide-react";
import {
  garmentItems,
  getItemsForService,
  stainTypes,
} from "@/data/order-wizard-data";
import type { OrderState, SelectedItem, BagSelection } from "@/types/order-wizard";

const bagOptions = [
  { size: "Small" as const, emoji: "🛍️", label: "Small", desc: "About 1 basket — a few days' worth", min: 7500, max: 12500 },
  { size: "Medium" as const, emoji: "🛍️🛍️", label: "Medium", desc: "About 2 baskets — a week's laundry", min: 15000, max: 25000 },
  { size: "Large" as const, emoji: "🛍️🛍️🛍️", label: "Large", desc: "3+ baskets — family load", min: 27500, max: 37500 },
];

interface Props {
  order: OrderState;
  onChange: (patch: Partial<OrderState>) => void;
  itemSelectionIndex?: number;
  onAddService?: () => void;
  onRemoveService?: () => void;
}

export function StepItems({ order, onChange, itemSelectionIndex = 0, onAddService, onRemoveService }: Props) {
  const { selectedItems, serviceIds, serviceNames, stainFlag } = order;
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** Derive the active service purely from the parent-controlled index */
  const activeServiceId = serviceIds[itemSelectionIndex] || serviceIds[0] || "";
  const activeServiceName =
    serviceNames[serviceIds.indexOf(activeServiceId)] || "Unknown Service";

  const isWeightBased = activeServiceId === "svc-1" || activeServiceId === "svc-13";
  const [mode, setMode] = useState<"bag" | "item">("bag");

  useEffect(() => {
    // Default to bag mode for weight-based services when switching services
    if (isWeightBased) {
      setMode("bag");
    } else {
      setMode("item");
    }
  }, [activeServiceId, isWeightBased]);

  // ── Bag helpers ────────────────────────────────────────────────────────────
  const activeBag = order.bagSelections.find((b) => b.serviceId === activeServiceId);

  const selectBag = (opt: typeof bagOptions[0]) => {
    const existing = order.bagSelections.findIndex((b) => b.serviceId === activeServiceId);
    const newBag: BagSelection = {
      serviceId: activeServiceId,
      serviceName: activeServiceName,
      size: opt.size,
      estimatedMin: opt.min,
      estimatedMax: opt.max,
    };
    
    if (existing >= 0) {
      const newBags = [...order.bagSelections];
      newBags[existing] = newBag;
      onChange({ bagSelections: newBags });
    } else {
      onChange({ bagSelections: [...order.bagSelections, newBag] });
    }
    // Also clear any selected items for this service to avoid mixed state
    if (selectedItems.some(i => i.serviceId === activeServiceId)) {
      onChange({ selectedItems: selectedItems.filter(i => i.serviceId !== activeServiceId) });
    }
  };

  // ── Item helpers ───────────────────────────────────────────────────────────
  const getQty = (itemId: string, sId: string) =>
    selectedItems.find((i) => i.itemId === itemId && i.serviceId === sId)
      ?.quantity ?? 0;

  const updateItem = (itemId: string, sId: string, delta: number) => {
    const item = garmentItems.find((g) => g.id === itemId)!;
    const existingIndex = selectedItems.findIndex(
      (i) => i.itemId === itemId && i.serviceId === sId,
    );
    const existing =
      existingIndex >= 0 ? selectedItems[existingIndex] : undefined;
    const newQty = (existing?.quantity ?? 0) + delta;

    if (newQty <= 0) {
      onChange({
        selectedItems: selectedItems.filter(
          (i) => !(i.itemId === itemId && i.serviceId === sId),
        ),
      });
    } else if (existing) {
      const newItems = [...selectedItems];
      newItems[existingIndex] = { ...existing, quantity: newQty };
      onChange({ selectedItems: newItems });
    } else {
      // Clear bag selection if they add an item manually
      if (order.bagSelections.some(b => b.serviceId === sId)) {
        onChange({ bagSelections: order.bagSelections.filter(b => b.serviceId !== sId) });
      }
      const sName = serviceNames[serviceIds.indexOf(sId)] || "";
      const newItem: SelectedItem = {
        itemId: item.id,
        name: item.name,
        emoji: item.emoji,
        quantity: 1,
        pricePerUnit: item.basePrice,
        unit: item.unit,
        serviceId: sId,
        serviceName: sName,
      };
      onChange({ selectedItems: [...selectedItems, newItem] });
    }
  };

  // ── Stain helpers ──────────────────────────────────────────────────────────
  const updateStain = (patch: Partial<typeof stainFlag>) =>
    onChange({ stainFlag: { ...stainFlag, ...patch } });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      updateStain({ imagePreview: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  const currentItems = activeServiceId
    ? getItemsForService(activeServiceId)
    : [];
  const isLastService = itemSelectionIndex >= serviceIds.length - 1;

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Items ({activeServiceName})
          </h2>
          {onRemoveService && (
            <button
              onClick={() => onRemoveService()}
              className="text-gray-300 hover:text-red-500 transition-colors pt-0.5"
              aria-label="Remove Service"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <button
          onClick={onAddService}
          className="flex items-center gap-1.5 text-xs font-bold text-brand-cobalt bg-brand-cobalt/10 hover:bg-brand-cobalt/20 px-3 py-1.5 rounded-full transition-colors"
        >
          <Plus size={12} strokeWidth={3} /> ADD MORE SERVICE
        </button>
      </div>
      {!isWeightBased && (
        <p className="text-sm text-gray-400 mb-6">
          Tap + to add items.
        </p>
      )}

      {/* ── Mode Toggle ── */}
      {isWeightBased && (
        <div className="mb-6">
          <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">
            How would you like to price this service?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode("bag")}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all text-center ${
                mode === "bag"
                  ? "border-brand-cobalt bg-brand-cobalt/5 dark:bg-brand-cobalt/10 shadow-sm"
                  : "border-gray-100 dark:border-white/5 hover:border-brand-cobalt/40 bg-white dark:bg-[#111827]"
              }`}
            >
              <span className="text-2xl mb-2">🛍️</span>
              <span className={`text-sm font-bold ${mode === "bag" ? "text-brand-cobalt" : "text-gray-900 dark:text-white"}`}>By Bag Size</span>
              <span className="text-[11px] text-gray-400 mt-1">Get a quick estimate</span>
            </button>
            <button
              onClick={() => setMode("item")}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all text-center ${
                mode === "item"
                  ? "border-brand-cobalt bg-brand-cobalt/5 dark:bg-brand-cobalt/10 shadow-sm"
                  : "border-gray-100 dark:border-white/5 hover:border-brand-cobalt/40 bg-white dark:bg-[#111827]"
              }`}
            >
              <span className="text-2xl mb-2">👕</span>
              <span className={`text-sm font-bold ${mode === "item" ? "text-brand-cobalt" : "text-gray-900 dark:text-white"}`}>By Item</span>
              <span className="text-[11px] text-gray-400 mt-1">Get exact pricing</span>
            </button>
          </div>
        </div>
      )}

      {mode === "bag" ? (
        <div className="space-y-3 mb-6">
          {bagOptions.map((opt) => {
            const isSelected = activeBag?.size === opt.size;
            return (
              <button
                key={opt.size}
                onClick={() => selectBag(opt)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-200 ${
                  isSelected
                    ? "border-brand-cobalt bg-brand-cobalt/5 dark:bg-brand-cobalt/10 shadow-sm"
                    : "border-gray-100 dark:border-white/10 bg-white dark:bg-[#111827] hover:border-brand-cobalt/40"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{opt.emoji}</span>
                    <h3 className="font-bold text-gray-900 dark:text-white">{opt.label}</h3>
                  </div>
                  <p className="text-xs text-gray-400">{opt.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-brand-cobalt">
                    ₦{opt.min.toLocaleString("en-NG")} – ₦{opt.max.toLocaleString("en-NG")}
                  </p>
                </div>
              </button>
            );
          })}
          <p className="text-xs text-center text-gray-400 mt-4 px-4 leading-relaxed">
            Rider weighs your bag at pickup. You only pay for the actual weight.
          </p>
        </div>
      ) : (
        <>
          {/* ── Selected chips ── */}
      <AnimatePresence initial={false}>
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-5"
          >
            {selectedItems.map((item) => (
              <motion.span
                key={`${item.itemId}-${item.serviceId}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-cobalt/10 text-brand-cobalt text-xs font-semibold"
              >
                {item.emoji} {item.quantity}× {item.name}
                <span className="opacity-50 font-normal">
                  ({item.serviceName})
                </span>
                <button
                  onClick={() =>
                    updateItem(item.itemId, item.serviceId, -item.quantity)
                  }
                >
                  <X size={11} strokeWidth={3} />
                </button>
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Items grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
        {currentItems.map((item) => {
          const qty = getQty(item.id, activeServiceId);
          const isSelected = qty > 0;
          return (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                isSelected
                  ? "border-brand-cobalt/40 bg-brand-cobalt/5 dark:bg-brand-cobalt/10"
                  : "border-gray-100 dark:border-white/10 bg-white dark:bg-[#111827]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{item.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    ₦{item.basePrice.toLocaleString("en-NG")}/{item.unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isSelected && (
                  <button
                    onClick={() => updateItem(item.id, activeServiceId, -1)}
                    className="w-7 h-7 rounded-full border border-gray-200 dark:border-white/20 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                  >
                    <Minus size={12} className="text-gray-500" />
                  </button>
                )}
                {isSelected && (
                  <span className="text-sm font-bold text-brand-cobalt w-4 text-center">
                    {qty}
                  </span>
                )}
                <button
                  onClick={() => updateItem(item.id, activeServiceId, 1)}
                  className="w-7 h-7 rounded-full bg-brand-cobalt flex items-center justify-center hover:brightness-110 transition-all"
                >
                  <Plus size={12} className="text-white" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

        </>
      )}

      {/* ── Inline Stain Report (Applies to both Bag and Item modes) ── */}
      <div className="border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden mt-6">
        <button
          onClick={() => updateStain({ hasStain: !stainFlag.hasStain })}
          className="w-full flex items-center justify-between px-4 py-3.5 bg-white dark:bg-[#111827] text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-2">
            <AlertCircle size={15} className="text-amber-500" />
            Any stains to report?
          </span>
          <motion.div
            animate={{ rotate: stainFlag.hasStain ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={15} className="text-gray-400" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {stainFlag.hasStain && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-2 space-y-4 bg-amber-50/50 dark:bg-amber-500/5 border-t border-amber-100 dark:border-amber-500/10">
                {/* Info */}
                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                  Our team will make every effort to treat the stain. We&apos;ll
                  notify you if it cannot be fully removed.
                </p>

                {/* Stain type */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Type of Stain
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {stainTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => updateStain({ stainType: type })}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          stainFlag.stainType === type
                            ? "bg-brand-cobalt text-white border-brand-cobalt"
                            : "bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-white/10 hover:border-brand-cobalt/40"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={stainFlag.description}
                    onChange={(e) =>
                      updateStain({ description: e.target.value })
                    }
                    placeholder="e.g. Coffee stain on the front of a white shirt..."
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/10 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-cobalt resize-none transition-all"
                  />
                </div>

                {/* Image upload */}
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Photo (optional)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  {stainFlag.imagePreview ? (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-100 dark:border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={stainFlag.imagePreview}
                        alt="Stain preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => updateStain({ imagePreview: null })}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center shadow-md"
                      >
                        <X size={13} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center gap-2 w-full h-28 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-brand-cobalt/50 bg-gray-50 dark:bg-white/2 transition-all text-gray-400 hover:text-brand-cobalt"
                    >
                      <ImagePlus size={20} />
                      <span className="text-xs font-semibold">
                        Upload a photo
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
