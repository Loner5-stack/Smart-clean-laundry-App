"use client";
import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomSelect } from "@/components/ui/custom-select";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message.trim()) return;

    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setSubject("");
      setMessage("");

      // Reset success state after a few seconds
      setTimeout(() => setIsSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/10 p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Send us a message
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Have an issue with an order or a specific request? Drop us a note and
          we&apos;ll get back to you within 24 hours.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Message Sent!
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Thanks for reaching out. A member of our support team will reply
              to your account email shortly.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Subject Dropdown */}
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                What is this regarding?
              </label>
              <CustomSelect
                value={subject}
                onChange={setSubject}
                options={[
                  { value: "order_issue", label: "Issue with my active order" },
                  { value: "missing_item", label: "Report a missing/damaged item" },
                  { value: "billing", label: "Billing or Subscription question" },
                  { value: "other", label: "Other inquiry" },
                ]}
                placeholder="Select a topic..."
              />
            </div>

            {/* Message Area */}
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                placeholder="Please provide as much detail as possible..."
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/3 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-cobalt resize-none transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !subject || !message.trim()}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-brand-cobalt text-white text-sm font-bold shadow-lg shadow-brand-cobalt/20 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
