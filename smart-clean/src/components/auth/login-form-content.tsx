"use client";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, CheckCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";
import { useAuthLayout } from "@/context/login-auth-layout-context";
import { loginAction } from "@/app/actions/login";

import { ScrollArea } from "@/components/ui/scroll-area";

const SocialButton = ({
  icon: Icon,
  label,
  iconColor,
}: {
  icon: any;
  label: string;
  iconColor?: string;
}) => (
  <button
    type="button"
    className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-white dark:hover:bg-white/5 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 text-sm font-bold text-gray-700 dark:text-white bg-gray-50/50 dark:bg-black/10 backdrop-blur-sm"
  >
    <Icon size={20} color={iconColor} />
    {label}
  </button>
);

export function LoginFormContent() {
  const { isExpanded } = useAuthLayout();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [shakeKey, setShakeKey] = useState(0);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShakeKey((prev) => prev + 1);
      return;
    }

    setErrors({});
    setServerError("");

    startTransition(async () => {
      const result = await loginAction(formData);

      if (!result.success) {
        const errorMsg = result.error ?? "Invalid email or password. Please try again.";
        const lowerMsg = errorMsg.toLowerCase();
        
        // Intelligently map the error to the right field so it highlights red
        if (lowerMsg.includes("email") || lowerMsg.includes("oauth")) {
          setErrors({ email: errorMsg });
        } else if (lowerMsg.includes("password") || lowerMsg.includes("credentials")) {
          setErrors({ password: errorMsg });
        } else {
          // Fallback for rate limits or other general errors
          setServerError(errorMsg);
        }
        setShakeKey((prev) => prev + 1);
        return;
      }

      router.push("/dashboard");
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
        <h2 className="text-2xl font-bold dark:text-white">Welcome Back</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Please enter your details to continue
        </p>
      </div>

      {/* Registration success banner */}
      {justRegistered && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
        >
          <CheckCircle size={18} className="text-green-600 dark:text-green-400 shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
            Account created! Sign in to get started.
          </p>
        </motion.div>
      )}

      {/* Wrapper for mobile scrolling */}
      <ScrollArea
        className={`transition-all duration-500 ease-in-out ${scrollClasses}`}
      >
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
              Email Address
            </label>
            <motion.div 
              key={errors.email ? `email-shake-${shakeKey}` : "email"}
              animate={errors.email ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              <div className={`absolute z-10 inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${errors.email ? "text-red-400 group-focus-within:text-red-500" : "text-gray-400 group-focus-within:text-brand-cobalt"}`}>
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                required
                placeholder="name@company.com"
                className={`w-full py-3.5 pl-11 pr-4 rounded-xl bg-white/50 dark:bg-black/10 backdrop-blur-md border ${errors.email ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 dark:border-white/10 focus:border-brand-cobalt focus:ring-brand-cobalt/20"} focus:ring-4 outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm`}
              />
            </motion.div>
            {errors.email && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 ml-1">
                {errors.email}
              </motion.p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Password
              </label>
            </div>
            <motion.div 
              key={errors.password ? `password-shake-${shakeKey}` : "password"}
              animate={errors.password ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              <div className={`absolute z-10 inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${errors.password ? "text-red-400 group-focus-within:text-red-500" : "text-gray-400 group-focus-within:text-brand-cobalt"}`}>
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="********"
                className={`w-full py-3.5 pl-11 pr-12 rounded-xl bg-white/50 dark:bg-black/10 backdrop-blur-md border ${errors.password ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 dark:border-white/10 focus:border-brand-cobalt focus:ring-brand-cobalt/20"} focus:ring-4 outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className={`absolute z-10 right-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? "text-red-400 hover:text-red-600" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </motion.div>
            {errors.password && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 ml-1">
                {errors.password}
              </motion.p>
            )}
            <div className="flex justify-end mt-1">
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-brand-cobalt hover:underline"
              >
                Forgot password?
              </Link>
            </div>
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 relative overflow-hidden w-full p-4 text-white rounded-xl font-bold hover:shadow-[0_8px_30px_rgb(41,98,255,0.3)] hover:shadow-brand-cobalt/30 active:scale-[0.98] hover:-translate-y-0.5 transition-all duration-300 tracking-wide bg-linear-to-r from-brand-cobalt to-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Spinner size={18} className="text-current" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        {/* Separator */}
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
          </div>
          <div className="relative px-4 bg-white dark:bg-[#090B11] text-xs uppercase text-gray-400 font-bold">
            Or sign in with
          </div>
        </div>

        {/* Social Authentication */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-white dark:hover:bg-white/5 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 text-sm font-bold text-gray-700 dark:text-white bg-gray-50/50 dark:bg-black/10 backdrop-blur-sm"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>
        </div>

        {/* New User Prompt */}
        <div className="mt-6 pb-16 lg:pb-0 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-brand-cobalt font-bold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
