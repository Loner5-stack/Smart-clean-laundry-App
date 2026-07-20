"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Suppress React 19 warning about next-themes injecting a script tag
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) return;
    orig.apply(console, args);
  };
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      const currentPath = window.location.pathname;
      
      if (e.key === "sc_user_logout") {
        // Only boot the user to login if they are currently inside the protected customer dashboard
        if (currentPath.startsWith("/dashboard")) {
          window.location.href = "/login";
        }
      }
      
      if (e.key === "sc_admin_logout") {
        // Only boot the admin to login if they are currently inside the protected admin area
        if (currentPath.startsWith("/admin") && currentPath !== "/admin/login") {
          window.location.href = "/admin/login";
        }
      }
    };
    
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
