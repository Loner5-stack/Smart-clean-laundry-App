import { Loader } from "lucide-react";

interface SpinnerProps {
  size?: number;
  className?: string;
  fullScreen?: boolean;
  fullContainer?: boolean;
}

export function Spinner({ size = 24, className = "", fullScreen = false, fullContainer = false }: SpinnerProps) {
  const textColorClass = className.includes("text-") ? "" : "text-brand-cobalt";
  const spinner = (
    <Loader 
      size={size} 
      className={`animate-spin ${textColorClass} ${className}`} 
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  if (fullContainer) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
