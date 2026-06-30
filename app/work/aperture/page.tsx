"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const APERTURE_URL = "https://aperture-teal-delta.vercel.app";

/*
 * CASE STUDY — APERTURE (editorial refinement pass).
 *
 * Same 7-beat narrative as before, but tuned for visual rhythm rather
 * than uniform weight: Hero and Insight are the two "loud" full-screen
 * beats (the only sections that keep snap-start), everything else flows
 * at normal density with padding scaled to how much weight that section
 * should carry — Problem/Solution/Highlights medium, Technical compact,
 * Outcome large again on the way out. Screenshots are sized down and
 * treated as figures (image → small caption → explanation) rather than
 * full-bleed inserts. The pipeline diagram now reads as a left-to-right
 * flow that terminates in a Recommendation artifact, not five inert dots.
 */

const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PROCESS_STAGES = ["Extract", "Chunk", "Enrich", "Embed", "Store"] as const;

const EVIDENCE_ROWS = [
  {
    label: "Choosing a model",
    note: "Weeks of comparisons, benchmarks, demos.",
    widthPct: 92,
  },
  {
    label: "Choosing an ingestion pipeline",
    note: "Usually picked by habit, on day one.",
    widthPct: 12,
  },
] as const;

const TECH_CARDS = [
  {
    label: "Architecture",
    takeaway: "Every stage is swappable.",
    body: "Extraction, chunking, enrichment, embedding, and storage are independent — replace one without rewriting the rest of the pipeline.",
  },
  {
    label: "Benchmarking methodology",
    takeaway: "Results stay interpretable as options grow.",
    body: "Each candidate is scored against an all-defaults baseline, not every possible combination across stages.",
  },
  {
    label: "Deployment",
    takeaway: "Built to actually run.",
    body: "FastAPI on a GCP Compute Engine VM behind Caddy; Next.js frontend on Vercel.",
  },
  {
    label: "Graceful degradation",
    takeaway: "Missing credentials don't break a run.",
    body: "Components without access — Azure Document Intelligence, GPT-4o Vision — drop out as a flagged, excluded result instead of crashing or skewing every score equally.",
  },
  {
    label: "Scoring model",
    takeaway: "One score, with its confidence attached.",
    body: "Quality, cost, and runtime combine into a single number per configuration, alongside a confidence rating on the final recommendation.",
  },
] as const;

export default function ApertureCaseStudy() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    // Proximity, not mandatory: only Hero and Insight declare snap
    // points on this page. Mandatory snap requires the scroll position
    // to always rest on *a* snap point, which — with no snap point
    // anywhere after Insight — traps scrolling there. Proximity snaps
    // near a declared point without blocking scroll past sections that
    // don't have one.
    const html = document.documentElement;
    html.setAttribute("data-scroll-snap", "y-proximity");
    return () => {
      html.removeAttribute("data-scroll-snap");
    };
  }, [reduced]);

  return (
    <>
      <SectionHero reduced={!!reduced} />
      <SectionProblem reduced={!!reduced} />
      <SectionInsight reduced={!!reduced} />
      <SectionSolution reduced={!!reduced} />
      <SectionHighlights reduced={!!reduced} />
      <SectionTechnical reduced={!!reduced} />
      <SectionOutcome reduced={!!reduced} />
    </>
  );
}

/* ──────────────── Shared helpers ──────────────── */

type ReducedProps = { reduced: boolean };

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
      <span className="text-accent">{String(index).padStart(2, "0")}</span>{" "}
      · {name}
    </motion.p>
  );
}

function variantFade(reduced: boolean) {
  return {
    hidden: reduced ? {} : { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE_OUT_SOFT },
    },
  };
}

const containerStagger = (stagger = 0.12, delay = 0.08) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/* ──────────────── 01 · Hero — loud ──────────────── */

function SectionHero({ reduced }: ReducedProps) {
  const words = "Better AI starts before the model.".split(" ");
  const wordContainer = containerStagger(0.06, 0.15);
  const wordItem = {
    hidden: reduced ? {} : { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE_OUT_SOFT },
    },
  };

  return (
    <section className="min-h-screen snap-start snap-always relative mx-auto max-w-6xl w-full px-8 pt-24 pb-12 flex flex-col justify-center">
      <Link
        href="/work"
        className="group absolute left-8 top-8 inline-flex items-center gap-2 font-sans text-caption uppercase text-muted hover:text-foreground transition-colors duration-fast ease-out-soft"
      >
        <span
          aria-hidden="true"
          className="transition-transform duration-fast ease-out-soft group-hover:-translate-x-0.5"
        >
          ←
        </span>
        <span>Work</span>
      </Link>

      <Link
        href={APERTURE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group absolute right-8 top-8 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 font-sans text-caption uppercase text-muted hover:border-accent hover:text-accent transition-colors duration-fast ease-out-soft"
      >
        <span>Visit Aperture</span>
        <span
          aria-hidden="true"
          className="transition-transform duration-fast ease-out-soft group-hover:translate-x-0.5"
        >
          ↗
        </span>
      </Link>

      <div className="flex items-center gap-8 font-sans text-caption uppercase text-muted mb-6">
        <span>
          <span className="text-accent">01</span> · Product
        </span>
        <span>2026</span>
      </div>

      <motion.h1
        variants={reduced ? undefined : wordContainer}
        initial={reduced ? false : "hidden"}
        animate={reduced ? undefined : "visible"}
        className="font-serif text-display md:text-hero leading-[1.02] max-w-5xl"
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={reduced ? undefined : wordItem}
            className="inline-block mr-[0.22em]"
          >
            {word}
          </motion.span>
        ))}
      </motion.h1>

      <motion.p
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT_SOFT, delay: 0.7 }}
        className="font-serif text-h3 text-secondary mt-6 max-w-2xl"
      >
        Aperture benchmarks AI ingestion pipelines — extraction, chunking,
        embedding — on evidence instead of vendor demos.
      </motion.p>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT_SOFT, delay: 0.85 }}
        className="mt-8 flex max-w-3xl flex-wrap gap-x-10 gap-y-2 border-t border-b border-border py-4 font-mono text-[11px] text-secondary"
      >
        <span>
          <span className="text-muted">role</span> solo — product, backend,
          frontend, deploy
        </span>
        <span>
          <span className="text-muted">stack</span> FastAPI · Next.js · GCP
          · Vercel
        </span>
        <span>
          <span className="text-muted">scope</span> 5 stages · 14
          components
        </span>
      </motion.div>

      <motion.figure
        initial={reduced ? false : { opacity: 0, y: 22 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: EASE_OUT_SOFT, delay: 0.1 }}
        className="mt-8 mx-auto w-full max-w-4xl"
      >
        <div className="overflow-hidden rounded-lg border border-foreground/15 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.5)]">
          <Image
            src="/work/aperture/hero.png"
            alt="Aperture homepage in dark mode, showing the extract-chunk-enrich-embed-store pipeline and a last-run proof card scoring 87/100."
            width={2940}
            height={1602}
            priority
            className="w-full h-auto"
            sizes="(min-width: 1024px) 56rem, 100vw"
          />
        </div>
        <figcaption className="mt-3 font-serif italic text-small text-muted">
          Homepage, dark mode.
        </figcaption>
      </motion.figure>
    </section>
  );
}

/* ──────────────── 02 · The problem — medium ──────────────── */

function SectionProblem({ reduced }: ReducedProps) {
  const container = containerStagger();
  const fade = variantFade(reduced);

  return (
    <section className="mx-auto max-w-6xl w-full px-8 py-16">
      <SectionLabel
        index={2}
        name="The problem"
        reduced={reduced}
        className="mb-6"
      />

      <motion.div
        variants={reduced ? undefined : container}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, amount: 0.4 }}
        className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] items-center"
      >
        <div className="flex flex-col gap-5 max-w-xl">
          <motion.h2
            variants={fade}
            className="font-serif text-h2 text-foreground leading-[1.2]"
          >
            Everyone benchmarks the model. Almost no one benchmarks what
            reaches it.
          </motion.h2>
          <motion.p
            variants={fade}
            className="font-serif text-body-lg text-secondary leading-[1.65]"
          >
            Extraction, chunking, and embedding choices quietly set a
            ceiling on retrieval quality — and most teams pick them by
            habit or vendor demo, not evidence.
          </motion.p>
        </div>

        <motion.div variants={fade} className="flex flex-col gap-6">
          {EVIDENCE_ROWS.map((row) => (
            <div key={row.label}>
              <div className="flex justify-between font-sans text-small text-muted mb-2">
                <span className="text-foreground">{row.label}</span>
                <span>{row.note}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-border/50 overflow-hidden">
                <motion.div
                  initial={reduced ? false : { width: 0 }}
                  whileInView={
                    reduced ? undefined : { width: `${row.widthPct}%` }
                  }
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.9, ease: EASE_OUT_SOFT }}
                  style={reduced ? { width: `${row.widthPct}%` } : undefined}
                  className="h-full rounded-full bg-accent"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ──────────────── 03 · The insight — the centrepiece ──────────────── */

const INSIGHT_HALO = [
  "radial-gradient(circle closest-side at center,",
  " color-mix(in oklab, var(--accent) 40%, transparent) 0%,",
  " color-mix(in oklab, var(--accent) 18%, transparent) 35%,",
  " transparent 70%)",
].join("");

function SectionInsight({ reduced }: ReducedProps) {
  const haloAnim = reduced
    ? undefined
    : {
        initial: { opacity: 0, scale: 0.88 },
        whileInView: { opacity: 0.26, scale: 1 },
        viewport: { once: true, amount: 0.5 },
        transition: { duration: 1.4, ease: EASE_OUT_SOFT },
      };
  const quoteAnim = reduced
    ? undefined
    : {
        initial: { opacity: 0, scale: 0.9 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true, amount: 0.5 },
        transition: { duration: 1.1, ease: EASE_OUT_SOFT, delay: 0.15 },
      };

  return (
    <section className="min-h-screen snap-start snap-always relative flex items-center justify-center px-8 overflow-hidden">
      <motion.div
        aria-hidden="true"
        {...(haloAnim ?? {})}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={reduced ? { opacity: 0.26 } : undefined}
      >
        <div
          className="w-[min(92vw,92vh)] aspect-square"
          style={{ backgroundImage: INSIGHT_HALO }}
        />
      </motion.div>

      <motion.div
        {...(quoteAnim ?? {})}
        className="relative z-10 w-full max-w-[90vw] md:max-w-[62vw] mx-auto text-center"
      >
        <p className="font-sans text-caption uppercase text-muted mb-8">
          <span className="text-accent">03</span> · The insight
        </p>
        <blockquote>
          <p className="font-serif italic text-h1 md:text-display text-foreground leading-[1.05] md:leading-[1.05]">
            A model can&apos;t retrieve what ingestion already lost.
          </p>
        </blockquote>
        <p className="font-sans text-caption uppercase tracking-wide text-muted mt-14 max-w-sm mx-auto">
          Errors made at the first stage stay invisible — until they
          surface as a wrong answer three stages later.
        </p>
      </motion.div>
    </section>
  );
}

/* ──────────────── 04 · The solution — medium ──────────────── */

function SectionSolution({ reduced }: ReducedProps) {
  const container = containerStagger();
  const fade = variantFade(reduced);
  const nodeContainer = containerStagger(0.09, 0.15);
  const node = {
    hidden: reduced ? {} : { opacity: 0, scale: 0.7 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.45, ease: EASE_OUT_SOFT },
    },
  };
  const arrow = {
    hidden: reduced ? {} : { opacity: 0, x: -6 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: EASE_OUT_SOFT },
    },
  };

  return (
    <section className="mx-auto max-w-6xl w-full px-8 py-16">
      <SectionLabel
        index={4}
        name="The solution"
        reduced={reduced}
        className="mb-6"
      />

      <motion.div
        variants={reduced ? undefined : container}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, amount: 0.4 }}
        className="flex flex-col gap-10"
      >
        <motion.h2
          variants={fade}
          className="font-serif text-h2 text-foreground leading-[1.2] max-w-3xl"
        >
          Five independent stages. One scored recommendation.
        </motion.h2>

        {/* Pipeline flow — process stages on the left, connected by
            chevron arrows that read as motion rather than static dots,
            terminating in a visually distinct Recommendation artifact. */}
        <motion.div
          variants={reduced ? undefined : nodeContainer}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "visible"}
          viewport={{ once: true, amount: 0.5 }}
          className="flex items-center w-full overflow-x-auto pb-2"
          aria-label="Pipeline: extract, chunk, enrich, embed, store, then a scored recommendation"
        >
          {PROCESS_STAGES.map((stage) => (
            <div key={stage} className="flex items-center shrink-0">
              <motion.div
                variants={reduced ? undefined : node}
                className="flex flex-col items-center gap-2.5 shrink-0"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-muted" />
                <span className="font-mono text-[11px] uppercase tracking-wide text-muted whitespace-nowrap">
                  {stage}
                </span>
              </motion.div>
              <motion.span
                variants={reduced ? undefined : arrow}
                aria-hidden="true"
                className="mx-3 sm:mx-5 text-muted/50 font-mono text-sm shrink-0"
              >
                →
              </motion.span>
            </div>
          ))}

          <motion.div
            variants={reduced ? undefined : node}
            className="flex flex-col items-center gap-2.5 shrink-0"
          >
            <div className="rounded-full bg-accent px-4 py-1.5">
              <span className="font-mono text-[11px] uppercase tracking-wide text-background whitespace-nowrap">
                Recommendation
              </span>
            </div>
          </motion.div>
        </motion.div>

        <motion.p
          variants={fade}
          className="font-serif text-body-lg text-secondary leading-[1.65] max-w-2xl"
        >
          Every candidate runs against the same document corpus and is
          scored against an all-defaults baseline — not every possible
          combination — so the comparison stays interpretable as the
          number of options grows.
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ──────────────── 05 · Product highlights — editorial figures ──────────────── */

function HighlightFigure({
  figureNumber,
  caption,
  body,
  src,
  alt,
  reduced,
  align,
}: {
  figureNumber: string;
  caption: string;
  body: string;
  src: string;
  alt: string;
  reduced: boolean;
  align: "left" | "right";
}) {
  const container = containerStagger(0.12, 0.05);
  const fade = variantFade(reduced);

  return (
    <motion.figure
      variants={reduced ? undefined : container}
      initial={reduced ? false : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      viewport={{ once: true, amount: 0.3 }}
      className="flex flex-col"
    >
      <motion.div
        variants={fade}
        className="mx-auto w-full max-w-3xl overflow-hidden rounded-lg border border-foreground/15 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.5)]"
      >
        <Image
          src={src}
          alt={alt}
          width={2940}
          height={1602}
          className="w-full h-auto"
          sizes="(min-width: 1024px) 48rem, 100vw"
        />
      </motion.div>

      <motion.figcaption
        variants={fade}
        className={`mt-5 max-w-md flex flex-col gap-2 ${
          align === "right" ? "ml-auto text-left" : "mr-auto"
        }`}
      >
        <p className="font-mono text-[11px] uppercase tracking-wide text-muted">
          <span className="text-accent">{figureNumber}</span> — {caption}
        </p>
        <p className="font-serif text-body text-secondary leading-[1.6]">
          {body}
        </p>
      </motion.figcaption>
    </motion.figure>
  );
}

function SectionHighlights({ reduced }: ReducedProps) {
  return (
    <section className="mx-auto max-w-6xl w-full px-8 py-16 flex flex-col gap-14">
      <SectionLabel index={5} name="Product highlights" reduced={reduced} />

      <HighlightFigure
        figureNumber="Fig. 01"
        caption="The recommendation."
        body="Aperture doesn't just rank configurations — it commits to one, with a confidence score attached, not a spreadsheet to interpret."
        src="/work/aperture/recommendation.png"
        alt="Run detail page showing the recommended architecture: Native Text Extraction, Heading-Based Chunking, Rule-Based Metadata, OpenAI Small Embeddings, and Qdrant, scoring 87/100 with medium confidence."
        reduced={reduced}
        align="left"
      />

      <HighlightFigure
        figureNumber="Fig. 02"
        caption="The evidence behind it."
        body="Every configuration actually run, ranked on quality, cost, and runtime — nothing fabricated, nothing assumed."
        src="/work/aperture/leaderboard.png"
        alt="Configuration leaderboard ranking every benchmarked ingestion stack by overall score, quality, runtime, cost, and confidence."
        reduced={reduced}
        align="right"
      />
    </section>
  );
}

/* ──────────────── 06 · Technical decisions — compact ──────────────── */

function SectionTechnical({ reduced }: ReducedProps) {
  const container = containerStagger(0.07, 0.08);
  const fade = variantFade(reduced);
  const card = {
    hidden: reduced ? {} : { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE_OUT_SOFT },
    },
  };

  return (
    <section className="mx-auto max-w-6xl w-full px-8 py-14">
      <SectionLabel
        index={6}
        name="Technical decisions"
        reduced={reduced}
        className="mb-5"
      />

      <motion.div
        variants={reduced ? undefined : container}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          variants={fade}
          className="font-serif text-h2 text-foreground leading-[1.2] max-w-2xl mb-7"
        >
          Decisions that hold up under inspection.
        </motion.h2>

        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 border border-border rounded-lg overflow-hidden">
          {TECH_CARDS.map((c) => (
            <motion.div
              key={c.label}
              variants={card}
              className="bg-background p-5 flex flex-col gap-1.5"
            >
              <p className="font-sans text-caption uppercase text-accent mb-1">
                {c.label}
              </p>
              <p className="font-sans text-body font-medium text-foreground leading-[1.4]">
                {c.takeaway}
              </p>
              <p className="font-sans text-small text-secondary leading-[1.55]">
                {c.body}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ──────────────── 07 · Outcome — large again on the way out ──────────────── */

function SectionOutcome({ reduced }: ReducedProps) {
  const container = containerStagger();
  const fade = variantFade(reduced);

  return (
    <section className="mx-auto max-w-6xl w-full px-8 py-24">
      <SectionLabel
        index={7}
        name="Outcome"
        reduced={reduced}
        className="mb-7"
      />

      <motion.div
        variants={reduced ? undefined : container}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, amount: 0.4 }}
        className="flex flex-col gap-6 max-w-3xl"
      >
        <motion.h2
          variants={fade}
          className="font-serif text-h1 text-foreground leading-[1.15]"
        >
          It&apos;s live — and the leaderboard it produces is the evidence
          most teams skip on their way to picking a model.
        </motion.h2>

        <motion.p
          variants={fade}
          className="font-sans text-small text-muted leading-[1.6] max-w-xl"
        >
          Designed, engineered, and deployed solo: product strategy,
          interface, FastAPI benchmarking backend, scoring methodology,
          Next.js frontend, and the deploy itself.
        </motion.p>

        <motion.div variants={fade}>
          <Link
            href={APERTURE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-3 mt-4 rounded-full border border-border px-6 py-3 font-sans text-small text-foreground hover:border-accent hover:text-accent transition-colors duration-fast ease-out-soft"
          >
            <span>Visit Aperture</span>
            <span
              aria-hidden="true"
              className="transition-transform duration-fast ease-out-soft group-hover:translate-x-1"
            >
              ↗
            </span>
          </Link>
        </motion.div>

        <motion.footer
          variants={fade}
          className="mt-14 border-t border-border pt-8"
        >
          <p className="font-sans text-caption uppercase text-muted mb-4">
            Next project
          </p>
          <Link
            href="/work/agent-conversational-companion"
            className="group inline-flex items-baseline gap-4 font-serif text-h3 text-foreground hover:text-accent transition-colors duration-fast ease-out-soft"
          >
            <span>
              A conversational companion for Owne, my hormonal-health brand.
            </span>
            <span
              aria-hidden="true"
              className="transition-transform duration-fast ease-out-soft group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </motion.footer>
      </motion.div>
    </section>
  );
}
