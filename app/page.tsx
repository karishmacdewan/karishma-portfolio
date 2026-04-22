"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const HALO_EASE: [number, number, number, number] = [0.32, 0.72, 0.24, 1];

// Halo radius in vh. Base 45; pulse oscillates ±2% around base.
const HALO_BASE = 45;
const HALO_PULSE_HIGH = 45.9;
const HALO_PULSE_LOW = 44.1;

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

  // Radius starts at 0 on both server and client to keep SSR deterministic.
  // Return visits snap to HALO_BASE in the effect below (imperceptible
  // since a zero-radius gradient is effectively invisible).
  const haloRadius = useMotionValue(0);

  const haloBackgroundImage = useTransform(haloRadius, (r) =>
    [
      `radial-gradient(circle ${r}vh at 50% 42%,`,
      ` var(--accent) 0%,`,
      ` var(--accent) 15%,`,
      ` color-mix(in oklab, var(--accent) 75%, transparent) 22%,`,
      ` color-mix(in oklab, var(--accent) 45%, transparent) 32%,`,
      ` color-mix(in oklab, var(--accent) 20%, transparent) 42%,`,
      ` transparent 55%)`,
    ].join(""),
  );

  useEffect(() => {
    if (!skipIntro && typeof window !== "undefined") {
      sessionStorage.setItem("seen-hero-intro", "1");
    }
  }, [skipIntro]);

  // Orchestrate halo intro → pulse. onComplete on the intro triggers
  // the pulse so there's no setState-in-effect.
  useEffect(() => {
    let pulseControls: ReturnType<typeof animate> | null = null;

    const startPulse = () => {
      if (prefersReducedMotion) return;
      pulseControls = animate(
        haloRadius,
        [HALO_BASE, HALO_PULSE_HIGH, HALO_PULSE_LOW, HALO_BASE],
        { duration: 6, ease: "easeInOut", repeat: Infinity },
      );
    };

    let introControls: ReturnType<typeof animate> | null = null;

    if (skipIntro) {
      haloRadius.set(HALO_BASE);
      startPulse();
    } else {
      introControls = animate(haloRadius, HALO_BASE, {
        duration: 1.8,
        ease: HALO_EASE,
        onComplete: startPulse,
      });
    }

    return () => {
      introControls?.stop();
      pulseControls?.stop();
    };
  }, [haloRadius, skipIntro, prefersReducedMotion]);

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
        // Text starts just after the halo intro completes (1.8s).
        delayChildren: skipIntro ? 0 : 1.9,
      },
    },
  };

  return (
    <section className="relative h-screen min-h-screen overflow-hidden">
      {/* Halo — terracotta radial gradient, soft five-stop falloff to
          transparent; the body's var(--background) shows through beyond. */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: haloBackgroundImage }}
        aria-hidden="true"
      />

      {/* Primary claim — vertical center at 58vh, sitting in the lower
          half of the halo's falloff. */}
      <motion.h1
        variants={lineVariants}
        initial="hidden"
        animate="visible"
        className="absolute left-0 right-0 px-8 text-center font-serif text-hero z-10"
        style={{ top: "58vh", transform: "translateY(-50%)" }}
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

      {/* Qualifier — 72vh, further into the falloff. */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={tx(2.8, 0.5)}
        className="absolute left-1/2 max-w-3xl w-[calc(100%-4rem)] text-center font-serif text-h3 text-muted z-10"
        style={{ top: "72vh", transform: "translate(-50%, -50%)" }}
      >
        Most AI gets built by people who only have one. I build products
        with all three — for companies that care how AI feels, not just
        what it does.
      </motion.p>

      {/* Credibility cluster — 88vh, outside the gradient's reach. */}
      <div
        className="absolute left-0 right-0 px-8 flex flex-col items-center gap-3 z-10"
        style={{ top: "88vh", transform: "translateY(-50%)" }}
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={tx(3.3, 0.5)}
          className="font-serif italic text-body-lg text-secondary tracking-[0.01em]"
        >
          ex-google <span className="text-accent">·</span> founder{" "}
          <span className="text-accent">·</span> engineer
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={tx(3.55, 0.5)}
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
