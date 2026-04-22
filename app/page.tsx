"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const HALO_EASE: [number, number, number, number] = [0.32, 0.72, 0.24, 1];

// Halo ellipse: 50vw wide, 25vh tall at base scale. Wider-than-tall so it
// reaches the horizontal edges of the viewport (immersive halo) while
// leaving the lower half of the hero clear for qualifier/cluster.
const HALO_BASE = 1.0;
const HALO_PULSE_HIGH = 1.05;
const HALO_PULSE_LOW = 0.95;

function haloGradient(scale: number): string {
  const rx = 50 * scale;
  const ry = 25 * scale;
  return [
    `radial-gradient(ellipse ${rx}vw ${ry}vh at 50% 40%,`,
    ` var(--accent) 0%,`,
    ` var(--accent) 35%,`,
    ` color-mix(in oklab, var(--accent) 60%, transparent) 50%,`,
    ` color-mix(in oklab, var(--accent) 30%, transparent) 65%,`,
    ` color-mix(in oklab, var(--accent) 10%, transparent) 85%,`,
    ` transparent 100%)`,
  ].join("");
}

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

  // A single scale value drives both ellipse radii. 0 at SSR/first paint
  // keeps HTML deterministic across server and client; the effect below
  // either snaps to 1.0 or animates to it.
  const haloScale = useMotionValue(0);
  const haloBackgroundImage = useTransform(haloScale, haloGradient);

  useEffect(() => {
    if (!skipIntro && typeof window !== "undefined") {
      sessionStorage.setItem("seen-hero-intro", "1");
    }
  }, [skipIntro]);

  useEffect(() => {
    let pulseControls: ReturnType<typeof animate> | null = null;

    const startPulse = () => {
      if (prefersReducedMotion) return;
      // base → high → base → low → base over 7s. Ease-in-out on each
      // segment gives it the rest/expand/rest/contract/rest cadence of
      // slow breathing.
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
      {/* Halo — ellipse gradient, centered at (50%, 40%). Wider than tall
          so it reaches horizontal viewport edges while leaving the lower
          half of the hero clear. */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: haloBackgroundImage }}
        aria-hidden="true"
      />

      {/* Primary claim — vertical center at 55vh, top edge ~50vh enters
          the halo's lower falloff. All centering on the outer wrapper +
          inner block keeps it bulletproof against max-width edge cases. */}
      <div
        className="absolute inset-x-0 px-8 z-10"
        style={{ top: "55vh", transform: "translateY(-50%)" }}
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

      {/* Qualifier — 72vh, outside the ellipse's vertical reach (ellipse
          bottom is ~65vh), so it sits on clean background. */}
      <div
        className="absolute inset-x-0 px-8 z-10"
        style={{ top: "72vh", transform: "translateY(-50%)" }}
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={tx(2.8, 0.5)}
          className="mx-auto max-w-3xl text-center font-serif text-h3 text-muted"
        >
          Most AI gets built by people who only have one. I build products
          with all three — for companies that care how AI feels, not just
          what it does.
        </motion.p>
      </div>

      {/* Credibility cluster — 88vh, fully outside the halo. */}
      <div
        className="absolute inset-x-0 px-8 z-10 flex flex-col items-center gap-3"
        style={{ top: "88vh", transform: "translateY(-50%)" }}
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
