// src/components/auth/login-auth-layout.tsx
import { BrandLogo } from "../brand-logo";
import { useState } from "react";
import { ThemeWrapper } from "../theme-wrapper";
import { ThemeToggle } from "../theme-toggle";
import { useMotionValue } from "framer-motion";
import Image from "next/image";
import { ThemeTransitionText } from "@/components/theme-transition-text";
import { AuthLayoutProvider } from "@/context/login-auth-layout-context";
import { AuthLayoutInner } from "./login-AuthLayoutInner";
import Link from "next/link";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const y = useMotionValue(0);

  return (
    <AuthLayoutProvider>
      <ThemeWrapper>
        <main className="relative min-h-dvh flex flex-col justify-start lg:justify-center px-0 md:px-12 lg:px-24 bg-flare-light dark:bg-ambient-dark transition-colors duration-500 overflow-hidden">
          {/* HEADER: Anchored at the top */}
          <header className="absolute top-6 left-6 lg:left-8 md:left-8 right-8 md:right-12 flex justify-between items-center z-50">
            <Link href="/" className="flex items-center gap-3">
              <BrandLogo />
              <span className="font-bold text-[#1A1A1A] dark:text-[#FFFFFF] text-sm tracking-tight">
                Smart-Clean
              </span>
            </Link>
            <ThemeToggle />
          </header>

          {/* MAIN CONTENT CONTAINER */}
          <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-40 pt-4 pb-12 lg:py-0">
            {/* LEFT: Branding Block */}
            <div className=" flex flex-col w-full max-w-md lg:-ml-16 lg:max-w-120 gap-2 items-center text-center ">
              <div className="relative w-full h-0 lg:h-100">
                <Image
                  src="/images/smart-washer.png"
                  alt="Smart Washer Illustration"
                  fill
                  sizes="450px"
                  className="object-contain transition-all duration-700 hover:scale-105"
                  priority
                  style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.1))" }}
                />
              </div>

              {/* Branding Text */}
              <div className="flex flex-col items-start lg:items-center pl-7 lg:pl-0 mt-14 lg:mt-0 lg:space-y-3 lg:text-center text-start">
                <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-[#FFFFFF] dark:text-[#FFFFFF]">
                  The{" "}
                  <ThemeTransitionText
                    lightColor="text-[#CBA974]"
                    darkColor="dark:text-[#F8FAFC]"
                  >
                    Future
                  </ThemeTransitionText>{" "}
                  of <br />
                  <span className="text-brand-cobalt">Freshness</span>
                </h1>
                <p className="text-xs lg:text-lg text-brand-obsidian/70 dark:text-white/60 leading-relaxed">
                  Elevating fabric care through intelligent cleaning technology
                  and artisan precision.
                </p>
              </div>
            </div>

            {/* RIGHT: Form Container - AuthLayoutInner is now a sibling */}
            <AuthLayoutInner>{children}</AuthLayoutInner>
          </div>
        </main>
      </ThemeWrapper>
    </AuthLayoutProvider>
  );
}
