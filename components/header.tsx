"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ChatModal } from "./chat-modal";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { index: "01", href: "/work", label: "Work" },
  { index: "02", href: "/about", label: "About" },
  { index: "03", href: "/services", label: "Services" },
  { index: "04", href: "/contact", label: "Contact" },
];

const TOOLTIP_STORAGE_KEY = "chat-tooltip-seen";
// Delay between page settle and tooltip appearing — long enough to feel
// considered, short enough that the user is still oriented on the header.
const TOOLTIP_SHOW_DELAY_MS = 900;
// How long the tooltip stays up before auto-dismissing.
const TOOLTIP_VISIBLE_MS = 8000;

export function Header() {
  const [pinned, setPinned] = useState(false);
  // Chat modal lives in the header so it's mounted everywhere on the
  // site without needing to thread state through layout/page boundaries.
  const [chatOpen, setChatOpen] = useState(false);
  // First-visit tooltip — appears once, ever, per visitor (localStorage).
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

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

  // Mark the tooltip as "seen" — both hides it now and persists the flag
  // so it never re-shows for this visitor on this device. Stable callback
  // so it can be referenced in the visibility timer cleanup safely.
  const markTooltipSeen = useCallback(() => {
    setTooltipVisible(false);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(TOOLTIP_STORAGE_KEY, "1");
      } catch {
        // Private mode / disabled storage — not fatal, just means the
        // tooltip might re-show on the next visit. Acceptable.
      }
    }
  }, []);

  // First-visit tooltip lifecycle: read storage, show after a delay,
  // auto-dismiss after a timeout. setState calls are inside callbacks
  // (setTimeout), not the effect body — keeps React 19's "setState in
  // effect" lint rule happy.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let seen = false;
    try {
      seen = window.localStorage.getItem(TOOLTIP_STORAGE_KEY) === "1";
    } catch {
      seen = true; // if storage is broken, don't risk re-showing forever
    }
    if (seen) return;

    const showTimer = window.setTimeout(() => {
      setTooltipVisible(true);
    }, TOOLTIP_SHOW_DELAY_MS);
    const hideTimer = window.setTimeout(() => {
      markTooltipSeen();
    }, TOOLTIP_SHOW_DELAY_MS + TOOLTIP_VISIBLE_MS);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [markTooltipSeen]);

  const onTriggerClick = () => {
    setChatOpen(true);
    // Tooltip's job is done the moment the user has acknowledged the
    // feature, whether by clicking the trigger or the tooltip's dismiss.
    if (tooltipVisible) markTooltipSeen();
  };

  return (
    <>
      <motion.header
        initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.4,
          delay: prefersReducedMotion ? 0 : 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
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

          <div className="flex items-center gap-10 md:gap-12">
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

            {/* Ask-me trigger — pill-shaped, terracotta border, pulsing dot.
                Stands out without shouting. Sits between nav and theme
                toggle. Wrapped in a relative container so the first-visit
                tooltip can be absolutely positioned beneath it. */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={onTriggerClick}
                aria-label="Open chat with Karishma's assistant"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-accent/60 hover:border-accent hover:bg-accent/10 transition-colors duration-fast ease-out-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <motion.span
                  aria-hidden="true"
                  className="w-[8px] h-[8px] rounded-full bg-accent shrink-0"
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { scale: [1, 1.35, 1], opacity: [0.9, 0.5, 0.9] }
                  }
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                  }
                />
                <span className="font-serif italic text-body-lg lowercase text-foreground">
                  ask me anything
                </span>
              </button>

              {/* First-visit tooltip — anchored to the button's lower edge,
                  right-aligned. Hidden on subsequent visits (localStorage).
                  AnimatePresence handles the fade in/out cleanly. */}
              <AnimatePresence>
                {tooltipVisible && (
                  <motion.div
                    role="status"
                    aria-live="polite"
                    initial={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -8 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -8 }
                    }
                    transition={{
                      duration: prefersReducedMotion ? 0.2 : 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute top-full right-0 mt-3 w-[280px] bg-surface border border-border rounded-sm shadow-2xl p-4 pr-9"
                  >
                    {/* Small triangle/notch pointing up at the button —
                        pure CSS, sits flush with the bubble's top edge. */}
                    <span
                      aria-hidden="true"
                      className="absolute -top-[1px] right-6 w-3 h-3 bg-surface border-l border-t border-border"
                      style={{ transform: "translateY(-50%) rotate(45deg)" }}
                    />
                    <p className="font-serif italic text-body-lg text-foreground leading-[1.4]">
                      An AI assistant trained on this site — ask anything
                      about her work.
                    </p>
                    <button
                      type="button"
                      aria-label="Dismiss tooltip"
                      onClick={markTooltipSeen}
                      className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center text-muted hover:text-foreground rounded-full hover:bg-background/40 transition-colors duration-fast ease-out-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <span aria-hidden="true" className="text-lg leading-none">
                        ×
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
