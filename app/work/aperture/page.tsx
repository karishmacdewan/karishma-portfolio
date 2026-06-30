import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aperture, a benchmarking tool for AI ingestion pipelines — Karishma Dewan",
  description:
    "Helping enterprise knowledge reach AI: a solo-built tool that benchmarks document ingestion architectures on evidence, not assumptions.",
};

const APERTURE_URL = "https://aperture-teal-delta.vercel.app";

/*
 * CASE STUDY — PRODUCT (essay-style, no imagery yet).
 *
 * Same register as the Owne case study: long-form narrative on a narrow
 * measure, no plates. A "role / stack / scope" mono strip stands in for
 * a bullet list of highlights — it borrows Aperture's own homepage
 * convention (font-mono spec row) so the case study visually rhymes with
 * the product it's describing, rather than reading like a generic résumé
 * dump.
 *
 * TODO(Karishma): drop in 2 real screenshots once captured —
 *   1. Homepage hero, dark mode (the proof card + headline).
 *   2. A run detail page: recommended-architecture panel + leaderboard
 *      (e.g. /runs/13ebe2a197d6) — this is the strongest "evidence" shot.
 * Insert as <figure> plates below the second/fourth paragraphs once the
 * files exist; this page intentionally ships text-only rather than with
 * placeholder boxes.
 */

export default function ApertureCaseStudy() {
  return (
    <article className="mx-auto max-w-6xl px-8 pt-[20vh] pb-32">
      <Link
        href="/work"
        className="group inline-flex items-center gap-2 font-sans text-caption uppercase text-muted hover:text-foreground transition-colors duration-fast ease-out-soft"
      >
        <span
          aria-hidden="true"
          className="transition-transform duration-fast ease-out-soft group-hover:-translate-x-0.5"
        >
          ←
        </span>
        <span>Work</span>
      </Link>

      <header className="mt-10 mb-12 max-w-4xl">
        <div className="flex items-center gap-8 font-sans text-caption uppercase text-muted mb-8">
          <span>
            <span className="text-accent">01</span> · Product
          </span>
          <span>2026</span>
        </div>
        <h1 className="font-serif text-display">Aperture</h1>
        <p className="font-serif text-h2 leading-[1.15] text-foreground mt-4">
          Helping enterprise knowledge reach AI.
        </p>
      </header>

      {/* Role / stack / scope — mono spec row, mirrors the product's own
          homepage convention rather than a bulleted résumé list. */}
      <div className="mb-16 flex max-w-3xl flex-wrap gap-x-10 gap-y-2 border-t border-b border-border py-5 font-mono text-[11px] text-muted">
        <span>
          <span className="text-muted/60">role</span> solo — product, backend, frontend, deploy
        </span>
        <span>
          <span className="text-muted/60">stack</span> FastAPI · Next.js · GCP · Vercel
        </span>
        <span>
          <span className="text-muted/60">scope</span> 5 stages · 14 components
        </span>
      </div>

      <div className="max-w-2xl flex flex-col gap-8 font-serif text-body-lg text-foreground leading-[1.7]">
        <p>
          Most AI teams spend months choosing a model and almost no time
          checking whether the information reaching it was processed well.
          Extraction, chunking, and embedding decisions quietly set a
          ceiling on retrieval quality — and in practice they get chosen
          by habit or vendor demo, not evidence.
        </p>

        <p>
          Aperture runs a representative document corpus through the
          ingestion strategies a team is actually choosing between, scores
          each one on quality, cost, and runtime, and recommends the
          architecture that earns the spot — instead of the one that
          happened to ship first.
        </p>

        <blockquote className="my-6 py-2 pl-8 border-l-2 border-accent font-serif italic text-h2 text-foreground leading-[1.2]">
          Better AI starts before the model.
        </blockquote>

        <p>
          The pipeline stays modular on purpose: extraction, chunking,
          metadata enrichment, embedding, and vector storage are
          independent, swappable stages. Each candidate is benchmarked
          against an all-defaults baseline rather than every possible
          combination, so the comparison stays interpretable as the
          number of options grows — the recommendation engine only ever
          scores configurations it actually ran, never a fabricated
          full cross-product. Components that depend on credentials the
          environment doesn&apos;t have — Azure Document Intelligence
          without a key, GPT-4o Vision without API access — degrade into
          a clearly flagged, excluded result instead of crashing the run
          or quietly dragging every score down equally.
        </p>

        <p>
          Built solo, end to end: the product strategy and interface, the
          FastAPI benchmarking backend, the scoring methodology, the
          Next.js frontend, and the deploy — a FastAPI service on a GCP
          Compute Engine VM behind Caddy, with the frontend on Vercel.
          It&apos;s live now, and the leaderboard it produces is the kind
          of evidence most teams currently skip straight past on their
          way to picking a model.
        </p>

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
      </div>

      <footer className="mt-32 max-w-2xl border-t border-border pt-12">
        <p className="font-sans text-caption uppercase text-muted mb-4">
          Next project
        </p>
        <Link
          href="/work/agent-conversational-companion"
          className="group inline-flex items-baseline gap-4 font-serif text-h2 text-foreground hover:text-accent transition-colors duration-fast ease-out-soft"
        >
          <span>A conversational companion for Owne, my hormonal-health brand.</span>
          <span
            aria-hidden="true"
            className="transition-transform duration-fast ease-out-soft group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </footer>
    </article>
  );
}
