import type { Metadata } from "next";

/*
 * Aperture route layout.
 *
 * The page is a client component (every section uses scroll-triggered
 * motion + a page-level scroll-snap register), and Next disallows a
 * `metadata` export from client modules — so the route's metadata lives
 * here, on a minimal server wrapper that just renders children. Same
 * pattern as app/about/layout.tsx.
 */

export const metadata: Metadata = {
  title: "Aperture, a benchmarking tool for AI ingestion pipelines — Karishma Dewan",
  description:
    "Helping enterprise knowledge reach AI: a solo-built tool that benchmarks document ingestion architectures on evidence, not assumptions.",
};

export default function ApertureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
