"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MoreHorizontal, Check, Clock, UserPlus, ChevronDown, ListFilter, Download } from "lucide-react";
import { mockAdminOrders, adminStatusColors, OrderStatus, AdminOrder } from "@/data/mock-admin";
import { OrderSidePanel } from "@/components/admin/order-side-panel";

function CustomDropdown({
  value,
  options,
  onChange,
  label,
  primary
}: {
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  label?: string;
  primary?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
          primary 
            ? 'bg-brand-cobalt text-white shadow-sm hover:bg-brand-cobalt/90' 
            : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
        }`}
      >
        {label && <span className="text-gray-400 dark:text-gray-500 font-normal">{label}:</span>}
        {options.find(o => o.value === value)?.label || value}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full mt-2 left-0 w-48 bg-white dark:bg-[#1f2937] border border-gray-100 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden py-1"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm font-bold transition-colors ${
                value === opt.value
                  ? 'bg-brand-cobalt/10 text-brand-cobalt'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

const dateOptions = [
  { label: "All Time", value: "All Time" },
  { label: "Today", value: "Today" },
  { label: "Yesterday", value: "Yesterday" },
  { label: "Last 7 Days", value: "Last 7 Days" },
  { label: "Last 30 Days", value: "Last 30 Days" }
];

const statusOptions = [
  { label: "All Statuses", value: "All Statuses" },
  { label: "Pending", value: "PENDING" },
  { label: "Pickup Assigned", value: "PICKUP ASSIGNED" },
  { label: "At Hub", value: "AT HUB" },
  { label: "In Production", value: "IN PRODUCTION" },
  { label: "Out for Delivery", value: "OUT FOR Delivery" },
  { label: "Completed", value: "COMPLETED" }
];

export default function AdminOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [unassignedOnly, setUnassignedOnly] = useState(false);
  const [todayOnly, setTodayOnly] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [selectedOrderForPanel, setSelectedOrderForPanel] = useState<AdminOrder | null>(null);

  const filteredOrders = mockAdminOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) || 
                          order.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          order.customerPhone.includes(search);
    const matchesStatus = statusFilter === "All Statuses" ? true : order.status.replace("_", " ") === statusFilter;
    const matchesUnassigned = unassignedOnly ? !order.rider : true;
    const matchesToday = todayOnly ? new Date(order.pickupDate).toDateString() === new Date().toDateString() : true;
    
    const matchesDateFilter = () => {
      if (dateFilter === "All Time") return true;
      const orderDate = new Date(order.placedAt);
      const today = new Date();
      if (dateFilter === "Today") {
        return orderDate.toDateString() === today.toDateString();
      }
      if (dateFilter === "Yesterday") {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return orderDate.toDateString() === yesterday.toDateString();
      }
      if (dateFilter === "Last 7 Days") {
        const last7 = new Date();
        last7.setDate(last7.getDate() - 7);
        return orderDate >= last7;
      }
      if (dateFilter === "Last 30 Days") {
        const last30 = new Date();
        last30.setDate(last30.getDate() - 30);
        return orderDate >= last30;
      }
      return true;
    };
    
    return matchesSearch && matchesStatus && matchesUnassigned && matchesToday && matchesDateFilter();
  });

  const toggleSelectAll = () => {
    if (selectedOrders.size === filteredOrders.length && filteredOrders.length > 0) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const toggleSelectOrder = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newSet = new Set(selectedOrders);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedOrders(newSet);
  };

  const handleRowClick = (order: AdminOrder) => {
    setSelectedOrderForPanel(order);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Order Routing</h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">Manage and dispatch active orders.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-4 flex flex-col lg:flex-row items-center gap-4">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by order ID, customer name, phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all"
          />
        </div>

        <div className="flex-1 flex flex-wrap items-center gap-2 pb-2 lg:pb-0">
          
          <CustomDropdown 
            value={dateFilter}
            onChange={setDateFilter}
            options={dateOptions}
            label="Date"
          />

          <div className="h-6 w-px bg-gray-200 dark:bg-white/10 shrink-0 mx-1"></div>

          <CustomDropdown 
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            primary
          />
          <button 
            onClick={() => setUnassignedOnly(!unassignedOnly)}
            className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${unassignedOnly ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'}`}
          >
            Unassigned Riders
          </button>
          <button 
            onClick={() => setTodayOnly(!todayOnly)}
            className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-colors ${todayOnly ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'}`}
          >
            Today's Pickups
          </button>
          <button className="shrink-0 flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors ml-auto">
            <ListFilter size={16} /> More Filters
          </button>
        </div>
      </div>

      {/* Bulk Actions Banner */}
      {selectedOrders.size > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-cobalt text-white px-4 py-3 rounded-2xl shadow-md flex items-center justify-between"
        >
          <span className="font-bold text-sm">{selectedOrders.size} orders selected</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors">Assign Rider</button>
            <button className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors">Update Status</button>
          </div>
        </motion.div>
      )}

      {/* Orders Table */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-4 pl-6 w-12">
                  <input 
                    type="checkbox" 
                    checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-brand-cobalt focus:ring-brand-cobalt cursor-pointer" 
                  />
                </th>
                <th className="p-4">Order Details</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Pickup Date</th>
                <th className="p-4">Services</th>
                <th className="p-4">Status</th>
                <th className="p-4">Rider</th>
                <th className="p-4 pr-6">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500 font-bold">No orders match the current filters.</td>
                </tr>
              ) : filteredOrders.map((order, i) => (
                <motion.tr 
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleRowClick(order)}
                  className={`cursor-pointer transition-colors ${
                    selectedOrders.has(order.id) ? "bg-brand-cobalt/5" : "hover:bg-gray-50/50 dark:hover:bg-white-[0.02]"
                  }`}
                >
                  <td className="p-4 pl-6">
                    <input 
                      type="checkbox" 
                      checked={selectedOrders.has(order.id)}
                      onChange={(e) => toggleSelectOrder(order.id, e)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded border-gray-300 text-brand-cobalt focus:ring-brand-cobalt cursor-pointer" 
                    />
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-gray-900 dark:text-white text-sm">{order.id}</span>
                    <div className="text-xs font-semibold text-gray-500 mt-1 flex items-center gap-1">
                      <Clock size={12}/> {new Date(order.placedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900 dark:text-white text-sm">{order.customerName}</div>
                    <div className="text-xs font-semibold text-gray-500 mt-0.5 truncate max-w-[150px]">{order.customerAddress}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900 dark:text-white text-sm">{new Date(order.pickupDate).toLocaleDateString()}</div>
                    <div className="text-xs font-semibold text-gray-500 mt-0.5">{order.pickupTimeSlot}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {order.services.map(svc => (
                        <span key={svc} className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          {svc}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${adminStatusColors[order.status]}`}>
                      {order.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    {order.rider ? (
                      <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-cobalt/10 flex items-center justify-center text-[10px] text-brand-cobalt font-bold">
                          {order.rider.charAt(0)}
                        </div>
                        {order.rider}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-md">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="p-4 pr-6">
                    <div className="font-bold text-gray-900 dark:text-white text-sm">
                      ₦{order.totalAmount.toLocaleString()}
                    </div>
                    <div className={`text-[10px] font-bold mt-0.5 ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {order.paymentStatus}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <OrderSidePanel 
        order={selectedOrderForPanel} 
        isOpen={!!selectedOrderForPanel} 
        onClose={() => setSelectedOrderForPanel(null)} 
      />
    </div>
  );
}
