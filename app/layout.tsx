import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";
import { ScrollProgress } from "@/components/scroll-progress";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Karishma Dewan — Strategy, taste, and code.",
  description:
    "Strategy, taste, and code. I build AI products for companies that care how AI feels, not just what it does.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <ScrollProgress />
        {/*
         * `relative` on <main> gives the pinned galleries a positioned
         * ancestor for useScroll's offset math. Without it, Framer
         * Motion emits "container has a non-static position" warnings
         * and scroll-linked motion values fail to update — silently
         * breaks /work and /about horizontal galleries.
         */}
        <main className="flex-1 relative">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
