"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // A safety state to ensure Next.js doesn't crash before the browser loads
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // If the browser hasn't loaded yet, show a blank placeholder to prevent flickering
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 rounded-full"
        disabled
      />
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      // We make it perfectly round and add a subtle hover effect using our Cobalt brand color
      className="rounded-full w-10 h-10 hover:bg-brand-cobalt/10 hover:text-brand-cobalt transition-all duration-300"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {/* ☀️ SUN ICON: Shows in Light Mode, spins and shrinks away in Dark Mode */}
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 text-brand-sunset" />

      {/* 🌙 MOON ICON: Hidden initially, spins and grows into view in Dark Mode */}
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 text-brand-paper" />

      {/* Invisible text for screen readers (accessibility is a premium feature!) */}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
