"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Inbox, CheckCircle2, AlertCircle, MessageSquare, Plus, MoreHorizontal } from "lucide-react";

interface Ticket {
  id: string;
  customerName: string;
  subject: string;
  status: "Open" | "Resolved";
  date: string;
  message: string;
}

const mockTickets: Ticket[] = [
  {
    id: "TK-001",
    customerName: "Alex Johnson",
    subject: "Stain on shirt wasn't removed",
    status: "Open",
    date: "2026-07-04T09:30:00Z",
    message: "Hi, I just received my order #ORD-123 and the coffee stain on my white shirt is still visible. What can be done about this?"
  },
  {
    id: "TK-002",
    customerName: "Sarah Williams",
    subject: "Change subscription plan",
    status: "Resolved",
    date: "2026-07-03T14:15:00Z",
    message: "I would like to upgrade from Standard to Premium Family before my next billing cycle."
  },
];

const mockFaqs = [
  {
    id: "f1",
    question: "What is your turnaround time?",
    answer: "Our standard turnaround time is 48 hours. We also offer a 24-hour priority service for an additional fee."
  },
  {
    id: "f2",
    question: "Do you offer dry cleaning?",
    answer: "Yes, dry cleaning is included in our Standard and Premium plans, or available à la carte."
  },
];

export default function AdminSupport() {
  const [activeTab, setActiveTab] = useState<"tickets" | "faq">("tickets");
  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Support & Feedback</h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">Manage customer inquiries and knowledge base.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-2xl w-full max-w-[400px]">
        {[
          { id: "tickets", icon: Inbox, label: "Support Tickets" },
          { id: "faq", icon: MessageSquare, label: "FAQ Management" }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                isActive 
                  ? "bg-white dark:bg-[#111827] text-gray-900 dark:text-white shadow-sm" 
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "tickets" && (
          <motion.div key="tickets" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm p-4 flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search tickets by ID, name or subject..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-cobalt transition-all"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/5">
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Ticket</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {mockTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer">
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900 dark:text-white text-sm">{ticket.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">{ticket.customerName}</span>
                        </td>
                        <td className="px-6 py-4 max-w-[200px] truncate">
                          <span className="font-medium text-gray-600 dark:text-gray-400 text-sm">{ticket.subject}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ticket.status === 'Open' 
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' 
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                          }`}>
                            {ticket.status === 'Open' ? <AlertCircle size={10} /> : <CheckCircle2 size={10} />}
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-500">
                            {isMounted ? new Date(ticket.date).toLocaleDateString() : '...'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => alert("Ticket details & reply coming soon")}
                            className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </motion.div>
        )}

        {activeTab === "faq" && (
          <motion.div key="faq" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            
            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-4 py-2 bg-brand-cobalt text-white rounded-xl text-sm font-bold shadow-sm shadow-brand-cobalt/20 hover:brightness-110 transition-all">
                <Plus size={16} />
                Add FAQ
              </button>
            </div>

            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm p-6 space-y-6">
              {mockFaqs.map((faq) => (
                <div key={faq.id} className="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-2xl flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <p className="font-black text-gray-900 dark:text-white">{faq.question}</p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
