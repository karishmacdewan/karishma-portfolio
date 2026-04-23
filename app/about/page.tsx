import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Karishma Dewan",
  description:
    "Ex-Google strategist, founder, and AI builder. Strategy, taste, and code — for companies where AI feels as considered as the product around it.",
};

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
];

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

      <div className="flex flex-col gap-20 max-w-3xl">
        {SECTIONS.map((section, i) => (
          <section key={section.label}>
            <p className="font-sans text-caption uppercase text-muted mb-6">
              <span className="text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>{" "}
              · {section.label}
            </p>
            <p className="font-serif text-h3 text-foreground">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
