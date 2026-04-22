"use client";

import { motion } from "framer-motion";

const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const;
const DURATION_SLOW = 0.6;

const wordVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_SLOW, ease: EASE_OUT_SOFT },
  },
};

const lineVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export default function HomePage() {
  return (
    <section className="min-h-screen mx-auto max-w-6xl px-8 flex flex-col justify-center">
      <motion.h1
        variants={lineVariants}
        initial="hidden"
        animate="visible"
        className="font-serif text-display"
      >
        <motion.span variants={wordVariants} className="inline-block">
          Strategy,
        </motion.span>{" "}
        <motion.span variants={wordVariants} className="inline-block">
          <span className="italic">taste</span>,
        </motion.span>{" "}
        <motion.span variants={wordVariants} className="inline-block">
          and
        </motion.span>{" "}
        <motion.span variants={wordVariants} className="inline-block">
          code.
        </motion.span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: DURATION_SLOW,
          ease: EASE_OUT_SOFT,
          delay: 1.2,
        }}
        className="font-serif text-h3 text-muted mt-12 max-w-3xl"
      >
        Most AI gets built by people who only have one. I build products with
        all three — for companies that care how AI feels, not just what it
        does.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: DURATION_SLOW,
          ease: EASE_OUT_SOFT,
          delay: 1.9,
        }}
        className="mt-32 font-sans text-caption uppercase text-muted"
      >
        Ex-Google · Founder · Engineer
      </motion.div>
    </section>
  );
}
