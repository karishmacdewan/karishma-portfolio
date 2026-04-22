const SOCIAL = [
  { href: "https://linkedin.com/in/karishmacdewan", label: "LinkedIn" },
  { href: "mailto:karishmadewan0@gmail.com", label: "Email" },
  { href: "https://x.com/karishmacdewan", label: "X" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-8 py-24 grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start">
        <p className="font-sans text-small text-muted">
          Built by Karishma Dewan. Based in [city].
        </p>

        <nav
          aria-label="Social"
          className="flex gap-6 font-sans text-small md:justify-center"
        >
          {SOCIAL.map(({ href, label }) => (
            <a
              key={label}
              href={href}
              className="text-muted hover:text-foreground transition-colors duration-fast ease-out-soft"
            >
              {label}
            </a>
          ))}
        </nav>

        <p className="font-sans text-small text-muted md:text-right">
          © {year}
        </p>
      </div>
    </footer>
  );
}
