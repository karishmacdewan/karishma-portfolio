"use client";

import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/*
 * ServicesCarousel — cleanly navigable horizontal carousel.
 *
 * Simpler than WorkGallery: no scroll-hijack, no pin. Just a horizontal
 * scroll container with CSS scroll-snap (snap-x mandatory + snap-start).
 * Works identically on desktop and touch because the primitive is native
 * scroll. Desktop gets keyboard arrows + edge chevrons; touch gets native
 * swipe inertia for free.
 *
 *   Layout: panels are 80vw wide, with 10vw scroll-padding-inline on the
 *   container so neighbours peek ~10% on either side of the active panel.
 *   Gap: 2vw between panels. First/last panel reach the edges via the
 *   container's 10vw side padding, so the user can scroll to the literal
 *   start/end without dead space.
 *
 *   Navigation:
 *     - Left/right chevron buttons (visible on ≥md, touch-only hides
 *       them — swipe is the primary interaction there).
 *     - Keyboard Arrow Left/Right when any panel has focus.
 *     - Click the pagination dots to jump.
 *
 *   Indicator: "02 / 04" counter + segmented dots along the bottom.
 *
 *   prefers-reduced-motion: behaves the same structurally but disables
 *   smooth scrolling — jumps are instant so the motion preference is
 *   honoured at the interaction layer.
 */

export type Service = {
  name: string;
  description: string;
  deliverables: string[];
  caseStudyTitle?: string;
  caseStudyHref?: string;
};

export function ServicesCarousel({ services }: { services: Service[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  // Recompute active index from scroll position. We measure the track's
  // children each time (cheap enough at 4 panels) so resize doesn't
  // require a separate observer.
  const syncIndex = useCallback(() => {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const panels = Array.from(track.children) as HTMLElement[];
    const scrollLeft = el.scrollLeft;
    // Find the panel whose left edge is closest to the container's
    // scroll-padding-left (10vw). scrollLeft=0 corresponds to panel 0.
    let best = 0;
    let bestDist = Infinity;
    const targetOffset = window.innerWidth * 0.1; // 10vw
    panels.forEach((p, i) => {
      const dist = Math.abs(p.offsetLeft - scrollLeft - targetOffset);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setIndex(best);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", syncIndex, { passive: true });
    window.addEventListener("resize", syncIndex);
    // Initial sync after layout settles — rAF defers until paint, which
    // is plenty. No setState-in-effect lint concern: setIndex fires from
    // inside a requestAnimationFrame callback.
    const raf = requestAnimationFrame(syncIndex);
    return () => {
      el.removeEventListener("scroll", syncIndex);
      window.removeEventListener("resize", syncIndex);
      cancelAnimationFrame(raf);
    };
  }, [syncIndex]);

  const goTo = useCallback(
    (i: number) => {
      const el = scrollRef.current;
      const track = trackRef.current;
      if (!el || !track) return;
      const clamped = Math.max(0, Math.min(services.length - 1, i));
      const panels = Array.from(track.children) as HTMLElement[];
      const panel = panels[clamped];
      if (!panel) return;
      // Subtract the container's scroll-padding-left so the panel snaps
      // to the 10vw mark, not the container's left edge.
      const targetLeft = panel.offsetLeft - window.innerWidth * 0.1;
      el.scrollTo({
        left: targetLeft,
        behavior: prefersReduced ? "auto" : "smooth",
      });
    },
    [services.length, prefersReduced],
  );

  // Keyboard — only when focus is inside the carousel subtree, so Arrow
  // keys elsewhere keep behaving normally.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    }
  };

  return (
    <section
      aria-label="Services"
      className="relative"
      onKeyDown={onKeyDown}
    >
      {/* Scroll container — horizontal overflow + snap. The inner track
          is a flex row with panels. Scroll-padding-inline pushes the
          snap point 10vw from the container edge so the next/previous
          panel always peeks. */}
      <div
        ref={scrollRef}
        className="overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollPaddingInline: "10vw" }}
      >
        <div
          ref={trackRef}
          className="flex gap-[2vw] px-[10vw] py-4"
        >
          {services.map((s, i) => (
            <ServicePanel key={s.name} s={s} index={i} />
          ))}
        </div>
      </div>

      {/* Edge chevrons — visible on ≥md (desktop), hidden on touch where
          swipe is the primary interaction. Disabled state fades out but
          stays in layout to avoid the controls jumping. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden md:flex items-center justify-between px-4">
        <button
          type="button"
          aria-label="Previous service"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="pointer-events-auto w-12 h-12 rounded-full bg-surface/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground transition-opacity duration-base ease-out-soft hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span aria-hidden="true" className="font-sans text-body-lg">
            ←
          </span>
        </button>
        <button
          type="button"
          aria-label="Next service"
          onClick={() => goTo(index + 1)}
          disabled={index === services.length - 1}
          className="pointer-events-auto w-12 h-12 rounded-full bg-surface/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground transition-opacity duration-base ease-out-soft hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span aria-hidden="true" className="font-sans text-body-lg">
            →
          </span>
        </button>
      </div>

      {/* Pagination — segmented bar + counter, editorial register. Dots
          are clickable to jump. Lives below the carousel, centred. */}
      <div className="mt-10 flex items-center justify-center gap-4 px-8">
        <div className="flex gap-2">
          {services.map((s, i) => (
            <button
              key={s.name}
              type="button"
              aria-label={`Go to service ${i + 1} of ${services.length}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => goTo(i)}
              className={`h-[2px] w-10 transition-colors duration-base ease-out-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background ${
                i === index ? "bg-accent" : "bg-border hover:bg-muted"
              }`}
            />
          ))}
        </div>
        <span className="font-sans text-caption uppercase text-muted">
          <span className="text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>{" "}
          / {String(services.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}

function ServicePanel({ s, index }: { s: Service; index: number }) {
  return (
    <article
      tabIndex={0}
      aria-label={s.name}
      // Panel is 80vw wide, min-height sized so content breathes on
      // short viewports. The surface background + border + inner
      // padding make each panel feel like a plate rather than a strip
      // of the page. shrink-0 stops flex from compressing it.
      className="snap-start shrink-0 w-[80vw] min-h-[60vh] bg-surface border border-border rounded-sm p-10 md:p-14 flex flex-col gap-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <header className="flex flex-col gap-6">
        <p className="font-sans text-caption uppercase text-muted">
          <span className="text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>{" "}
          · Service
        </p>
        <h2 className="font-serif text-display leading-[1.05]">{s.name}</h2>
        <p className="font-serif text-h3 text-secondary max-w-2xl">
          {s.description}
        </p>
      </header>

      <div className="grid gap-y-10 gap-x-12 md:grid-cols-[auto_1fr]">
        <div>
          <p className="font-sans text-caption uppercase text-muted mb-4">
            Deliverables
          </p>
          <ul className="flex flex-col gap-2 font-sans text-body text-foreground max-w-md">
            {s.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="text-accent shrink-0 mt-1"
                >
                  —
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        {s.caseStudyHref && s.caseStudyTitle ? (
          <div className="md:border-l md:border-border md:pl-12 flex flex-col gap-3 justify-end max-w-sm">
            <p className="font-sans text-caption uppercase text-muted">
              Representative case study
            </p>
            <Link
              href={s.caseStudyHref}
              className="group inline-flex items-baseline gap-3 font-serif italic text-h3 text-foreground hover:text-accent transition-colors duration-fast ease-out-soft"
            >
              <span>{s.caseStudyTitle}</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-fast ease-out-soft group-hover:translate-x-1 shrink-0"
              >
                →
              </span>
            </Link>
          </div>
        ) : (
          <div className="md:border-l md:border-border md:pl-12 flex flex-col gap-3 justify-end max-w-sm">
            <p className="font-sans text-caption uppercase text-muted">
              Availability
            </p>
            <p className="font-serif italic text-h3 text-secondary">
              By referral or direct note.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
