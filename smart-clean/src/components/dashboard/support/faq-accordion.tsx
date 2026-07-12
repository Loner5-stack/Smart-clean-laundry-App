"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    id: "faq-1",
    question: "How long does the Wash & Fold service take?",
    answer: "Our standard turnaround time for Wash & Fold is 24-48 hours. If you need it sooner, you can select the 'Express Next-Day' option at checkout for an additional fee.",
  },
  {
    id: "faq-2",
    question: "What happens if I miss my scheduled pickup?",
    answer: "Don't worry! Our rider will attempt to call you when they arrive. If you are entirely unavailable, you can reschedule the pickup from the 'Orders' tab in your dashboard without any penalty for the first missed pickup.",
  },
  {
    id: "faq-3",
    question: "Are my delicate items safe?",
    answer: "Absolutely. For items like silk, wool, and structured suits, we recommend selecting our 'Eco Dry Clean' or 'Suit Preservation' services. These are handled by our specialist team using non-toxic fabric care processes.",
  },
  {
    id: "faq-4",
    question: "How do you handle stains?",
    answer: "You can report specific stains during the checkout process (under the Items step). Our team will assess the fabric and apply the most effective, safest pre-treatment available. While we cannot guarantee 100% removal for set-in stains, we have a very high success rate.",
  },
  {
    id: "faq-5",
    question: "When do I pay for my order?",
    answer: "Payment is processed only after your order is picked up and confirmed at our facility. We will send you a final invoice, and your selected payment method will be charged. We do not charge you upfront during checkout.",
  },
];

export function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-white/10 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
          <HelpCircle size={20} className="text-orange-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Quick answers to common questions
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-200 ${
                isOpen
                  ? "border-brand-cobalt bg-brand-cobalt/5 dark:bg-brand-cobalt/10"
                  : "border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/10"
              }`}
            >
              <button
                onClick={() => toggle(faq.id)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-bold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown
                    size={18}
                    className={isOpen ? "text-brand-cobalt" : "text-gray-400"}
                  />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
