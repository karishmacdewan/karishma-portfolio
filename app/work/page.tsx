import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work — Karishma Dewan",
  description:
    "Selected AI engagements across agent, product, and brand for Seed–Series B companies.",
};

// Placeholder case studies — in Karishma's voice, swap for real entries later.
// Individual case-study pages don't exist yet, so items render as static blocks.
const CASE_STUDIES = [
  {
    tag: "Agent",
    year: "2025",
    title: "A conversational companion for women's hormonal wellness.",
    description:
      "Interaction model, domain knowledge, and voice for a Series A wellness brand.",
  },
  {
    tag: "Product",
    year: "2025",
    title: "Rebuilt onboarding for an AI creative suite.",
    description:
      "First-run strategy and shipped prototype for a generative creative tools company.",
  },
  {
    tag: "Brand",
    year: "2024",
    title: "Positioning and voice for a Seed-stage AI launch.",
    description:
      "Narrative system, visual direction, and launch copy for a generative AI company.",
  },
  {
    tag: "Agent",
    year: "2024",
    title: "An internal research copilot for a venture fund.",
    description:
      "Retrieval, context model, and voice for analysts querying private research libraries.",
  },
  {
    tag: "Product",
    year: "2024",
    title: "Design system for an enterprise AI platform.",
    description:
      "Primitives, documentation, and adoption across a 60-person product organisation.",
  },
  {
    tag: "Brand",
    year: "2023",
    title: "Name, mark, and narrative for an AI infrastructure company.",
    description:
      "Brand foundation at pre-seed — name, visual identity, and launch messaging.",
  },
];

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-8 pt-[20vh] pb-32">
      <header className="mb-24 max-w-4xl">
        <p className="font-sans text-caption uppercase text-muted mb-6">Work</p>
        <h1 className="font-serif text-display">
          Selected projects, 2023–2025.
        </h1>
        <p className="font-serif text-h3 text-secondary mt-10 max-w-3xl">
          A short list. Each engagement runs from strategy through shipped
          work — I don&apos;t hand off for others to finish.
        </p>
      </header>

      <div className="border-t border-b border-border divide-y divide-border">
        {CASE_STUDIES.map((item, i) => (
          <article
            key={`${item.tag}-${item.year}-${i}`}
            className="py-16"
          >
            <div className="grid gap-y-6 gap-x-12 md:grid-cols-[10rem_1fr]">
              <div className="flex flex-col gap-1 font-sans text-caption uppercase text-muted">
                <span>
                  <span className="text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>{" "}
                  · {item.tag}
                </span>
                <span>{item.year}</span>
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="font-serif text-h1 text-foreground">
                  {item.title}
                </h2>
                <p className="font-serif text-h3 text-secondary max-w-2xl">
                  {item.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
