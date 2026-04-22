/**
 * Palette — single source of truth for colour values.
 *
 * These values are mirrored in `app/globals.css` inside the @theme block.
 * If you change a value here, update globals.css to match.
 * (CSS cannot import from TS; conventional mirroring is the simplest
 * reliable pattern for a Tailwind v4 CSS-first config.)
 *
 * Warm palette: every neutral leans toward paper and earth, not slate.
 * Four anchor values for theme-aware fg/bg:
 *   ink   — dark-mode bg (warm ink-black)
 *   char  — light-mode fg (warm near-black)
 *   cream — dark-mode fg (warm cream)
 *   paper — light-mode bg (warm cream-white)
 * The grey scale is tinted toward sand, not blue.
 */

export const palette = {
  ink: "#0D0A08",
  char: "#1A1512",
  cream: "#EDE5D8",
  paper: "#F5EFE6",

  clay: {
    DEFAULT: "#B8604A",
    hover: "#C96E55",
  },

  grey: {
    50: "#F0ECE3",
    100: "#E3DCD0",
    200: "#CCC4B5",
    300: "#B0A895",
    400: "#857F6E",
    500: "#615B4E",
    600: "#434030",
    700: "#2A2822",
    800: "#1A1816",
    900: "#12100D",
  },
} as const;

export type Palette = typeof palette;
