"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/*
 * WorkGallery — three modes, picked at mount:
 *
 *  1. "pinned"    Desktop w/ fine pointer. Section pins to the viewport
 *                 for (N-1) × 100vh of scroll while the case-study row
 *                 translates horizontally. Includes parallax on the
 *                 image plate and a segmented progress rail. Arrow keys
 *                 advance when the section is in view.
 *  2. "carousel"  Touch-only (hover: none). Native horizontal scroll w/
 *                 scroll-snap — no hijack. iOS-friendly by construction.
 *  3. "list"      prefers-reduced-motion. Falls back to the original
 *                 vertical editorial list, unchanged in feel.
 *
 * Mode is picked client-side after mount. SSR renders "list" so the
 * page is SEO-friendly and there's no layout shift risk for users who
 * never hydrate (rare). The hydration swap to pinned/carousel happens
 * on the next frame and is visually instant because the header sits
 * above the viewport fold — the gallery isn't painted until scroll.
 */

const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export type WorkCase = {
  tag: string;
  year: string;
  title: string;
  description: string;
  preview: string; // CSS background-image (gradient)
  slug?: string;
};

type Mode = "pinned" | "carousel" | "list";

// useSyncExternalStore keeps us out of the "setState in effect" lint
// bucket and gives a clean SSR/client split: the server snapshot is
// always the safe default, the client snapshot reflects live state.

function useTouchOnly(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(hover: none)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(hover: none)").matches,
    () => false, // SSR: assume desktop (the richest layout)
  );
}

function useHasMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true, // client snapshot: mounted
    () => false, // server snapshot: not yet
  );
}

function useMode(): Mode {
  const prefersReduced = useReducedMotion();
  const touchOnly = useTouchOnly();
  const mounted = useHasMounted();

  // Pre-hydration: list (safe, static, SEO-visible).
  if (!mounted) return "list";
  if (prefersReduced) return "list";
  if (touchOnly) return "carousel";
  return "pinned";
}

export function WorkGallery({ cases }: { cases: WorkCase[] }) {
  const mode = useMode();

  if (mode === "list") return <ListFallback cases={cases} />;
  if (mode === "carousel") return <TouchCarousel cases={cases} />;
  return <PinnedGallery cases={cases} />;
}

/* ────────────────────────────────────────────────────────────────────
 * PINNED — desktop hijack mode.
 * ──────────────────────────────────────────────────────────────────── */

function PinnedGallery({ cases }: { cases: WorkCase[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const N = cases.length;
  const [active, setActive] = useState(0);

  // Progress 0..1 across the whole pinned section. "start start" means
  // progress = 0 the moment the section top hits viewport top; "end end"
  // means progress = 1 when the section bottom hits viewport bottom —
  // i.e., exactly when the pin releases.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Map 0..1 → 0vw .. -(N-1) × 100vw. Spring-smooth so keyboard jumps
  // and fast wheel bursts don't feel snappy-discrete.
  const xRaw = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `-${(N - 1) * 100}vw`],
  );
  const x = useSpring(xRaw, { damping: 40, stiffness: 260, mass: 0.6 });

  // Active-panel indicator — derived from scroll progress, not from
  // the spring-smoothed x (avoids "indicator lags behind reality").
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.round(v * (N - 1));
    const clamped = Math.max(0, Math.min(N - 1, idx));
    setActive(clamped);
  });

  // Keyboard nav — only when the section is actually pinned (i.e.,
  // occupying the full viewport). Otherwise arrow keys should do what
  // the user expects on the rest of the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const pinned = r.top <= 0 && r.bottom >= window.innerHeight;
      if (!pinned) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        window.scrollBy({ top: -window.innerHeight, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Jump-to via progress-rail click. Scroll to section.offsetTop + i*100vh.
  const jumpTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.offsetTop + i * window.innerHeight;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Selected work — horizontal gallery"
      // Total height determines how much vertical scroll the gallery
      // consumes. With N panels we want (N-1) panels worth of
      // *translation* to happen, and one panel's worth of "resting at
      // the end" before the pin releases — which is exactly what
      // height: N × 100vh gives us (sticky is pinned for
      // sectionHeight - viewportHeight = (N-1) × 100vh).
      style={{ height: `${N * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div
          className="flex h-full"
          style={{ x, width: `${N * 100}vw` }}
        >
          {cases.map((c, i) => (
            <PinnedPanel
              key={`${c.tag}-${c.year}-${i}`}
              c={c}
              index={i}
              total={N}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </motion.div>

        {/* Progress rail — segmented bar; thin editorial register. Each
            segment is clickable to jump to its panel. */}
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-2 px-8">
          {cases.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to project ${i + 1} of ${N}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => jumpTo(i)}
              className={`h-[2px] w-10 transition-colors duration-base ease-out-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background ${
                i === active ? "bg-accent" : "bg-border hover:bg-muted"
              }`}
            />
          ))}
          <span className="absolute -bottom-6 right-8 font-sans text-caption uppercase text-muted">
            <span className="text-accent">
              {String(active + 1).padStart(2, "0")}
            </span>{" "}
            / {String(N).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}

function PinnedPanel({
  c,
  index,
  total,
  scrollYProgress,
}: {
  c: WorkCase;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  // Parallax window: what fraction of 0..1 this panel owns. Panel i is
  // "centered" at progress i / (total − 1); its influence extends one
  // step on either side.
  const step = total === 1 ? 1 : 1 / (total - 1);
  const center = total === 1 ? 0.5 : index / (total - 1);

  // Image translates +/- 12% across its container, scales down at the
  // edges. Subtle — depth, not a show.
  const imgX = useTransform(
    scrollYProgress,
    [center - step, center, center + step],
    ["12%", "0%", "-12%"],
  );
  const imgScale = useTransform(
    scrollYProgress,
    [center - step, center, center + step],
    [0.94, 1, 0.94],
  );

  // Copy fades up slightly as the panel enters focus. Keeps attention
  // on the active panel without being theatrical.
  const copyOpacity = useTransform(
    scrollYProgress,
    [center - step * 0.6, center, center + step * 0.6],
    [0.45, 1, 0.45],
  );
  const copyY = useTransform(
    scrollYProgress,
    [center - step * 0.6, center, center + step * 0.6],
    [16, 0, -16],
  );

  return (
    <article
      tabIndex={-1}
      aria-label={`${c.tag}, ${c.year} — ${c.title}`}
      className="relative w-screen h-screen shrink-0"
    >
      <div className="grid h-full w-full grid-cols-[45%_55%]">
        {/* Image plate — parallax + scale */}
        <div className="relative overflow-hidden">
          <motion.div
            className="absolute inset-0 scale-[1.08]"
            style={{ x: imgX, scale: imgScale, backgroundImage: c.preview }}
            aria-hidden="true"
          />
        </div>

        {/* Copy side — everything is vertically centred inside the
            55% column with generous outer padding for breathing room. */}
        <motion.div
          className="flex flex-col justify-center gap-8 px-16 max-w-[650px]"
          style={{ opacity: copyOpacity, y: copyY }}
        >
          <div className="flex items-center gap-6 font-sans text-caption uppercase text-muted">
            <span>
              <span className="text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>{" "}
              · {c.tag}
            </span>
            <span>{c.year}</span>
          </div>
          <h2 className="font-serif text-display leading-[1.05]">{c.title}</h2>
          <p className="font-serif text-h3 text-secondary">{c.description}</p>
          {c.slug ? (
            <Link
              href={`/work/${c.slug}`}
              className="group inline-flex items-baseline gap-3 font-sans text-body-lg text-foreground hover:text-accent transition-colors duration-fast ease-out-soft"
            >
              <span>Read case study</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-fast ease-out-soft group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          ) : (
            <span className="font-sans text-caption uppercase text-muted italic">
              Write-up forthcoming.
            </span>
          )}
        </motion.div>
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * TOUCH CAROUSEL — native horizontal swipe, no hijack.
 * ──────────────────────────────────────────────────────────────────── */

function TouchCarousel({ cases }: { cases: WorkCase[] }) {
  return (
    <section
      aria-label="Selected work"
      className="relative py-8"
      // Scroll-snap params — mandatory snap, start alignment.
    >
      <div
        className="overflow-x-auto snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollPaddingInline: "8vw" }}
      >
        <div className="flex gap-4 px-[8vw] pb-6">
          {cases.map((c, i) => (
            <article
              key={`${c.tag}-${c.year}-${i}`}
              className="snap-start shrink-0 w-[84vw] flex flex-col gap-6"
            >
              <div
                className="w-full aspect-[4/5] rounded-sm overflow-hidden"
                style={{ backgroundImage: c.preview }}
                aria-hidden="true"
              />
              <div className="flex items-center gap-6 font-sans text-caption uppercase text-muted">
                <span>
                  <span className="text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>{" "}
                  · {c.tag}
                </span>
                <span>{c.year}</span>
              </div>
              <h2 className="font-serif text-h1 leading-[1.05]">{c.title}</h2>
              <p className="font-serif text-h3 text-secondary">
                {c.description}
              </p>
              {c.slug ? (
                <Link
                  href={`/work/${c.slug}`}
                  className="inline-flex items-baseline gap-3 font-sans text-body-lg text-foreground hover:text-accent transition-colors duration-fast ease-out-soft"
                >
                  <span>Read case study</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <span className="font-sans text-caption uppercase text-muted italic">
                  Write-up forthcoming.
                </span>
              )}
            </article>
          ))}
        </div>
      </div>
      <p className="mt-4 px-8 text-center font-sans text-caption uppercase text-muted">
        Swipe to explore
      </p>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * LIST — prefers-reduced-motion fallback. Same register as the prior
 * vertical editorial list so nothing about the feel changes for users
 * with the motion preference.
 * ──────────────────────────────────────────────────────────────────── */

function ListFallback({ cases }: { cases: WorkCase[] }) {
  return (
    <section
      aria-label="Selected work"
      className="mx-auto max-w-6xl px-8 border-t border-b border-border divide-y divide-border"
    >
      {cases.map((c, i) =>
        c.slug ? (
          <Link
            key={`${c.tag}-${c.year}-${i}`}
            href={`/work/${c.slug}`}
            className="group block py-16"
          >
            <ListRow c={c} index={i} linked />
          </Link>
        ) : (
          <article key={`${c.tag}-${c.year}-${i}`} className="py-16">
            <ListRow c={c} index={i} linked={false} />
          </article>
        ),
      )}
    </section>
  );
}

function ListRow({
  c,
  index,
  linked,
}: {
  c: WorkCase;
  index: number;
  linked: boolean;
}) {
  return (
    <div className="grid gap-y-6 gap-x-12 md:grid-cols-[10rem_1fr]">
      <div className="flex flex-col gap-1 font-sans text-caption uppercase text-muted">
        <span>
          <span className="text-accent">
            {String(index + 1).padStart(2, "0")}
          </span>{" "}
          · {c.tag}
        </span>
        <span>{c.year}</span>
      </div>
      <div className="flex flex-col gap-4">
        <h2
          className={`font-serif text-h1 text-foreground ${
            linked
              ? "group-hover:text-accent transition-colors duration-fast ease-out-soft"
              : ""
          }`}
        >
          {c.title}
        </h2>
        <p className="font-serif text-h3 text-secondary max-w-2xl">
          {c.description}
        </p>
      </div>
    </div>
  );
}

// Unused, kept to silence unused import warnings if ease changes. Compiler
// will tree-shake; readers know the intended easing.
export { EASE_OUT_SOFT };
