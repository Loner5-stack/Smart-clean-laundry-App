"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { WizardProgress } from "@/components/dashboard/order-wizard/wizard-progress";
import { PriceCalculator } from "@/components/dashboard/order-wizard/price-calculator";
import { StepService } from "@/components/dashboard/order-wizard/step-service";
import { StepItems } from "@/components/dashboard/order-wizard/step-items";
import { StepLocation } from "@/components/dashboard/order-wizard/step-location";
import { StepReview } from "@/components/dashboard/order-wizard/step-review";
import { MobileCartDrawer } from "@/components/dashboard/order-wizard/mobile-cart-drawer";
import { initialOrderState, type OrderState } from "@/types/order-wizard";
import { allServices } from "@/data/mock-dashboard";
import { timeSlots, PICKUP_FEE } from "@/data/order-wizard-data";
import { placeOrder } from "@/lib/api";

/** The wizard now has 4 logical steps. Step 2 (Items) has sub-steps driven by
 *  itemSelectionIndex so the user selects items for each service in turn. */
const TOTAL_STEPS = 4;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function NewOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service");

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  /** Sub-step within Step 2: which service's items we are currently selecting */
  const [itemSelectionIndex, setItemSelectionIndex] = useState(0);
  /** Mobile cart drawer */
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [order, setOrder] = useState<OrderState>(initialOrderState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydration-safe draft loading & preselected service initialization
  useEffect(() => {
    let draftOrder = initialOrderState;
    const saved = sessionStorage.getItem("smart_clean_draft_order");
    if (saved) {
      try {
        draftOrder = JSON.parse(saved);
        setOrder(draftOrder);
      } catch (e) {}
    }

    if (preselectedService) {
      setOrder((prev) => {
        // If they already have this service in their draft, don't add it again
        if (prev.serviceIds.includes(preselectedService)) {
          return prev;
        }
        return {
          ...prev,
          serviceIds: [...prev.serviceIds, preselectedService],
          serviceNames: [
            ...prev.serviceNames, 
            allServices.find((s) => s.id === preselectedService)?.name || ""
          ].filter(Boolean),
        };
      });
      setStep(2);
      
      // If we are appending a service to an existing draft, point the selection index to it
      if (draftOrder.serviceIds && draftOrder.serviceIds.length > 0 && !draftOrder.serviceIds.includes(preselectedService)) {
        setItemSelectionIndex(draftOrder.serviceIds.length);
      } else {
        setItemSelectionIndex(0);
      }
    } else if (saved && draftOrder.serviceIds && draftOrder.serviceIds.length > 0) {
      // If they came back to the order wizard and had a draft, auto-resume to step 2 to show items
      setStep(2);
    }
    
    setIsLoaded(true);
  }, [preselectedService]);

  // Save on every change
  useEffect(() => {
    if (isLoaded) {
      sessionStorage.setItem("smart_clean_draft_order", JSON.stringify(order));
    }
  }, [order, isLoaded]);

  const update = (patch: Partial<OrderState>) =>
    setOrder((prev) => ({ ...prev, ...patch }));

  // ── Validation State ──────────────────────────────────────────────────────
  const checkCanContinue = () => {
    if (step === 1 && order.serviceIds.length === 0) return false;
    if (step === 2 && order.selectedItems.length === 0 && order.bagSelections.length === 0) return false;
    if (step === 3 && (!order.pickupAddress || !order.pickupDate || !order.pickupTimeSlotId)) return false;
    if (step === 4 && !order.paymentMethod) return false;
    return true;
  };
  const canContinue = checkCanContinue();

  // ── Navigation ────────────────────────────────────────────────────────────
  const cleanupEmptyActiveService = () => {
    if (step !== 2) return;
    const currentServiceId = order.serviceIds[itemSelectionIndex];
    if (!currentServiceId) return;

    const hasItems = order.selectedItems.some((i) => i.serviceId === currentServiceId);
    const hasBags = order.bagSelections.some((b) => b.serviceId === currentServiceId);
    
    if (!hasItems && !hasBags) {
      const newServiceIds = [...order.serviceIds];
      const newServiceNames = [...order.serviceNames];
      newServiceIds.splice(itemSelectionIndex, 1);
      newServiceNames.splice(itemSelectionIndex, 1);

      update({
        serviceIds: newServiceIds,
        serviceNames: newServiceNames,
      });
    }
  };

  const goNext = () => {
    if (step === 2) {
      cleanupEmptyActiveService();
    }

    // ── Validation ──
    if (step === 1 && order.serviceIds.length === 0) {
      alert("Please select at least one service.");
      return;
    }
    if (step === 2 && order.selectedItems.length === 0 && order.bagSelections.length === 0) {
      alert("Please add at least one item or select a bag size.");
      return;
    }
    if (step === 3) {
      if (!order.pickupAddress) {
        alert("Please provide a pickup location.");
        return;
      }
      if (!order.pickupDate || !order.pickupTimeSlotId) {
        alert("Please select a pickup date and time slot.");
        return;
      }
    }
    if (step === 4 && !order.paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (step === TOTAL_STEPS) {
      const services = order.serviceNames.join(", ");
      const exactSubtotal = order.selectedItems.reduce((acc, i) => acc + i.pricePerUnit * i.quantity, 0);
      const bagMin = order.bagSelections?.reduce((acc, bag) => acc + bag.estimatedMin, 0) || 0;
      const bagMax = order.bagSelections?.reduce((acc, bag) => acc + bag.estimatedMax, 0) || 0;
      
      const hasItems = order.selectedItems.length > 0 || order.bagSelections.length > 0;
      const isEstimate = order.bagSelections && order.bagSelections.length > 0;
      const totalMin = hasItems ? exactSubtotal + bagMin + PICKUP_FEE : 0;
      const totalMax = hasItems ? exactSubtotal + bagMax + PICKUP_FEE : 0;
      
      const totalStr = isEstimate
        ? `$${totalMin.toLocaleString("en-US")} - $${totalMax.toLocaleString("en-US")}`
        : `$${totalMin.toLocaleString("en-US")}`;
      const dateLabel = order.pickupDate
        ? new Date(order.pickupDate + "T00:00:00").toLocaleDateString("en-NG", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })
        : "";
      const slot = timeSlots.find((t) => t.id === order.pickupTimeSlotId);
      const pickup = [dateLabel, slot?.label].filter(Boolean).join(", ");

      const params = new URLSearchParams();
      if (services) params.set("services", services);
      if (pickup) params.set("pickup", pickup);
      params.set("total", totalStr);
      if (isEstimate) params.set("isEstimate", "true");

      placeOrder({
        items: [...order.selectedItems, ...order.bagSelections],
        pickupDetails: {
          address: order.pickupAddress,
          landmark: order.pickupLandmark,
          date: order.pickupDate,
          timeSlotId: order.pickupTimeSlotId,
        },
        totalAmount: totalMin, // the backend will re-calculate this securely
        paymentMethod: order.paymentMethod,
        isEstimate,
      }).then((res) => {
        console.log("Order placed successfully", res);
        sessionStorage.removeItem("smart_clean_draft_order");
        router.push(`/dashboard/orders/confirmed?${params.toString()}`);
      }).catch(err => {
        console.error(err);
        alert("Failed to place order.");
      });
      return;
    }

    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step === 1) {
      router.push("/dashboard");
      return;
    }

    // Step 2 always goes back to Step 1 (Services)
    if (step === 2) {
      cleanupEmptyActiveService();
      setDirection(-1);
      setStep(1);
      return;
    }

    // Coming back to step 2 from step 3 → land on the last service
    if (step === 3) {
      setItemSelectionIndex(Math.max(0, order.serviceIds.length - 1));
    }

    setDirection(-1);
    setStep((s) => s - 1);
  };

  // ── Step 2 sub-label for the progress bar ─────────────────────────────────
  const step2SubLabel =
    step === 2 && order.serviceIds.length > 1
      ? `${order.serviceNames[itemSelectionIndex]} · ${itemSelectionIndex + 1} of ${order.serviceIds.length}`
      : undefined;

  const handleSelectService = (index: number) => {
    setItemSelectionIndex(index);
    setDirection(1);
    setStep(2);
  };

  const handleAddService = () => {
    cleanupEmptyActiveService();
    setDirection(-1);
    setStep(1);
  };

  const handleRemoveService = (targetServiceId?: string) => {
    const idToRemove = targetServiceId || order.serviceIds[itemSelectionIndex];
    if (!idToRemove) return;

    const indexToRemove = order.serviceIds.indexOf(idToRemove);
    if (indexToRemove === -1) return;

    const newServiceIds = order.serviceIds.filter((id) => id !== idToRemove);
    const newServiceNames = order.serviceNames.filter((_, i) => i !== indexToRemove);
    const newSelectedItems = order.selectedItems.filter((i) => i.serviceId !== idToRemove);
    const newBagSelections = order.bagSelections.filter((b) => b.serviceId !== idToRemove);

    update({
      serviceIds: newServiceIds,
      serviceNames: newServiceNames,
      selectedItems: newSelectedItems,
      bagSelections: newBagSelections,
    });

    if (newServiceIds.length === 0) {
      setDirection(-1);
      setStep(1);
    } else {
      setDirection(-1);
      setItemSelectionIndex((prev) => Math.max(0, prev - 1));
    }
  };

  // ── Step map ──────────────────────────────────────────────────────────────
  const steps: Record<number, React.ReactNode> = {
    1: <StepService order={order} onChange={update} onSelectService={handleSelectService} />,
    2: <StepItems order={order} onChange={update} itemSelectionIndex={itemSelectionIndex} onAddService={handleAddService} onRemoveService={handleRemoveService} />,
    3: <StepLocation order={order} onChange={update} />,
    4: <StepReview order={order} onChange={update} />,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <WizardProgress currentStep={step} totalSteps={TOTAL_STEPS} subLabel={step2SubLabel} />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#2962ff] [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-width:thin] [scrollbar-color:#2962ff_transparent]">
          <div className="px-4 md:px-8 xl:px-12 py-6 max-w-4xl mx-auto">
            {/* Back button */}
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-5 transition-colors"
            >
              <ChevronLeft size={16} />
              {step === 1 ? "Back to Dashboard" : "Back"}
            </button>

            {/* Animated step content */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${step}-${itemSelectionIndex}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {steps[step]}
              </motion.div>
            </AnimatePresence>


          </div>
        </div>

        {/* ── Right: Price Calculator (desktop only) ── */}
        <div className="hidden lg:flex flex-col w-72 shrink-0 border-l border-gray-100 dark:border-white/5 bg-white dark:bg-[#0D1117] p-6 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#2962ff] [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-width:thin] [scrollbar-color:#2962ff_transparent]">
          <PriceCalculator
            order={order}
            onNext={goNext}
            currentStep={step}
            totalSteps={TOTAL_STEPS}
            canContinue={canContinue}
            onChange={update}
            onRemoveService={handleRemoveService}
          />
        </div>
      </div>

      {/* Mobile cart FAB — appears when first item/bag is added, only on Step 1 or 2 */}
      {(step === 1 || step === 2) && (order.selectedItems.length > 0 || order.bagSelections.length > 0) && (
        <div className="lg:hidden">
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            onClick={() => setIsCartOpen(true)}
            aria-label="View cart"
            className="fixed right-4 z-30 flex items-center gap-2 pl-3 pr-4 h-11 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl hover:scale-105 active:scale-95 transition-transform"
            style={{ bottom: "88px" }}
          >
            <div className="relative">
              <ShoppingCart size={18} />
              {/* Badge */}
              <span className="absolute -top-2 -right-2 min-w-[16px] h-4 rounded-full bg-brand-cobalt text-white text-[9px] font-black flex items-center justify-center px-1 leading-none">
                {order.selectedItems.reduce((a, i) => a + i.quantity, 0) + order.bagSelections.length}
              </span>
            </div>
            <span className="text-xs font-bold">View Cart</span>
          </motion.button>
        </div>
      )}

      {/* Mobile sticky bottom bar — always visible */}
      <div className="lg:hidden sticky bottom-0 z-10 bg-white dark:bg-[#0D1117] border-t border-gray-100 dark:border-white/5 px-4 py-3">
        {/* Disabled hint on Step 4 only */}
        {step === TOTAL_STEPS && !canContinue && (
          <p className="text-xs text-amber-500 font-medium text-center mb-2">
            ⚠️ Please select a payment method to continue
          </p>
        )}

        {/* Price row (only when items exist) */}
        {(order.selectedItems.length > 0 || order.bagSelections.length > 0) && (() => {
          const exactSubtotal = order.selectedItems.reduce((acc, i) => acc + i.pricePerUnit * i.quantity, 0);
          const bagMin = order.bagSelections?.reduce((acc, bag) => acc + bag.estimatedMin, 0) || 0;
          const bagMax = order.bagSelections?.reduce((acc, bag) => acc + bag.estimatedMax, 0) || 0;
          const isEstimate = order.bagSelections && order.bagSelections.length > 0;
          const totalMin = exactSubtotal + bagMin + 500;
          const totalMax = exactSubtotal + bagMax + 500;

          return (
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs text-gray-400">
                {isEstimate ? "Estimated" : "Total"}
              </span>
              <span className="text-sm font-extrabold text-brand-cobalt">
                {isEstimate
                  ? `$${totalMin.toLocaleString("en-US")} – $${totalMax.toLocaleString("en-US")}`
                  : `$${totalMin.toLocaleString("en-US")}`}
              </span>
            </div>
          );
        })()}

        {/* CTA button — always shown */}
        <button
          onClick={goNext}
          disabled={!canContinue}
          className="w-full py-3.5 rounded-xl bg-brand-cobalt text-white text-sm font-bold hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {step === TOTAL_STEPS ? "Place Order 🎉" : "Continue →"}
        </button>
      </div>
      {/* Mobile Cart Drawer */}
      <MobileCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        order={order}
        onChange={update}
        onRemoveService={(serviceId) => {
          handleRemoveService(serviceId);
          if (order.serviceIds.length <= 1) setIsCartOpen(false);
        }}
      />
    </div>
  );
}
