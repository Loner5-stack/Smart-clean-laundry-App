"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Sparkles, AlertCircle, Shirt, Truck, Clock, ArrowLeft } from "lucide-react";
import { sharedSubscriptionPlans } from "@/data/shared-data";



export default function SubscriptionsPage() {
  const [billing, setBilling] = useState<"monthly" | "quarterly">("monthly");
  const router = useRouter();

  return (
    <div className="px-4 md:px-6 py-6 lg:py-10 max-w-6xl mx-auto pb-24 lg:pb-10">
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="mb-4 lg:absolute lg:top-10 lg:left-8 flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-[#111827] shadow-md border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-gray-600 dark:text-gray-300 active:scale-95"
        aria-label="Go back"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Header */}
      <div className="text-center mb-10 mt-2 lg:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            Laundry on Autopilot.
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm md:text-base">
            Subscribe to a monthly plan and never worry about laundry day again. We clearly define exactly how many pieces of clothes each plan covers.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 inline-flex items-center p-1 bg-gray-100 dark:bg-[#111827] rounded-full border border-gray-200 dark:border-white/5"
        >
          <button
            onClick={() => setBilling("monthly")}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              billing === "monthly"
                ? "bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("quarterly")}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
              billing === "quarterly"
                ? "bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Quarterly
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase tracking-wider">
              Save 10%
            </span>
          </button>
        </motion.div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
        {sharedSubscriptionPlans.map((plan, idx) => {
          const price = billing === "quarterly" ? plan.price * 3 * 0.9 : plan.price;
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className={`relative bg-white dark:bg-[#111827] rounded-3xl p-6 md:p-8 flex flex-col h-full border ${
                plan.isPopular 
                  ? "border-brand-cobalt shadow-xl shadow-brand-cobalt/10 scale-100 md:scale-105 z-10" 
                  : "border-gray-100 dark:border-white/5 shadow-sm"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cobalt text-white text-xs font-bold shadow-md">
                    <Sparkles size={14} /> Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900 dark:text-white">
                    ₦{price.toLocaleString("en-NG")}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    /{billing === "monthly" ? "mo" : "qtr"}
                  </span>
                </div>
                
                {/* Visual Piece indicator */}
                <div className="mt-4 p-3 bg-brand-cobalt/5 dark:bg-brand-cobalt/10 rounded-xl border border-brand-cobalt/10">
                  <p className="text-xs font-bold text-brand-cobalt flex items-center justify-center gap-1.5">
                    <Shirt size={14} /> Covers up to {plan.pieces} pieces
                  </p>
                </div>
              </div>

              {/* Features List */}
              <div className="flex-1 space-y-4 mb-8">
                {plan.featureTexts.map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5 text-brand-cobalt opacity-80">
                      <Check size={16} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug">
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => alert(`Subscription checkout flow for ${plan.name} is coming soon!`)}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                  plan.isPopular
                    ? "bg-brand-cobalt text-white hover:brightness-110 active:scale-[0.98]"
                    : "bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 active:scale-[0.98]"
                }`}
              >
                Choose {plan.name}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* FAQ Note */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 flex flex-col md:flex-row items-center justify-center gap-4 p-6 bg-amber-50 dark:bg-amber-500/10 rounded-2xl border border-amber-100 dark:border-amber-500/20 max-w-3xl mx-auto"
      >
        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
          <AlertCircle size={24} className="text-amber-600 dark:text-amber-500" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-900 dark:text-amber-400 mb-1">
            What counts as a "piece"?
          </h4>
          <p className="text-xs text-amber-700 dark:text-amber-500/80 leading-relaxed">
            Standard items like shirts, trousers, and skirts count as 1 piece. Larger items like suits count as 2 pieces. Premium items like Wedding Dresses or Carpets are <strong>not</strong> included in subscription plans and must be ordered separately.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
