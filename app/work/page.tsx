import type { Metadata } from "next";
import { WorkGallery, type WorkCase } from "@/components/work-gallery";

export const metadata: Metadata = {
  title: "Work — Karishma Dewan",
  description:
    "Selected AI engagements across agent, product, and brand for Seed–Series B companies.",
};

/*
 * WORK INDEX — pinned horizontal gallery.
 *
 * The server renders the editorial header (label, title, qualifier) and
 * hands the six case studies to the client <WorkGallery>. The gallery
 * picks its mode at hydration:
 *
 *   - Desktop + pointer   →  pinned scroll-hijack with parallax
 *   - Touch (hover:none)  →  native swipe carousel, scroll-snap
 *   - prefers-reduced     →  the prior vertical list, unchanged in feel
 *
 * Gradient previews are inline CSS background-images — same register as
 * the homepage "Selected work" cursor previews. Six unique variants so
 * the set reads as curated, not duplicated.
 */

const CASE_STUDIES: WorkCase[] = [
  {
    tag: "Agent",
    year: "2025",
    title: "A conversational companion for women's hormonal wellness.",
    description:
      "Interaction model, domain knowledge, and voice for a Series A wellness brand.",
    preview:
      "radial-gradient(circle at 30% 40%, color-mix(in oklab, var(--accent) 80%, transparent), color-mix(in oklab, var(--accent) 30%, transparent) 45%, var(--color-grey-800) 85%)",
    slug: "agent-conversational-companion",
  },
  {
    tag: "Product",
    year: "2025",
    title: "Rebuilt onboarding for an AI creative suite.",
    description:
      "First-run strategy and shipped prototype for a generative creative tools company.",
    preview:
      "radial-gradient(ellipse at 45% 55%, var(--color-grey-400), var(--color-grey-700) 55%, var(--color-grey-900) 95%)",
    slug: "product-onboarding",
  },
  {
    tag: "Brand",
    year: "2024",
    title: "Positioning and voice for a Seed-stage AI launch.",
    description:
      "Narrative system, visual direction, and launch copy for a generative AI company.",
    preview:
      "radial-gradient(circle at 70% 65%, color-mix(in oklab, var(--accent) 35%, transparent), var(--color-grey-900) 50%, var(--color-grey-900) 100%)",
    slug: "brand-seed-stage-ai",
  },
  {
    tag: "Agent",
    year: "2024",
    title: "An internal research copilot for a venture fund.",
    description:
      "Retrieval, context model, and voice for analysts querying private research libraries.",
    preview:
      "radial-gradient(circle at 25% 75%, var(--color-grey-300), var(--color-grey-600) 50%, var(--color-grey-900) 95%)",
  },
  {
    tag: "Product",
    year: "2024",
    title: "Design system for an enterprise AI platform.",
    description:
      "Primitives, documentation, and adoption across a 60-person product organisation.",
    preview:
      "radial-gradient(ellipse at 60% 30%, color-mix(in oklab, var(--accent) 50%, transparent), var(--color-grey-500) 55%, var(--color-grey-800) 100%)",
  },
  {
    tag: "Brand",
    year: "2023",
    title: "Name, mark, and narrative for an AI infrastructure company.",
    description:
      "Brand foundation at pre-seed — name, visual identity, and launch messaging.",
    preview:
      "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--accent) 25%, var(--color-grey-700)), var(--color-grey-900) 70%)",
  },
];

export default function WorkPage() {
  return (
    <div>
      <header className="mx-auto max-w-6xl px-8 pt-[20vh] pb-24">
        <p className="font-sans text-caption uppercase text-muted mb-6">Work</p>
        <h1 className="font-serif text-display">
          Selected projects, 2023–2025.
        </h1>
        <p className="font-serif text-h3 text-secondary mt-10 max-w-3xl">
          A short list. Each engagement runs from strategy through shipped
          work — I don&apos;t hand off for others to finish.
        </p>
      </header>

      <WorkGallery cases={CASE_STUDIES} />
    </div>
  );
}
