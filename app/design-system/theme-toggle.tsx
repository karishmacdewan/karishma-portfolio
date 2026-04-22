"use client";

import { useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
  }

  return (
    <button
      onClick={toggle}
      className="font-sans text-caption uppercase tracking-wider text-muted hover:text-foreground transition-colors duration-300"
    >
      theme — {theme}
    </button>
  );
}
