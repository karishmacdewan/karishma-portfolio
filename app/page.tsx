"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];
// Brush timing: fast through the arc, decelerating into the gap.
const BRUSH_EASE: [number, number, number, number] = [0.32, 0.72, 0.24, 1];

/**
 * The circle mark — imperfect, drawn in one continuous gesture.
 *
 * Two arcs with slightly different radii (101×99, 99×101) for subtle
 * asymmetry that reads as gesture rather than geometry. Gap (~25°) at the
 * bottom, facing the text stack below.
 *
 * The "brush lift" at the end is produced by an SVG <mask> with a radial
 * gradient centered on the endpoint — the stroke is fully visible
 * everywhere except within ~16 units of (21.6, 97.6), where the mask
 * luminance fades to transparent. Combined with strokeLinecap="round" and
 * a subtle feTurbulence + feDisplacementMap on the whole path, the
 * terminal reads as a brush lifting off the page, not a timer-snipped line.
 */
const CIRCLE_PATH =
  "M -21.6 97.6 A 101 99 0 0 1 0 -100 A 99 101 0 0 1 21.6 97.6";

type IntroState = {
  skipIntro: boolean;
  prefersReducedMotion: boolean;
};

function readIntroState(): IntroState {
  if (typeof window === "undefined") {
    return { skipIntro: false, prefersReducedMotion: false };
  }
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const seen = sessionStorage.getItem("seen-hero-intro") === "1";
  return {
    skipIntro: prefersReducedMotion || seen,
    prefersReducedMotion,
  };
}

export default function HomePage() {
  const [{ skipIntro, prefersReducedMotion }] = useState(readIntroState);
  const [breathing, setBreathing] = useState(false);

  const rotate = useSpring(0, { damping: 30, stiffness: 100 });

  useEffect(() => {
    if (!skipIntro && typeof window !== "undefined") {
      sessionStorage.setItem("seen-hero-intro", "1");
    }
  }, [skipIntro]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setTimeout(() => setBreathing(true), skipIntro ? 0 : 4300);
    return () => clearTimeout(timer);
  }, [skipIntro, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      rotate.set(Math.max(-4, Math.min(4, deltaX * 4)));
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [rotate, prefersReducedMotion]);

  const tx = (delay: number, duration: number) => ({
    duration: skipIntro ? 0 : duration,
    delay: skipIntro ? 0 : delay,
    ease: EASE_OUT_SOFT,
  });

  const wordVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: skipIntro ? 0 : 0.55,
        ease: EASE_OUT_SOFT,
      },
    },
  };

  const lineVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: skipIntro ? 0 : 0.12,
        delayChildren: skipIntro ? 0 : 2.4,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center text-center px-8 pt-[14vh] overflow-hidden">
      {/* Circle mark — contained form at the top of the hero. Sized
          proportionally to viewport height, capped at 640px on taller
          screens, bounded by 85vw on narrow portrait mobile. */}
      <motion.div
        className="w-[min(60vh,640px,85vw)] aspect-square shrink-0 pointer-events-none"
        style={{ rotate }}
        initial={{ scale: 1.02 }}
        animate={breathing ? { scale: [1, 1.015, 1] } : { scale: 1 }}
        transition={
          breathing
            ? { duration: 5, ease: "easeInOut", repeat: Infinity }
            : skipIntro
              ? { duration: 0 }
              : { duration: 0.3, delay: 2.1, ease: EASE_OUT_SOFT }
        }
      >
        <svg
          viewBox="-110 -110 220 220"
          className="w-full h-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <filter id="brush-texture">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.025"
                numOctaves="2"
                seed="2"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="1.5"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            <radialGradient id="tail-grad">
              <stop offset="0" stopColor="black" stopOpacity="1" />
              <stop offset="0.5" stopColor="black" stopOpacity="0.7" />
              <stop offset="1" stopColor="black" stopOpacity="0" />
            </radialGradient>
            <mask
              id="tail-fade"
              maskUnits="userSpaceOnUse"
              x="-110"
              y="-110"
              width="220"
              height="220"
            >
              <rect
                x="-110"
                y="-110"
                width="220"
                height="220"
                fill="white"
              />
              <circle cx="21.6" cy="97.6" r="16" fill="url(#tail-grad)" />
            </mask>
          </defs>

          <motion.path
            d={CIRCLE_PATH}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#brush-texture)"
            mask="url(#tail-fade)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: skipIntro ? 0 : 1.8,
              delay: skipIntro ? 0 : 0.3,
              ease: BRUSH_EASE,
            }}
          />
        </svg>
      </motion.div>

      {/* Primary claim sits cleanly below the circle's gap with a
          deliberate 2rem breath; no overlap with the stroke. */}
      <div className="relative z-10 mt-8 flex flex-col items-center gap-10 max-w-5xl">
        <motion.h1
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          className="font-serif text-hero"
        >
          <motion.span variants={wordVariants} className="inline-block">
            Strategy,
          </motion.span>{" "}
          <motion.span variants={wordVariants} className="inline-block">
            <span className="italic">taste</span>,
          </motion.span>{" "}
          <motion.span variants={wordVariants} className="inline-block">
            and
          </motion.span>{" "}
          <motion.span variants={wordVariants} className="inline-block">
            code.
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={tx(3.3, 0.5)}
          className="font-serif text-h3 text-muted max-w-3xl"
        >
          Most AI gets built by people who only have one. I build products
          with all three — for companies that care how AI feels, not just
          what it does.
        </motion.p>
      </div>

      {/* Flex spacer — pushes the credibility cluster to the bottom on
          taller viewports, with a minimum breath on shorter ones. */}
      <div className="flex-1 min-h-[6vh]" aria-hidden="true" />

      {/* Credibility cluster — proof strip + status line as a composed
          two-line block. 18px italic serif, secondary contrast (brighter
          than muted, below foreground), separator dots in accent. */}
      <div className="relative z-10 flex flex-col items-center gap-3 pb-[10vh]">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={tx(3.8, 0.5)}
          className="font-serif italic text-body-lg text-secondary tracking-[0.01em]"
        >
          ex-google <span className="text-accent">·</span> founder{" "}
          <span className="text-accent">·</span> engineer
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={tx(4.05, 0.5)}
          className="flex items-center gap-3 font-serif italic text-body-lg text-secondary tracking-[0.01em]"
        >
          <span
            aria-hidden="true"
            className="w-[12px] h-[12px] rounded-full bg-accent shrink-0"
          />
          <span>available for select engagements — 2026</span>
        </motion.p>
      </div>
    </section>
  );
}
