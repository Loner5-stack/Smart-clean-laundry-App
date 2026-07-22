"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Award, 
  Lock, 
  Unlock, 
  Star, 
  Zap,
  TrendingUp,
  Search,
  CheckCircle2,
  PackageCheck,
  ArrowLeft
} from "lucide-react";
import { sharedLoyaltyConfig } from "@/data/mock-shared";

export default function AccountabilityPageContent({
  totalOrders,
  currentTierName,
  nextTier,
  dbTiers,
}: {
  totalOrders: number;
  currentTierName: string | null;
  nextTier: { name: string; ordersNeeded: number } | null;
  dbTiers: Array<{
    level: number;
    name: string;
    minOrders: number;
    maxOrders: number | null;
    discountPercentage: number;
    perks: any;
  }>;
}) {
  const router = useRouter();

  // Data for User Loyalty
  const nextTierThreshold = nextTier ? totalOrders + nextTier.ordersNeeded : totalOrders;
  const progressPercent = dbTiers.length === 0 ? 0 : (nextTierThreshold > totalOrders ? Math.min((totalOrders / nextTierThreshold) * 100, 100) : 100);

  const pillars = [
    { name: "Accountability", desc: "Every garment is tracked, documented, and fully insured from pickup to drop-off.", icon: <ShieldCheck size={24} /> },
    { name: "Transparency", desc: "No hidden fees. Live order tracking, detailed stain reports, and open communication.", icon: <Search size={24} /> },
    { name: "Trust", desc: "Your wardrobe is handled by vetted professionals in sterile, top-tier facilities.", icon: <CheckCircle2 size={24} /> },
    { name: "Convenience", desc: "Schedule pickups with a tap. We work around your lifestyle.", icon: <PackageCheck size={24} /> },
    { name: "Automation", desc: "Seamless subscriptions, automated notifications, and AI-powered sorting.", icon: <Zap size={24} /> },
  ];

  const tiers = dbTiers.map((tier) => {
    const isUnlocked = totalOrders >= tier.minOrders;
    const isActive = isUnlocked && (tier.maxOrders === null || totalOrders <= tier.maxOrders);
    
    // Convert Json perks (string[]) safely
    let parsedPerks: string[] = [];
    if (Array.isArray(tier.perks)) {
      parsedPerks = tier.perks as string[];
    } else if (typeof tier.perks === "string") {
      try {
        parsedPerks = JSON.parse(tier.perks);
      } catch (e) {}
    }

    return {
      level: tier.level,
      name: tier.name,
      requirement: `${tier.minOrders}${tier.maxOrders ? ` - ${tier.maxOrders}` : '+'} Orders`,
      discount: `${tier.discountPercentage}% Discount`,
      perks: parsedPerks,
      unlocked: isUnlocked,
      active: isActive,
    };
  });

  return (
    <div className="px-4 md:px-6 py-6 lg:py-8 max-w-6xl mx-auto pb-24 lg:pb-10 relative">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 mt-2 lg:mt-0 relative"
      >
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="mb-4 lg:absolute lg:-left-16 lg:top-0 lg:mb-0 shrink-0 flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white dark:bg-[#111827] shadow-sm border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-gray-600 dark:text-gray-300 active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="lg:w-6 lg:h-6" />
        </button>

        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="text-brand-cobalt" /> Accountability & Rewards
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-2 max-w-2xl">
            We believe in complete transparency. Track your loyalty rewards and see how we uphold our five brand pillars every single day.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Loyalty Program */}
        <div className="lg:col-span-7 space-y-6">
          {/* Progress Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#111827] rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-cobalt/5 rounded-full blur-3xl pointer-events-none" />

            <div className={`flex items-center justify-between mb-6 ${dbTiers.length === 0 ? 'opacity-50' : ''}`}>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Your Status</p>
                <h2 className={`text-3xl font-black flex items-center gap-2 ${dbTiers.length === 0 ? 'text-gray-500' : 'text-brand-cobalt'}`}>
                  <Award size={28} /> {currentTierName || "Unassigned"}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOrders}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                <span>{currentTierName} Started</span>
                <span>
                  {nextTier 
                    ? `${nextTier.ordersNeeded} orders to ${nextTier.name}` 
                    : "Max tier reached!"}
                </span>
              </div>
              <div className="h-3 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-brand-cobalt to-brand-cobalt/80 rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -skew-x-12" />
                </motion.div>
              </div>
            </div>
            {dbTiers.length > 0 ? (
              <p className="text-xs text-gray-400 font-medium">
                You are currently enjoying a <strong className="text-brand-cobalt">discount</strong> on all orders!
              </p>
            ) : (
              <p className="text-xs text-gray-400 font-medium italic">
                Loyalty tiers are currently being set up. Check back soon!
              </p>
            )}
          </motion.div>

          {/* Tier Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dbTiers.length === 0 ? (
              <div className="col-span-1 md:col-span-3 p-8 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center text-gray-400 text-sm font-medium">
                No tiers configured yet.
              </div>
            ) : (
              tiers.map((tier, idx) => (
              <motion.div
                key={tier.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className={`relative p-5 rounded-2xl border ${
                  tier.active 
                    ? "border-brand-cobalt bg-brand-cobalt/5 dark:bg-brand-cobalt/10 shadow-md" 
                    : tier.unlocked 
                      ? "border-gray-200 dark:border-white/10 bg-white dark:bg-[#1f2937]" 
                      : "border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#111827] opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-bold ${tier.active ? "text-brand-cobalt" : "text-gray-900 dark:text-white"}`}>
                    {tier.name}
                  </h3>
                  {tier.unlocked ? <Unlock size={14} className="text-emerald-500" /> : <Lock size={14} className="text-gray-400" />}
                </div>
                
                <p className="text-xs font-semibold text-gray-500 mb-4">{tier.requirement}</p>
                
                <div className="mb-4">
                  <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${
                    tier.active ? "bg-brand-cobalt text-white" : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300"
                  }`}>
                    {tier.discount}
                  </span>
                </div>

                <ul className="space-y-2">
                  {tier.perks.map((perk, i) => (
                    <li key={i} className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5">
                      <Star size={12} className={`shrink-0 mt-0.5 ${tier.active ? "text-brand-cobalt" : "text-gray-400"}`} /> 
                      {perk}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )))}
          </div>
        </div>

        {/* Right Column: Brand Pillars */}
        <div className="lg:col-span-5">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-[#111827] rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-white/5 shadow-sm h-full"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-emerald-500" size={24} />
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Our Promise</h2>
            </div>
            
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              We aren&apos;t just cleaning clothes; we are redefining garment care through our core pillars of excellence.
            </p>

            <div className="space-y-6">
              {pillars.map((pillar, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0 text-brand-cobalt">
                    {pillar.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{pillar.name}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Micro-stat footer */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex justify-between items-center text-xs font-bold text-gray-400">
              <span className="flex items-center gap-1"><CheckCircle2 size={14} className="text-emerald-500"/> 0 Lost Items</span>
              <span className="flex items-center gap-1"><Zap size={14} className="text-amber-500"/> 100% On-time</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
