"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface SplashScreenProps {
  onExiting: () => void;
  onComplete: () => void;
}

// Physical easing curves — these read as "real" because they mimic actual
// deceleration/acceleration of mass, not linear or generic ease-in-out.
const EASE_GLIDE = [0.16, 1, 0.3, 1] as const; // strong deceleration, like a dolly-in
const EASE_SETTLE = [0.34, 1.56, 0.64, 1] as const; // slight overshoot then settle, like a weighted object landing
const EASE_EXIT = [0.7, 0, 0.84, 0] as const; // accelerate away, like something pulled by gravity/momentum

// ── Soapy Bubble: rises with a wobble, shines with an inner reflection ─
function Bubble({ delay, x, size, color, depth }: { delay: number; x: number; size: number; color: string; depth: number }) {
  const drift = (Math.random() - 0.5) * 80;
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: "28%",
        // 3D Bubble Appearance
        background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), ${color}22 60%, rgba(255,255,255,0.3) 100%)`,
        boxShadow: `inset 0 0 6px rgba(255,255,255,0.6), 0 0 4px ${color}44`,
        border: `1px solid rgba(255,255,255,0.5)`,
        willChange: "transform, filter, opacity",
      }}
      initial={{ opacity: 0, y: 0, scale: 0, filter: "blur(0px)" }}
      animate={{
        opacity: [0, 0.9, 0.7, 0],
        y: [-10, -90, -180, -260],
        // Wobble physics
        x: [0, drift * 0.5, drift * 0.2, drift],
        scale: [0, 1.15, 0.9, 1.05, 0.5],
        filter: ["blur(0px)", "blur(0px)", `blur(${depth}px)`, `blur(${depth * 1.5}px)`],
      }}
      transition={{
        delay,
        duration: 3.8,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 1.2,
      }}
    />
  );
}

// ── Ripple ring: expands with real deceleration, not a linear scale ──────
function Ripple({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full border border-brand-cobalt/25 pointer-events-none"
      style={{ width: 96, height: 100, willChange: "transform, opacity" }}
      initial={{ scale: 0.9, opacity: 0.5 }}
      animate={{ scale: 4, opacity: 0 }}
      transition={{ delay, duration: 2.2, ease: EASE_GLIDE, repeat: Infinity, repeatDelay: 0.4 }}
    />
  );
}

export function SplashScreen({ onExiting, onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  // ── Sequence ────────────────────────────────────────────────────────
  // 0ms     : logo glides in from depth (3D dolly-in), settles with soft overshoot
  // 1500ms  : text letters flip in from depth, one by one
  // 2100ms  : tagline resolves from blur, particles + ripples begin, ambient float starts
  // 3600ms  : hold ends → camera pulls back and everything recedes into depth
  // 4300ms  : fully unmounted
  useEffect(() => {
    const holdTimer = setTimeout(() => {
      onExiting();
      setIsVisible(false);
      const doneTimer = setTimeout(() => onComplete(), 700);
      return () => clearTimeout(doneTimer);
    }, 3600);
    return () => clearTimeout(holdTimer);
  }, [onExiting, onComplete]);



  const brandName = "Smart-Clean".split("");

  // Each letter tumbles in from depth (rotateX) rather than sliding flatly —
  // this is what actually reads as "3D" instead of a 2D translate dressed up.
  const textContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 1.5 },
    },
  };

  const letterAnim: Variants = {
    hidden: { y: "70%", opacity: 0, rotateX: -70, filter: "blur(6px)" },
    show: {
      y: "0%",
      opacity: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: { duration: 0.65, ease: EASE_SETTLE },
    },
  };

  // Center-focused distribution (30% to 70%)
  const bubbles = [
    { delay: 2.1, x: 35, size: 16, color: "#2962FF", depth: 2 },
    { delay: 2.3, x: 65, size: 24, color: "#CBA974", depth: 3 },
    { delay: 2.5, x: 55, size: 12, color: "#2962FF", depth: 1.5 },
    { delay: 2.2, x: 40, size: 18, color: "#FC9D41", depth: 3.5 },
    { delay: 2.4, x: 50, size: 20, color: "#CBA974", depth: 2 }, 
    { delay: 2.6, x: 60, size: 14, color: "#2962FF", depth: 2.5 },
    { delay: 2.15, x: 38, size: 22, color: "#FC9D41", depth: 4 },
    { delay: 2.7, x: 70, size: 15, color: "#2962FF", depth: 1 },
    { delay: 2.25, x: 30, size: 14, color: "#CBA974", depth: 2 },
    { delay: 2.45, x: 68, size: 20, color: "#FC9D41", depth: 3 },
    { delay: 2.35, x: 45, size: 16, color: "#2962FF", depth: 1.5 },
    { delay: 2.55, x: 52, size: 22, color: "#CBA974", depth: 2.5 },
  ];

  return (
    <>
      {/* ── 1. BACKGROUND ─────────────────────────────────────────── */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="splash-bg"
            className="fixed inset-0 z-40 bg-flare-light dark:bg-ambient-dark"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.08, filter: "blur(4px)" }}
            transition={{ duration: 0.75, ease: EASE_EXIT }}
          >
            {/* Ambient glow that breathes very slowly — gives the background
                a sense of depth and life instead of sitting flat and inert. */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.7, 1] }}
              transition={{ delay: 0.7, duration: 4, ease: "easeInOut", repeat: Infinity }}
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(41,98,255,0.09) 0%, transparent 70%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 2. RIPPLE RINGS ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="splash-ripples"
            className="fixed z-48 flex items-center justify-center"
            style={{ top: "50%", left: "50%", x: "-50%", y: "-50%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.8, duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <Ripple delay={1.9} />
            <Ripple delay={2.5} />
            <Ripple delay={2.1} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 3. PARTICLES ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="splash-particles"
            className="fixed inset-0 z-48 overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1.9, duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {bubbles.map((p, i) => (
              <Bubble key={i} {...p} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 4. LOGO ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="splash-logo"
            layoutId="brand-logo"
            className="fixed z-50"
            style={{
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
              perspective: 1400,
              perspectiveOrigin: "50% 40%",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Inner group carries the actual 3D transform + continuous float,
                separated from opacity so the float loop never gets interrupted
                by the enter/exit fade. */}
            <motion.div
              style={{ transformStyle: "preserve-3d" }}
              initial={{ scale: 0.4, rotateX: 55, rotateY: -45, z: -300, filter: "blur(8px)" }}
              animate={{
                scale: 1,
                rotateX: [0, -3, 0, 3, 0],
                rotateY: [0, 4, 0, -4, 0],
                z: 0,
                y: [0, -6, 0, 6, 0],
                filter: "blur(0px)",
              }}
              transition={{
                scale: { duration: 0.9, ease: EASE_SETTLE },
                rotateX: { duration: 6, ease: "easeInOut", repeat: Infinity, delay: 1 },
                rotateY: { duration: 7, ease: "easeInOut", repeat: Infinity, delay: 1 },
                y: { duration: 5, ease: "easeInOut", repeat: Infinity, delay: 1 },
                z: { duration: 0.9, ease: EASE_SETTLE },
                filter: { duration: 0.6 },
              }}
              className="drop-shadow-2xl"
            >
              {/* Glow ring behind logo — pulses gently instead of firing once */}
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0.55, 0.35, 0.5, 0.35], scale: [0.8, 1.3, 1.15, 1.25, 1.15] }}
                transition={{ delay: 0.5, duration: 4, ease: "easeInOut", repeat: Infinity }}
                style={{
                  background: "radial-gradient(circle, rgba(41,98,255,0.35) 0%, transparent 70%)",
                  filter: "blur(14px)",
                }}
              />

              {/* Contact shadow beneath the mark — shifts subtly with the
                  float/rotate loop above so it reads as a real object with
                  weight, not a flat sticker. */}
              <motion.div
                className="absolute left-1/2 rounded-full bg-black/25 dark:bg-black/40 pointer-events-none"
                style={{ width: 70, height: 14, bottom: -22, x: "-50%", filter: "blur(6px)" }}
                initial={{ opacity: 0, scaleX: 0.6 }}
                animate={{ opacity: [0, 0.5, 0.4, 0.5, 0.4], scaleX: [0.6, 1, 0.9, 1, 0.9] }}
                transition={{ delay: 1, duration: 5, ease: "easeInOut", repeat: Infinity }}
              />

              <svg
                width="96"
                height="100"
                viewBox="-2 -2 60 62"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer Gold Base */}
                <motion.rect
                  width="56" height="58" rx="28"
                  stroke="#CBA974" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0, fill: "rgba(203,169,116,0)" }}
                  animate={{ pathLength: 1, fill: "rgba(203,169,116,1)" }}
                  transition={{
                    pathLength: { duration: 0.8, ease: EASE_GLIDE },
                    fill: { delay: 0.55, duration: 0.4 },
                  }}
                />
                {/* Inner White Ring */}
                <motion.rect
                  x="2" y="2" width="52" height="54" rx="26"
                  fill="white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65, duration: 0.35, ease: EASE_GLIDE }}
                />
                {/* Inner Blue Core */}
                <motion.rect
                  x="4.5" y="4.5" width="47" height="49" rx="23.5"
                  stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0, fill: "rgba(41,98,255,0)", opacity: 0 }}
                  animate={{ pathLength: 1, fill: "rgba(41,98,255,1)", opacity: 1 }}
                  transition={{
                    opacity: { delay: 0.3, duration: 0.1 },
                    pathLength: { delay: 0.3, duration: 0.7, ease: EASE_GLIDE },
                    fill: { delay: 0.8, duration: 0.4 },
                  }}
                />
                {/* Horizontal Bar */}
                <motion.path
                  d="M9 31.5C9 30.1193 10.1193 29 11.5 29H44.5C45.8807 29 47 30.1193 47 31.5C47 32.8807 45.8807 34 44.5 34H11.5C10.1193 34 9 32.8807 9 31.5Z"
                  stroke="white" strokeWidth="1"
                  initial={{ pathLength: 0, fill: "rgba(255,255,255,0)" }}
                  animate={{ pathLength: 1, fill: "rgba(255,255,255,1)" }}
                  transition={{
                    pathLength: { delay: 0.6, duration: 0.5, ease: EASE_GLIDE },
                    fill: { delay: 0.95, duration: 0.3 },
                  }}
                />
                {/* Droplet 1: Gold — falls and settles with a soft squash/stretch,
                    like a real drop of liquid landing rather than sliding into place */}
                <motion.path
                  d="M21.9619 18.0098C22.2896 17.9629 22.5331 18.0887 22.6162 18.1357C22.7203 18.1947 22.7968 18.2618 22.8418 18.3037C23.0025 18.4532 23.1903 18.7018 23.4443 19.0801C23.9839 19.8835 25.0289 21.5908 27.0801 25.2295C29.2358 29.0535 29.4607 32.4639 28.3291 34.9961C27.1952 37.5332 24.7731 39 22.0947 39C19.3804 38.9999 16.9052 37.3603 15.7275 34.7939C14.5376 32.2007 14.7064 28.7719 16.9863 25.1846L21.2305 18.5059C21.3535 18.2944 21.5911 18.0629 21.9619 18.0098Z"
                  stroke="white" strokeWidth="2"
                  initial={{ pathLength: 0, fill: "rgba(203,169,116,0)", y: -26, scaleY: 0.6, opacity: 0 }}
                  animate={{
                    pathLength: 1,
                    fill: "rgba(203,169,116,1)",
                    y: [-26, 2, -2, 0],
                    scaleY: [0.6, 1.25, 0.92, 1],
                    opacity: 1,
                  }}
                  transition={{
                    opacity: { delay: 1.0, duration: 0.1 },
                    y: { delay: 1.0, duration: 0.55, ease: EASE_SETTLE },
                    scaleY: { delay: 1.0, duration: 0.55, ease: EASE_SETTLE },
                    pathLength: { delay: 1.0, duration: 0.45 },
                    fill: { delay: 1.3, duration: 0.3 },
                  }}
                />
                {/* Droplet 2: Blue — same physical landing, slightly later */}
                <motion.path
                  d="M31.0107 14.0107C31.346 13.9619 31.596 14.0921 31.6836 14.1426C31.7927 14.2054 31.8758 14.2781 31.9287 14.3281C32.1211 14.5102 32.3731 14.8419 32.7559 15.4219C33.553 16.6296 35.1121 19.2205 38.1885 24.7734C41.3667 30.5103 41.6491 35.5305 40.04 39.1943C38.4278 42.8651 34.9819 44.9999 31.1426 45C27.2672 45 23.7281 42.6176 22.043 38.8809C20.3465 35.1187 20.5536 30.0795 23.8965 24.7275L30.2725 14.5195C30.3923 14.3076 30.6296 14.0664 31.0107 14.0107Z"
                  stroke="white" strokeWidth="2"
                  initial={{ pathLength: 0, fill: "rgba(41,98,255,0)", y: -26, scaleY: 0.6, opacity: 0 }}
                  animate={{
                    pathLength: 1,
                    fill: "rgba(41,98,255,1)",
                    y: [-26, 2, -2, 0],
                    scaleY: [0.6, 1.25, 0.92, 1],
                    opacity: 1,
                  }}
                  transition={{
                    opacity: { delay: 1.12, duration: 0.1 },
                    y: { delay: 1.12, duration: 0.55, ease: EASE_SETTLE },
                    scaleY: { delay: 1.12, duration: 0.55, ease: EASE_SETTLE },
                    pathLength: { delay: 1.12, duration: 0.45 },
                    fill: { delay: 1.42, duration: 0.3 },
                  }}
                />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 5. BRAND TEXT + TAGLINE ──────────────────────────────────── */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="splash-text"
            className="fixed z-50 flex flex-col items-center"
            style={{ top: "calc(50% + 72px)", left: "50%", x: "-50%", perspective: 800 }}
            exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: EASE_EXIT }}
          >
            {/* Brand name — per-letter 3D tumble-in */}
            <motion.div
              variants={textContainer}
              initial="hidden"
              animate="show"
              className="flex overflow-visible pb-1"
              style={{ transformStyle: "preserve-3d" }}
            >
              {brandName.map((char, i) => (
                <motion.span
                  key={i}
                  variants={letterAnim}
                  className="inline-block text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.div>

            {/* Tagline resolves from blur, like a lens racking into focus */}
            <motion.span
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 2.1, duration: 0.7, ease: EASE_GLIDE }}
              className="text-xs md:text-sm text-gray-500 dark:text-white/50 tracking-widest uppercase mt-2 font-medium"
            >
              Intelligent Fabric Care
            </motion.span>


          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 6. CORNER ACCENT LINES (decorative) ─────────────────────── */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="splash-corners"
            className="fixed inset-0 z-47 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.4, duration: 0.6 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {[
              "top-8 left-8 border-t-2 border-l-2 rounded-tl-xl",
              "top-8 right-8 border-t-2 border-r-2 rounded-tr-xl",
              "bottom-8 left-8 border-b-2 border-l-2 rounded-bl-xl",
              "bottom-8 right-8 border-b-2 border-r-2 rounded-br-xl",
            ].map((cls, i) => (
              <motion.div
                key={cls}
                className={`absolute w-12 h-12 border-brand-cobalt/20 ${cls}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: [0, 1, 0.7, 1] }}
                transition={{
                  scale: { delay: 0.6 + i * 0.08, duration: 0.6, ease: EASE_SETTLE },
                  opacity: { delay: 0.6 + i * 0.08, duration: 4, ease: "easeInOut", repeat: Infinity },
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}