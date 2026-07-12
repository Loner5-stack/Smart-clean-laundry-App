interface ThemeTransitionTextProps {
  children: React.ReactNode;
  lightColor: string; // e.g., "text-[#CBA974]"
  darkColor: string; // e.g., "dark:text-[#F8FAFC]"
  className?: string; // For extra padding/margin/font weights
}

export const ThemeTransitionText = ({
  children,
  lightColor,
  darkColor,
  className = "",
}: ThemeTransitionTextProps) => {
  return (
    <span
      className={`
        ${lightColor} 
        ${darkColor} 
        transition-colors 
        duration-500 
        ease-in-out 
        ${className}
      `}
    >
      {children}
    </span>
  );
};
