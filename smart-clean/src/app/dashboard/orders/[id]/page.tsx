"use client";
import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";
import { 
  ChevronLeft, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Circle, 
  Loader2,
  Package,
  Droplets,
  Receipt
} from "lucide-react";
import Link from "next/link";
import { mockActiveOrder, mockOrders, trackingStages, type TrackingStage } from "@/data/mock-dashboard";
import { ORDER_STATUS_MAP } from "@/data/mock-shared";
import { garmentItems, PICKUP_FEE } from "@/data/order-wizard-data";

/** Returns the status of a stage relative to the current stage */
function getStageStatus(
  stage: TrackingStage,
  currentStage: TrackingStage
): "completed" | "active" | "upcoming" {
  const currentIdx = trackingStages.indexOf(currentStage);
  const stageIdx = trackingStages.indexOf(stage);
  if (stageIdx < currentIdx) return "completed";
  if (stageIdx === currentIdx) return "active";
  return "upcoming";
}

// Stage descriptions are now handled by ORDER_STATUS_MAP

import { getCustomerOrderById } from "@/lib/api";

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await getCustomerOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <Spinner size={40} />
        <p className="text-gray-500 font-medium">Loading order details...</p>
      </div>
    );
  }

  if (!order || order.status === "COMPLETED" || order.status === "CANCELLED") {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <Package size={48} className="text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 font-medium">Order not found or already delivered.</p>
        <Link href="/dashboard/orders" className="text-brand-cobalt font-bold text-sm">
          Return to Orders
        </Link>
      </div>
    );
  }

  // Format the ETA from deliveryDate
  const etaDate = new Date(order.deliveryDate);
  const formattedEta = etaDate.toLocaleDateString("en-NG", { weekday: 'short', month: 'short', day: 'numeric' }) 
                       + " \u2022 " 
                       + etaDate.toLocaleTimeString("en-NG", { hour: 'numeric', minute: '2-digit' });

  // Fallback items if none provided
  const items = (order.items && order.items.length > 0) ? order.items : [
    { name: "Standard Bag", quantity: order.itemCount || 1, basePrice: 0 }
  ];
  
  const total = order.totalAmount;

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link 
          href="/dashboard"
          className="w-8 h-8 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
            Order #{order.orderId.replace('SC-', '')}
          </h1>
          <p className="text-xs text-brand-cobalt font-bold mt-0.5">
            {order.service}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* ETA Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-cobalt rounded-2xl p-5 text-white shadow-lg shadow-brand-cobalt/20"
        >
          <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
            Estimated Delivery
          </p>
          <p className="text-2xl font-black mb-4">
            {order.eta}
          </p>
          <p className="text-xs text-white/70 uppercase tracking-wider font-bold mb-3">
            Rider Information
          </p>
          
          {order.rider ? (
            <div className="flex items-center gap-3 pt-4 border-t border-white/20">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-white font-bold">{order.rider.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{order.rider.name}</p>
                <p className="text-xs text-white/80 truncate">Your assigned rider</p>
              </div>
              <a 
                href={`tel:${order.rider.phone}`}
                className="w-10 h-10 rounded-full bg-white text-brand-cobalt flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-transform"
              >
                <Phone size={16} className="fill-current" />
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-3 pt-4 border-t border-white/20">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Spinner size={18} className="text-white/50" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-white/80 truncate">Pending Assignment</p>
                <p className="text-xs text-white/60 truncate">Waiting for admin to assign</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Vertical Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm"
        >
          <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-5 uppercase tracking-wider">
            Live Tracking
          </h3>
          
          <div className="space-y-6 relative">
            {/* Vertical connector line background */}
            <div className="absolute left-[11px] top-2 bottom-6 w-[2px] bg-gray-100 dark:bg-white/10 z-0" />
            
            {trackingStages.map((stage, i) => {
              const status = getStageStatus(stage, (order.status as TrackingStage) || "PENDING");
              const isLast = i === trackingStages.length - 1;
              
              return (
                <div key={stage} className="relative z-10 flex gap-4">
                  {/* Icon Node */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="bg-white dark:bg-[#111827] py-1">
                      {status === "completed" ? (
                        <CheckCircle2 size={24} className="text-emerald-500 bg-white dark:bg-[#111827] rounded-full" />
                      ) : status === "active" ? (
                        <div className="relative">
                          <span className="absolute inset-0 rounded-full bg-brand-cobalt/30 animate-ping" />
                          <div className="w-6 h-6 rounded-full bg-brand-cobalt flex items-center justify-center relative z-10">
                            <Spinner size={12} className="text-white" />
                          </div>
                        </div>
                      ) : (
                        <Circle size={24} className="text-gray-200 dark:text-white/10 bg-white dark:bg-[#111827] rounded-full" />
                      )}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className={`pb-1 ${status === 'upcoming' ? 'opacity-50' : ''}`}>
                    <p className={`text-sm font-bold ${
                      status === "active" 
                        ? "text-brand-cobalt" 
                        : status === "completed" 
                        ? "text-gray-900 dark:text-white" 
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {ORDER_STATUS_MAP[stage].label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {ORDER_STATUS_MAP[stage].description}
                    </p>
                    
                    {/* Stain Treatment specific UI */}
                    {stage === "IN_PRODUCTION" && status === "active" && (
                      <div className="mt-3 inline-flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                        <Droplets size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-amber-700 dark:text-amber-500">Stain treatment in progress</p>
                          <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">Coffee stain flagged on order</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Receipt size={16} className="text-brand-cobalt" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">
              Order Summary
            </h3>
          </div>
          
          <div className="space-y-3 mb-4">
            {items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-start">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {item.quantity || 1}× {item.name || "Laundry Item"}
                </span>
                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                  ₦{(item.quantity || 1) * (item.basePrice || 0) || 0}
                </span>
              </div>
            ))}
          </div>
          
          <div className="pt-3 border-t border-gray-100 dark:border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <span>Subtotal</span>
              <span>₦{Math.max(0, total - PICKUP_FEE).toLocaleString('en-US')}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
              <span>Pickup Fee</span>
              <span>₦{PICKUP_FEE.toLocaleString('en-US')}</span>
            </div>
            <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100 dark:border-white/10">
              <span className="text-sm font-bold text-gray-900 dark:text-white">Total</span>
              <span className="text-sm font-extrabold text-brand-cobalt">
                ₦{total.toLocaleString('en-US')}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
