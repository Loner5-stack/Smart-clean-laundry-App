import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Smart-Clean | Logistics Simplified",
  description:
    "Manage your million-user laundry operations with zero friction.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is REQUIRED here so Next.js doesn't throw an error when the theme changes the HTML
    <html lang="en" className="h-full overflow-hidden" suppressHydrationWarning>
      <body className=" h-full overflow-hidden antialiased text-brand-obsidian dark:text-brand-paper bg-brand-paper dark:bg-brand-obsidian">
        {/* THE ENGINE: Wrapping our entire app so it remembers light/dark mode */}
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
