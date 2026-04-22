"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import Link from "next/link";
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
    <>
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

      {/* Hero meta row — proof strip (left) and status line (right) split
          to opposite bottom corners. Geist Sans at 13px for tonal contrast
          with the italic serif qualifier above. Container mirrors the
          header's max-w-6xl px-8 so both align on the x-axis with the
          wordmark and nav. */}
      <div className="absolute inset-x-0 bottom-8 z-10">
        <div className="mx-auto max-w-6xl px-8 flex items-center justify-between gap-6">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={tx(3.3, 0.5)}
            className="font-sans text-[13px] lowercase text-muted tracking-[0.04em]"
          >
            ex-google <span className="text-accent">·</span> founder{" "}
            <span className="text-accent">·</span> engineer
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={tx(3.55, 0.5)}
            className="flex items-center gap-3 font-sans text-[13px] lowercase text-muted tracking-[0.04em]"
          >
            <span
              aria-hidden="true"
              className="w-[12px] h-[12px] rounded-full bg-accent shrink-0"
            />
            <span>available for select engagements — 2026</span>
          </motion.p>
        </div>
      </div>
    </section>

    <SelectedWork />
    <AboutCta />
    </>
  );
}

const WORK = [
  {
    tag: "Agent",
    year: "2025",
    title: "A conversational companion for women's hormonal wellness.",
    description:
      "Interaction model, domain knowledge, and voice for a Series A wellness brand.",
  },
  {
    tag: "Product",
    year: "2025",
    title: "Rebuilt onboarding for an AI creative suite.",
    description:
      "First-run strategy and shipped prototype for a generative creative tools company.",
  },
  {
    tag: "Brand",
    year: "2024",
    title: "Positioning and voice for a Seed-stage AI launch.",
    description:
      "Narrative system, visual direction, and launch copy for a generative AI company.",
  },
];

function SelectedWork() {
  return (
    <section className="mx-auto max-w-6xl px-8 py-32">
      <h2 className="font-sans text-caption uppercase text-muted mb-20">
        Selected work
      </h2>
      <div className="border-t border-b border-border divide-y divide-border">
        {WORK.map((item, i) => (
          <Link
            key={`${item.tag}-${item.year}`}
            href="/work"
            className="group block py-16"
          >
            <div className="grid gap-y-6 gap-x-12 md:grid-cols-[10rem_1fr]">
              <div className="flex flex-col gap-1 font-sans text-caption uppercase text-muted">
                <span>
                  0{i + 1} · {item.tag}
                </span>
                <span>{item.year}</span>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="font-serif text-h1 text-foreground group-hover:text-accent transition-colors duration-fast ease-out-soft">
                  {item.title}
                </h3>
                <p className="font-serif text-h3 text-secondary max-w-2xl">
                  {item.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function AboutCta() {
  return (
    <section className="mx-auto max-w-6xl px-8 py-32">
      <h2 className="font-sans text-caption uppercase text-muted mb-20">
        About
      </h2>
      <div className="flex flex-col gap-8 max-w-3xl">
        <p className="font-serif text-h2 text-foreground">
          Strategy, product, and code — for companies where taste matters as
          much as technology.
        </p>
        <p className="font-serif text-h3 text-secondary">
          A small practice. One or two engagements at a time. AI product work,
          agent design, and brand positioning for AI-native companies.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-3 mt-8 font-sans text-body-lg text-foreground hover:text-accent transition-colors duration-fast ease-out-soft"
        >
          <span>Get in touch</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
