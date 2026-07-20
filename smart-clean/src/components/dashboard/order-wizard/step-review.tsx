"use client";
import { useEffect } from "react";
import { CheckCircle2, MapPin, CreditCard, ShoppingBag, Droplets, Building2, ShieldCheck, Wallet } from "lucide-react";
import { timeSlots, PICKUP_FEE } from "@/data/order-wizard-data";
import type { OrderState } from "@/types/order-wizard";

interface Props {
  order: OrderState;
  onChange: (patch: Partial<OrderState>) => void;
}

function formatNaira(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-gray-50 dark:border-white/5 last:border-0">
      <span className="text-xs text-gray-400 shrink-0">{label}</span>
      <span className="text-xs font-semibold text-gray-900 dark:text-white text-right">{value}</span>
    </div>
  );
}

const paymentMethods = [
  { id: "card" as const, label: "Debit / Credit Card", sub: "Pay securely via Flutterwave", icon: CreditCard },
  { id: "bank_transfer" as const, label: "Bank Transfer", sub: "Receive account details at checkout", icon: Building2 },
  { id: "pay_on_pickup" as const, label: "Pay on Pickup", sub: "Pay the rider via cash or transfer", icon: Wallet },
];

export function StepReview({ order, onChange }: Props) {
  const slot = timeSlots.find((t) => t.id === order.pickupTimeSlotId);
  const exactSubtotal = order.selectedItems.reduce((acc, i) => acc + i.pricePerUnit * i.quantity, 0);
  const bagMin = order.bagSelections?.reduce((acc, bag) => acc + bag.estimatedMin, 0) || 0;
  const bagMax = order.bagSelections?.reduce((acc, bag) => acc + bag.estimatedMax, 0) || 0;

  const hasItems = order.selectedItems.length > 0 || (order.bagSelections && order.bagSelections.length > 0);
  const isEstimate = order.bagSelections && order.bagSelections.length > 0;

  const totalMin = hasItems ? exactSubtotal + bagMin + PICKUP_FEE : 0;
  const totalMax = hasItems ? exactSubtotal + bagMax + PICKUP_FEE : 0;

  const dateLabel = order.pickupDate
    ? new Date(order.pickupDate + "T00:00:00").toLocaleDateString("en-NG", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "—";

  // Enforce pay_on_pickup if it's an estimate
  useEffect(() => {
    if (isEstimate && order.paymentMethod !== "pay_on_pickup") {
      onChange({ paymentMethod: "pay_on_pickup" });
    }
  }, [isEstimate, order.paymentMethod, onChange]);

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
        Review &amp; Confirm
      </h2>
      <p className="text-sm text-gray-400 mb-5">
        Check your details, choose a payment method, then place your order.
      </p>

      <div className="space-y-4">
        {/* Services */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-white/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag size={14} className="text-brand-cobalt" />
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Services</p>
          </div>
          <Row label="Type" value={order.serviceNames.join(", ") || "—"} />
        </div>

        {/* Items + Price */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-white/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag size={14} className="text-brand-cobalt" />
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Items</p>
          </div>
          {order.bagSelections?.map((bag) => (
            <Row
              key={`${bag.size}-${bag.serviceId}`}
              label={`🛍️ ${bag.size} Bag (${bag.serviceName})`}
              value={`${formatNaira(bag.estimatedMin)} - ${formatNaira(bag.estimatedMax)}`}
            />
          ))}
          {order.selectedItems.map((item) => (
            <Row
              key={`${item.itemId}-${item.serviceId}`}
              label={`${item.emoji} ${item.quantity}× ${item.name} (${item.serviceName})`}
              value={formatNaira(item.pricePerUnit * item.quantity)}
            />
          ))}
          <Row label="Pickup fee" value={formatNaira(PICKUP_FEE)} />
          <div className="flex items-center justify-between pt-2.5 mt-1">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {isEstimate ? "Estimated Total" : "Total"}
            </span>
            <span className="text-sm font-extrabold text-brand-cobalt">
              {isEstimate
                ? `${formatNaira(totalMin)} - ${formatNaira(totalMax)}`
                : formatNaira(totalMin)}
            </span>
          </div>
        </div>

        {/* Stain report (if flagged) */}
        {order.stainFlag.hasStain && (
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Droplets size={14} className="text-amber-500" />
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Stain Report</p>
            </div>
            <Row label="Type" value={order.stainFlag.stainType || "Not specified"} />
            {order.stainFlag.description && <Row label="Note" value={order.stainFlag.description} />}
            {order.stainFlag.imagePreview && (
              <div className="mt-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={order.stainFlag.imagePreview} alt="Stain" className="w-24 h-24 rounded-xl object-cover border border-gray-100 dark:border-white/10" />
              </div>
            )}
          </div>
        )}

        {/* Location + Schedule */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-white/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={14} className="text-brand-cobalt" />
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Pickup</p>
          </div>
          <Row label="Address" value={order.pickupAddress || "—"} />
          {order.pickupLandmark && <Row label="Landmark" value={order.pickupLandmark} />}
          <Row label="Date" value={dateLabel} />
          <Row label="Time" value={slot ? `${slot.label} (${slot.range})` : "—"} />
        </div>

        {/* ── Payment Method (inline) ── */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-white/5 p-4">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={14} className="text-brand-cobalt" />
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">How to Pay</p>
          </div>

          <div className="space-y-3 mb-4">
            {paymentMethods.map((method) => {
              const isSelected = order.paymentMethod === method.id;
              const isDisabled = isEstimate && method.id !== "pay_on_pickup";
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => onChange({ paymentMethod: method.id })}
                  disabled={isDisabled}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                    isSelected
                      ? "border-brand-cobalt bg-brand-cobalt/5 dark:bg-brand-cobalt/10 shadow-md"
                      : "border-gray-100 dark:border-white/10 hover:border-brand-cobalt/40"
                  } ${isDisabled ? "opacity-40 cursor-not-allowed grayscale pointer-events-none" : ""}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-brand-cobalt" : "bg-gray-100 dark:bg-white/10"}`}>
                    <Icon size={16} className={isSelected ? "text-white" : "text-gray-400"} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{method.label}</p>
                      {isDisabled && (
                        <span className="text-[9px] font-bold text-gray-400 bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                          Unavailable for estimates
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{method.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Combined trust notice */}
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50 dark:bg-brand-cobalt/5 border border-blue-100 dark:border-brand-cobalt/10">
          <ShieldCheck size={14} className="text-brand-cobalt shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
            All garments are fully insured. Payment is processed only after your order is confirmed. Subscription billing is separate.
          </p>
        </div>

        {/* T&C note */}
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
          <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
            By placing this order you agree to our terms. Our rider will contact you before arrival.
          </p>
        </div>
      </div>
    </div>
  );
}
