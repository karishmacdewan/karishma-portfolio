"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { index: "01", href: "/work", label: "Work" },
  { index: "02", href: "/about", label: "About" },
  { index: "03", href: "/services", label: "Services" },
  { index: "04", href: "/contact", label: "Contact" },
];

export function Header() {
  const [pinned, setPinned] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const evaluate = () => {
      setPinned(window.scrollY > 80);
    };
    evaluate();
    window.addEventListener("scroll", evaluate, { passive: true });
    return () => {
      window.removeEventListener("scroll", evaluate);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-base ease-out-soft ${
        pinned
          ? "bg-background/70 backdrop-blur-md border-b border-border"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-8 h-20 flex items-center justify-between">
        <Link
          href="/"
          aria-label="Karishma Dewan — home"
          className="font-serif italic lowercase text-h2 text-foreground"
        >
          Karishma.
        </Link>

        <div className="flex items-center gap-16">
          <nav aria-label="Primary">
            <ul className="flex items-baseline gap-12">
              {NAV.map(({ index, href, label }) => {
                const active =
                  pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <li key={href}>
                    <Link href={href} className="group inline">
                      <span className="font-sans text-small text-muted">
                        {index}&nbsp;—&nbsp;
                      </span>
                      <span
                        className={`font-serif text-body-lg lowercase transition-colors duration-fast ease-out-soft ${
                          active
                            ? "text-foreground"
                            : "text-muted group-hover:text-foreground"
                        }`}
                      >
                        {label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
