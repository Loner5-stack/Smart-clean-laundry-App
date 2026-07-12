"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Truck, Home } from "lucide-react";
import Link from "next/link";

function OrderDetails() {
  const searchParams = useSearchParams();
  const services = searchParams.get("services") || "—";
  const pickup = searchParams.get("pickup") || "—";
  const total = searchParams.get("total");

  const isEstimate = searchParams.get("isEstimate") === "true";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.4 }}
      className="mt-6 w-full max-w-sm bg-gray-50 dark:bg-white/5 rounded-2xl p-5 text-left space-y-3 border border-gray-100 dark:border-white/5 mx-auto"
    >
      <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">Order Details</p>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">Services</span>
        <span className="font-semibold text-gray-900 dark:text-white text-right max-w-[60%]">{services}</span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">Pickup</span>
        <span className="font-semibold text-gray-900 dark:text-white text-right max-w-[60%]">{pickup}</span>
      </div>
      <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-200 dark:border-white/10 mt-1">
        <span className="font-bold text-gray-900 dark:text-white">{isEstimate ? "Estimated Total" : "Total"}</span>
        <span className="font-black text-brand-cobalt">
          {total ? total : "—"}
        </span>
      </div>
    </motion.div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-16 text-center">
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-6"
      >
        <CheckCircle2 size={48} className="text-emerald-500" strokeWidth={1.5} />
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
      >
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
          Order Placed! 🎉
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
          We&apos;ve received your request. A rider will be assigned and will contact
          you before arriving at your door.
        </p>
      </motion.div>

      {/* Trust pill */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mt-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-brand-cobalt/10 text-brand-cobalt text-sm font-semibold mx-auto w-max"
      >
        <Truck size={16} />
        Your garments are fully insured
      </motion.div>

      {/* Order Summary Placeholder */}
      <Suspense fallback={<div className="mt-6 w-full max-w-sm h-32 bg-gray-50 dark:bg-white/5 rounded-2xl animate-pulse mx-auto" />}>
        <OrderDetails />
      </Suspense>

      {/* What happens next */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-8 w-full max-w-sm bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-white/10 p-5 text-left space-y-4"
      >
        <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">What happens next</p>
        {[
          { step: "1", text: "Rider is assigned and will call you" },
          { step: "2", text: "Your items are picked up and taken to the facility" },
          { step: "3", text: "Cleaning & quality check" },
          { step: "4", text: "Fresh clothes delivered back to you" },
        ].map((item) => (
          <div key={item.step} className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-brand-cobalt text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              {item.step}
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-300">{item.text}</p>
          </div>
        ))}
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-8 w-full max-w-sm flex flex-col gap-3"
      >
        <Link
          href="/dashboard/orders"
          className="w-full py-3.5 rounded-xl bg-brand-cobalt text-white text-sm font-bold text-center hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-md"
        >
          Track Order
        </Link>
        <Link
          href="/dashboard"
          className="w-full py-3.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-700 dark:text-gray-300 text-center hover:border-brand-cobalt/40 flex items-center justify-center gap-2 transition-all"
        >
          <Home size={15} /> Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
