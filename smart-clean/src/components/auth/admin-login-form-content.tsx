"use client";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthLayout } from "@/context/login-auth-layout-context";
import { adminLoginAction } from "@/app/actions/admin-login";
import { Spinner } from "@/components/ui/spinner";

import { ScrollArea } from "@/components/ui/scroll-area";

export function AdminLoginFormContent() {
  const { isExpanded } = useAuthLayout();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [shakeKey, setShakeKey] = useState(0);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const passcode = formData.get("passcode") as string;

    const newErrors: Record<string, string> = {};
    if (!passcode) newErrors.passcode = "Passcode is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShakeKey((prev) => prev + 1);
      return;
    }

    setErrors({});
    setServerError("");

    startTransition(async () => {
      const result = await adminLoginAction(formData);

      if (!result.success) {
        const errorMsg = result.error ?? "Invalid passcode. Please try again.";
        const lowerMsg = errorMsg.toLowerCase();
        
        if (lowerMsg.includes("passcode")) {
          setErrors({ passcode: errorMsg });
        } else {
          setServerError(errorMsg);
        }
        setShakeKey((prev) => prev + 1);
        return;
      }

      router.push("/admin/orders"); // Direct admin to orders by default
      router.refresh();
    });
  };

  const scrollClasses = isExpanded
    ? "h-[80vh] lg:h-auto lg:max-h-[60vh] touch-pan-y pr-4 pb-24 lg:pb-0"
    : "h-[60vh] lg:h-auto lg:max-h-[60vh] touch-pan-y pr-4 pb-8 lg:pb-0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Info */}
      <div>
        <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          Admin Portal <ShieldCheck className="text-brand-cobalt" />
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Enter your highly secure technical passcode to access the system
        </p>
      </div>

      {/* Wrapper for mobile scrolling */}
      <ScrollArea
        className={`transition-all duration-500 ease-in-out ${scrollClasses}`}
      >
        <form noValidate onSubmit={handleSubmit} className="space-y-6">
          
          {/* Passcode */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                System Passcode
              </label>
            </div>
            <motion.div 
              key={errors.passcode ? `passcode-shake-${shakeKey}` : "passcode"}
              animate={errors.passcode ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              <div className={`absolute z-10 inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${errors.passcode ? "text-red-400 group-focus-within:text-red-500" : "text-gray-400 group-focus-within:text-brand-cobalt"}`}>
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="passcode"
                required
                placeholder="********"
                className={`w-full py-3.5 pl-11 pr-12 rounded-xl bg-white/50 dark:bg-black/10 backdrop-blur-md border ${errors.passcode ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 dark:border-white/10 focus:border-brand-cobalt focus:ring-brand-cobalt/20"} focus:ring-4 outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className={`absolute z-10 right-4 top-1/2 -translate-y-1/2 transition-colors ${errors.passcode ? "text-red-400 hover:text-red-600" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </motion.div>
            {errors.passcode && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 ml-1 mt-1">
                {errors.passcode}
              </motion.p>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{serverError}</p>
            </motion.div>
          )}

          <div className="pt-2 pb-16 lg:pb-0">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 relative overflow-hidden w-full p-4 text-white rounded-xl font-bold hover:shadow-[0_8px_30px_rgb(41,98,255,0.3)] hover:shadow-brand-cobalt/30 active:scale-[0.98] hover:-translate-y-0.5 transition-all duration-300 tracking-wide bg-linear-to-r from-gray-900 to-gray-700 dark:from-brand-cobalt dark:to-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
               <>
                 <Spinner size={18} className="text-current" />
                 Authenticating...
               </>
              ) : (
                "Access System"
              )}
            </button>
          </div>
        </form>
      </ScrollArea>
    </motion.div>
  );
}
