import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Karishma Dewan",
  description:
    "Ex-Google strategist, founder, and AI builder. Strategy, taste, and code — for companies where AI feels as considered as the product around it.",
};

/*
 * ABOUT — distinctive layout, not a stretched template.
 *
 * Shape:
 *   01 · BACKGROUND   two-column — body text left, portrait plate right
 *   02 · FOUNDING     single-column narrative (original)
 *   03 · NOW          single-column narrative (original)
 *   04 · WHY          single-column narrative (original)
 *   05 · TODAY        live "/now"-style list with a recency dot
 */

// Narrative sections — 01 renders in a 2-col layout with the portrait, the
// rest single-column. Order and copy match the prior version so nothing
// written is lost; only the composition changes.
const SECTIONS = [
  {
    label: "Background",
    body:
      "Five years at Google in strategy, analytics, and go-to-market. Worked on products where decisions moved slowly and the stakes rode on execution — ads infrastructure, a consumer bet, a creator platform before it had a name.",
  },
  {
    label: "Founding",
    body:
      "In 2023, left to start a women's hormonal wellness brand. Built it from first principles — research, brand, product, early revenue. Still active as founder; the company is how I keep my product instincts honest.",
  },
  {
    label: "Now",
    body:
      "Most of my time goes into shipping AI. Agents, product work, and brand strategy for a small number of companies each year. By referral or direct note. I don't run a team — engagements are hands-on.",
  },
  {
    label: "Why",
    body:
      "AI is going to reshape how products feel. Most teams building it today come from one direction — usually engineering. Strategy, product taste, and technical fluency rarely sit in one person. When they do, the work tends to show it.",
  },
] as const;

// /now-style live list. Italic serif labels, sans values, terracotta dot
// on "Last updated" to signal recency at a glance.
const TODAY = [
  { label: "Currently in", value: "Brooklyn, NY" },
  { label: "Building", value: "A women's hormonal wellness brand (in market)" },
  { label: "Reading", value: "The Creative Act — Rick Rubin" },
  { label: "Listening to", value: "Alice Coltrane — Journey in Satchidananda" },
] as const;

const LAST_UPDATED = "April 2026";

// Inline SVG noise — fractalNoise filter painted into a tile, embedded as a
// data URI. Kept inline so the portrait plate is self-contained and doesn't
// require a /public asset. Opacity is turned way down (~8%) and composited
// via mix-blend-overlay so it reads as grain, not texture.
const NOISE_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-8 pt-[20vh] pb-32">
      <header className="mb-24 max-w-4xl">
        <p className="font-sans text-caption uppercase text-muted mb-6">
          About
        </p>
        <h1 className="font-serif text-display">
          Karishma Dewan. Strategy, taste, and code.
        </h1>
      </header>

      <div className="flex flex-col gap-20">
        {/*
         * 01 · BACKGROUND — two-column composition.
         * Proportions: text 55%, gutter 5%, portrait 40% (≈ 11 / 1 / 8 cols).
         * Collapses to stacked on <md so the portrait doesn't squeeze.
         */}
        <section>
          <p className="font-sans text-caption uppercase text-muted mb-6">
            <span className="text-accent">01</span> · {SECTIONS[0].label}
          </p>
          <div className="grid gap-y-12 md:gap-x-[5%] md:grid-cols-[55%_40%]">
            <p className="font-serif text-h3 text-foreground">
              {SECTIONS[0].body}
            </p>
            <figure className="flex flex-col">
              <div
                className="relative w-full aspect-[4/5] overflow-hidden"
                // Warm-grey plate. Layered: a soft diagonal gradient for depth,
                // then a subtle warm tint, then noise on top via ::after-like
                // absolute overlay. Base colour sits between surface (near-
                // black/near-paper) and grey-400 so the plate reads as "photo
                // space" not a flat swatch.
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, color-mix(in oklab, var(--color-grey-300) 55%, var(--surface)) 0%, color-mix(in oklab, var(--color-grey-500) 40%, var(--surface)) 100%)",
                }}
                aria-label="Portrait placeholder"
              >
                {/* Warm tint wash — ties the plate to the palette */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(ellipse at 60% 40%, color-mix(in oklab, var(--accent) 8%, transparent), transparent 70%)",
                  }}
                />
                {/* Noise grain — subtle, sits on top */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
                  style={{ backgroundImage: NOISE_SVG }}
                />
              </div>
              <figcaption className="mt-4 font-serif italic text-small text-muted">
                Photo forthcoming.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* 02–04 · Remaining narrative sections — single-column as before. */}
        <div className="flex flex-col gap-20 max-w-3xl">
          {SECTIONS.slice(1).map((section, i) => (
            <section key={section.label}>
              <p className="font-sans text-caption uppercase text-muted mb-6">
                <span className="text-accent">
                  {String(i + 2).padStart(2, "0")}
                </span>{" "}
                · {section.label}
              </p>
              <p className="font-serif text-h3 text-foreground">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        {/* 05 · TODAY — live list. Italic serif labels / sans values.
            The terracotta dot next to "Last updated" telegraphs recency. */}
        <section>
          <p className="font-sans text-caption uppercase text-muted mb-6">
            <span className="text-accent">05</span> · Today
          </p>
          <dl className="grid grid-cols-[minmax(9rem,11rem)_1fr] gap-y-4 gap-x-8 max-w-2xl">
            {TODAY.map((row) => (
              <div key={row.label} className="contents">
                <dt className="font-serif italic text-body-lg text-muted">
                  {row.label}
                </dt>
                <dd className="font-sans text-body text-foreground self-center">
                  {row.value}
                </dd>
              </div>
            ))}
            <dt className="font-serif italic text-body-lg text-muted">
              Last updated
            </dt>
            <dd className="flex items-center gap-3 font-sans text-body text-foreground self-center">
              <span
                aria-hidden="true"
                className="w-[8px] h-[8px] rounded-full bg-accent shrink-0"
              />
              <span>{LAST_UPDATED}</span>
            </dd>
          </dl>
        </section>
      </div>
    </div>
  );
}
