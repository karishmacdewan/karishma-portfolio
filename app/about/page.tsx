"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef } from "react";

/*
 * ABOUT — vertical scroll-snap with per-section entrance choreography.
 *
 * Pattern:
 *   - <html> gets `scroll-snap-type: y mandatory` (via globals.css +
 *     a data attribute set here for the route's lifetime).
 *   - Each section is min-h-screen snap-start snap-always, so scrolling
 *     between sections feels committed — no accidental "stuck between"
 *     states.
 *   - Each section's entrance uses whileInView with viewport={{ once:
 *     true, amount: 0.5 }}, so the animation fires exactly once when
 *     the section is half-visible.
 *   - Each section has a DISTINCT animation register — scale for the
 *     hero, slide-in pairs for BACKGROUND and FOUNDING (reversed),
 *     row-by-row stagger for NOW, scale + halo pulse-to-life for WHY,
 *     typed-clause reveal for TODAY.
 *   - Portrait and artifact plates have subtle scroll-linked parallax
 *     (±30px over their section's scroll window).
 *
 * Reduced-motion:
 *   - No scroll-snap attribute set on <html>.
 *   - No whileInView / initial / animate variants — content renders at
 *     final state directly.
 *   - Parallax returns 0 for y.
 *   - Pulsing "last updated" dot is static (already respects this).
 *
 * The section content treatments from step 7.3 are preserved intact —
 * this step only adds the scroll + animation layer around them.
 */

const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ──────────────── Content constants ──────────────── */

const NOISE_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const NOW = [
  { label: "Currently in", value: "Brooklyn, NY" },
  { label: "Building", value: "A women's hormonal wellness brand (in market)" },
  { label: "Reading", value: "The Creative Act — Rick Rubin" },
  { label: "Listening to", value: "Alice Coltrane — Journey in Satchidananda" },
] as const;

const LAST_UPDATED = "April 2026";

const JOURNAL_DATE = "April 24, 2026 — Brooklyn, NY";

// Journal body split into clauses — each fades in sequentially, giving
// the "written in real time" feel without literal typewriter overhead.
const JOURNAL_CLAUSES = [
  "Draft of a positioning doc open for the third day.",
  "The founders keep gesturing toward a sentence they haven\u2019t written yet — and the whole thing turns on it.",
  "That\u2019s most of the work. The rest is decoration.",
  "Coffee, a walk, try again tomorrow.",
] as const;

const WHY_HALO = [
  "radial-gradient(circle closest-side at center,",
  " color-mix(in oklab, var(--accent) 35%, transparent) 0%,",
  " color-mix(in oklab, var(--accent) 15%, transparent) 35%,",
  " transparent 70%)",
].join("");

/* ──────────────── Page shell ──────────────── */

export default function AboutPage() {
  const reduced = useReducedMotion();

  // Opt <html> into scroll-snap for this route only, and only for
  // users who aren't requesting reduced motion.
  useEffect(() => {
    if (reduced) return;
    const html = document.documentElement;
    html.setAttribute("data-scroll-snap", "y-mandatory");
    return () => {
      html.removeAttribute("data-scroll-snap");
    };
  }, [reduced]);

  return (
    <>
      <SectionHero reduced={!!reduced} />
      <SectionBackground reduced={!!reduced} />
      <SectionFounding reduced={!!reduced} />
      <SectionNow reduced={!!reduced} />
      <SectionWhy reduced={!!reduced} />
      <SectionToday reduced={!!reduced} />
    </>
  );
}

/* ──────────────── Shared helpers ──────────────── */

type ReducedProps = { reduced: boolean };

/**
 * useSectionProgress — 0..1 progress mapped to the section's scroll
 * window (from when it enters the viewport to when it leaves).
 * Used to drive subtle y-parallax on image plates.
 */
function useSectionProgress(ref: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  return scrollYProgress;
}

/** Section label — slides in from above, small "chapter heading" moment. */
function SectionLabel({
  index,
  name,
  reduced,
  className = "",
}: {
  index: number;
  name: string;
  reduced: boolean;
  className?: string;
}) {
  return (
    <motion.p
      initial={reduced ? false : { opacity: 0, y: -14 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: EASE_OUT_SOFT }}
      className={`font-sans text-caption uppercase text-muted ${className}`}
    >
      <span className="text-accent">
        {String(index).padStart(2, "0")}
      </span>{" "}
      · {name}
    </motion.p>
  );
}

/* ──────────────── 01 · Hero ────────────────
 * Scale 98% → 100% while fading in. Simple, confident.
 * ────────────────────────────────────────── */

function SectionHero({ reduced }: ReducedProps) {
  return (
    <section className="min-h-screen snap-start snap-always flex items-center justify-center px-8">
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.98 }}
        whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: EASE_OUT_SOFT }}
        className="text-center max-w-5xl"
      >
        <p className="font-sans text-caption uppercase text-muted mb-6">
          About
        </p>
        <h1 className="font-serif text-display leading-[1.05]">
          Karishma Dewan. Strategy, taste, and code.
        </h1>
      </motion.div>
    </section>
  );
}

/* ──────────────── 02 · Background ────────────────
 * Pull quote slides in from left, body fades in, portrait slides in
 * from right. Staggered via variants (160ms between items, 100ms
 * delay before the first). Portrait also carries scroll-linked
 * parallax (+30 → -30 across its scroll window).
 * ───────────────────────────────────────────────── */

function SectionBackground({ reduced }: ReducedProps) {
  const ref = useRef<HTMLElement>(null);
  const progress = useSectionProgress(ref);
  const portraitY = useParallaxY(progress, reduced, 30);

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.16,
        delayChildren: 0.1,
      },
    },
  };
  const slideLeft = variantSlide(-40, reduced);
  const slideRight = variantSlide(40, reduced);
  const fade = variantFade(reduced);

  return (
    <section
      ref={ref}
      className="min-h-screen snap-start snap-always mx-auto max-w-6xl w-full px-8 pt-24 pb-16 flex flex-col justify-center"
    >
      <SectionLabel
        index={1}
        name="Background"
        reduced={reduced}
        className="mb-10"
      />

      <motion.div
        variants={reduced ? undefined : container}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, amount: 0.4 }}
        className="grid gap-y-10 md:gap-x-[3%] md:grid-cols-[18%_42%_37%] items-center"
      >
        <motion.blockquote
          variants={reduced ? undefined : slideLeft}
          className="order-first md:order-none"
        >
          <p className="font-serif italic text-h3 md:text-h2 text-muted leading-[1.2]">
            &ldquo;products where decisions moved slowly and the stakes rode
            on execution&rdquo;
          </p>
        </motion.blockquote>

        <motion.p
          variants={reduced ? undefined : fade}
          className="font-serif text-h3 text-foreground"
        >
          Five years at Google in strategy, analytics, and go-to-market.
          Worked on products where decisions moved slowly and the stakes
          rode on execution — ads infrastructure, a consumer bet, a
          creator platform before it had a name.
        </motion.p>

        <motion.figure
          variants={reduced ? undefined : slideRight}
          className="flex flex-col"
        >
          <div className="relative w-full aspect-[4/5] max-h-[65vh] overflow-hidden">
            <motion.div
              className="absolute inset-0"
              style={{
                y: portraitY,
                backgroundImage:
                  "linear-gradient(135deg, color-mix(in oklab, var(--color-grey-300) 55%, var(--surface)) 0%, color-mix(in oklab, var(--color-grey-500) 40%, var(--surface)) 100%)",
              }}
              aria-label="Portrait placeholder"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse at 60% 40%, color-mix(in oklab, var(--accent) 8%, transparent), transparent 70%)",
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
                style={{ backgroundImage: NOISE_SVG }}
              />
            </motion.div>
          </div>
          <figcaption className="mt-3 font-serif italic text-small text-muted">
            Photo forthcoming.
          </figcaption>
        </motion.figure>
      </motion.div>
    </section>
  );
}

/* ──────────────── 03 · Founding ────────────────
 * Mirror of BACKGROUND's choreography — artifact slides from LEFT,
 * paragraph slides from RIGHT. Rhythmic reversal: the eye learns the
 * page's direction, then gets pulled the other way.
 * ─────────────────────────────────────────────── */

function SectionFounding({ reduced }: ReducedProps) {
  const ref = useRef<HTMLElement>(null);
  const progress = useSectionProgress(ref);
  const artifactY = useParallaxY(progress, reduced, 30);

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
  };
  const slideLeft = variantSlide(-40, reduced);
  const slideRight = variantSlide(40, reduced);

  return (
    <section
      ref={ref}
      className="min-h-screen snap-start snap-always mx-auto max-w-6xl w-full px-8 pt-24 pb-16 flex flex-col justify-center"
    >
      <SectionLabel
        index={2}
        name="Founding"
        reduced={reduced}
        className="mb-10"
      />

      <motion.div
        variants={reduced ? undefined : container}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, amount: 0.4 }}
        className="grid gap-y-10 md:gap-x-[5%] md:grid-cols-[40%_55%] items-center"
      >
        <motion.figure
          variants={reduced ? undefined : slideLeft}
          className="flex flex-col order-last md:order-none"
        >
          <div className="relative w-full aspect-[4/5] max-h-[65vh] overflow-hidden">
            <motion.div
              className="absolute inset-0"
              style={{
                y: artifactY,
                backgroundImage:
                  "linear-gradient(210deg, color-mix(in oklab, var(--color-grey-400) 50%, var(--surface)) 0%, color-mix(in oklab, var(--color-grey-700) 45%, var(--surface)) 100%)",
              }}
              aria-label="Founding artifact placeholder"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse at 30% 65%, color-mix(in oklab, var(--accent) 10%, transparent), transparent 65%)",
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
                style={{ backgroundImage: NOISE_SVG }}
              />
            </motion.div>
          </div>
          <figcaption className="mt-3 font-serif italic text-small text-muted">
            Founding artifact, 2023.
          </figcaption>
        </motion.figure>

        <motion.p
          variants={reduced ? undefined : slideRight}
          className="font-serif text-h3 text-foreground"
        >
          In 2023, left to start a women&apos;s hormonal wellness brand.
          Built it from first principles — research, brand, product,
          early revenue. Still active as founder; the company is how I
          keep my product instincts honest.
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ──────────────── 04 · Now ────────────────
 * Stat rows stagger in one at a time — 120ms between rows — so the
 * list populates live, like data resolving. Pulsing dot on "Last
 * updated" continues to do its own thing independent of the entrance.
 * ─────────────────────────────────────────── */

function SectionNow({ reduced }: ReducedProps) {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };
  const row = {
    hidden: reduced ? {} : { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASE_OUT_SOFT },
    },
  };

  return (
    <section className="min-h-screen snap-start snap-always mx-auto max-w-6xl w-full px-8 pt-24 pb-16 flex flex-col justify-center">
      <SectionLabel
        index={3}
        name="Now"
        reduced={reduced}
        className="mb-10"
      />

      <motion.div
        variants={reduced ? undefined : container}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-col gap-5 max-w-3xl"
        aria-label="What I'm doing right now"
      >
        {NOW.map((item) => (
          <motion.div
            key={item.label}
            variants={reduced ? undefined : row}
            className="grid grid-cols-[minmax(9rem,30%)_1fr] gap-x-8 items-center"
          >
            <span className="font-serif italic text-body-lg text-muted">
              {item.label}
            </span>
            <span className="font-sans text-body-lg text-foreground">
              {item.value}
            </span>
          </motion.div>
        ))}

        <motion.div
          variants={reduced ? undefined : row}
          className="grid grid-cols-[minmax(9rem,30%)_1fr] gap-x-8 items-center"
        >
          <span className="font-serif italic text-body-lg text-muted">
            Last updated
          </span>
          <span className="flex items-center gap-3 font-sans text-body-lg text-foreground">
            <motion.span
              aria-hidden="true"
              className="w-[10px] h-[10px] rounded-full bg-accent shrink-0"
              animate={
                reduced
                  ? undefined
                  : { scale: [1, 1.35, 1], opacity: [0.9, 0.5, 0.9] }
              }
              transition={
                reduced
                  ? undefined
                  : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
              }
            />
            <span>{LAST_UPDATED}</span>
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ──────────────── 05 · Why ────────────────
 * The dramatic apex. Halo pulses to life (opacity 0 → 0.2, scale
 * 0.9 → 1) simultaneously with the quote scaling up (0.9 → 1 with
 * fade). Longer duration (1.1s) to let the moment land.
 * ─────────────────────────────────────────── */

function SectionWhy({ reduced }: ReducedProps) {
  const quoteAnim = reduced
    ? undefined
    : {
        initial: { opacity: 0, scale: 0.9 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true, amount: 0.5 },
        transition: { duration: 1.1, ease: EASE_OUT_SOFT, delay: 0.1 },
      };
  const haloAnim = reduced
    ? undefined
    : {
        initial: { opacity: 0, scale: 0.9 },
        whileInView: { opacity: 0.2, scale: 1 },
        viewport: { once: true, amount: 0.5 },
        transition: { duration: 1.3, ease: EASE_OUT_SOFT },
      };

  return (
    <section className="min-h-screen snap-start snap-always relative flex items-center justify-center px-8 overflow-hidden">
      <motion.div
        aria-hidden="true"
        {...(haloAnim ?? {})}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        // Under reduced-motion, jump straight to the final opacity.
        style={reduced ? { opacity: 0.2 } : undefined}
      >
        <div
          className="w-[min(90vw,90vh)] aspect-square"
          style={{ backgroundImage: WHY_HALO }}
        />
      </motion.div>

      <motion.div
        {...(quoteAnim ?? {})}
        className="relative z-10 w-full max-w-[85vw] md:max-w-[60vw] mx-auto"
      >
        <p className="font-sans text-caption uppercase text-muted mb-10 text-center">
          <span className="text-accent">04</span> · Why
        </p>
        <blockquote>
          <p className="font-serif italic text-h2 md:text-display text-foreground text-center leading-[1.25] md:leading-[1.2]">
            AI is going to reshape how products feel. Most teams
            building it today come from one direction — usually
            engineering. Strategy, product taste, and technical fluency
            rarely sit in one person. When they do, the work tends to
            show it.
          </p>
        </blockquote>
      </motion.div>
    </section>
  );
}

/* ──────────────── 06 · Today ────────────────
 * Journal entry written in real time. Date fades in first, then each
 * clause of the paragraph fades in sequentially (200ms gap), then
 * the signature lands last.
 * ───────────────────────────────────────────── */

function SectionToday({ reduced }: ReducedProps) {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.22, delayChildren: 0.1 } },
  };
  const item = {
    hidden: reduced ? {} : { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASE_OUT_SOFT },
    },
  };

  return (
    <section className="min-h-screen snap-start snap-always mx-auto max-w-6xl w-full px-8 pt-24 pb-16 flex flex-col justify-center">
      <SectionLabel
        index={5}
        name="Today"
        reduced={reduced}
        className="mb-10"
      />

      <motion.article
        variants={reduced ? undefined : container}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-2xl"
      >
        <motion.p
          variants={reduced ? undefined : item}
          className="font-serif italic text-small text-muted mb-8 tracking-wide"
        >
          {JOURNAL_DATE}
        </motion.p>

        {/* Paragraph split into clauses. Each <motion.span> fades in
            sequentially; visually still one flowing paragraph because
            the spans are inline. */}
        <p className="font-serif italic text-h3 text-foreground leading-[1.5]">
          {JOURNAL_CLAUSES.map((clause, i) => (
            <motion.span
              key={i}
              variants={reduced ? undefined : item}
              className="inline"
            >
              {clause}
              {i < JOURNAL_CLAUSES.length - 1 ? " " : ""}
            </motion.span>
          ))}
        </p>

        <motion.p
          variants={reduced ? undefined : item}
          className="mt-10 font-serif italic text-h2 text-foreground text-right"
        >
          — karishma
        </motion.p>
      </motion.article>
    </section>
  );
}

/* ──────────────── Animation helpers ──────────────── */

/**
 * Subtle y-parallax over a section's scroll window, clamped so Framer
 * Motion 12's WAAPI backend doesn't reject out-of-range keyframe
 * offsets. Returns 0 under reduced-motion.
 */
function useParallaxY(
  progress: MotionValue<number>,
  reduced: boolean,
  range = 30,
): MotionValue<number> {
  return useTransform(
    progress,
    [0, 1],
    reduced ? [0, 0] : [range, -range],
  );
}

function variantSlide(fromX: number, reduced: boolean) {
  return {
    hidden: reduced ? {} : { opacity: 0, x: fromX },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: EASE_OUT_SOFT },
    },
  };
}

function variantFade(reduced: boolean) {
  return {
    hidden: reduced ? {} : { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE_OUT_SOFT },
    },
  };
}
