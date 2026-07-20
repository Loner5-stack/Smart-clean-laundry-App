"use client";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, Sparkles } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuthLayout } from "@/context/login-auth-layout-context";
import { completeOnboardingAction } from "@/app/actions/onboarding";

import { ScrollArea } from "@/components/ui/scroll-area";

export function OnboardingFormContent() {
  const { isExpanded } = useAuthLayout();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [shakeKey, setShakeKey] = useState(0);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Get the update function from useSession to manually refresh the token
  const { update } = useSession();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    const newErrors: Record<string, string> = {};
    if (!phone || phone.trim().length < 5)
      newErrors.phone = "Valid phone number is required";
    if (!address || address.trim().length < 5)
      newErrors.address = "Valid home address is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShakeKey((prev) => prev + 1);
      return;
    }

    setErrors({});
    setServerError("");

    startTransition(async () => {
      const result = await completeOnboardingAction(formData);

      if (!result.success) {
        setServerError(result.error ?? "Something went wrong.");
        setShakeKey((prev) => prev + 1);
        return;
      }

      // Update the client-side session to reflect onboardingComplete = true
      await update({ onboardingComplete: true });

      // Redirect safely to the dashboard
      router.push("/dashboard");
      router.refresh();
    });
  };

  const scrollClasses = isExpanded
    ? "h-[75vh] lg:h-auto lg:max-h-[60vh] touch-pan-y pr-4 pb-24 lg:pb-0"
    : "h-[50vh] lg:h-auto lg:max-h-[60vh] touch-pan-y pr-4 pb-8 lg:pb-0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Info */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-cobalt/10 border border-brand-cobalt/20 text-brand-cobalt text-xs font-bold mb-4">
          <Sparkles size={14} />
          Almost There
        </div>
        <h2 className="text-2xl font-bold dark:text-white">Complete Profile</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          We need a few more details to set up your laundry profile.
        </p>
      </div>

      {/* Wrapper for mobile scrolling */}
      <ScrollArea
        className={`transition-all duration-500 ease-in-out ${scrollClasses}`}
      >
        <form
          noValidate
          onSubmit={handleSubmit}
          className="space-y-4 pb-16 lg:pb-0"
        >
          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
              Phone Number
            </label>
            <motion.div
              key={errors.phone ? `phone-shake-${shakeKey}` : "phone"}
              animate={errors.phone ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              <div
                className={`absolute z-10 inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${errors.phone ? "text-red-400 group-focus-within:text-red-500" : "text-gray-400 group-focus-within:text-brand-cobalt"}`}
              >
                <Phone size={18} />
              </div>
              <input
                type="tel"
                name="phone"
                required
                placeholder="+234 800 000 0000"
                className={`w-full py-3.5 pl-11 pr-4 rounded-xl bg-white/50 dark:bg-black/10 backdrop-blur-md border ${errors.phone ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 dark:border-white/10 focus:border-brand-cobalt focus:ring-brand-cobalt/20"} focus:ring-4 outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm`}
              />
            </motion.div>
            {errors.phone && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 ml-1"
              >
                {errors.phone}
              </motion.p>
            )}
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
              Home / Pickup Address
            </label>
            <motion.div
              key={errors.address ? `address-shake-${shakeKey}` : "address"}
              animate={errors.address ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              <div
                className={`absolute z-10 top-4 left-0 pl-4 flex pointer-events-none transition-colors ${errors.address ? "text-red-400 group-focus-within:text-red-500" : "text-gray-400 group-focus-within:text-brand-cobalt"}`}
              >
                <MapPin size={18} />
              </div>
              <textarea
                name="address"
                required
                rows={3}
                placeholder="123 Example Street, City, State"
                className={`w-full py-3.5 pl-11 pr-4 rounded-xl bg-white/50 dark:bg-black/10 backdrop-blur-md border ${errors.address ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 dark:border-white/10 focus:border-brand-cobalt focus:ring-brand-cobalt/20"} focus:ring-4 outline-none transition-all duration-300 text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm resize-none`}
              />
            </motion.div>
            {errors.address && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 ml-1"
              >
                {errors.address}
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
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                {serverError}
              </p>
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
                  Saving Profile...
                </>
              ) : (
                "Complete Profile"
              )}
            </button>
          </div>
        </form>
      </ScrollArea>
    </motion.div>
  );
}
