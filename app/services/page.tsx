import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — Karishma Dewan",
  description:
    "AI agents, AI product work, brand strategy for AI companies, and advisory.",
};

const SERVICES = [
  {
    title: "AI agents",
    description:
      "End-to-end design and build — interaction model, retrieval, tool use, and evaluation. For products where the agent is the primary surface, not a side feature.",
  },
  {
    title: "AI product work",
    description:
      "Product strategy through shipped prototype for AI features or AI-native apps. Across consumer and enterprise. I write the spec and the code.",
  },
  {
    title: "Brand strategy for AI companies",
    description:
      "Positioning, voice, and launch architecture. For companies bringing AI to market where taste is the differentiator and the technical story is already strong.",
  },
  {
    title: "Advisory",
    description:
      "Limited availability. For founders and teams wrestling with product direction, hiring decisions, or the strategy — taste — code gap on their team.",
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-8 pt-[20vh] pb-32">
      <header className="mb-24 max-w-4xl">
        <p className="font-sans text-caption uppercase text-muted mb-6">
          Services
        </p>
        <h1 className="font-serif text-display">Offerings.</h1>
        <p className="font-serif text-h3 text-secondary mt-10 max-w-3xl">
          Four shapes of engagement. Most clients land on one; some run two in
          sequence. Pricing is per engagement, not hourly.
        </p>
      </header>

      <div className="border-t border-b border-border divide-y divide-border">
        {SERVICES.map((item, i) => (
          <article key={item.title} className="py-16">
            <div className="grid gap-y-6 gap-x-12 md:grid-cols-[10rem_1fr]">
              <div className="font-sans text-caption uppercase text-muted">
                <span className="text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
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
