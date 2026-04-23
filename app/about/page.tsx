"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

/*
 * ABOUT — five sections, five distinct registers.
 *
 *   01 · BACKGROUND   two-col w/ portrait + parallax + margin pull quote
 *   02 · FOUNDING     mirror two-col: visual left, body right
 *   03 · NOW          live stat list, pulsing recency dot (no paragraph)
 *   04 · WHY          full-viewport dramatic pull quote w/ halo halo behind
 *   05 · TODAY        personal journal entry, italic serif, signature
 *
 * Site-wide scroll progress rail (components/scroll-progress.tsx) is
 * mounted in the root layout — no wiring needed here.
 *
 * Client component because nearly every section uses scroll-linked
 * motion. Metadata is exported from a small re-export trick — Next 16
 * allows metadata only from server components, so the page itself has
 * to be a server component OR we omit the metadata export here and set
 * it via head (or a loading shim). For a single-route client page,
 * omitting the custom metadata in favour of the root layout's defaults
 * is acceptable; better: pair this with a `layout.tsx` for /about that
 * sets metadata. (See note below — metadata moved to app/about/layout.tsx)
 */

// Shared noise technique — matches the portrait/plate treatment used
// elsewhere on the site so the visuals read as a family.
const NOISE_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

// Live "now" list — labels italic serif muted, values Geist sans
// foreground. Separate from the narrative sections so the live
// register reads at a glance.
const NOW = [
  { label: "Currently in", value: "Brooklyn, NY" },
  { label: "Building", value: "A women's hormonal wellness brand (in market)" },
  { label: "Reading", value: "The Creative Act — Rick Rubin" },
  { label: "Listening to", value: "Alice Coltrane — Journey in Satchidananda" },
] as const;

const LAST_UPDATED = "April 2026";

// Journal entry date for §05 — matches the "last updated" so the pages
// feel in-sync. Displayed as "April 23, 2026 — Brooklyn, NY".
const JOURNAL_DATE = "April 23, 2026 — Brooklyn, NY";

export default function AboutPage() {
  return (
    <div>
      <PageHeader />
      <Section01Background />
      <Section02Founding />
      <Section03Now />
      <Section04Why />
      <Section05Today />
    </div>
  );
}

function PageHeader() {
  return (
    <header className="mx-auto max-w-6xl px-8 pt-[20vh] pb-24">
      <p className="font-sans text-caption uppercase text-muted mb-6">
        About
      </p>
      <h1 className="font-serif text-display">
        Karishma Dewan. Strategy, taste, and code.
      </h1>
    </header>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * 01 · BACKGROUND — two-column w/ portrait parallax + margin pull quote.
 *
 *   grid cols: [quote 16%] [body 44%] [portrait 36%] on md+ (100% total
 *   with 2% gaps). The pull quote sits in the left margin, echoing a
 *   sentence from the body — classic editorial treatment. On mobile,
 *   the quote sits above the body as a standalone block.
 *
 *   Parallax: the portrait translates from +20px → -20px as the section
 *   scrolls through the viewport (40px travel). Subtle. Disabled under
 *   prefers-reduced-motion.
 * ──────────────────────────────────────────────────────────────────── */

function Section01Background() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const portraitY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [20, -20],
  );

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-8 py-20 md:py-24">
      <p className="font-sans text-caption uppercase text-muted mb-10">
        <span className="text-accent">01</span> · Background
      </p>

      <div className="grid gap-y-10 md:gap-x-[2%] md:grid-cols-[16%_44%_36%]">
        {/* Margin pull quote — italic serif, muted, larger than body.
            On mobile, renders first as a standalone quote block. */}
        <blockquote className="md:pt-2 order-first md:order-none">
          <p className="font-serif italic text-h2 text-muted leading-[1.2]">
            &ldquo;products where decisions moved slowly and the stakes rode
            on execution&rdquo;
          </p>
        </blockquote>

        <p className="font-serif text-h3 text-foreground">
          Five years at Google in strategy, analytics, and go-to-market.
          Worked on products where decisions moved slowly and the stakes
          rode on execution — ads infrastructure, a consumer bet, a
          creator platform before it had a name.
        </p>

        {/* Portrait plate — parallax Y, warm-grey gradient + tint + grain.
            Same technique as the other image plates on the site. */}
        <figure className="flex flex-col">
          <div className="relative w-full aspect-[4/5] overflow-hidden">
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
          <figcaption className="mt-4 font-serif italic text-small text-muted">
            Photo forthcoming.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * 02 · FOUNDING — mirror layout (visual LEFT, body RIGHT).
 *
 *   Establishes an alternating-column rhythm with §01. Same plate
 *   technique but flipped horizontally so the eye pivots on each
 *   section change.
 * ──────────────────────────────────────────────────────────────────── */

function Section02Founding() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const artifactY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [20, -20],
  );

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-8 py-20 md:py-24">
      <p className="font-sans text-caption uppercase text-muted mb-10">
        <span className="text-accent">02</span> · Founding
      </p>

      <div className="grid gap-y-10 md:gap-x-[5%] md:grid-cols-[40%_55%]">
        {/* Plate LEFT — different gradient direction so this plate feels
            related to §01's portrait but not a duplicate. */}
        <figure className="flex flex-col order-last md:order-none">
          <div className="relative w-full aspect-[4/5] overflow-hidden">
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
          <figcaption className="mt-4 font-serif italic text-small text-muted">
            Founding artifact, 2023.
          </figcaption>
        </figure>

        <p className="font-serif text-h3 text-foreground">
          In 2023, left to start a women&apos;s hormonal wellness brand.
          Built it from first principles — research, brand, product,
          early revenue. Still active as founder; the company is how I
          keep my product instincts honest.
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * 03 · NOW — live-feed stat list.
 *
 *   The paragraph is gone. In its place: a 5-row grid of "label →
 *   value" pairs. Italic serif labels (muted), Geist sans values
 *   (foreground). Pulsing terracotta dot next to "Last updated" —
 *   the only animation in this section and the only thing telegraphing
 *   "this section is live."
 *
 *   Disabled under reduced-motion so the dot stays static.
 * ──────────────────────────────────────────────────────────────────── */

function Section03Now() {
  const reduced = useReducedMotion();

  return (
    <section className="mx-auto max-w-6xl px-8 py-20 md:py-24">
      <p className="font-sans text-caption uppercase text-muted mb-10">
        <span className="text-accent">03</span> · Now
      </p>

      {/* 30/70 split — label column fixed (9–12rem range), value fills.
          `contents` wrappers let each pair render as two direct grid
          children so the alignment stays clean. */}
      <dl className="grid grid-cols-[minmax(9rem,30%)_1fr] gap-y-5 gap-x-8 max-w-3xl">
        {NOW.map((row) => (
          <div key={row.label} className="contents">
            <dt className="font-serif italic text-body-lg text-muted self-center">
              {row.label}
            </dt>
            <dd className="font-sans text-body-lg text-foreground self-center">
              {row.value}
            </dd>
          </div>
        ))}
        <dt className="font-serif italic text-body-lg text-muted self-center">
          Last updated
        </dt>
        <dd className="flex items-center gap-3 font-sans text-body-lg text-foreground self-center">
          <motion.span
            aria-hidden="true"
            className="w-[10px] h-[10px] rounded-full bg-accent shrink-0"
            animate={
              reduced
                ? undefined
                : {
                    scale: [1, 1.35, 1],
                    opacity: [0.9, 0.5, 0.9],
                  }
            }
            transition={
              reduced
                ? undefined
                : {
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          />
          <span>{LAST_UPDATED}</span>
        </dd>
      </dl>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * 04 · WHY — full-viewport dramatic pull quote.
 *
 *   min-h-screen, centred. The paragraph sits at display-italic scale
 *   on a ~60vw measure. Behind it, a subtle atmospheric halo — the same
 *   radial gradient technique as the hero, at ~20% opacity, no
 *   animation. The philosophical heart of the page; nothing else shares
 *   the section.
 * ──────────────────────────────────────────────────────────────────── */

// Halo gradient — echoes the hero's but simpler and quieter. No ambient
// extension layer, no dark void core. Just a warm, soft circle.
const WHY_HALO = [
  "radial-gradient(circle closest-side at center,",
  " color-mix(in oklab, var(--accent) 35%, transparent) 0%,",
  " color-mix(in oklab, var(--accent) 15%, transparent) 35%,",
  " transparent 70%)",
].join("");

function Section04Why() {
  return (
    <section
      aria-labelledby="why-heading"
      className="relative min-h-screen flex items-center justify-center px-8 py-24 overflow-hidden"
    >
      {/* Atmospheric halo behind the quote — opacity clamped to ~20% so
          it reads as light, not a spotlight. Fills a centred square
          bounded to the smaller viewport dimension. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20"
      >
        <div
          className="w-[min(90vw,90vh)] aspect-square"
          style={{ backgroundImage: WHY_HALO }}
        />
      </div>

      {/* Measure: tight 60vw on md+ for the dramatic center-spread; on
          mobile a wider 85vw so the italic serif at h1 scale doesn't
          break to one word per line. */}
      <div className="relative z-10 w-full max-w-[85vw] md:max-w-[60vw] mx-auto">
        <p
          id="why-label"
          className="font-sans text-caption uppercase text-muted mb-10 text-center"
        >
          <span className="text-accent">04</span> · Why
        </p>
        <blockquote>
          <p
            id="why-heading"
            className="font-serif italic text-h2 md:text-display text-foreground text-center leading-[1.25] md:leading-[1.2]"
          >
            AI is going to reshape how products feel. Most teams
            building it today come from one direction — usually
            engineering. Strategy, product taste, and technical fluency
            rarely sit in one person. When they do, the work tends to
            show it.
          </p>
        </blockquote>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * 05 · TODAY — journal entry.
 *
 *   Date line, italic serif paragraph, right-offset signature. A smaller
 *   register than the rest of the page, deliberately intimate. Italic
 *   serif for the body too — this whole section reads as a personal
 *   note, not an editorial section.
 * ──────────────────────────────────────────────────────────────────── */

function Section05Today() {
  return (
    <section className="mx-auto max-w-6xl px-8 py-20 md:py-24">
      <p className="font-sans text-caption uppercase text-muted mb-10">
        <span className="text-accent">05</span> · Today
      </p>

      <article className="max-w-2xl">
        <p className="font-serif italic text-small text-muted mb-8 tracking-wide">
          {JOURNAL_DATE}
        </p>
        <p className="font-serif italic text-h3 text-foreground leading-[1.5]">
          Draft of a positioning doc open for the third day. The founders
          keep gesturing toward a sentence they haven&apos;t written yet
          — and the whole thing turns on it. That&apos;s most of the
          work. The rest is decoration. Coffee, a walk, try again
          tomorrow.
        </p>
        <p className="mt-12 font-serif italic text-h2 text-foreground text-right">
          — karishma
        </p>
      </article>
    </section>
  );
}
