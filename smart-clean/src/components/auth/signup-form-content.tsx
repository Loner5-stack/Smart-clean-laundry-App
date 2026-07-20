"use client";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Phone, MapPin, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { signupAction } from "@/app/actions/signup";
import { useAuthLayout } from "@/context/login-auth-layout-context";
import { ScrollArea } from "@/components/ui/scroll-area";

// ------------------------------------------------------------------
// 1. REUSABLE SUB-COMPONENTS
// ------------------------------------------------------------------

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  autoComplete: string;
  error?: string;
}

const FormInput = ({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  icon: Icon,
  error,
}: FormInputProps & { icon?: any }) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1"
    >
      {label}
    </label>
    <div className="relative group">
      {Icon && (
        <div className={`absolute z-10 inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${error ? "text-red-400 group-focus-within:text-red-500" : "text-gray-400 group-focus-within:text-brand-cobalt"}`}>
          <Icon size={18} />
        </div>
      )}
      <input
        id={id}
        name={id}
        type={type}
        required
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full py-3.5 ${Icon ? "pl-11" : "pl-4"} pr-4 rounded-xl bg-white/50 dark:bg-black/10 backdrop-blur-md border ${error ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 dark:border-white/10 focus:border-brand-cobalt focus:ring-brand-cobalt/20"} focus:ring-4 outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm`}
      />
    </div>
    {error && (
      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 ml-1">
        {error}
      </motion.p>
    )}
  </div>
);

const SocialButton = ({
  icon: Icon,
  label,
  iconColor,
  onClick,
}: {
  icon: any;
  label: string;
  iconColor?: string;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-white dark:hover:bg-white/5 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 text-sm font-bold text-gray-700 dark:text-white bg-gray-50/50 dark:bg-black/10 backdrop-blur-sm"
  >
    <Icon size={20} color={iconColor} />
    {label}
  </button>
);

// ------------------------------------------------------------------
// 2. MAIN LAYOUT COMPONENT
// ------------------------------------------------------------------

export function SignupFormContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { isExpanded } = useAuthLayout();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const terms = formData.get("terms");

    // ── Client-side validation ───────────────────────────────────────────
    const newErrors: Record<string, string> = {};
    if (!fullName) newErrors.fullName = "Full name is required";
    if (!email) newErrors.email = "Email address is required";
    if (!phone) newErrors.phone = "Phone number is required";
    if (!address) newErrors.address = "Address is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!terms) newErrors.terms = "You must agree to the terms";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setServerError("");

    // ── Call server action ───────────────────────────────────────────────
    startTransition(async () => {
      const result = await signupAction(formData);
      if (!result.success) {
        setServerError(result.error ?? "Something went wrong. Please try again.");
        return;
      }
      // Account created — redirect to login so user signs in
      router.push("/login?registered=true");
    });
  };

  const scrollClasses = isExpanded
    ? "h-[85vh] lg:h-[70vh] touch-pan-y pr-4 pb-24 lg:pb-0"
    : "h-[65vh] lg:h-[70vh] touch-pan-y pr-4 pb-8 lg:pb-0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Info */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Join Us
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Create your laundry profile
        </p>
      </div>

      {/* Scrollable Container for Mobile */}
      <ScrollArea
        className={`transition-all duration-500 ease-in-out ${scrollClasses}`}
      >
        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-y-4">
            <FormInput
              id="fullName"
              label="Full Name"
              placeholder="John Doe"
              autoComplete="name"
              icon={User}
              error={errors.fullName}
            />

            <FormInput
              id="email"
              type="email"
              label="Email Address"
              placeholder="name@company.com"
              autoComplete="email"
              icon={Mail}
              error={errors.email}
            />

            <FormInput
              id="phone"
              type="tel"
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              autoComplete="tel"
              icon={Phone}
              error={errors.phone}
            />

            <FormInput
              id="address"
              label="Address"
              placeholder="123 Main St, City, Country"
              autoComplete="street-address"
              icon={MapPin}
              error={errors.address}
            />

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1"
              >
                Create Password
              </label>
              <div className="relative group">
                <div className={`absolute z-10 inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${errors.password ? "text-red-400 group-focus-within:text-red-500" : "text-gray-400 group-focus-within:text-brand-cobalt"}`}>
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full py-3.5 pl-11 pr-12 rounded-xl bg-white/50 dark:bg-black/10 backdrop-blur-md border ${errors.password ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 dark:border-white/10 focus:border-brand-cobalt focus:ring-brand-cobalt/20"} focus:ring-4 outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
            </div>

            {/* Confirm Password Input */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1"
              >
                Confirm Password
              </label>
              <div className="relative group">
                <div className={`absolute z-10 inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${errors.confirmPassword ? "text-red-400 group-focus-within:text-red-500" : "text-gray-400 group-focus-within:text-brand-cobalt"}`}>
                  <Lock size={18} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full py-3.5 pl-11 pr-12 rounded-xl bg-white/50 dark:bg-black/10 backdrop-blur-md border ${errors.confirmPassword ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 dark:border-white/10 focus:border-brand-cobalt focus:ring-brand-cobalt/20"} focus:ring-4 outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className={`absolute z-10 right-4 top-1/2 -translate-y-1/2 transition-colors ${errors.confirmPassword ? "text-red-400 hover:text-red-600" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"}`}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 ml-1">
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex flex-col gap-1 mt-4 pt-2">
            <div className="flex items-start gap-3">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className={`w-4 h-4 rounded ${errors.terms ? "border-red-500" : "border-gray-300 dark:border-gray-600"} text-brand-cobalt focus:ring-brand-cobalt bg-white dark:bg-black/20 transition-colors`}
                />
              </div>
              <label
                htmlFor="terms"
                className={`text-sm font-medium leading-tight ${errors.terms ? "text-red-500" : "text-gray-600 dark:text-gray-400"}`}
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-blue-500 hover:underline font-sm"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-blue-500 hover:underline font-sm"
                >
                  Privacy Policy
                </Link>
                .
              </label>
            </div>
            {errors.terms && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 ml-7">
                {errors.terms}
              </motion.p>
            )}
          </div>

          {/* Server Error */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{serverError}</p>
            </motion.div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 relative overflow-hidden w-full p-4 text-white rounded-xl font-bold hover:shadow-[0_8px_30px_rgb(41,98,255,0.3)] hover:shadow-brand-cobalt/30 active:scale-[0.98] hover:-translate-y-0.5 transition-all duration-300 tracking-wide bg-linear-to-r from-brand-cobalt to-blue-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isPending ? (
                <>
                  <Spinner size={18} className="text-current" />
                  Creating account...
                </>
              ) : (
                "Create Account"
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
            Or sign up with
          </div>
        </div>

        {/* Social Authentication */}
        <div className="flex gap-4">
          <SocialButton
            icon={FcGoogle}
            label="Continue with Google"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          />
        </div>

        {/* Existing User Prompt */}
        <div className="pb-16 lg:pb-0 text-center text-sm text-gray-500 dark:text-gray-400 mt-6 font-medium">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brand-cobalt font-bold hover:underline"
          >
            Sign In
          </Link>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
