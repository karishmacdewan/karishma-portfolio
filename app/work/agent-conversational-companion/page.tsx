import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "A conversational companion for Owne, my hormonal-health brand — Karishma Dewan",
  description:
    "Inside the build: retrieval, OpenAI structured outputs, safety guardrails, and the real bugs fixed shipping Owne's AI guide.",
};

/*
 * CASE STUDY — AGENT (essay-style).
 *
 * Body register: long-form narrative on a narrow measure (max-w-2xl),
 * interrupted twice by pull quotes. Serif body, slight line-height
 * lift for reading. No imagery — this one is about voice and
 * architecture, so the layout stays textual on purpose.
 */

export default function AgentCaseStudy() {
  return (
    <article className="mx-auto max-w-6xl px-8 pt-[20vh] pb-32">
      {/* Quiet back link — caption size, muted, nudges with arrow on hover */}
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

      {/* Meta + title — same register as the homepage "Selected work" rows,
          scaled up: number in accent, tag, year. */}
      <header className="mt-10 mb-20 max-w-4xl">
        <div className="flex items-center gap-8 font-sans text-caption uppercase text-muted mb-8">
          <span>
            <span className="text-accent">01</span> · Agent
          </span>
          <span>2026</span>
        </div>
        <h1 className="font-serif text-display">
          A conversational companion for Owne, my hormonal-health brand.
        </h1>
      </header>

      {/* Essay body. Comfortable measure (~65ch) and a small gap between
          paragraphs. leading-[1.7] reads a notch looser than text-body-lg's
          baked-in 1.6 — suits long-form serif on a dark page. */}
      <div className="max-w-2xl flex flex-col gap-8 font-serif text-body-lg text-foreground leading-[1.7]">
        <p>
          Owne is the hormonal-health and Ayurvedic wellness brand I started
          in 2023. By this year it had a product line, a point of view, and
          a recurring customer question that no FAQ page answers well:
          &quot;is this normal?&quot; So I built Ask Owne — a RAG-backed AI
          guide that lives directly in the storefront — to answer it with
          something more specific than a generic wellness chatbot would
          give.
        </p>

        <p>
          The architecture is straightforward on paper: a Vercel serverless
          function, OpenAI for embeddings and generation, Qdrant as the
          vector store. Customer questions get embedded, matched against a
          knowledge base split across a hormone-education reference and a
          ritual-and-recipe library, and the closest matches get assembled
          into a structured prompt. The model replies in OpenAI&apos;s
          Structured Outputs format — a strict JSON schema with named
          fields for the likely hormonal pattern, a food suggestion, a
          movement suggestion, a product ritual, and a safety note —
          rather than a single freeform string. That schema constraint did
          more for response quality than any amount of prompt tweaking.
          It&apos;s much easier to control where a product mention lands
          when &quot;where the product goes&quot; is a field, not a hope.
        </p>

        {/* Pull quote — terracotta left rule, italic serif, h2 scale.
            Margin sits wider than the body to feel like a break, not
            just a quoted line. */}
        <blockquote className="my-6 py-2 pl-8 border-l-2 border-accent font-serif italic text-h2 text-foreground leading-[1.2]">
          Self-harm and a missed period with cramping are both urgent. They
          are not the same kind of urgent, and the system has to know
          that.
        </blockquote>

        <p>
          The riskiest part of any health-adjacent agent is escalation
          logic, so that&apos;s where I spent the most care. A
          deterministic moderation layer checks every message for
          self-harm language before anything reaches the model; if it
          fires, the response is forced into a support-redirect path, full
          stop, no model discretion. Physical red-flag symptoms — heavy
          bleeding, fainting, a missed period with a chance of pregnancy —
          get a different path: full guidance, led by a prominent safety
          note urging medical care. Early versions conflated the two
          categories, which meant a question about dizziness got the same
          crisis-redirect treatment as a question about hopelessness.
          Separating them was a short prompt fix with an outsized effect on
          whether the agent actually felt trustworthy.
        </p>

        <p>
          The bug that took longest to diagnose wasn&apos;t a bug in the
          code — it was a bug in how retrieval ranks information.
          Owne&apos;s actual point of difference is a dosha-and-agni
          framework for thinking about hormonal symptoms, but it&apos;s
          written abstractly, and vector search ranks by literal
          similarity to whatever the user typed. A message about bloating
          matches chunks about bloating, not the philosophical section
          explaining why bloating matters in Ayurvedic terms. The result
          was technically correct, brand-empty answers. The fix was to
          stop trusting ranking for that one section: I built a
          deterministic extractor that pulls the core Ayurveda framework
          out of the knowledge base by heading and injects it into every
          prompt, regardless of what retrieval surfaces.
        </p>

        <blockquote className="my-6 py-2 pl-8 border-l-2 border-accent font-serif italic text-h2 text-foreground leading-[1.2]">
          If the fact that makes your product yours isn&apos;t guaranteed
          to show up, it isn&apos;t really part of your product.
        </blockquote>

        <p>
          Two smaller fixes mattered more than they should have. The
          schema originally had two separate fields that could each name
          the hero product, so it showed up twice in one reply — once near
          the top, like an opening pitch. Collapsing that to a single
          field, capped at one mention and moved to the end of the
          response, fixed it immediately. Separately, the model would
          occasionally name a specific recipe by title without saying how
          to make it, traced to a name-only index table in the knowledge
          base getting embedded as its own retrievable chunk, disconnected
          from the chunk holding the real method. Excluding that index
          from embedding, plus a hard rule — never name a recipe unless
          the method comes with it — closed the gap.
        </p>

        <p>
          The last piece was making it real for a non-technical merchant
          workflow — mine. The chat lives in a Shopify theme section with
          merchant-editable settings (API endpoint, greeting copy, example
          prompts), because most days I&apos;m editing through
          Shopify&apos;s browser-based code editor, not a terminal.
          It&apos;s deployed on Vercel and live on the storefront now.
          There&apos;s no clean before/after number to point to yet — it
          just shipped. What I can point to is the architecture decisions
          that made it worth shipping: a schema that controls itself, a
          safety layer that doesn&apos;t guess, and a brand voice that
          can&apos;t quietly disappear under retrieval ranking.
        </p>
      </div>

      {/* Next project — linear sequence, wraps at the end of the set.
          Arrow nudges right on hover (mirror of the back link). */}
      <footer className="mt-32 max-w-2xl border-t border-border pt-12">
        <p className="font-sans text-caption uppercase text-muted mb-4">
          Next project
        </p>
        <Link
          href="/work/product-onboarding"
          className="group inline-flex items-baseline gap-4 font-serif text-h2 text-foreground hover:text-accent transition-colors duration-fast ease-out-soft"
        >
          <span>Rebuilt onboarding for an AI creative suite.</span>
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
