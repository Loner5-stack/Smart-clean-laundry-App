"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import { useAuthLayout } from "@/context/login-auth-layout-context";

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
      return;
    }
    
    setErrors({});
    
    // Simulate auth
    document.cookie = "auth_token=mock_token; path=/;";
    window.location.href = "/dashboard";
  };

  const scrollClasses = isExpanded
    ? "max-h-[75vh] overflow-y-auto lg:max-h-none lg:overflow-y-visible touch-pan-y pr-2 pl-1 pb-24 lg:pb-0 custom-scrollbar"
    : "max-h-[50vh] overflow-y-auto lg:max-h-none lg:overflow-y-visible touch-pan-y pr-2 pl-1 pb-8 lg:pb-0 custom-scrollbar";

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

      {/* Wrapper for mobile scrolling */}
      <div className={`transition-all duration-500 ease-in-out ${scrollClasses}`}>
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
              Email Address
            </label>
            <div className="relative group">
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
            </div>
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
            <div className="relative group">
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
            </div>
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

          <div className="pt-2">
            <button className="relative overflow-hidden w-full p-4 text-white rounded-xl font-bold hover:shadow-[0_8px_30px_rgb(41,98,255,0.3)] hover:shadow-brand-cobalt/30 active:scale-[0.98] hover:-translate-y-0.5 transition-all duration-300 tracking-wide bg-linear-to-r from-brand-cobalt to-blue-500">
              Sign In
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
        <div className="flex gap-4 sm:flex-row flex-col">
          <SocialButton icon={FcGoogle} label="Google" />
          <SocialButton
            icon={FaLinkedin}
            label="LinkedIn"
            iconColor="#0A66C2"
          />
        </div>

        {/* New User Prompt */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-brand-cobalt font-bold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
