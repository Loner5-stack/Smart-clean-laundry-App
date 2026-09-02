"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 font-sans relative overflow-hidden bg-neutral-50 text-neutral-900">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200/50 via-neutral-50 to-neutral-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-200/50 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Left Content Column */}
        <div className="flex flex-col items-start text-left order-2 lg:order-1">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 font-serif text-neutral-900 animate-in fade-in slide-in-from-top-4 duration-700">
            Error 404
          </h1>

          <p className="text-base md:text-xl lg:text-2xl mb-6 md:mb-10 max-w-lg leading-relaxed text-neutral-600 animate-in fade-in slide-in-from-top-2 duration-700 delay-200 fill-mode-both">
            It looks like this page was washed away. The page does not exist.
          </p>

          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300 fill-mode-both">
            <button
              onClick={() => router.back()}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#084ba5] text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 shadow-[0_0_20px_rgba(8,75,165,0.2)] hover:shadow-[0_0_30px_rgba(8,75,165,0.4)]"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>
          </div>
        </div>

        {/* Right Illustration Column */}
        <div className="relative w-full aspect-square md:aspect-4/3 lg:aspect-square order-1 lg:order-2 flex items-center justify-center animate-in fade-in zoom-in-95 duration-1000">
          <Image
            src="/images/404-illustration.png"
            alt="Page Not Found Illustration"
            fill
            className="object-contain drop-shadow-2xl lg:scale-[1.15] origin-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}
