"use client";
import { motion } from "framer-motion";
import { Phone, ArrowRight, Loader2, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import {
  mockActiveOrder,
  trackingStages,
  type TrackingStage,
} from "@/data/mock-dashboard";
import { ORDER_STATUS_MAP } from "@/data/mock-shared";

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

interface StepNodeProps {
  stage: TrackingStage;
  status: "completed" | "active" | "upcoming";
  isLast: boolean;
}

function StepNode({ stage, status, isLast }: StepNodeProps) {
  return (
    <div className="flex flex-col items-center flex-1 min-w-0">
      {/* Circle + connector row */}
      <div className="flex items-center w-full">
        {/* Node */}
        <div className="relative flex-shrink-0 flex items-center justify-center">
          {status === "completed" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <CheckCircle2 size={24} className="text-emerald-500" />
            </motion.div>
          )}
          {status === "active" && (
            <div className="relative">
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full bg-brand-cobalt/30 animate-ping" />
              <div className="w-6 h-6 rounded-full bg-brand-cobalt flex items-center justify-center z-10 relative">
                <Loader2 size={12} className="text-white animate-spin" />
              </div>
            </div>
          )}
          {status === "upcoming" && (
            <Circle size={24} className="text-gray-200 dark:text-white/10" />
          )}
        </div>

        {/* Connector line */}
        {!isLast && (
          <div className="flex-1 h-0.5 mx-1">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                status === "completed"
                  ? "bg-emerald-400"
                  : "bg-gray-100 dark:bg-white/10"
              }`}
            />
          </div>
        )}
      </div>

      {/* Label */}
      <p
        className={`mt-2 text-center text-[10px] md:text-xs font-semibold leading-tight px-0.5 ${
          status === "active"
            ? "text-brand-cobalt"
            : status === "completed"
            ? "text-emerald-500"
            : "text-gray-300 dark:text-white/20"
        }`}
      >
        {ORDER_STATUS_MAP[stage].label}
      </p>
    </div>
  );
}

export function ActiveOrderTracker() {
  const order = mockActiveOrder;

  if (!order || order.currentStage === "COMPLETED") {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-cobalt">
              Active Order
            </span>
            <span className="px-2 py-0.5 rounded-full bg-brand-cobalt/10 text-brand-cobalt text-[10px] font-bold">
              #{order.orderId}
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">
            {order.service}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
            ETA
          </p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {order.eta}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 md:px-6 pt-5 pb-4 overflow-x-auto">
        <div className="flex items-start min-w-[560px] md:min-w-0">
          {trackingStages.map((stage, i) => (
            <StepNode
              key={stage}
              stage={stage}
              status={getStageStatus(stage, order.currentStage)}
              isLast={i === trackingStages.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Rider + CTA Footer */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5">
        {/* Rider Info */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-cobalt flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-bold">
              {order.rider.initials}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900 dark:text-white">
              {order.rider.name}
            </p>
            <p className="text-[10px] text-gray-400">Your assigned rider</p>
          </div>
          <a
            href={`tel:${order.rider.phone}`}
            className="ml-1 p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
            aria-label="Call rider"
          >
            <Phone size={13} className="text-emerald-500" />
          </a>
        </div>

        {/* Track Order link */}
        <Link
          href={`/dashboard/orders/${order.orderId}`}
          className="flex items-center gap-1 text-xs font-bold text-brand-cobalt hover:underline"
        >
          Full Details
          <ArrowRight size={12} />
        </Link>
      </div>
    </motion.section>
  );
}
