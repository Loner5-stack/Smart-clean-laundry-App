"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Trash2 } from "lucide-react";
import { PICKUP_FEE } from "@/data/order-wizard-data";
import type { OrderState } from "@/types/order-wizard";

function formatNaira(n: number) {
  return `\u20A6${n.toLocaleString("en-NG")}`;
}

interface PriceCalculatorProps {
  order: OrderState;
  onNext: () => void;
  currentStep: number;
  totalSteps: number;
  canContinue: boolean;
  onChange?: (patch: Partial<OrderState>) => void;
  onRemoveService?: (id: string) => void;
}

export function PriceCalculator({
  order,
  onNext,
  currentStep,
  totalSteps,
  canContinue,
  onChange,
  onRemoveService,
}: PriceCalculatorProps) {
  const exactSubtotal = order.selectedItems.reduce(
    (acc, item) => acc + item.pricePerUnit * item.quantity,
    0,
  );
  const bagMin = order.bagSelections?.reduce((acc, bag) => acc + bag.estimatedMin, 0) || 0;
  const bagMax = order.bagSelections?.reduce((acc, bag) => acc + bag.estimatedMax, 0) || 0;

  const hasItems = order.selectedItems.length > 0 || (order.bagSelections && order.bagSelections.length > 0);
  const isEstimate = order.bagSelections && order.bagSelections.length > 0;

  const totalMin = hasItems ? exactSubtotal + bagMin + PICKUP_FEE : 0;
  const totalMax = hasItems ? exactSubtotal + bagMax + PICKUP_FEE : 0;

  const isLastStep = currentStep === totalSteps;

  const handleRemoveBag = (size: string, serviceId: string) => {
    const newBags = order.bagSelections.filter(b => !(b.size === size && b.serviceId === serviceId));
    onChange?.({ bagSelections: newBags });
  };

  const handleRemoveItem = (itemId: string, serviceId: string) => {
    const newItems = order.selectedItems.filter(i => !(i.itemId === itemId && i.serviceId === serviceId));
    onChange?.({ selectedItems: newItems });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-white/10">
        <ShoppingBag size={16} className="text-brand-cobalt" />
        <h3 className="font-bold text-sm text-gray-900 dark:text-white">
          Order Summary
        </h3>
      </div>

      {/* Services */}
      {order.serviceIds.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
            Services
          </p>
          <div className="space-y-1">
            {order.serviceIds.map((sId, index) => (
              <div key={sId} className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {order.serviceNames[index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Line items */}
      <div className="flex-1 space-y-2 overflow-y-auto mb-4 min-h-20">
        <AnimatePresence initial={false}>
          {!hasItems ? (
            <p className="text-xs text-gray-300 dark:text-gray-600 text-center py-4">
              Add items to see pricing
            </p>
          ) : (
            <>
              {order.bagSelections?.map((bag) => (
                <motion.div
                  key={`${bag.size}-${bag.serviceId}`}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gray-600 dark:text-gray-400">
                    🛍️ {bag.size} Bag
                    <span className="text-[10px] text-gray-400 ml-1">
                      ({bag.serviceName})
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatNaira(bag.estimatedMin)} - {formatNaira(bag.estimatedMax)}
                    </span>
                    <button
                      onClick={() => handleRemoveBag(bag.size, bag.serviceId)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      aria-label="Remove Bag"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
              {order.selectedItems.map((item) => (
                <motion.div
                  key={`${item.itemId}-${item.serviceId}`}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.emoji} {item.quantity}× {item.name}
                    <span className="text-[10px] text-gray-400 ml-1">
                      ({item.serviceName})
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatNaira(item.pricePerUnit * item.quantity)}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.itemId, item.serviceId)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      aria-label="Remove Item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Totals */}
      {hasItems && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2 pt-3 border-t border-gray-100 dark:border-white/10 mb-4"
        >
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Subtotal</span>
            <span>
              {isEstimate
                ? `${formatNaira(exactSubtotal + bagMin)} - ${formatNaira(exactSubtotal + bagMax)}`
                : formatNaira(exactSubtotal)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Pickup fee</span>
            <span>{formatNaira(PICKUP_FEE)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-gray-900 dark:text-white pt-1 border-t border-gray-100 dark:border-white/10">
            <span>{isEstimate ? "Estimated Total" : "Total"}</span>
            <span className="text-brand-cobalt">
              {isEstimate
                ? `${formatNaira(totalMin)} - ${formatNaira(totalMax)}`
                : formatNaira(totalMin)}
            </span>
          </div>
        </motion.div>
      )}

      {/* CTA Button */}
      <button
        onClick={onNext}
        disabled={!canContinue}
        className="w-full py-3 rounded-xl bg-brand-cobalt text-white text-sm font-bold hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100"
      >
        {isLastStep ? "Place Order" : "Continue →"}
      </button>
    </div>
  );
}
