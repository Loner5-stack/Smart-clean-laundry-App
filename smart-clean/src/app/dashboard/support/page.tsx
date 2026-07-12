import { ContactCards } from "@/components/dashboard/support/contact-cards";
import { ContactForm } from "@/components/dashboard/support/contact-form";
import { FaqAccordion } from "@/components/dashboard/support/faq-accordion";

export const metadata = {
  title: "Support | Smart-Clean",
  description: "Get help and support for your Smart-Clean account",
};

export default function SupportPage() {
  return (
    <div className="px-4 md:px-6 py-6 md:py-8 max-w-5xl mx-auto space-y-8 md:space-y-12">
      {/* Header section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          How can we help you?
        </h1>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
          Whether you have a question about an active order, a billing inquiry, or just want to leave feedback, our team is ready to assist you.
        </p>
      </div>

      {/* Quick Contact Cards */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest">
            The Direct Line
          </h2>
          <div className="flex-1 h-px bg-gray-100 dark:bg-white/5" />
        </div>
        <ContactCards />
      </section>

      {/* Form and FAQ Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* Left Column: Form */}
        <ContactForm />

        {/* Right Column: FAQs */}
        <FaqAccordion />
      </section>
    </div>
  );
}
