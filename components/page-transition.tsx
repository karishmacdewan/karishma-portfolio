"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRef } from "react";

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
 *
 * STICKY INTEROP: once the enter animation completes we clear the
 * inline transform. Without this, motion leaves `transform: translateY(0)`
 * on the wrapper, which creates a containing block for `position: fixed`
 * and alters the behaviour of `position: sticky` descendants (their
 * sticky ancestor becomes the transformed wrapper, clamping their pin
 * range). Pages that rely on sticky scroll sections (e.g. /work's
 * pinned gallery) need the transform gone at rest. On the next route
 * change AnimatePresence mounts a new child with its own initial, so
 * this one-time clear is safe.
 */

const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        ref={ref}
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
        // Fires on every completed segment; we only want to clear after
        // "enter" (not "exit" — that element is about to unmount). The
        // simplest signal: the final animate value. If the target object
        // is the enter animate (y: 0), wipe the transform.
        onAnimationComplete={(def) => {
          const isEnter =
            def && typeof def === "object" && "y" in def && def.y === 0;
          if (isEnter && ref.current) {
            // Remove the inline transform so sticky descendants pin to
            // the viewport instead of to this wrapper.
            ref.current.style.transform = "";
          }
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
