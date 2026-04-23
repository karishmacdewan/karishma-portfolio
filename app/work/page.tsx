import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Work — Karishma Dewan",
  description:
    "Selected AI engagements across agent, product, and brand for Seed–Series B companies.",
};

// Case studies. Entries with a `slug` have a detail page and render as a
// link; the rest render as static blocks (placeholder entries for now).
type CaseStudy = {
  tag: string;
  year: string;
  title: string;
  description: string;
  slug?: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    tag: "Agent",
    year: "2025",
    title: "A conversational companion for women's hormonal wellness.",
    description:
      "Interaction model, domain knowledge, and voice for a Series A wellness brand.",
    slug: "agent-conversational-companion",
  },
  {
    tag: "Product",
    year: "2025",
    title: "Rebuilt onboarding for an AI creative suite.",
    description:
      "First-run strategy and shipped prototype for a generative creative tools company.",
    slug: "product-onboarding",
  },
  {
    tag: "Brand",
    year: "2024",
    title: "Positioning and voice for a Seed-stage AI launch.",
    description:
      "Narrative system, visual direction, and launch copy for a generative AI company.",
    slug: "brand-seed-stage-ai",
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

/*
 * CaseStudyRow — renders the interior of a row. Used twice so linked and
 * unlinked entries keep identical typography and grid.
 */
function CaseStudyRow({
  item,
  index,
  linked,
}: {
  item: CaseStudy;
  index: number;
  linked: boolean;
}) {
  return (
    <div className="grid gap-y-6 gap-x-12 md:grid-cols-[10rem_1fr]">
      <div className="flex flex-col gap-1 font-sans text-caption uppercase text-muted">
        <span>
          <span className="text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>{" "}
          · {item.tag}
        </span>
        <span>{item.year}</span>
      </div>
      <div className="flex flex-col gap-4">
        <h2
          className={`font-serif text-h1 text-foreground ${
            linked
              ? "group-hover:text-accent transition-colors duration-fast ease-out-soft"
              : ""
          }`}
        >
          {item.title}
        </h2>
        <p className="font-serif text-h3 text-secondary max-w-2xl">
          {item.description}
        </p>
      </div>
    </div>
  );
}

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
        {CASE_STUDIES.map((item, i) =>
          item.slug ? (
            <Link
              key={`${item.tag}-${item.year}-${i}`}
              href={`/work/${item.slug}`}
              className="group block py-16"
            >
              <CaseStudyRow item={item} index={i} linked />
            </Link>
          ) : (
            <article
              key={`${item.tag}-${item.year}-${i}`}
              className="py-16"
            >
              <CaseStudyRow item={item} index={i} linked={false} />
            </article>
          ),
        )}
      </div>
    </div>
  );
}
