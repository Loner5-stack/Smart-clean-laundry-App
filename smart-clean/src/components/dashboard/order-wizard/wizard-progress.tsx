"use client";
import { motion } from "framer-motion";

const STEPS = [
  "Choose Services",
  "Add Items",
  "Pickup Details",
  "Review & Confirm",
];

interface WizardProgressProps {
  currentStep: number; // 1-indexed
  totalSteps?: number;
  /** Optional sub-step label to show beneath the main step (e.g. "Curtain Cleaning · 2 of 3") */
  subLabel?: string;
}

export function WizardProgress({ currentStep, totalSteps = STEPS.length, subLabel }: WizardProgressProps) {
  const stepName = STEPS[currentStep - 1] ?? "Review";
  const progressPercent = currentStep === 1 ? 15 : ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="px-4 md:px-6 py-4 bg-white dark:bg-[#0D1117] border-b border-gray-100 dark:border-white/5 sticky top-0 z-20">
      {/* Step label row */}
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <p className="text-sm font-extrabold text-gray-900 dark:text-white leading-tight">
            Step {currentStep} of {totalSteps}
            <span className="text-brand-cobalt ml-1.5">— {stepName}</span>
          </p>
          {subLabel && (
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">{subLabel}</p>
          )}
        </div>
        <span className="text-xs font-semibold text-gray-400 tabular-nums">
          {Math.round(progressPercent)}%
        </span>
      </div>

      {/* Single animated fill bar */}
      <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-brand-cobalt rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
