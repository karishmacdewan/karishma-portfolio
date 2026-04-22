"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const HALO_EASE: [number, number, number, number] = [0.32, 0.72, 0.24, 1];

const HALO_BASE = 1.0;
const HALO_PULSE_HIGH = 1.05;
const HALO_PULSE_LOW = 0.95;

// Gradient is static; pulse rides on a transform: scale on the container.
// closest-side → the gradient's outer fade completes at the nearest edge
// of the (square) container, so the halo dissolves within its own bounds.
// Stops per spec: 0–35% bg (dark void), 35–48% transition, 48–58% accent
// (ring peak), 58–85% fade back, 85–100% bg.
const HALO_GRADIENT = [
  `radial-gradient(circle closest-side at center,`,
  ` var(--background) 0%,`,
  ` var(--background) 35%,`,
  ` var(--accent) 48%,`,
  ` var(--accent) 58%,`,
  ` var(--background) 85%,`,
  ` var(--background) 100%)`,
].join("");

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

  // Starts at 0 (invisible point) on SSR + first paint; the effect below
  // either snaps to HALO_BASE or animates up to it.
  const haloScale = useMotionValue(0);

  useEffect(() => {
    if (!skipIntro && typeof window !== "undefined") {
      sessionStorage.setItem("seen-hero-intro", "1");
    }
  }, [skipIntro]);

  useEffect(() => {
    let pulseControls: ReturnType<typeof animate> | null = null;

    const startPulse = () => {
      if (prefersReducedMotion) return;
      pulseControls = animate(
        haloScale,
        [HALO_BASE, HALO_PULSE_HIGH, HALO_BASE, HALO_PULSE_LOW, HALO_BASE],
        { duration: 7, ease: "easeInOut", repeat: Infinity },
      );
    };

    let introControls: ReturnType<typeof animate> | null = null;

    if (skipIntro) {
      haloScale.set(HALO_BASE);
      startPulse();
    } else {
      introControls = animate(haloScale, HALO_BASE, {
        duration: 1.8,
        ease: HALO_EASE,
        onComplete: startPulse,
      });
    }

    return () => {
      introControls?.stop();
      pulseControls?.stop();
    };
  }, [haloScale, skipIntro, prefersReducedMotion]);

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
        delayChildren: skipIntro ? 0 : 1.9,
      },
    },
  };

  return (
    <section className="relative h-screen min-h-screen overflow-hidden">
      {/* Halo — dominant, centered on the viewport, min(85vw, 80vh) so it
          stays within bounds on both landscape and portrait. Outer div
          handles positioning via translate; inner motion.div handles the
          scale pulse so the two transforms don't fight. */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        aria-hidden="true"
      >
        <motion.div
          className="w-[min(85vw,80vh)] aspect-square"
          style={{
            scale: haloScale,
            backgroundImage: HALO_GRADIENT,
          }}
        />
      </div>

      {/* Primary claim — vertical centre at 50vh, inside the dark void. */}
      <div
        className="absolute inset-x-0 px-8 z-10"
        style={{ top: "50vh", transform: "translateY(-50%)" }}
      >
        <motion.h1
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-5xl text-center font-serif text-hero"
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
      </div>

      {/* Qualifier — 80vh. text-secondary for readable mid-contrast. */}
      <div
        className="absolute inset-x-0 px-8 z-10"
        style={{ top: "80vh", transform: "translateY(-50%)" }}
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={tx(2.8, 0.5)}
          className="mx-auto max-w-3xl text-center font-serif text-h3 text-secondary"
        >
          Most AI gets built by people who only have one. I build products
          with all three — for companies that care how AI feels, not just
          what it does.
        </motion.p>
      </div>

      {/* Credibility cluster — 92vh, fully on background. */}
      <div
        className="absolute inset-x-0 px-8 z-10 flex flex-col items-center gap-3"
        style={{ top: "92vh", transform: "translateY(-50%)" }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={tx(3.3, 0.5)}
          className="text-center font-serif italic text-body-lg text-secondary tracking-[0.01em]"
        >
          ex-google <span className="text-accent">·</span> founder{" "}
          <span className="text-accent">·</span> engineer
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={tx(3.55, 0.5)}
          className="flex items-center gap-3 text-center font-serif italic text-body-lg text-secondary tracking-[0.01em]"
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
