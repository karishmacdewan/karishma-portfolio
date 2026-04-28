import OpenAI from "openai";
import { KARISHMA_CONTEXT, SYSTEM_RULES } from "@/lib/karishma-context";

/*
 * Chat API route — POSTs from the chat modal land here.
 *
 * Flow:
 *   1. Client sends { messages: [...] } where messages alternate user/assistant.
 *   2. We call OpenAI's gpt-4o-mini with our system prompt (rules +
 *      context), streaming the response.
 *   3. We pipe the streamed tokens back to the client as plain text chunks
 *      so the modal can render them progressively.
 *
 * Notes:
 *  - The API key lives in the OPENAI_API_KEY env var (set in Vercel and
 *    in .env.local for local dev). Never sent to the client.
 *  - Basic rate limiting: per-IP, in-memory, 30 messages / hour. Resets
 *    when the function cold-starts. Good enough for a portfolio site;
 *    upgrade to Upstash KV if abuse becomes a real problem.
 *  - Per-message hard caps: 800 chars in, 600 tokens out. Keeps any
 *    single chat short and cheap.
 */

// Edge runtime would be slightly faster here, but the OpenAI SDK works
// best on the Node runtime and streaming is identical. Keep Node default.
export const runtime = "nodejs";

// In-memory rate limiter. Module-level state persists across warm
// invocations of the same function instance.
type RateRecord = { count: number; windowStart: number };
const RATE_LIMIT = {
  maxPerHour: 30,
  windowMs: 60 * 60 * 1000,
};
const rateBuckets = new Map<string, RateRecord>();

function checkRate(ip: string): { ok: boolean; remaining: number } {
  const now = Date.now();
  const rec = rateBuckets.get(ip);
  if (!rec || now - rec.windowStart > RATE_LIMIT.windowMs) {
    rateBuckets.set(ip, { count: 1, windowStart: now });
    return { ok: true, remaining: RATE_LIMIT.maxPerHour - 1 };
  }
  if (rec.count >= RATE_LIMIT.maxPerHour) {
    return { ok: false, remaining: 0 };
  }
  rec.count += 1;
  return { ok: true, remaining: RATE_LIMIT.maxPerHour - rec.count };
}

// Validate one message at the API boundary so a malicious client can't
// blow up cost by sending a 1MB user message.
type ChatMessage = { role: "user" | "assistant"; content: string };

function validate(messages: unknown): ChatMessage[] | null {
  if (!Array.isArray(messages) || messages.length === 0) return null;
  if (messages.length > 40) return null; // hard cap on history length
  const out: ChatMessage[] = [];
  for (const m of messages) {
    if (
      !m ||
      typeof m !== "object" ||
      !("role" in m) ||
      !("content" in m) ||
      typeof (m as { content: unknown }).content !== "string"
    ) {
      return null;
    }
    const role = (m as { role: unknown }).role;
    const content = (m as { content: string }).content;
    if (role !== "user" && role !== "assistant") return null;
    if (content.length === 0 || content.length > 800) return null;
    out.push({ role, content });
  }
  // First message must be user; messages must alternate.
  if (out[0].role !== "user") return null;
  for (let i = 1; i < out.length; i++) {
    if (out[i].role === out[i - 1].role) return null;
  }
  return out;
}

export async function POST(req: Request) {
  // Pull the client IP from the standard Vercel/Next header. Fall back to
  // a constant string in dev so the rate limiter still functions.
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local";
  const rate = checkRate(ip);
  if (!rate.ok) {
    return new Response(
      "You've reached the message limit for this hour. Try again later, or email Karishma directly at karishmadewan0@gmail.com.",
      { status: 429, headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON.", { status: 400 });
  }

  const messages = validate(
    (body as { messages?: unknown } | null)?.messages,
  );
  if (!messages) {
    return new Response("Invalid messages.", { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Fail loud in dev, soft on prod (don't leak that the key is missing).
    console.error("OPENAI_API_KEY is not set");
    return new Response("The chat assistant is unavailable right now.", {
      status: 500,
    });
  }

  const client = new OpenAI({ apiKey });

  // Build the messages array OpenAI expects: a single system message
  // followed by the alternating user/assistant turns. We concatenate the
  // rules and context with a blank line so the model treats them as one
  // coherent system prompt.
  const systemPrompt = `${SYSTEM_RULES}\n\n${KARISHMA_CONTEXT}`;

  const oaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  // Stream OpenAI → client. Use a ReadableStream so we can convert
  // the SDK's typed chunks into the plain text bytes the modal expects.
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const completion = await client.chat.completions.create({
          model: "gpt-4o-mini",
          max_tokens: 600,
          messages: oaiMessages,
          stream: true,
        });

        // Each chunk has a `choices[0].delta.content` string we can
        // forward straight to the client. Some chunks (role announcement,
        // finish-reason-only) carry no content — skip those.
        for await (const chunk of completion) {
          const piece = chunk.choices[0]?.delta?.content;
          if (piece) {
            controller.enqueue(encoder.encode(piece));
          }
        }
        controller.close();
      } catch (err: unknown) {
        // If anything goes wrong mid-stream, push an apology and close.
        console.error("[chat] stream error:", err);
        const apology =
          "\n\n[Sorry — I hit an error answering that. Try again, or email Karishma directly at karishmadewan0@gmail.com.]";
        controller.enqueue(encoder.encode(apology));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-RateLimit-Remaining": String(rate.remaining),
    },
  });
}
