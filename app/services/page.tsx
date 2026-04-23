import type { Metadata } from "next";
import {
  ServicesCarousel,
  type Service,
} from "@/components/services-carousel";

export const metadata: Metadata = {
  title: "Services — Karishma Dewan",
  description:
    "AI agents, AI product work, brand strategy for AI companies, and advisory.",
};

/*
 * SERVICES — editorial header + horizontal carousel of four service
 * panels. No scroll-hijack: native horizontal scroll with CSS snap,
 * so the interaction works the same on desktop (swipe/drag/arrow
 * chevrons/keyboard) and on touch (native swipe with inertia).
 *
 * Each panel carries the service name, description, deliverables, and
 * a representative case-study link — or, for Advisory, a quiet
 * availability note instead.
 */

const SERVICES: Service[] = [
  {
    name: "AI agents.",
    description:
      "End-to-end design and build — interaction model, retrieval, tool use, and evaluation. For products where the agent is the primary surface, not a side feature.",
    deliverables: [
      "Interaction model and tone strategy",
      "Voice guide and refusal patterns",
      "Retrieval and knowledge system",
      "Evaluation harness with living metrics",
      "Shipped prototype in six weeks",
    ],
    caseStudyTitle:
      "A conversational companion for women's hormonal wellness.",
    caseStudyHref: "/work/agent-conversational-companion",
  },
  {
    name: "AI product work.",
    description:
      "Product strategy through shipped prototype for AI features or AI-native apps. Across consumer and enterprise. I write the spec and the code.",
    deliverables: [
      "Onboarding and activation strategy",
      "Core loop and jobs-to-be-done",
      "Shipped prototypes and design specs",
      "Metric definitions and instrumentation",
    ],
    caseStudyTitle: "Rebuilt onboarding for an AI creative suite.",
    caseStudyHref: "/work/product-onboarding",
  },
  {
    name: "Brand strategy.",
    description:
      "Positioning, voice, and launch architecture for companies bringing AI to market where taste is the differentiator and the technical story is already strong.",
    deliverables: [
      "Positioning territory and thesis",
      "Three-beat narrative system",
      "Voice guide from founder transcripts",
      "Mark, palette, and launch identity",
      "Launch-week messaging across channels",
    ],
    caseStudyTitle: "Positioning and voice for a Seed-stage AI launch.",
    caseStudyHref: "/work/brand-seed-stage-ai",
  },
  {
    name: "Advisory.",
    description:
      "A small number of founders on retainer. Weekly calls, async review of product, strategy, and positioning work as it lands. Occasionally the right answer is \u201Cdon\u2019t ship that.\u201D",
    deliverables: [
      "Weekly 60-minute working session",
      "Async review of artifacts in flight",
      "Annual strategy off-site",
      "On-call for launches and fundraises",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="pb-32">
      <header className="mx-auto max-w-6xl px-8 pt-[20vh] pb-20">
        <p className="font-sans text-caption uppercase text-muted mb-6">
          Services
        </p>
        <h1 className="font-serif text-display">Offerings.</h1>
        <p className="font-serif text-h3 text-secondary mt-10 max-w-3xl">
          Four shapes of engagement. Most clients land on one; some run two
          in sequence. Pricing is per engagement, not hourly.
        </p>
      </header>

      <ServicesCarousel services={SERVICES} />
    </div>
  );
}
