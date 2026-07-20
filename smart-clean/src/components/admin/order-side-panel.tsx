import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, MapPin, Phone, Mail, User, Check, CreditCard, StickyNote, Activity, FileText, Download } from "lucide-react";
import { AdminOrder, adminStatusColors, OrderStatus } from "@/data/mock-admin";
import { CustomSelect } from "@/components/ui/custom-select";

interface OrderSidePanelProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderSidePanel({ order, isOpen, onClose }: OrderSidePanelProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  
  const [selectedStatus, setSelectedStatus] = useState(order?.status || "PENDING");
  
  useEffect(() => {
    if (order) setSelectedStatus(order.status);
  }, [order]);

  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/20 dark:bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Side Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-white dark:bg-[#111827] border-l border-gray-100 dark:border-white/5 shadow-2xl z-50 overflow-y-auto custom-scrollbar flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md z-10">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-black text-gray-900 dark:text-white">{order.id}</h2>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${adminStatusColors[order.status]}`}>
                    {order.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                  <Clock size={12} /> Placed: {new Date(order.placedAt).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-8 flex-1">
              
              {/* Admin Status Control */}
              <div className="bg-gray-50 dark:bg-white/[0.02] rounded-2xl p-5 border border-gray-100 dark:border-white/5">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity size={14} /> Update Order Status
                </h3>
                <div className="flex items-center gap-3">
                    <CustomSelect
                      value={selectedStatus}
                      onChange={(val) => setSelectedStatus(val as OrderStatus)}
                      className="flex-1"
                    options={[
                      { value: "PENDING", label: "Pending" },
                      { value: "PICKUP_ASSIGNED", label: "Pickup Assigned" },
                      { value: "AT_HUB", label: "At Hub" },
                      { value: "IN_PRODUCTION", label: "In Production" },
                      { value: "OUT_FOR_DELIVERY", label: "Out For Delivery" },
                      { value: "COMPLETED", label: "Completed" }
                    ]}
                  />
                  <button className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all">
                    Update
                  </button>
                </div>
              </div>

              {/* Rider Assignment */}
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Assigned Logistics</h3>
                {order.rider ? (
                  <div className="flex items-center justify-between p-4 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-cobalt/10 flex items-center justify-center text-brand-cobalt font-bold">
                        {order.rider.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white">{order.rider}</p>
                        <p className="text-xs font-semibold text-gray-500">Logistics Partner</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-brand-cobalt hover:underline">Reassign</button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-amber-900 dark:text-amber-400">No Rider Assigned</p>
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-500/70">Action required</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-amber-500 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-amber-600 active:scale-95 transition-all">
                      Assign Now
                    </button>
                  </div>
                )}
              </div>

              {/* Customer Details */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customer Details</h3>
                  <button className="text-[10px] font-bold text-brand-cobalt hover:underline">View Profile</button>
                </div>
                <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-gray-400" />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{order.customerPhone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{order.customerAddress}</span>
                  </div>
                </div>
              </div>

              {/* Order Items & Services */}
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Order Contents</h3>
                
                <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl p-4 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-brand-cobalt" />
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">Scheduled Pickup</p>
                      <p className="text-xs font-semibold text-gray-500">
                        {new Date(order.pickupDate).toLocaleDateString()} • {order.pickupTimeSlot}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {order.services.map((svc, i) => (
                      <span key={i} className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-[10px] font-bold">
                        {svc}
                      </span>
                    ))}
                  </div>
                  
                  {order.items && order.items.length > 0 ? (
                    <div className="border border-gray-100 dark:border-white/5 rounded-xl divide-y divide-gray-100 dark:divide-white/5">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.02]">
                          <div className="flex items-center gap-2">
                            {item.emoji && <span className="text-lg">{item.emoji}</span>}
                            <div>
                              <span className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                {item.name}
                                {item.stain && (
                                  <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[10px] font-bold">Stain</span>
                                )}
                              </span>
                              {item.price && (
                                <p className="text-xs font-semibold text-gray-500">${(item.price * item.quantity).toLocaleString()}</p>
                              )}
                            </div>
                          </div>
                          <span className="font-bold text-xs text-gray-500 bg-gray-200 dark:bg-white/10 px-2 py-1 rounded-md">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-semibold text-gray-400 italic">No detailed items recorded.</p>
                  )}

                  {/* Bag Selections */}
                  {order.bagSelections && order.bagSelections.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Bags Selected</h4>
                      <div className="border border-gray-100 dark:border-white/5 rounded-xl divide-y divide-gray-100 dark:divide-white/5">
                        {order.bagSelections.map((bag, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.02]">
                            <span className="font-bold text-sm text-gray-900 dark:text-white">{bag.size} Bag</span>
                            <span className="font-bold text-xs text-gray-500 bg-gray-200 dark:bg-white/10 px-2 py-1 rounded-md">x{bag.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Payment Information</h3>
                <div className="flex items-center justify-between p-4 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <CreditCard size={18} className="text-gray-400" />
                    <div>
                      <p className="font-black text-lg text-gray-900 dark:text-white">${order.totalAmount.toLocaleString()}</p>
                      <p className="text-xs font-semibold text-gray-500">{order.paymentMethod}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                    order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                    order.paymentStatus === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                    'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <StickyNote size={14} /> Internal Notes
                </h3>
                <div className="space-y-3 mb-4">
                  {order.notes?.map((note, i) => (
                    <div key={i} className="p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-500/20 rounded-xl">
                      <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-500">{note}</p>
                      <p className="text-[10px] font-bold text-yellow-600/70 dark:text-yellow-500/50 mt-1">Admin • Added during order creation</p>
                    </div>
                  ))}
                  {(!order.notes || order.notes.length === 0) && (
                    <p className="text-sm font-semibold text-gray-400 italic">No internal notes.</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Add an internal note..." 
                    className="flex-1 bg-white dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-cobalt"
                  />
                  <button className="px-4 py-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold text-sm rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                    Add
                  </button>
                </div>
              </div>

            </div>
            
            {/* Danger Zone */}
            <div className="p-6 border-t border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 mt-auto">
              <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-3">Danger Zone</h3>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowCancelModal(true)}
                  className="flex-1 py-2.5 bg-white dark:bg-[#111827] border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-bold text-sm rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
                >
                  Cancel Order
                </button>
                <button 
                  onClick={() => setShowRefundModal(true)}
                  className="flex-1 py-2.5 bg-white dark:bg-[#111827] border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-bold text-sm rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
                >
                  Issue Refund
                </button>
              </div>
            </div>
          </motion.div>

          {/* Cancel Confirmation Modal */}
          <AnimatePresence>
            {showCancelModal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCancelModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-[#111827] w-full max-w-sm rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-6">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Cancel Order?</h3>
                  <p className="text-sm font-semibold text-gray-500 mb-4">This action cannot be undone. The rider will be unassigned and the customer will be notified.</p>
                  <textarea 
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Reason for cancellation (optional)"
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm font-semibold mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={3}
                  />
                  <div className="flex gap-3">
                    <button onClick={() => setShowCancelModal(false)} className="flex-1 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm">Keep Order</button>
                    <button onClick={() => { setShowCancelModal(false); alert("Order Cancelled"); }} className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm">Yes, Cancel</button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Refund Modal */}
          <AnimatePresence>
            {showRefundModal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRefundModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white dark:bg-[#111827] w-full max-w-sm rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-6">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Issue Refund</h3>
                  <p className="text-sm font-semibold text-gray-500 mb-4">Order total is ${order.totalAmount.toLocaleString()}. How much would you like to refund?</p>
                  <div className="relative mb-4">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                    <input 
                      type="number" 
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowRefundModal(false)} className="flex-1 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm">Cancel</button>
                    <button onClick={() => { setShowRefundModal(false); alert("Refund Issued"); }} className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl text-sm" disabled={!refundAmount}>Process Refund</button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
