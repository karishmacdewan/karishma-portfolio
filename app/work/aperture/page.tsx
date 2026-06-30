"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const APERTURE_URL = "https://aperture-teal-delta.vercel.app";

/*
 * CASE STUDY — APERTURE (narrative redesign).
 *
 * Rebuilt as a premium product case study, not documentation: one large
 * statement up front, a problem/insight/solution arc that shows instead
 * of explains, exactly two screenshots earning their place in "Product
 * highlights," scannable technical-decision cards, and a tight close.
 *
 * Structural choice: borrows About's vertical scroll-snap register
 * (min-h-screen snap-start snap-always sections, each with a distinct
 * entrance choreography) so the page has the momentum the old essay-style
 * version lacked. Diagrams are pure CSS/SVG, no images — they replace the
 * paragraphs the brief asked to cut. Reduced-motion disables snap and all
 * whileInView variants, same as About.
 */

const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PIPELINE_STAGES = ["Extract", "Chunk", "Enrich", "Embed", "Store"] as const;

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
    body: "Five independent, swappable stages — extraction, chunking, enrichment, embedding, storage. Any candidate can be replaced without rewriting the pipeline around it.",
  },
  {
    label: "Benchmarking methodology",
    body: "Every candidate runs against the same document corpus and is scored against an all-defaults baseline, not every possible combination — so results stay interpretable as the option count grows.",
  },
  {
    label: "Deployment",
    body: "FastAPI benchmarking service on a GCP Compute Engine VM behind Caddy. Next.js frontend on Vercel.",
  },
  {
    label: "Graceful degradation",
    body: "Components missing credentials — Azure Document Intelligence, GPT-4o Vision — drop out as a flagged, excluded result instead of crashing the run or dragging every score down equally.",
  },
  {
    label: "Scoring model",
    body: "Quality, cost, and runtime combine into one score per configuration, with a confidence rating attached to the final recommendation.",
  },
] as const;

export default function ApertureCaseStudy() {
  const reduced = useReducedMotion();

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
    hidden: reduced ? {} : { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: EASE_OUT_SOFT },
    },
  };
}

const containerStagger = (stagger = 0.14, delay = 0.1) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/* ──────────────── 01 · Hero ──────────────── */

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
    <section className="min-h-screen snap-start snap-always relative mx-auto max-w-6xl w-full px-8 pt-32 pb-16 flex flex-col justify-center">
      <Link
        href="/work"
        className="group absolute left-8 top-10 inline-flex items-center gap-2 font-sans text-caption uppercase text-muted hover:text-foreground transition-colors duration-fast ease-out-soft"
      >
        <span
          aria-hidden="true"
          className="transition-transform duration-fast ease-out-soft group-hover:-translate-x-0.5"
        >
          ←
        </span>
        <span>Work</span>
      </Link>

      <div className="flex items-center gap-8 font-sans text-caption uppercase text-muted mb-8">
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
        className="font-serif text-h3 text-secondary mt-8 max-w-2xl"
      >
        Aperture benchmarks AI ingestion pipelines — extraction, chunking,
        embedding — on evidence instead of vendor demos.
      </motion.p>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT_SOFT, delay: 0.85 }}
        className="mt-12 flex max-w-3xl flex-wrap gap-x-10 gap-y-2 border-t border-b border-border py-5 font-mono text-[11px] text-muted"
      >
        <span>
          <span className="text-muted/60">role</span> solo — product, backend,
          frontend, deploy
        </span>
        <span>
          <span className="text-muted/60">stack</span> FastAPI · Next.js · GCP
          · Vercel
        </span>
        <span>
          <span className="text-muted/60">scope</span> 5 stages · 14
          components
        </span>
      </motion.div>

      <motion.figure
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: EASE_OUT_SOFT, delay: 0.1 }}
        className="mt-12"
      >
        <div className="overflow-hidden rounded-lg border border-border">
          <Image
            src="/work/aperture/hero.png"
            alt="Aperture homepage in dark mode, showing the extract-chunk-enrich-embed-store pipeline and a last-run proof card scoring 87/100."
            width={2940}
            height={1602}
            priority
            className="w-full h-auto"
            sizes="(min-width: 1024px) 72rem, 100vw"
          />
        </div>
      </motion.figure>
    </section>
  );
}

/* ──────────────── 02 · The problem ──────────────── */

function SectionProblem({ reduced }: ReducedProps) {
  const container = containerStagger();
  const fade = variantFade(reduced);

  return (
    <section className="min-h-screen snap-start snap-always mx-auto max-w-6xl w-full px-8 pt-24 pb-16 flex flex-col justify-center">
      <SectionLabel
        index={2}
        name="The problem"
        reduced={reduced}
        className="mb-10"
      />

      <motion.div
        variants={reduced ? undefined : container}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, amount: 0.4 }}
        className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] items-center"
      >
        <div className="flex flex-col gap-6 max-w-xl">
          <motion.h2
            variants={fade}
            className="font-serif text-h2 text-foreground leading-[1.2]"
          >
            Everyone benchmarks the model. Almost no one benchmarks what
            reaches it.
          </motion.h2>
          <motion.p
            variants={fade}
            className="font-serif text-body-lg text-secondary leading-[1.7]"
          >
            Extraction, chunking, and embedding choices quietly set a
            ceiling on retrieval quality — and most teams pick them by
            habit or vendor demo, not evidence.
          </motion.p>
        </div>

        <motion.div variants={fade} className="flex flex-col gap-8">
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

/* ──────────────── 03 · The insight ──────────────── */

const INSIGHT_HALO = [
  "radial-gradient(circle closest-side at center,",
  " color-mix(in oklab, var(--accent) 35%, transparent) 0%,",
  " color-mix(in oklab, var(--accent) 15%, transparent) 35%,",
  " transparent 70%)",
].join("");

function SectionInsight({ reduced }: ReducedProps) {
  const haloAnim = reduced
    ? undefined
    : {
        initial: { opacity: 0, scale: 0.9 },
        whileInView: { opacity: 0.2, scale: 1 },
        viewport: { once: true, amount: 0.5 },
        transition: { duration: 1.3, ease: EASE_OUT_SOFT },
      };
  const quoteAnim = reduced
    ? undefined
    : {
        initial: { opacity: 0, scale: 0.92 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true, amount: 0.5 },
        transition: { duration: 1, ease: EASE_OUT_SOFT, delay: 0.1 },
      };

  return (
    <section className="min-h-screen snap-start snap-always relative flex items-center justify-center px-8 overflow-hidden">
      <motion.div
        aria-hidden="true"
        {...(haloAnim ?? {})}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={reduced ? { opacity: 0.2 } : undefined}
      >
        <div
          className="w-[min(80vw,80vh)] aspect-square"
          style={{ backgroundImage: INSIGHT_HALO }}
        />
      </motion.div>

      <motion.div
        {...(quoteAnim ?? {})}
        className="relative z-10 w-full max-w-[85vw] md:max-w-[55vw] mx-auto text-center"
      >
        <p className="font-sans text-caption uppercase text-muted mb-10">
          <span className="text-accent">03</span> · The insight
        </p>
        <blockquote>
          <p className="font-serif italic text-h2 md:text-display text-foreground leading-[1.2]">
            A model can&apos;t retrieve what ingestion already lost.
          </p>
        </blockquote>
        <p className="font-sans text-small text-muted mt-10 max-w-md mx-auto">
          Errors made at the first stage stay invisible — until they
          surface as a wrong answer three stages later.
        </p>
      </motion.div>
    </section>
  );
}

/* ──────────────── 04 · The solution ──────────────── */

function SectionSolution({ reduced }: ReducedProps) {
  const container = containerStagger();
  const fade = variantFade(reduced);
  const nodeContainer = containerStagger(0.1, 0.2);
  const node = {
    hidden: reduced ? {} : { opacity: 0, scale: 0.7 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: EASE_OUT_SOFT },
    },
  };

  return (
    <section className="min-h-screen snap-start snap-always mx-auto max-w-6xl w-full px-8 pt-24 pb-16 flex flex-col justify-center">
      <SectionLabel
        index={4}
        name="The solution"
        reduced={reduced}
        className="mb-10"
      />

      <motion.div
        variants={reduced ? undefined : container}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, amount: 0.4 }}
        className="flex flex-col gap-16"
      >
        <motion.h2
          variants={fade}
          className="font-serif text-h2 text-foreground leading-[1.2] max-w-3xl"
        >
          Five independent stages. One scored recommendation.
        </motion.h2>

        <motion.div
          variants={reduced ? undefined : nodeContainer}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "visible"}
          viewport={{ once: true, amount: 0.5 }}
          className="flex items-center w-full max-w-4xl"
          aria-label="Pipeline stages: extract, chunk, enrich, embed, store"
        >
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage} className="flex items-center flex-1 last:flex-none">
              <motion.div
                variants={reduced ? undefined : node}
                className="flex flex-col items-center gap-3 shrink-0"
              >
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="font-mono text-[11px] uppercase tracking-wide text-muted">
                  {stage}
                </span>
              </motion.div>
              {i < PIPELINE_STAGES.length - 1 && (
                <div className="flex-1 h-px bg-border mx-3" />
              )}
            </div>
          ))}
        </motion.div>

        <motion.p
          variants={fade}
          className="font-serif text-body-lg text-secondary leading-[1.7] max-w-2xl"
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

/* ──────────────── 05 · Product highlights ──────────────── */

function HighlightShot({
  eyebrow,
  heading,
  body,
  src,
  alt,
  reduced,
  fromLeft,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  src: string;
  alt: string;
  reduced: boolean;
  fromLeft: boolean;
}) {
  const textVariant = {
    hidden: reduced ? {} : { opacity: 0, x: fromLeft ? -32 : 32 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: EASE_OUT_SOFT },
    },
  };
  const shotVariant = {
    hidden: reduced ? {} : { opacity: 0, x: fromLeft ? 32 : -32 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: EASE_OUT_SOFT },
    },
  };
  const container = containerStagger(0.14, 0.05);

  const text = (
    <motion.div
      variants={reduced ? undefined : textVariant}
      className="flex flex-col gap-3 max-w-xs shrink-0"
    >
      <p className="font-sans text-caption uppercase text-accent">
        {eyebrow}
      </p>
      <h3 className="font-serif text-h3 text-foreground leading-[1.25]">
        {heading}
      </h3>
      <p className="font-sans text-small text-secondary leading-[1.6]">
        {body}
      </p>
    </motion.div>
  );

  const shot = (
    <motion.figure
      variants={reduced ? undefined : shotVariant}
      className="flex-1 min-w-0"
    >
      <div className="overflow-hidden rounded-lg border border-border">
        <Image
          src={src}
          alt={alt}
          width={2940}
          height={1602}
          className="w-full h-auto"
          sizes="(min-width: 1024px) 56rem, 100vw"
        />
      </div>
    </motion.figure>
  );

  return (
    <motion.div
      variants={reduced ? undefined : container}
      initial={reduced ? false : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      viewport={{ once: true, amount: 0.35 }}
      className="flex flex-col md:flex-row gap-8 md:gap-12 items-center"
    >
      {fromLeft ? (
        <>
          {text}
          {shot}
        </>
      ) : (
        <>
          {shot}
          {text}
        </>
      )}
    </motion.div>
  );
}

function SectionHighlights({ reduced }: ReducedProps) {
  return (
    <section className="min-h-screen snap-start snap-always mx-auto max-w-6xl w-full px-8 pt-24 pb-16 flex flex-col justify-center gap-16">
      <SectionLabel index={5} name="Product highlights" reduced={reduced} />

      <HighlightShot
        eyebrow="The recommendation"
        heading="Commits to one answer."
        body="Aperture doesn't just rank configurations — it recommends one, with a confidence score attached, not a spreadsheet to interpret."
        src="/work/aperture/recommendation.png"
        alt="Run detail page showing the recommended architecture: Native Text Extraction, Heading-Based Chunking, Rule-Based Metadata, OpenAI Small Embeddings, and Qdrant, scoring 87/100 with medium confidence."
        reduced={reduced}
        fromLeft={true}
      />

      <HighlightShot
        eyebrow="The evidence"
        heading="Nothing fabricated, nothing assumed."
        body="Every configuration actually run, ranked on quality, cost, and runtime — the leaderboard behind the recommendation."
        src="/work/aperture/leaderboard.png"
        alt="Configuration leaderboard ranking every benchmarked ingestion stack by overall score, quality, runtime, cost, and confidence."
        reduced={reduced}
        fromLeft={false}
      />
    </section>
  );
}

/* ──────────────── 06 · Technical decisions ──────────────── */

function SectionTechnical({ reduced }: ReducedProps) {
  const container = containerStagger(0.08, 0.1);
  const fade = variantFade(reduced);
  const card = {
    hidden: reduced ? {} : { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASE_OUT_SOFT },
    },
  };

  return (
    <section className="min-h-screen snap-start snap-always mx-auto max-w-6xl w-full px-8 pt-24 pb-16 flex flex-col justify-center">
      <SectionLabel
        index={6}
        name="Technical decisions"
        reduced={reduced}
        className="mb-10"
      />

      <motion.div
        variants={reduced ? undefined : container}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          variants={fade}
          className="font-serif text-h2 text-foreground leading-[1.2] max-w-2xl mb-10"
        >
          Decisions that hold up under inspection.
        </motion.h2>

        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 border border-border rounded-lg overflow-hidden">
          {TECH_CARDS.map((c) => (
            <motion.div
              key={c.label}
              variants={card}
              className="bg-background p-6 flex flex-col gap-3"
            >
              <p className="font-sans text-caption uppercase text-accent">
                {c.label}
              </p>
              <p className="font-sans text-small text-secondary leading-[1.6]">
                {c.body}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ──────────────── 07 · Outcome ──────────────── */

function SectionOutcome({ reduced }: ReducedProps) {
  const container = containerStagger();
  const fade = variantFade(reduced);

  return (
    <section className="min-h-screen snap-start snap-always mx-auto max-w-6xl w-full px-8 pt-24 pb-20 flex flex-col justify-center">
      <SectionLabel
        index={7}
        name="Outcome"
        reduced={reduced}
        className="mb-10"
      />

      <motion.div
        variants={reduced ? undefined : container}
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, amount: 0.4 }}
        className="flex flex-col gap-8 max-w-2xl"
      >
        <motion.h2
          variants={fade}
          className="font-serif text-h2 text-foreground leading-[1.2]"
        >
          Designed, engineered, and deployed — solo.
        </motion.h2>

        <motion.p
          variants={fade}
          className="font-serif text-body-lg text-secondary leading-[1.7]"
        >
          Product strategy, interface, FastAPI benchmarking backend,
          scoring methodology, Next.js frontend, deploy. Aperture is live,
          and the leaderboard it produces is the evidence most teams skip
          on their way to picking a model.
        </motion.p>

        <motion.div variants={fade}>
          <Link
            href={APERTURE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-3 mt-2 rounded-full border border-border px-6 py-3 font-sans text-small text-foreground hover:border-accent hover:text-accent transition-colors duration-fast ease-out-soft"
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
          className="mt-16 border-t border-border pt-10"
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
