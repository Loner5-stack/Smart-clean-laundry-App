"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ThemeWrapper } from "@/components/theme-wrapper";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeTransitionText } from "@/components/theme-transition-text";
import { ThemeToggle } from "@/components/theme-toggle";
import { SplashScreen } from "@/components/splash-screen";
import { SLIDES } from "@/constants/slides";
import Image from "next/image";
import { ChevronRight, MapPin } from "lucide-react";

// 🎨 ANIMATION VARIANTS
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function WelcomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = SLIDES;
  const router = useRouter();

  const [splashExiting, setSplashExiting] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  // 🎛️ NAVIGATION CONTROLS
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // 📱 Mobile Swipe State
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) =>
    setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) nextSlide();
    if (distance < -50) prevSlide();
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Auto-advance slides
  useEffect(() => {
    if (!splashDone) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [currentSlide, splashDone]);

  return (
    <ThemeWrapper>
      <SplashScreen
        onExiting={() => setSplashExiting(true)}
        onComplete={() => setSplashDone(true)}
      />
      <main className="relative flex flex-col justify-start lg:justify-center min-h-screen w-full overflow-x-hidden overflow-y-auto bg-flare-light dark:bg-ambient-dark transition-colors duration-500 px-0 md:px-12 lg:px-24">
        {/* 1️⃣ HEADER: Logo & Login */}
        <motion.header
          variants={containerVariants}
          initial="hidden"
          animate={splashDone ? "show" : "hidden"}
          className="absolute top-6 left-6 md:left-8 lg:left-8 right-6 md:right-12 flex justify-between items-center z-50"
        >
          <div className="flex items-center gap-3">
            {splashExiting && (
              <motion.div layoutId="brand-logo">
                <BrandLogo />
              </motion.div>
            )}
            <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">
              Smart-Clean
            </span>
          </div>
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4"
          >
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden lg:inline-flex px-5 py-2.5 rounded-full bg-white dark:bg-white/10 text-gray-900 dark:text-white text-sm font-bold shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-white/10"
            >
              Log in
            </Link>
          </motion.div>
        </motion.header>

        {/* 2️⃣ MAIN CONTENT LAYOUT */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl mx-auto z-10 pt-28 lg:pt-20 lg:pb-0 pb-12 gap-8 lg:gap-40">
          {/* LEFT: Text & CTA */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={splashDone ? "show" : "hidden"}
            className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left max-w-2xl order-2 lg:order-1 pt-4 lg:pt-0 pb-12 lg:pb-0 w-full px-4 lg:px-0"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-cobalt/10 text-brand-cobalt text-xs font-bold uppercase tracking-widest mb-6 border border-brand-cobalt/20 w-max"
            >
              <MapPin size={14} className="text-brand-cobalt shrink-0" />
              Now Available In Abeokuta
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-[#10173b] dark:text-white mb-4"
            >
              The{" "}
              <ThemeTransitionText
                lightColor="text-[#CBA974]"
                darkColor="dark:text-[#F8FAFC]"
              >
                Future
              </ThemeTransitionText>{" "}
              of <br className="hidden lg:block" />
              <span className="text-brand-cobalt">Freshness</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="hidden lg:block text-base md:text-xl text-gray-600 dark:text-gray-300 font-medium mb-6 max-w-lg leading-relaxed"
            >
              Elevating fabric care through intelligent cleaning technology,
              artisan precision, and on-demand delivery straight to your door.
            </motion.p>

            {/* Mobile Progress Indicators (Hidden on Desktop) */}
            <motion.div variants={itemVariants} className="flex lg:hidden justify-center gap-2 mb-8">
               {slides.map((_, index) => (
                  <div
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(index);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "w-8 bg-brand-cobalt" : "w-2 bg-gray-300 dark:bg-gray-700"}`}
                  />
               ))}
            </motion.div>

            <motion.div variants={itemVariants} className="w-full sm:w-auto flex flex-col items-center gap-4 mt-4 lg:mt-8">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-3 w-full px-10 py-5 rounded-full bg-brand-cobalt text-white text-lg font-bold shadow-xl shadow-brand-cobalt/30 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Get Started
                <ChevronRight size={20} className="stroke-3" />
              </Link>
              <Link href="/login" className="lg:hidden text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">
                Already have an account? <span className="text-brand-cobalt font-bold hover:underline">Sign in</span>
              </Link>
            </motion.div>

            {/* Rating Component (Hidden on Mobile) */}
            <motion.div variants={itemVariants} className="hidden lg:flex items-center gap-3 mt-20">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#e8be66] flex items-center justify-center ring-2 ring-blue-500/20 text-white font-bold text-xs z-10 shadow-sm">A</div>
                <div className="w-8 h-8 rounded-full bg-[#82a3f7] flex items-center justify-center ring-2 ring-blue-500/20 text-white font-bold text-xs z-20 shadow-sm">T</div>
                <div className="w-8 h-8 rounded-full bg-[#ee9877] flex items-center justify-center ring-2 ring-blue-500/20 text-white font-bold text-xs z-30 shadow-sm">M</div>
              </div>
              <div className="text-[#10173b] dark:text-gray-300 text-sm leading-tight">
                <span className="font-bold text-[15px]">4.9</span> rating from <span className="font-bold text-[15px]">500+</span><br />
                customers
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: Slideshow Showcase */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={splashDone ? "show" : "hidden"}
            className="flex-1 flex items-center justify-center lg:justify-end mt-2 lg:mt-0 order-1 lg:order-2 w-full"
          >
            <motion.div
              variants={itemVariants}
              className="relative w-full max-w-125 h-48 md:h-auto md:aspect-4/5 rounded-3xl lg:rounded-[2.5rem] overflow-hidden shadow-xl lg:shadow-2xl border-4 border-white dark:border-white/10 cursor-pointer group"
              onClick={nextSlide}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={SLIDES[currentSlide].image}
                    alt={SLIDES[currentSlide].title}
                    fill
                    priority
                    sizes="(max-width: 768px) 90vw, 500px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-brand-cobalt/60 via-brand-cobalt/10 to-transparent" />

                  {/* Slide Text */}
                  <div className="absolute bottom-10 left-8 right-8 text-white">
                    <h3 className="text-2xl font-bold mb-2">
                      {SLIDES[currentSlide].title}
                    </h3>
                    <p className="text-sm text-white/80">
                      {SLIDES[currentSlide].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Progress Indicators (Hidden on Mobile) */}
              <div className="hidden lg:flex absolute top-6 left-6 right-6 gap-2 z-20">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(index);
                    }}
                    className="h-1.5 flex-1 rounded-full bg-white/30 overflow-hidden cursor-pointer"
                  >
                    <motion.div
                      key={index === currentSlide && splashDone ? `active-${currentSlide}` : `inactive-${index}`}
                      className="h-full bg-white w-full origin-left"
                      initial={{ scaleX: index < currentSlide ? 1 : 0 }}
                      animate={{
                        scaleX:
                          index === currentSlide && splashDone
                            ? 1
                            : index < currentSlide
                              ? 1
                              : 0,
                      }}
                      transition={{
                        duration: index === currentSlide && splashDone ? 5 : 0,
                        ease: "linear",
                      }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </ThemeWrapper>
  );
}
