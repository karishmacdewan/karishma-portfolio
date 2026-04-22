import { Fragment } from "react";

const SOCIAL = [
  { href: "https://linkedin.com/in/karishmacdewan", label: "LinkedIn" },
  { href: "mailto:karishmadewan0@gmail.com", label: "Email" },
  { href: "https://x.com/karishmacdewan", label: "X" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      {/* Two zones — left credit, right socials + copyright. Container
          mirrors the header's max-w-6xl px-8 so the left zone aligns with
          the wordmark and the right zone with the theme toggle. */}
      <div className="mx-auto max-w-6xl px-8 py-16 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="font-sans text-[13px] text-muted tracking-[0.04em]">
          Built by Karishma Dewan. Based in [city].
        </p>

        <div className="flex items-center gap-6 font-sans text-[13px] text-muted tracking-[0.04em]">
          <nav aria-label="Social" className="flex items-center gap-2">
            {SOCIAL.map(({ href, label }, i) => (
              <Fragment key={label}>
                {i > 0 && (
                  <span aria-hidden="true" className="text-muted">
                    ·
                  </span>
                )}
                <a
                  href={href}
                  className="text-muted hover:text-foreground hover:underline underline-offset-4 decoration-1 transition-colors duration-[180ms] ease-out-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                >
                  {label}
                </a>
              </Fragment>
            ))}
          </nav>
          <span>© {year}</span>
        </div>
      </div>
    </footer>
  );
}
