import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "A conversational companion for women's hormonal wellness — Karishma Dewan",
  description:
    "Interaction model, domain knowledge, and voice for a Series A wellness brand.",
};

/*
 * CASE STUDY — AGENT (essay-style).
 *
 * Body register: long-form narrative on a narrow measure (max-w-2xl),
 * interrupted twice by pull quotes. Serif body, slight line-height
 * lift for reading. No imagery — this one is about voice, so the
 * layout stays textual on purpose.
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
          <span>2025</span>
        </div>
        <h1 className="font-serif text-display">
          A conversational companion for women&apos;s hormonal wellness.
        </h1>
      </header>

      {/* Essay body. Comfortable measure (~65ch) and a small gap between
          paragraphs. leading-[1.7] reads a notch looser than text-body-lg's
          baked-in 1.6 — suits long-form serif on a dark page. */}
      <div className="max-w-2xl flex flex-col gap-8 font-serif text-body-lg text-foreground leading-[1.7]">
        <p>
          The brief was simple and quietly hard: give the product a voice
          that sounds like a calm friend with good information. Not a
          doctor, not a chatbot, not a wellness influencer. Someone a
          25-year-old figuring out her cycle for the first time could
          actually keep talking to.
        </p>

        <p>
          Most conversational AI in the wellness category fails in the
          same place. It over-validates — everything you feel is normal,
          everything you ask is a great question — until the tone
          dissolves into a kind of warm static. Users stop believing it.
          The product gets reduced to a search engine with emoji.
        </p>

        {/* Pull quote — terracotta left rule, italic serif, h2 scale.
            Margin sits wider than the body to feel like a break, not
            just a quoted line. */}
        <blockquote className="my-6 py-2 pl-8 border-l-2 border-accent font-serif italic text-h2 text-foreground leading-[1.2]">
          Tone isn&apos;t a wrapper. It&apos;s the product.
        </blockquote>

        <p>
          We rebuilt the agent from the interaction model out. First, a
          sharper point of view on what the companion wouldn&apos;t do:
          no diagnosis, no prescriptive advice, no cheerleading. Then a
          voice guide — short sentences, grounded metaphors, willing to
          say &quot;I don&apos;t know&quot; in the two or three contexts
          where that answer is the honest one.
        </p>

        <p>
          Domain knowledge came next. The agent reads from a curated
          knowledge base — clinical research abstracted into plain
          language, reviewed by an OB-GYN on retainer. The retrieval
          layer prioritises source weight, not recency; the system
          prompt carries a short list of topics where it escalates to
          &quot;please talk to your clinician&quot; rather than answer.
        </p>

        <p>
          The hardest part was the waiting — the silences between user
          messages where the old agent would fill with nudges. We took
          those out. The companion waits. When it does speak, it earns
          the line.
        </p>

        <blockquote className="my-6 py-2 pl-8 border-l-2 border-accent font-serif italic text-h2 text-foreground leading-[1.2]">
          The agent that respects a user&apos;s silence is the one they
          come back to.
        </blockquote>

        <p>
          Six weeks from strategy to shipped. Retention on week-four
          cohorts moved up noticeably; session length came down, which
          was the goal. The best compliment came from a user who wrote
          in to ask if a real person had written one of the responses.
          The answer was no — and that the agent should feel that way
          is, I think, the whole project.
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
