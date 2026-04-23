"use client";

import { animate, motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const HALO_EASE: [number, number, number, number] = [0.32, 0.72, 0.24, 1];

const HALO_BASE = 1.0;
const HALO_PULSE_HIGH = 1.05;
const HALO_PULSE_LOW = 0.95;

// Halo — contained ring (dark void + warm accent ring + fade) plus a
// subtle blurred ambient layer that extends the glow a bit further into
// the surrounding space at low opacity. The ring stays the focal mark;
// the ambient is a quiet warmth the eye picks up in peripheral vision.
const HALO_GRADIENT = [
  `radial-gradient(circle closest-side at center,`,
  ` var(--background) 0%,`,
  ` var(--background) 35%,`,
  ` var(--accent) 48%,`,
  ` var(--accent) 58%,`,
  // Fade to transparent (not var(--background)) so the square container's
  // corners — and the outer fade zone — don't paint an opaque dark box
  // over the ambient glow layer below.
  ` transparent 85%,`,
  ` transparent 100%)`,
].join("");

// Ambient — transparent through the centre so the ring's dark core stays
// clean; warm shoulder that picks up just outside the ring's outer fade,
// heavily blurred to dissolve any visible edge.
const HALO_AMBIENT = [
  `radial-gradient(circle 80vmin at 50% 50%,`,
  ` transparent 0%,`,
  ` transparent 25%,`,
  ` color-mix(in oklab, var(--accent) 10%, transparent) 45%,`,
  ` color-mix(in oklab, var(--accent) 5%, transparent) 65%,`,
  ` transparent 90%)`,
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
      {/* Halo — contained ring + subtle blurred ambient extension. Both
          layers scale together via the shared parent (intro + pulse). */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ scale: haloScale }}
        aria-hidden="true"
      >
        {/* Ambient extension — low opacity, heavy blur, no visible edge. */}
        <div
          className="absolute inset-0"
          style={{ backgroundImage: HALO_AMBIENT, filter: "blur(60px)" }}
        />
        {/* Contained ring — the previous design, unchanged. */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(85vw,80vh)] aspect-square"
          style={{ backgroundImage: HALO_GRADIENT }}
        />
      </motion.div>

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

/**
 * WORK — homepage "Selected work" list.
 *
 * The `preview` field is a CSS background-image used as a placeholder
 * atmospheric block for the cursor-following hover preview. Swap each
 * one for a real case study visual when available. All three share the
 * same visual register — radial gradients in terracotta / warm grey /
 * dark-with-accent — so they read as a consistent set, not one-offs.
 */
const WORK = [
  {
    tag: "Agent",
    year: "2025",
    title: "A conversational companion for women's hormonal wellness.",
    description:
      "Interaction model, domain knowledge, and voice for a Series A wellness brand.",
    preview:
      "radial-gradient(circle at 30% 40%, color-mix(in oklab, var(--accent) 80%, transparent), color-mix(in oklab, var(--accent) 30%, transparent) 45%, var(--color-grey-800) 85%)",
  },
  {
    tag: "Product",
    year: "2025",
    title: "Rebuilt onboarding for an AI creative suite.",
    description:
      "First-run strategy and shipped prototype for a generative creative tools company.",
    preview:
      "radial-gradient(ellipse at 45% 55%, var(--color-grey-400), var(--color-grey-700) 55%, var(--color-grey-900) 95%)",
  },
  {
    tag: "Brand",
    year: "2024",
    title: "Positioning and voice for a Seed-stage AI launch.",
    description:
      "Narrative system, visual direction, and launch copy for a generative AI company.",
    preview:
      "radial-gradient(circle at 70% 65%, color-mix(in oklab, var(--accent) 35%, transparent), var(--color-grey-900) 50%, var(--color-grey-900) 100%)",
  },
];

type MotionPrefs = { reducedMotion: boolean; touchOnly: boolean };

function readMotionPrefs(): MotionPrefs {
  if (typeof window === "undefined") {
    return { reducedMotion: false, touchOnly: false };
  }
  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    touchOnly: window.matchMedia("(hover: none)").matches,
  };
}

function SelectedWork() {
  const [{ reducedMotion, touchOnly }] = useState(readMotionPrefs);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // displayIndex lingers after unhover so the preview's background doesn't
  // reset mid-fadeout.
  const [displayIndex, setDisplayIndex] = useState(0);

  // Cursor-follow springs. Start offscreen so the preview doesn't paint
  // a frame at (0, 0) before the first mousemove.
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const smoothX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  const previewEnabled = !reducedMotion && !touchOnly;

  useEffect(() => {
    if (!previewEnabled) return;
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX + 16);
      mouseY.set(e.clientY + 16);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY, previewEnabled]);

  // Scroll-entrance variants: if reduced-motion, render at final state.
  const rowInitial = reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 };
  const rowTransition = {
    duration: reducedMotion ? 0 : 0.6,
    ease: EASE_OUT_SOFT,
  };
  const stagger = reducedMotion ? 0 : 0.1;

  return (
    <>
      <section className="mx-auto max-w-6xl px-8 py-32">
        <motion.h2
          initial={rowInitial}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={rowTransition}
          className="font-sans text-caption uppercase text-muted mb-20"
        >
          Selected work
        </motion.h2>

        <motion.div
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: stagger } },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="border-t border-b border-border divide-y divide-border"
        >
          {WORK.map((item, i) => (
            <motion.div
              key={`${item.tag}-${item.year}`}
              variants={{
                hidden: rowInitial,
                visible: { opacity: 1, y: 0, transition: rowTransition },
              }}
              onMouseEnter={
                previewEnabled
                  ? () => {
                      setHoveredIndex(i);
                      setDisplayIndex(i);
                    }
                  : undefined
              }
              onMouseLeave={
                previewEnabled ? () => setHoveredIndex(null) : undefined
              }
            >
              <Link href="/work" className="group block py-16">
                <div className="grid gap-y-6 gap-x-12 md:grid-cols-[10rem_1fr]">
                  <div className="flex flex-col gap-1 font-sans text-caption uppercase text-muted">
                    <span>
                      <span className="text-accent">0{i + 1}</span> ·{" "}
                      {item.tag}
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
            </motion.div>
          ))}
        </motion.div>
      </section>

      {previewEnabled && (
        <motion.div
          aria-hidden="true"
          className="fixed pointer-events-none z-50 w-[280px] h-[180px] rounded-sm"
          style={{
            left: smoothX,
            top: smoothY,
            backgroundImage: WORK[displayIndex].preview,
            boxShadow: "0 20px 60px -10px rgba(0, 0, 0, 0.5)",
          }}
          animate={{ opacity: hoveredIndex !== null ? 1 : 0 }}
          transition={{ duration: 0.18, ease: EASE_OUT_SOFT }}
        />
      )}
    </>
  );
}

function AboutCta() {
  const [{ reducedMotion }] = useState(readMotionPrefs);

  const initial = reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 };
  const transition = {
    duration: reducedMotion ? 0 : 0.6,
    ease: EASE_OUT_SOFT,
  };
  const stagger = reducedMotion ? 0 : 0.1;

  return (
    <section className="mx-auto max-w-6xl px-8 py-32">
      <motion.h2
        initial={initial}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={transition}
        className="font-sans text-caption uppercase text-muted mb-20"
      >
        About
      </motion.h2>
      <motion.div
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: stagger } },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        className="flex flex-col gap-8 max-w-3xl"
      >
        <motion.p
          variants={{
            hidden: initial,
            visible: { opacity: 1, y: 0, transition },
          }}
          className="font-serif text-h2 text-foreground"
        >
          Strategy, product, and code — for companies where taste matters as
          much as technology.
        </motion.p>
        <motion.p
          variants={{
            hidden: initial,
            visible: { opacity: 1, y: 0, transition },
          }}
          className="font-serif text-h3 text-secondary"
        >
          A small practice. One or two engagements at a time. AI product work,
          agent design, and brand positioning for AI-native companies.
        </motion.p>
        <motion.div
          variants={{
            hidden: initial,
            visible: { opacity: 1, y: 0, transition },
          }}
          className="mt-8"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 font-sans text-body-lg text-foreground hover:text-accent transition-colors duration-fast ease-out-soft"
          >
            <span>Get in touch</span>
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
