import type { Metadata } from "next";

/*
 * About route layout.
 *
 * The page itself is a client component (every section uses scroll-linked
 * motion), and Next 16 disallows `metadata` export from client modules —
 * so the route's metadata lives here, on a minimal server wrapper that
 * just renders children.
 */

export const metadata: Metadata = {
  title: "About — Karishma Dewan",
  description:
    "Ex-Google strategist, founder, and AI builder. Strategy, taste, and code — for companies where AI feels as considered as the product around it.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
