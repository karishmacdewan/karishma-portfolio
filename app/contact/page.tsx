import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Karishma Dewan",
  description:
    "Direct outreach for AI engagements and advisory. A sentence or two about the problem is all it takes.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-8 pt-[20vh] pb-32">
      <header className="mb-16 max-w-4xl">
        <p className="font-sans text-caption uppercase text-muted mb-6">
          Contact
        </p>
        <h1 className="font-serif text-display">Write.</h1>
      </header>

      <div className="flex flex-col gap-12 max-w-3xl">
        <p className="font-serif text-h3 text-secondary">
          Most welcome: AI engagements and advisory work for companies where
          taste and technology both matter. A sentence or two about the
          problem is all it takes.
        </p>

        <a
          href="mailto:karishmadewan0@gmail.com"
          className="font-serif italic text-h1 text-accent hover:text-accent-hover transition-colors duration-fast ease-out-soft w-fit"
        >
          karishmadewan0@gmail.com
        </a>

        <div className="flex items-center gap-4 font-sans text-[13px] text-muted tracking-[0.04em]">
          <a
            href="https://linkedin.com/in/karishmacdewan"
            className="hover:text-foreground hover:underline underline-offset-4 decoration-1 transition-colors duration-[180ms] ease-out-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            LinkedIn
          </a>
          <span aria-hidden="true" className="text-muted">
            ·
          </span>
          <a
            href="https://x.com/karishmacdewan"
            className="hover:text-foreground hover:underline underline-offset-4 decoration-1 transition-colors duration-[180ms] ease-out-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            X
          </a>
        </div>
      </div>
    </div>
  );
}
