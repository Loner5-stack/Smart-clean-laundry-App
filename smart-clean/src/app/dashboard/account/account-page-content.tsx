"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Repeat, ShieldCheck, MessageCircle, ChevronRight, LogOut, Settings, Award } from "lucide-react";
import { signOut } from "next-auth/react";

const accountLinks = [
  { href: "/dashboard/subscriptions", label: "Subscriptions", icon: Repeat, color: "text-brand-cobalt" },
  { href: "/dashboard/accountability", label: "Accountability", icon: ShieldCheck, color: "text-emerald-500" },
  { href: "/dashboard/support", label: "Help & Support", icon: MessageCircle, color: "text-amber-500" },
];

export function AccountPageContent({
  user,
  tierData,
}: {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    role: string;
    image: string | null;
  };
  tierData: {
    success: boolean;
    tierName: string;
    completedOrders: number;
    nextTier?: { name: string; ordersNeeded: number } | null;
  };
}) {
  const router = useRouter();

  const handleLogout = async () => {
    // Let NextAuth securely destroy the session cookie and redirect
    await signOut({ redirectTo: "/login" });
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-8 pb-12"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          Account & Profile
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your settings, subscriptions, and get help.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
        <div className="w-24 h-24 rounded-full bg-brand-cobalt/10 flex items-center justify-center shrink-0 border-4 border-brand-cobalt/20 overflow-hidden">
          {user.image ? (
            <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-brand-cobalt">{getInitials(user.name)}</span>
          )}
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name || "Customer"}</h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Award size={14} />
              <span className="text-xs font-black uppercase tracking-wider">{tierData.tierName} Tier</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-1">{user.role} • {tierData.completedOrders} Orders Completed</p>
          {tierData.nextTier && (
            <p className="text-xs text-brand-cobalt mt-1 font-medium">
              {tierData.nextTier.ordersNeeded} more orders to reach {tierData.nextTier.name}!
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
            <Link href="/dashboard/account/edit" className="px-4 py-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white text-sm font-semibold rounded-full transition-colors flex items-center gap-2">
              <Settings size={16} /> Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
        {accountLinks.map((link, i) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group ${
              i !== accountLinks.length - 1 ? "border-b border-gray-100 dark:border-white/5" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <link.icon size={20} className={link.color} />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{link.label}</span>
            </div>
            <ChevronRight size={20} className="text-gray-300 dark:text-gray-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>

      {/* Log out section */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-4 text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-colors"
      >
        <LogOut size={18} />
        Log Out
      </button>
    </motion.div>
  );
}
