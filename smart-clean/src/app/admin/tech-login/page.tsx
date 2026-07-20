"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, KeyRound, ArrowRight, ShieldCheck, Database } from "lucide-react";
import { verifyTechPasskey } from "@/app/actions/tech-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

export default function TechLogin() {
  const router = useRouter();
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const isValid = await verifyTechPasskey(passkey);
      if (isValid) {
        sessionStorage.setItem("tech_passkey_verified", "true");
        sessionStorage.setItem("tech_passkey", passkey);
        router.push("/admin/customers");
      } else {
        setError("Invalid passcode. Access denied.");
        setPasskey("");
      }
    } catch (err) {
      setError("An error occurred verifying the passcode.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
            <ShieldCheck size={32} className="text-white" />
          </div>
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight"
        >
          Restricted Access
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-400"
        >
          Enter the technical passkey to unlock the system configurations.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="bg-white dark:bg-[#111827] py-8 px-4 shadow-[4px_0_24px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] sm:rounded-3xl sm:px-10 border border-gray-100 dark:border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="passkey"
                  name="passkey"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  className="appearance-none block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-bold transition-all sm:text-sm"
                  placeholder="Enter Passcode"
                  autoFocus
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-xs font-bold mt-2 text-center"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !passkey}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Spinner size={20} className="text-current" />
                ) : (
                  <span className="flex items-center gap-2">
                    Unlock Portal <ArrowRight size={18} />
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link href="/admin" className="text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              &larr; Return to General Operations
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
