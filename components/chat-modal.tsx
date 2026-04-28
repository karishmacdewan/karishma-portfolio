"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

/*
 * ChatModal — a focused dialog for asking questions about Karishma.
 *
 * Shape:
 *   - Centered modal w/ backdrop blur
 *   - Italic serif h2 title, small caption with a suggestion
 *   - Message list: user right-aligned (sans), assistant left-aligned
 *     (italic serif — matches the rest of the site's editorial register)
 *   - Streaming: tokens append to the last assistant message as they
 *     arrive from /api/chat
 *   - Auto-scrolls as new tokens arrive
 *   - ESC closes. Click the backdrop closes. Submit with Enter (Shift+Enter
 *     for newline). Disabled while streaming.
 *   - Reduced-motion: skips the modal mount animation, content still
 *     renders normally.
 */

const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What kind of AI work does she do?",
  "Is she available for new projects?",
  "Tell me about the wellness brand",
  "What's her background?",
] as const;

export function ChatModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // AbortController so we can cancel an in-flight request if the user
  // closes the modal mid-stream.
  const abortRef = useRef<AbortController | null>(null);

  // ESC-to-close + focus the input on mount.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // Defer focus a tick so the modal has mounted.
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(id);
    };
  }, [open, onClose]);

  // Cancel any in-flight stream when the modal closes.
  useEffect(() => {
    if (!open) {
      abortRef.current?.abort();
      abortRef.current = null;
    }
  }, [open]);

  // Auto-scroll to bottom whenever messages or streaming state change.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, streaming]);

  const sendQuery = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed || streaming) return;
      setError(null);
      setInput("");

      // Optimistically add the user turn AND a placeholder assistant turn
      // we'll fill in as tokens arrive.
      const next: Message[] = [
        ...messages,
        { role: "user", content: trimmed },
        { role: "assistant", content: "" },
      ];
      setMessages(next);
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Send the full conversation up to (but not including) the empty
          // placeholder we just pushed.
          body: JSON.stringify({ messages: next.slice(0, -1) }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          // Strip the empty assistant placeholder so the error reads cleanly.
          setMessages((prev) => prev.slice(0, -1));
          setError(
            text ||
              "Something went wrong. Try again, or email Karishma directly at karishmadewan0@gmail.com.",
          );
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setError("Streaming isn't available in this browser.");
          return;
        }
        const decoder = new TextDecoder();
        // Read the stream and append chunks to the last (assistant) message.
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (chunk) {
            setMessages((prev) => {
              const out = prev.slice();
              const last = out[out.length - 1];
              if (last && last.role === "assistant") {
                out[out.length - 1] = {
                  ...last,
                  content: last.content + chunk,
                };
              }
              return out;
            });
          }
        }
      } catch (err: unknown) {
        // AbortError fires when the user closes the modal mid-stream — silent.
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("[chat] client error:", err);
        setMessages((prev) => prev.slice(0, -1));
        setError(
          "Network error. Try again, or email Karishma directly at karishmadewan0@gmail.com.",
        );
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, streaming],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendQuery(input);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          // Backdrop — fixed full-screen, blurred + semi-transparent.
          // Click to close.
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT_SOFT }}
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-md flex items-center justify-center p-4"
          role="presentation"
        >
          <motion.div
            // Modal — stops click propagation so backdrop click only
            // fires when actually outside the modal.
            initial={reduced ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE_OUT_SOFT }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-modal-title"
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-surface border border-border rounded-sm shadow-2xl"
          >
            {/* Close button — top-right */}
            <button
              type="button"
              aria-label="Close chat"
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-muted hover:text-foreground hover:bg-background/50 transition-colors duration-fast ease-out-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                ×
              </span>
            </button>

            {/* Header — italic serif title + small qualifier */}
            <header className="px-8 pt-10 pb-6 border-b border-border">
              <h2
                id="chat-modal-title"
                className="font-serif italic text-h2 text-foreground"
              >
                Ask me about Karishma.
              </h2>
              <p className="font-sans text-caption uppercase text-muted mt-3 tracking-wide">
                <span className="text-accent">●</span> AI assistant ·
                Trained on this site
              </p>
            </header>

            {/* Message scroll area + suggestions when empty */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6"
            >
              {messages.length === 0 ? (
                <div className="flex flex-col gap-3">
                  <p className="font-serif italic text-body-lg text-muted">
                    Try a question like:
                  </p>
                  <div className="flex flex-col gap-2 items-start">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => sendQuery(s)}
                        className="text-left font-serif italic text-body-lg text-foreground hover:text-accent transition-colors duration-fast ease-out-soft focus:outline-none focus-visible:text-accent"
                      >
                        &ldquo;{s}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={
                        m.role === "user"
                          ? // User: sans, foreground, with a subtle terracotta-tinted bg
                            "max-w-[75%] font-sans text-body text-foreground bg-background/60 border border-border rounded-sm px-4 py-3"
                          : // Assistant: italic serif (matches site register)
                            "max-w-[85%] font-serif italic text-body-lg text-foreground leading-[1.5]"
                      }
                    >
                      {m.content}
                      {streaming &&
                        i === messages.length - 1 &&
                        m.role === "assistant" && (
                          <span
                            aria-hidden="true"
                            className="inline-block ml-1 w-2 h-4 bg-accent align-middle animate-pulse"
                          />
                        )}
                    </div>
                  </div>
                ))
              )}

              {error && (
                <p className="font-sans text-small text-muted italic">
                  {error}
                </p>
              )}
            </div>

            {/* Input — textarea + submit button */}
            <form
              onSubmit={onSubmit}
              className="border-t border-border px-6 py-4 flex items-end gap-3"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  // Enter submits, Shift+Enter inserts a newline.
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendQuery(input);
                  }
                }}
                placeholder="Ask anything…"
                maxLength={800}
                rows={1}
                disabled={streaming}
                className="flex-1 resize-none bg-transparent font-sans text-body text-foreground placeholder:text-muted focus:outline-none disabled:opacity-50 py-2"
                aria-label="Your question"
              />
              <button
                type="submit"
                disabled={streaming || input.trim().length === 0}
                aria-label="Send question"
                className="shrink-0 font-sans text-caption uppercase text-foreground hover:text-accent transition-colors duration-fast ease-out-soft disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:text-accent"
              >
                {streaming ? "Thinking…" : "Send →"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
