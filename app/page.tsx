"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * The circle mark.
 *
 * Two arcs with slightly different radii — ellipse-ish, left-heavy-then-right-
 * heavy — so the stroke reads as a gesture, not a geometry. The gap (~25°) sits
 * at the bottom, facing the text stack below; the opening points at the
 * content, not away from it.
 */
const CIRCLE_PATH =
  "M -21.6 97.6 A 101 99 0 0 1 0 -100 A 99 101 0 0 1 21.6 97.6";

type IntroState = {
  skipIntro: boolean;
  prefersReducedMotion: boolean;
};

/**
 * Decide up-front whether to play the intro. Reads the browser preference and
 * the session flag synchronously at render time so transitions have the right
 * timing from the first frame — no setState-in-effect dance.
 */
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

  // Mark the intro as seen only when it actually played — reduced-motion users
  // who later flip the preference still get to see it once.
  useEffect(() => {
    if (!skipIntro && typeof window !== "undefined") {
      sessionStorage.setItem("seen-hero-intro", "1");
    }
  }, [skipIntro]);

  // Breathing begins after the intro settles (or immediately on a skip).
  // Reduced-motion disables the breathing loop entirely.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setTimeout(() => setBreathing(true), skipIntro ? 0 : 4000);
    return () => clearTimeout(timer);
  }, [skipIntro, prefersReducedMotion]);

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
        delayChildren: skipIntro ? 0 : 2.1,
      },
    },
  };

  return (
    <section className="min-h-screen flex flex-col px-8 pt-32 pb-16">
      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        {/* The circle mark. Initial scale 1.02 overshoots; settles to 1.0 at
            1.8–2.1s. Breathing loop takes over at 4s. */}
        <motion.div
          className="w-[min(60vh,70vmin)] aspect-square"
          initial={{ scale: 1.02 }}
          animate={breathing ? { scale: [1, 1.015, 1] } : { scale: 1 }}
          transition={
            breathing
              ? { duration: 5, ease: "easeInOut", repeat: Infinity }
              : skipIntro
                ? { duration: 0 }
                : { duration: 0.3, delay: 1.8, ease: EASE_OUT_SOFT }
          }
        >
          <svg
            viewBox="-110 -110 220 220"
            className="w-full h-full overflow-visible"
            aria-hidden="true"
          >
            <motion.path
              d={CIRCLE_PATH}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={tx(0.3, 1.5)}
            />
          </svg>
        </motion.div>

        <div className="flex flex-col items-center text-center gap-10 max-w-4xl">
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
            transition={tx(3.0, 0.5)}
            className="font-serif text-h3 text-muted max-w-3xl"
          >
            Most AI gets built by people who only have one. I build products
            with all three — for companies that care how AI feels, not just
            what it does.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={tx(3.5, 0.5)}
            className="font-serif italic text-small text-muted mt-4"
          >
            ex-google · founder · engineer
          </motion.p>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={tx(3.75, 0.5)}
        className="self-center flex items-center gap-3 font-serif italic text-small text-muted"
      >
        <span
          aria-hidden="true"
          className="w-[0.45em] h-[0.45em] rounded-full bg-accent"
        />
        <span>available for select engagements — 2026</span>
      </motion.p>
    </section>
  );
}
