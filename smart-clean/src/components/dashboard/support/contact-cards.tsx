"use client";
import { MessageCircle, Phone, Mail, ArrowUpRight } from "lucide-react";

export function ContactCards() {
  const methods = [
    {
      id: "whatsapp",
      title: "WhatsApp Chat",
      description: "Fastest response time",
      icon: MessageCircle,
      href: "https://wa.me/2348000000000",
      colorClass: "text-[#25D366]",
      bgClass: "bg-[#25D366]/10",
      hoverClass: "hover:border-[#25D366]/40",
      target: "_blank",
    },
    {
      id: "call",
      title: "Call Us",
      description: "Mon-Sat, 8am-6pm",
      icon: Phone,
      href: "tel:+2348000000000",
      colorClass: "text-brand-cobalt",
      bgClass: "bg-brand-cobalt/10",
      hoverClass: "hover:border-brand-cobalt/40",
      target: "_self",
    },
    {
      id: "email",
      title: "Email Support",
      description: "support@smart-clean.com",
      icon: Mail,
      href: "mailto:support@smart-clean.com",
      colorClass: "text-purple-500",
      bgClass: "bg-purple-500/10",
      hoverClass: "hover:border-purple-500/40",
      target: "_blank",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {methods.map((method) => {
        const Icon = method.icon;
        return (
          <a
            key={method.id}
            href={method.href}
            target={method.target}
            rel="noopener noreferrer"
            className={`group relative flex flex-col p-5 rounded-2xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/10 transition-all duration-300 ${method.hoverClass}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.bgClass}`}
              >
                <Icon size={24} className={method.colorClass} />
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight
                  size={16}
                  className="text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
                />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                {method.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {method.description}
              </p>
            </div>
            
            {/* Hover highlight overlay */}
            <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-gray-100 dark:group-hover:ring-white/10 transition-all pointer-events-none" />
          </a>
        );
      })}
    </div>
  );
}
