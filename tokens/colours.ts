/**
 * Palette — single source of truth for colour values.
 *
 * These values are mirrored in `app/globals.css` inside the @theme block.
 * If you change a value here, update globals.css to match.
 * (CSS cannot import from TS; conventional mirroring is the simplest
 * reliable pattern for a Tailwind v4 CSS-first config.)
 *
 * Consume from components when runtime access to a value is genuinely needed:
 *   import { palette } from "@/tokens/colours";
 *   style={{ color: palette.clay.DEFAULT }}
 *
 * In most cases, prefer Tailwind utilities (bg-clay, text-ink, etc.).
 */

export const palette = {
  ink: "#0a0a0a",
  paper: "#fafaf5",

  clay: {
    DEFAULT: "#b8604a",
    hover: "#c96e55",
  },

  grey: {
    50: "#f5f4ef",
    100: "#e8e6df",
    200: "#d4d1c7",
    300: "#b5b0a3",
    400: "#8a867a",
    500: "#6b685e",
    600: "#4a4843",
    700: "#2e2d2a",
    800: "#1a1918",
    900: "#0f0e0d",
  },
} as const;

export type Palette = typeof palette;
