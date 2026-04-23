"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

/*
 * PageTransition — route-level fade/shift between pages.
 *
 * Shape (per design brief):
 *   Out: 200ms, opacity 1 → 0, translateY 0 → -20px, ease-out-soft
 *   In:  400ms, opacity 0 → 1, translateY +20px → 0, ease-out-soft
 *   Total ~600ms — mode="wait" runs exit to completion before enter starts.
 *
 * Notes:
 *  - `initial={false}` suppresses the transition on first mount, so the
 *    hero's own intro animation on "/" isn't stacked underneath a route
 *    fade-in. Route changes after mount animate normally.
 *  - Keyed by `usePathname()` so each route is a distinct child and
 *    AnimatePresence fires on navigation.
 *  - Honours prefers-reduced-motion: returns children plain, no mount of
 *    AnimatePresence at all.
 *  - Wraps inside the main element only (Header/Footer stay put) so the
 *    fixed chrome doesn't wobble between routes.
 */

const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: EASE_OUT_SOFT },
        }}
        exit={{
          opacity: 0,
          y: -20,
          transition: { duration: 0.2, ease: EASE_OUT_SOFT },
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
