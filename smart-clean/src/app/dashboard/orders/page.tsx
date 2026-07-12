"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Package,
  MapPin,
  Calendar,
  Receipt,
  RefreshCw,
  ChevronRight,
  Download,
} from "lucide-react";
import { mockOrders, type Order } from "@/data/mock-dashboard";

type Tab = "active" | "past";

function formatNaira(n: number) {
  return `\u20A6${n.toLocaleString("en-NG")}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function OrderCard({ order, index }: { order: Order; index: number }) {
  const isActive = order.status === "In Progress" || order.status === "Pending";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.05, 0.15), ease: "easeOut" }}
      className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-white/5 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isActive
                ? "bg-brand-cobalt/10 text-brand-cobalt"
                : "bg-gray-100 dark:bg-white/5 text-gray-500"
            }`}
          >
            <Package size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              {order.service}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Order {order.id}</p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            order.status === "In Progress"
              ? "bg-brand-cobalt/10 text-brand-cobalt"
              : order.status === "Completed"
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : order.status === "Cancelled"
                  ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                  : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-5 p-3.5 bg-gray-50 dark:bg-white/2 rounded-xl border border-gray-100 dark:border-white/5">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">
            Items
          </p>
          <p className="text-xs font-semibold text-gray-900 dark:text-white">
            {order.itemCount} pieces
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">
            Total Amount
          </p>
          <p className="text-xs font-bold text-brand-cobalt">
            {formatNaira(order.totalAmount)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">
            Pickup
          </p>
          <p className="text-xs font-semibold text-gray-900 dark:text-white">
            {formatDate(order.pickupDate)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">
            Delivery
          </p>
          <p className="text-xs font-semibold text-gray-900 dark:text-white">
            {formatDate(order.deliveryDate)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {isActive ? (
          <>
            <Link
              href={`/dashboard/orders/${order.id}`}
              className="flex-1 py-2.5 rounded-xl bg-brand-cobalt text-white text-xs font-bold text-center hover:brightness-110 active:scale-[0.98] transition-all"
            >
              Track Order
            </Link>
          </>
        ) : (
          <>
            <button className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
              <Download size={14} />
              <span className="hidden sm:inline">Receipt</span>
            </button>
            <Link
              href="/dashboard/orders/new"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand-cobalt/10 text-brand-cobalt text-xs font-bold hover:bg-brand-cobalt hover:text-white group transition-all"
            >
              <RefreshCw
                size={14}
                className="group-hover:rotate-180 transition-transform duration-500"
              />
              Re-order
            </Link>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function OrdersPage() {
  const [tab, setTab] = useState<Tab>("active");

  const activeOrders = mockOrders.filter(
    (o) => o.status === "In Progress" || o.status === "Pending",
  );
  const pastOrders = mockOrders.filter(
    (o) => o.status === "Completed" || o.status === "Cancelled",
  );

  const displayOrders = tab === "active" ? activeOrders : pastOrders;

  return (
    <div className="px-4 md:px-6 py-6 max-w-4xl mx-auto pb-24 lg:pb-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          My Orders
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Track active orders and review your past cleaning history.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 dark:bg-[#111827] rounded-xl mb-6">
        <button
          onClick={() => setTab("active")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            tab === "active"
              ? "bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Active ({activeOrders.length})
        </button>
        <button
          onClick={() => setTab("past")}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            tab === "past"
              ? "bg-white dark:bg-[#1f2937] text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Past ({pastOrders.length})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4 relative min-h-[300px]">
        <AnimatePresence mode="wait">
          {displayOrders.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl h-64"
            >
              <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                <Receipt size={24} className="text-gray-400" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                No {tab} orders found
              </h3>
              <p className="text-xs text-gray-500 mb-5 max-w-[250px]">
                {tab === "active"
                  ? "You don't have any orders currently in progress."
                  : "You don't have any completed orders yet."}
              </p>
              <Link
                href="/dashboard/orders/new"
                className="px-6 py-2.5 rounded-full bg-brand-cobalt text-white text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                Start New Order
              </Link>
            </motion.div>
          ) : (
            displayOrders.map((order, index) => (
              <OrderCard key={`${tab}-${order.id}`} order={order} index={index} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
