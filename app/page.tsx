"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const HALO_EASE: [number, number, number, number] = [0.32, 0.72, 0.24, 1];

// Halo: a circular gradient painted as a ring (eclipse, not sun).
// Base radius 80vw — with the 12/22/32/70/100 stops below, this puts the
// ring peak's outer edge at ~32% × 80vw = ~25vw from centre (a ring whose
// visible diameter reads as ~50% of viewport width), and the outer fade
// completes at 70% × 80vw = 56vw from centre — just past the horizontal
// edge, so the corners of the viewport settle cleanly on background.
const HALO_BASE = 1.0;
const HALO_PULSE_HIGH = 1.05;
const HALO_PULSE_LOW = 0.95;

function haloGradient(scale: number): string {
  const r = 80 * scale;
  return [
    `radial-gradient(circle ${r}vw at 50% 45%,`,
    // Dark core (void) — var(--background) fills 0–12% of the radius so
    // the hero text sits inside a quiet centre.
    ` var(--background) 0%,`,
    ` var(--background) 12%,`,
    // Transition into the warm ring.
    // Ring peak — solid accent from 22–32%.
    ` var(--accent) 22%,`,
    ` var(--accent) 32%,`,
    // Fade back into background. Linear interpolation between these two
    // stops handles the falloff.
    ` var(--background) 70%,`,
    ` var(--background) 100%)`,
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

  // Single scale value drives the entire gradient. 0 on SSR + first paint
  // renders a zero-radius (invisible) halo, so the HTML is deterministic
  // across server and client.
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
      {/* Halo — dark core surrounded by a warm accent ring, fading back
          to background. Painted via backgroundImage on an inset-0 layer
          so its transparent outer zone shows the body's background. */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: haloBackgroundImage }}
        aria-hidden="true"
      />

      {/* Primary claim — vertical centre at 45vh, inside the dark core.
          The warm ring wraps around the text like an aura. */}
      <div
        className="absolute inset-x-0 px-8 z-10"
        style={{ top: "45vh", transform: "translateY(-50%)" }}
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

      {/* Qualifier — 68vh, past the outer fade, on clean background. */}
      <div
        className="absolute inset-x-0 px-8 z-10"
        style={{ top: "68vh", transform: "translateY(-50%)" }}
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

      {/* Credibility cluster — 85vh, fully on background. */}
      <div
        className="absolute inset-x-0 px-8 z-10 flex flex-col items-center gap-3"
        style={{ top: "85vh", transform: "translateY(-50%)" }}
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
