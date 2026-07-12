import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface BrandButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  children: ReactNode;
  showArrow?: boolean;
  colorClass?: string; // Light mode color
  darkColorClass?: string; // 💡 New prop: Dark mode color
  shadowClass?: string; // Light mode shadow
  darkShadowClass?: string; // 💡 New prop: Dark mode shadow
}

export function BrandButton({
  href,
  children,
  showArrow = false,
  colorClass = "bg-[#6b9dfa]",
  darkColorClass = "dark:bg-[#6b9dfa]/90", // Defaults to slightly dimmed version
  shadowClass = "shadow-[0_8px_20px_-6px_rgba(107,157,250,0.6)]",
  darkShadowClass = "dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)]",
  className = "",
  ...props
}: BrandButtonProps) {
  const baseStyles = `
    group inline-flex items-center justify-center gap-2 rounded-full 
    px-8 py-4 text-sm font-semibold text-white 
    transition-all duration-300 
    hover:scale-105 hover:brightness-110
    focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#1a1a1a]
    ${colorClass} ${darkColorClass}
    ${shadowClass} ${darkShadowClass}
    ${className}
  `.trim();

  // ... (rest of the component remains the same)

  const content = (
    <>
      <span>{children}</span>
      {showArrow && (
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  );

  return href ? (
    <Link href={href} className={baseStyles}>
      {content}
    </Link>
  ) : (
    <button className={baseStyles} {...props}>
      {content}
    </button>
  );
}
