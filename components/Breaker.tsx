"use client";

import { motion } from "motion/react";
import { SketchHeart, SketchUnderline } from "./SketchUnderline";

export default function Breaker() {
  return (
    <section className="relative overflow-hidden bg-paper-pink py-20 sm:py-28">
      {/* notebook rule lines */}
      <div className="paper-lines absolute inset-0 opacity-70" aria-hidden />
      {/* margin line */}
      <div className="absolute inset-y-0 left-8 w-px bg-puccii-pink/40 sm:left-14" aria-hidden />

      <div className="relative mx-auto max-w-4xl px-8 text-center sm:px-6">
        <SketchHeart className="mx-auto mb-4 h-9 w-9 text-puccii-pink" />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="relative inline-block font-hand text-[clamp(3rem,13vw,6.5rem)] leading-[0.95] text-ink"
        >
          be bold, be beachy,
          <br />
          be PUCCII.
          <SketchUnderline className="absolute -bottom-3 left-[8%] h-5 w-[84%]" color="#F06BB0" />
        </motion.p>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-puccii-pink">
          swimwear &amp; self love
        </p>
      </div>
    </section>
  );
}
