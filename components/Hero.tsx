"use client";

import { motion } from "motion/react";
import HeroMedia from "./HeroMedia";

// Change this one line to swap the hero headline (e.g. "swimwear and self love").
const HERO_LINE = "ENDLESS SUMMER";

export default function Hero() {
  return (
    <section
      id="hero"
      // -mt-16 pulls the media up UNDER the transparent nav (nav height = h-16),
      // so the nav truly sits over the media. 100svh (never 100vh) for iOS chrome.
      className="relative -mt-16 h-[100svh] w-full overflow-hidden"
    >
      {/* Media (image | video | sequence) — object-cover, fills 100%. */}
      <HeroMedia />

      {/* Legibility: only two subtle gradients, no full-image overlay. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[120px]"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.25), transparent)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%]"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }}
        aria-hidden
      />

      {/* The ONLY text block — centered, anchored in the lower third. */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 bottom-[22%] flex flex-col items-center px-6 text-center md:bottom-[18%]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <h1
          className="font-display font-semibold uppercase text-cream"
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            letterSpacing: "0.15em",
            textShadow: "0 2px 16px rgba(0,0,0,0.35)",
          }}
        >
          {HERO_LINE}
        </h1>

        <a
          href="#shop"
          className="group mt-6 inline-flex min-h-12 items-center justify-center border border-cream px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-cream transition-colors duration-300 hover:bg-cream hover:text-ink"
          style={{ textShadow: "0 1px 10px rgba(0,0,0,0.25)" }}
        >
          Shop Now
        </a>
      </motion.div>
    </section>
  );
}
