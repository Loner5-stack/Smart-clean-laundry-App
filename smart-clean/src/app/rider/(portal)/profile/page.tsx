"use client";
import {
  User,
  ShieldCheck,
  FileText,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function RiderProfile() {
  return (
    <div className="min-h-full bg-[#F7F8FA] dark:bg-[#090B11] p-4">
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
        Profile
      </h1>

      {/* User Info Card */}
      <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm mb-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-brand-cobalt/10 flex items-center justify-center shrink-0">
          <span className="text-brand-cobalt font-black text-xl">JD</span>
        </div>
        <div>
          <h2 className="font-bold text-gray-900 dark:text-white text-lg">
            John Doe
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Rider ID: #RD-4921
          </p>
          <div className="mt-2 inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
            <ShieldCheck size={12} />
            Verified
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
          Vehicle Information
        </h3>
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-50 dark:border-white/5 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              Vehicle Type
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              Delivery Van
            </span>
          </div>
          <div className="px-4 py-3.5 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              License Plate
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white uppercase">
              AAA-123-BB
            </span>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
          Settings & Support
        </h3>
        <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden divide-y divide-gray-50 dark:divide-white/5">
          <button
            onClick={() => alert("Account Details (Coming Soon)")}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="text-brand-cobalt bg-brand-cobalt/10 p-2 rounded-lg">
                <User size={18} />
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                Account Details
              </span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
          <button
            onClick={() => alert("Earnings History (Coming Soon)")}
            className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="text-brand-cobalt bg-brand-cobalt/10 p-2 rounded-lg">
                <FileText size={18} />
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                Earnings History
              </span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          document.cookie =
            "rider_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          window.location.href = "/rider/login";
        }}
        className="w-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors active:scale-[0.98]"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  );
}
