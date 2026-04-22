/**
 * Typography — font stacks + type scale.
 *
 * Mirrored in `app/globals.css` @theme block. Authoritative here for
 * TS-side consumption; update both if a value changes.
 *
 * Each scale entry pairs font-size with a harmonious line-height and,
 * where the optical scale benefits from it, a letter-spacing.
 */

export const fonts = {
  serif: "var(--font-serif)",
  sans: "var(--font-sans)",
} as const;

export const typeScale = {
  hero: { size: "6rem", lineHeight: 1.0, letterSpacing: "-0.03em" },
  display: { size: "4.5rem", lineHeight: 1.05, letterSpacing: "-0.025em" },
  h1: { size: "3rem", lineHeight: 1.1, letterSpacing: "-0.02em" },
  h2: { size: "2rem", lineHeight: 1.2, letterSpacing: "-0.015em" },
  h3: { size: "1.5rem", lineHeight: 1.3, letterSpacing: "-0.01em" },
  bodyLg: { size: "1.125rem", lineHeight: 1.6 },
  body: { size: "1rem", lineHeight: 1.65 },
  small: { size: "0.875rem", lineHeight: 1.5 },
  caption: { size: "0.75rem", lineHeight: 1.4, letterSpacing: "0.06em" },
} as const;

export type TypeScale = typeof typeScale;
