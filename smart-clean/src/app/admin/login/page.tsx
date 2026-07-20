"use client";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LockKeyhole, Lock, ArrowRight, Database } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { ThemeToggle } from "@/components/theme-toggle";
import { adminLoginAction } from "@/app/actions/admin-login";

export default function AdminLogin() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!passcode) {
      setError("Passcode is required.");
      return;
    }

    const formData = new FormData();
    formData.append("passcode", passcode);

    startTransition(async () => {
      const result = await adminLoginAction(formData);

      if (!result?.success) {
        setError(result?.error ?? "Invalid passcode. Access denied.");
        setPasscode("");
        return;
      }

      router.push("/admin/orders");
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#090B11] flex flex-col relative overflow-hidden font-sans transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gray-500/5 dark:bg-gray-500/10 rounded-br-full blur-3xl -z-10" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <div className="bg-[#2962ff] w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
            <Database className="text-white " size={20} />
          </div>
          <span className="font-extrabold text-xl text-gray-900 dark:text-white tracking-tight">
            Control Center
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border-2 border-white dark:border-white/10 rounded-3xl p-8 shadow-2xl shadow-gray-200/50 dark:shadow-none hover:-translate-y-2 hover:border-brand-cobalt/20 dark:hover:border-brand-cobalt/30 hover:shadow-3xl hover:shadow-brand-cobalt/10 dark:hover:shadow-brand-cobalt/10 transition-all duration-300 ease-out">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-white/10">
                <LockKeyhole size={32} className="text-gray-900 dark:text-white" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                Admin Authentication
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Authorized personnel only. Please verify your identity.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Passcode */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between pl-1 pr-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Master Passcode
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-cobalt transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full py-3.5 pl-11 pr-4 rounded-xl bg-white/50 dark:bg-black/10 backdrop-blur-md border border-gray-200 dark:border-white/10 focus:border-brand-cobalt focus:ring-4 focus:ring-brand-cobalt/20 outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm"
                    placeholder="Enter system passcode"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 dark:text-red-400 text-xs font-bold text-center"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={isPending || !passcode}
                className="w-full bg-brand-cobalt text-white hover:bg-brand-cobalt/90 rounded-xl py-4 font-bold text-sm transition-all flex items-center justify-center gap-2 mt-6 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 relative overflow-hidden group shadow-lg hover:-translate-y-1 hover:shadow-brand-cobalt/30"
              >
                {isPending ? (
                  <Spinner size={18} className="text-current" />
                ) : (
                  <>
                    <span>Authenticate</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent skew-x-12" />
              </button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
