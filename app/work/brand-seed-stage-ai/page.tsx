import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Positioning and voice for a Seed-stage AI launch — Karishma Dewan",
  description:
    "Narrative system, visual direction, and launch copy for a generative AI company.",
};

/*
 * CASE STUDY — BRAND (process-driven).
 *
 * Body register: numbered steps with a small abstract diagram per step.
 * Diagrams are pure CSS (dot, ring, line, arc) — small, monotone, sit to
 * the left of each step as a quiet rhythmic anchor. The structural grid
 * itself is the point: brand work is a process and the page should show it.
 */

type Step = {
  label: string;
  heading: string;
  body: string;
  // Diagram kind — rendered by the switch in <Diagram />. Kept as a union
  // so the set stays small and deliberate.
  diagram: "ring" | "dot" | "arc" | "line" | "dots" | "rings";
};

const STEPS: Step[] = [
  {
    label: "Research",
    heading: "Listen first.",
    body:
      "Three weeks of interviews — founders, customers, category analysts. The goal wasn't consensus. It was to find the two or three sentences the founders couldn't stop saying, and the one they kept avoiding.",
    diagram: "dots",
  },
  {
    label: "Territory",
    heading: "Pick the fight.",
    body:
      "The category was crowded and the company was building something genuinely different. We staked out a narrow territory — one that made the difference legible — and let the rest of the space go. Positioning is subtraction.",
    diagram: "ring",
  },
  {
    label: "Narrative",
    heading: "A story in three beats.",
    body:
      "One sentence for the tension the product resolves. One for the shift it represents. One for what that means for the user. Everything downstream — homepage copy, investor deck, the CEO's Twitter bio — is an arrangement of those three beats.",
    diagram: "arc",
  },
  {
    label: "Voice",
    heading: "Write how they actually talk.",
    body:
      "The founders were sharper in conversation than in their own drafts. The voice guide was built from transcripts — the cadence, the specificity, the way they pushed back. Five rules, two pages, no adjectives the team couldn't defend.",
    diagram: "line",
  },
  {
    label: "Identity",
    heading: "A mark that earns its space.",
    body:
      "Wordmark, palette, a single primary mark, one secondary. No icon set, no pattern library, no illustration system — none of it was needed at Seed. The restraint was the point; everything we didn't ship was a decision.",
    diagram: "rings",
  },
  {
    label: "Launch",
    heading: "Ship the narrative, not just the site.",
    body:
      "Homepage, pitch, two op-eds under the founders' names, a quiet investor update. The launch week wasn't about impressions — it was about the first 200 people who'd try the product reading the same story in three places.",
    diagram: "dot",
  },
];

/*
 * DIAGRAM — small abstract mark per step. 72×72px, currentColor strokes,
 * no fills except the solid dot. Renders in text-muted by default; the
 * number above it gets the accent treatment.
 */
function Diagram({ kind }: { kind: Step["diagram"] }) {
  const base = "block text-muted";
  switch (kind) {
    case "ring":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 72 72"
          className={`${base} w-16 h-16`}
        >
          <circle
            cx="36"
            cy="36"
            r="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      );
    case "dot":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 72 72"
          className={`${base} w-16 h-16`}
        >
          <circle cx="36" cy="36" r="6" fill="currentColor" />
        </svg>
      );
    case "arc":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 72 72"
          className={`${base} w-16 h-16`}
        >
          <path
            d="M 12 48 Q 36 12 60 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      );
    case "line":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 72 72"
          className={`${base} w-16 h-16`}
        >
          <line
            x1="12"
            y1="36"
            x2="60"
            y2="36"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      );
    case "dots":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 72 72"
          className={`${base} w-16 h-16`}
        >
          <circle cx="20" cy="36" r="3" fill="currentColor" />
          <circle cx="36" cy="36" r="3" fill="currentColor" />
          <circle cx="52" cy="36" r="3" fill="currentColor" />
        </svg>
      );
    case "rings":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 72 72"
          className={`${base} w-16 h-16`}
        >
          <circle
            cx="28"
            cy="36"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle
            cx="44"
            cy="36"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      );
  }
}

export default function BrandCaseStudy() {
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
            <span className="text-accent">04</span> · Brand
          </span>
          <span>2024</span>
        </div>
        <h1 className="font-serif text-display">
          Positioning and voice for a Seed-stage AI launch.
        </h1>
        <p className="font-serif text-h3 text-secondary mt-10 max-w-3xl">
          Six weeks, six steps. The process we walked the founders
          through, in the order it happened.
        </p>
      </header>

      {/* Process grid — each row is [diagram | number+label | heading+body].
          Divider lines between rows lean into the structural register. */}
      <div className="border-t border-border">
        {STEPS.map((step, i) => (
          <div
            key={step.label}
            className="grid gap-y-6 gap-x-10 py-14 border-b border-border md:grid-cols-[5rem_10rem_1fr]"
          >
            <div className="flex items-start">
              <Diagram kind={step.diagram} />
            </div>
            <div className="flex flex-col gap-1 font-sans text-caption uppercase text-muted">
              <span>
                <span className="text-accent">Step</span>
              </span>
              <span>
                <span className="text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>{" "}
                · {step.label}
              </span>
            </div>
            <div className="flex flex-col gap-4 max-w-2xl">
              <h2 className="font-serif text-h2 text-foreground">
                {step.heading}
              </h2>
              <p className="font-serif text-body-lg text-secondary leading-[1.7]">
                {step.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Loops back to the first case study in the sequence so "next" is
          always meaningful, even at the end of the set. */}
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
