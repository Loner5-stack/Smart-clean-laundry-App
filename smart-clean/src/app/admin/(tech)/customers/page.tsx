"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  MoreHorizontal,
  Download,
  UserPlus,
  Star,
  Users,
} from "lucide-react";
import { mockAdminCustomers, AdminCustomer } from "@/data/mock-admin";
import Link from "next/link";

export default function AdminCustomers() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Customers
          </h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">
            Manage the user base and view history.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 rounded-lg bg-brand-cobalt/10 flex items-center justify-center text-brand-cobalt">
              <Users size={20} />
            </div>
          </div>
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
            Total Customers
          </h3>
          <p className="text-2xl font-black text-gray-900 dark:text-white">
            {mockAdminCustomers.length}
          </p>
        </motion.div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-4 flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full lg:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/5 border border-transparent rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-4 pl-6">Customer</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Orders & Spend</th>
                <th className="p-4">History</th>
                <th className="p-4">Loyalty Tier</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {mockAdminCustomers.map((customer, i) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-50/50 dark:hover:bg-white-[0.02] transition-colors"
                >
                  <td className="p-4 pl-6">
                    <div className="font-bold text-gray-900 dark:text-white text-sm">
                      {customer.name}
                    </div>
                    <div className="text-xs font-semibold text-gray-500 mt-0.5">
                      {customer.id}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                      {customer.email}
                    </div>
                    <div className="text-xs font-semibold text-gray-500 mt-0.5">
                      {customer.phone}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900 dark:text-white text-sm">
                      {customer.totalOrders} orders
                    </div>
                    <div className="text-xs font-semibold text-brand-cobalt mt-0.5">
                      ₦{customer.totalSpend.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900 dark:text-white text-[11px]">
                      Member:{" "}
                      {new Date(customer.memberSince).toLocaleDateString()}
                    </div>
                    <div className="text-[10px] font-semibold text-gray-500 mt-0.5">
                      Last Order:{" "}
                      {customer.lastOrderDate
                        ? new Date(customer.lastOrderDate).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 px-2.5 py-1 rounded-full text-[10px] font-bold">
                      <Star size={12} className="fill-current" />{" "}
                      {customer.loyaltyTier}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        customer.status === "Active"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6">
                    <Link href={`/admin/customers/${customer.id}`}>
                      <button className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors shadow-sm">
                        View Profile
                      </button>
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
