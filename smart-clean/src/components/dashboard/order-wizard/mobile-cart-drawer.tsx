"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2 } from "lucide-react";
import { PICKUP_FEE } from "@/data/order-wizard-data";
import type { OrderState } from "@/types/order-wizard";

function formatNaira(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

interface MobileCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderState;
  onChange: (patch: Partial<OrderState>) => void;
  onRemoveService: (serviceId: string) => void;
}

export function MobileCartDrawer({
  isOpen,
  onClose,
  order,
  onChange,
  onRemoveService,
}: MobileCartDrawerProps) {
  const exactSubtotal = order.selectedItems.reduce(
    (acc, i) => acc + i.pricePerUnit * i.quantity,
    0
  );
  const bagMin = order.bagSelections.reduce((acc, b) => acc + b.estimatedMin, 0);
  const bagMax = order.bagSelections.reduce((acc, b) => acc + b.estimatedMax, 0);
  const isEstimate = order.bagSelections.length > 0;
  const totalMin = exactSubtotal + bagMin + PICKUP_FEE;
  const totalMax = exactSubtotal + bagMax + PICKUP_FEE;

  const handleRemoveBag = (serviceId: string) => {
    onChange({ bagSelections: order.bagSelections.filter((b) => b.serviceId !== serviceId) });
  };

  const handleRemoveItem = (itemId: string, serviceId: string) => {
    onChange({
      selectedItems: order.selectedItems.filter(
        (i) => !(i.itemId === itemId && i.serviceId === serviceId)
      ),
    });
  };

  // Group items by service for cleaner display
  const serviceGroups = order.serviceIds.map((sId, idx) => {
    const bags = order.bagSelections.filter((b) => b.serviceId === sId);
    const items = order.selectedItems.filter((i) => i.serviceId === sId);
    return { sId, name: order.serviceNames[idx] || sId, bags, items };
  }).filter((g) => g.bags.length > 0 || g.items.length > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#111827] rounded-t-3xl shadow-2xl border-t border-gray-100 dark:border-white/10 max-h-[80vh] flex flex-col"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-white/10 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-brand-cobalt" />
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                  Your Order
                </h3>
                <span className="text-xs font-bold text-brand-cobalt bg-brand-cobalt/10 px-2 py-0.5 rounded-full">
                  {order.selectedItems.reduce((a, i) => a + i.quantity, 0) +
                    order.bagSelections.length}{" "}
                  {order.selectedItems.reduce((a, i) => a + i.quantity, 0) +
                    order.bagSelections.length ===
                  1
                    ? "item"
                    : "items"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {serviceGroups.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  No items added yet.
                </p>
              ) : (
                serviceGroups.map((group) => (
                  <div key={group.sId}>
                    {/* Service name header */}
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                        {group.name}
                      </p>
                      <button
                        onClick={() => onRemoveService(group.sId)}
                        className="text-[11px] font-semibold text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 size={11} /> Remove service
                      </button>
                    </div>

                    <div className="space-y-2">
                      {/* Bag selections */}
                      {group.bags.map((bag) => (
                        <div
                          key={`${bag.size}-${bag.serviceId}`}
                          className="flex items-center justify-between p-3 rounded-xl bg-brand-cobalt/5 dark:bg-brand-cobalt/10 border border-brand-cobalt/10"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">🛍️</span>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {bag.size} Bag
                              </p>
                              <p className="text-[10px] text-gray-400">
                                Estimate
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-xs font-bold text-brand-cobalt">
                              {formatNaira(bag.estimatedMin)} –{" "}
                              {formatNaira(bag.estimatedMax)}
                            </p>
                            <button
                              onClick={() => handleRemoveBag(bag.serviceId)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                              aria-label="Remove bag"
                            >
                              <X size={14} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Per-item selections */}
                      {group.items.map((item) => (
                        <div
                          key={`${item.itemId}-${item.serviceId}`}
                          className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{item.emoji}</span>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {item.quantity}× {item.name}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {formatNaira(item.pricePerUnit)} / pc
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-xs font-bold text-gray-900 dark:text-white">
                              {formatNaira(item.pricePerUnit * item.quantity)}
                            </p>
                            <button
                              onClick={() =>
                                handleRemoveItem(item.itemId, item.serviceId)
                              }
                              className="text-red-400 hover:text-red-600 transition-colors"
                              aria-label={`Remove ${item.name}`}
                            >
                              <X size={14} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer totals */}
            {(order.selectedItems.length > 0 || order.bagSelections.length > 0) && (
              <div className="px-5 py-4 border-t border-gray-100 dark:border-white/10 shrink-0 space-y-2">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>
                    {isEstimate
                      ? `${formatNaira(exactSubtotal + bagMin)} – ${formatNaira(exactSubtotal + bagMax)}`
                      : formatNaira(exactSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Pickup fee</span>
                  <span>{formatNaira(PICKUP_FEE)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-white/10">
                  <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                    {isEstimate ? "Estimated Total" : "Total"}
                  </span>
                  <span className="text-base font-black text-brand-cobalt">
                    {isEstimate
                      ? `${formatNaira(totalMin)} – ${formatNaira(totalMax)}`
                      : formatNaira(totalMin)}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-3 mt-1 rounded-xl bg-brand-cobalt/10 text-brand-cobalt text-sm font-bold hover:bg-brand-cobalt/20 active:scale-[0.98] transition-all"
                >
                  Done, back to adding items
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
