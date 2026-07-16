"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  
  return (
    <button 
      onClick={() => router.back()}
      className={`shrink-0 flex items-center justify-center rounded-full bg-white dark:bg-[#111827] shadow-sm border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-gray-600 dark:text-gray-300 active:scale-95 ${className || "w-10 h-10 lg:w-12 lg:h-12"}`}
      aria-label="Go back"
    >
      <ArrowLeft size={20} className="lg:w-6 lg:h-6" />
    </button>
  );
}
