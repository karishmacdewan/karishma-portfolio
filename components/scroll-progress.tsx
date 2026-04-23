"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

/*
 * ScrollProgress — ambient page-level progress rail.
 *
 * A 2px vertical line fixed to the viewport's right edge. The terracotta
 * fill grows top → bottom as scroll progresses. No track — the line only
 * exists where the scroll has been, so it reads as ambient information
 * rather than a progress bar for an action.
 *
 * Visibility gate: only shown on pages taller than 2 × viewport height.
 * Short pages (contact, services) skip the rail entirely so it doesn't
 * feel like UI chrome on a one-screen route.
 *
 * Route-aware without a pathname dep: we observe the <html> element with
 * ResizeObserver, so the check re-fires whenever the document height
 * actually changes. This sidesteps the race between a pathname change
 * and the new page's layout completing (PageTransition's exit runs for
 * ~200ms, during which scrollHeight is mid-transition and reading it on
 * a naive pathname-driven rAF gives stale values). ResizeObserver only
 * fires after layout settles — clean signal, no timing tuning.
 *
 * Motion: scaleY on a transparent container with origin-top so the fill
 * grows downward. Honours prefers-reduced-motion implicitly — the fill
 * is a live scroll-linked motion value, no animation timeline, so the
 * user's scrolling is what drives it. (The brief says the indicator
 * stays on even under reduced-motion, as a static element; because our
 * implementation has no independent animation to disable, we're already
 * compliant.)
 */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // setState is gated inside callbacks (rAF / timeout / ResizeObserver
    // / event handler), not called synchronously in the effect body —
    // keeps React 19's "setState in effect" lint rule happy.
    let rafId = 0;
    let timerId: ReturnType<typeof setTimeout> | null = null;
    const check = () => {
      setVisible(
        document.documentElement.scrollHeight > 2 * window.innerHeight,
      );
    };
    const schedule = () => {
      cancelAnimationFrame(rafId);
      if (timerId) clearTimeout(timerId);
      rafId = requestAnimationFrame(check);
      // Belt-and-suspenders: re-check well after the page transition
      // (~600ms) settles AND after slow client components finish mounting
      // (e.g. /work's pinned gallery adds a 6×100vh section after its
      // hydration effect runs, which ResizeObserver's initial fire can
      // miss). 1200ms covers every mount path we have without feeling
      // laggy — the rail's opacity fade is already 300ms so the user
      // sees a smooth settle.
      timerId = setTimeout(check, 1200);
    };
    schedule();
    window.addEventListener("resize", schedule);
    // ResizeObserver on <body> catches every layout change — route
    // transitions, font load reflows, images resolving, etc. Much more
    // reliable than pathname-based timing. (Originally observed
    // <html>, but the root <html> has `h-full` so its own box size is
    // viewport-locked; <body> is `min-h-full flex-col` and expands
    // with content, which is what we actually need to watch.)
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    // Scroll is the user's definitive signal that real content is laid
    // out — if they're scrolling, we have committed dimensions. Cheap
    // safety net for edge cases the observers miss.
    const onScroll = () => schedule();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      if (timerId) clearTimeout(timerId);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  // Map scrollYProgress (0..1) straight through. Using it on scaleY with
  // origin-top means the bar grows from 0 height to full height.
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 right-0 z-40 h-screen w-[2px] ${
        visible ? "opacity-100" : "opacity-0"
      } transition-opacity duration-base ease-out-soft`}
    >
      <motion.div
        className="w-full h-full bg-accent origin-top"
        style={{ scaleY }}
      />
    </div>
  );
}
