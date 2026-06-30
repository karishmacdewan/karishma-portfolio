import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rebuilt onboarding for an AI creative suite — Karishma Dewan",
  description:
    "First-run strategy and shipped prototype for a generative creative tools company.",
};

/*
 * CASE STUDY — PRODUCT (visual-forward).
 *
 * Body register: short paragraph → large image plate → short paragraph →
 * plate, photo-essay style. Image plates are the portrait-plate technique
 * (warm-grey gradient + tint + SVG fractal noise) at a wider 3:2 aspect,
 * each tinted a different direction so the page feels like a curated
 * set rather than repeated swatches.
 */

// Same noise technique as the about-page portrait. Inlined so the plate
// is self-contained — no /public asset required.
const NOISE_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

type Plate = {
  gradient: string;
  tint: string;
  caption: string;
};

// Three plates, distinct tints, same grain — they read as a set.
const PLATES: Plate[] = [
  {
    gradient:
      "linear-gradient(145deg, color-mix(in oklab, var(--color-grey-300) 50%, var(--surface)) 0%, color-mix(in oklab, var(--color-grey-600) 40%, var(--surface)) 100%)",
    tint: "radial-gradient(ellipse at 30% 35%, color-mix(in oklab, var(--accent) 10%, transparent), transparent 65%)",
    caption: "First-run wireframe, week one.",
  },
  {
    gradient:
      "linear-gradient(200deg, color-mix(in oklab, var(--color-grey-400) 45%, var(--surface)) 0%, color-mix(in oklab, var(--color-grey-700) 50%, var(--surface)) 100%)",
    tint: "radial-gradient(ellipse at 70% 55%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 70%)",
    caption: "Canvas-first onboarding — shipped prototype.",
  },
  {
    gradient:
      "linear-gradient(115deg, color-mix(in oklab, var(--color-grey-200) 45%, var(--surface)) 0%, color-mix(in oklab, var(--color-grey-500) 55%, var(--surface)) 100%)",
    tint: "radial-gradient(ellipse at 50% 40%, color-mix(in oklab, var(--accent) 7%, transparent), transparent 60%)",
    caption: "Second-session empty state.",
  },
];

function PlateBlock({ plate }: { plate: Plate }) {
  return (
    <figure className="my-4">
      <div
        className="relative w-full aspect-[3/2] overflow-hidden"
        style={{ backgroundImage: plate.gradient }}
        aria-label="Project visual placeholder"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundImage: plate.tint }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{ backgroundImage: NOISE_SVG }}
        />
      </div>
      <figcaption className="mt-3 font-serif italic text-small text-muted">
        {plate.caption}
      </figcaption>
    </figure>
  );
}

export default function ProductCaseStudy() {
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

      <header className="mt-10 mb-20 max-w-4xl">
        <div className="flex items-center gap-8 font-sans text-caption uppercase text-muted mb-8">
          <span>
            <span className="text-accent">03</span> · Product
          </span>
          <span>2025</span>
        </div>
        <h1 className="font-serif text-display">
          Rebuilt onboarding for an AI creative suite.
        </h1>
      </header>

      {/* Photo-essay body — paragraphs and plates alternate. Paragraphs sit
          on a narrower measure than the plates so the visuals read as the
          primary register and text as the connective tissue. */}
      <div className="flex flex-col gap-10">
        <p className="font-serif text-body-lg text-foreground max-w-2xl leading-[1.7]">
          The suite had a discoverability problem pretending to be a
          conversion problem. New users saw the canvas, froze, and
          closed the tab — the product was capable of ten things they
          hadn&apos;t asked about and none of the three they had.
        </p>

        <PlateBlock plate={PLATES[0]} />

        <p className="font-serif text-body-lg text-foreground max-w-2xl leading-[1.7]">
          We ripped out the tour. The new first-run is a single blank
          canvas with one prompt, a visible cursor, and a small
          suggestions rail. Everything else — the model picker, the
          layers panel, the export flow — stays behind a chevron until
          the user has produced something they care about.
        </p>

        <p className="font-serif text-body-lg text-foreground max-w-2xl leading-[1.7]">
          The model selection is the hidden unlock. Rather than ask the
          user to understand what model they need, the canvas picks one
          based on the first prompt and names it quietly in the bottom
          corner. Advanced users can override; new users never have to
          know.
        </p>

        <PlateBlock plate={PLATES[1]} />

        <p className="font-serif text-body-lg text-foreground max-w-2xl leading-[1.7]">
          Second-session return is where onboarding&apos;s real work
          lives. The empty state of session two was the biggest shift —
          it leads with the user&apos;s last artifact, not a tutorial.
          If you made something, we show you the thing you made.
          Continuity is its own kind of welcome.
        </p>

        <PlateBlock plate={PLATES[2]} />

        <p className="font-serif text-body-lg text-foreground max-w-2xl leading-[1.7]">
          Activation on day-three cohorts moved up materially. The more
          telling number was time-to-first-artifact, which halved. The
          product didn&apos;t need more features. It needed fewer
          choices in the first ninety seconds.
        </p>
      </div>

      <footer className="mt-32 max-w-2xl border-t border-border pt-12">
        <p className="font-sans text-caption uppercase text-muted mb-4">
          Next project
        </p>
        <Link
          href="/work/brand-seed-stage-ai"
          className="group inline-flex items-baseline gap-4 font-serif text-h2 text-foreground hover:text-accent transition-colors duration-fast ease-out-soft"
        >
          <span>Positioning and voice for a Seed-stage AI launch.</span>
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
