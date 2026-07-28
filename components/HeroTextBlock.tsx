"use client";

import { forwardRef } from "react";
import { HERO_LINE } from "@/lib/media";

/**
 * The one persistent hero block (TRIANGL-style): headline + SHOP NOW, centered
 * in the lower third. `.text-legible` gives a double text-shadow tuned for a
 * BRIGHT background (pale sand / pastel sky) so white text never disappears.
 */
const HeroTextBlock = forwardRef<HTMLDivElement>(function HeroTextBlock(_, ref) {
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 bottom-[22%] z-20 flex flex-col items-center px-6 text-center md:bottom-[18%]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <h1
        className="text-legible font-display font-semibold uppercase text-cream"
        style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", letterSpacing: "0.15em" }}
      >
        {HERO_LINE}
      </h1>

      <a
        href="#shop"
        className="text-legible pointer-events-auto mt-6 inline-flex min-h-12 items-center justify-center border border-cream px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-cream transition-colors duration-300 hover:bg-cream hover:text-ink"
      >
        Shop Now
      </a>
    </div>
  );
});

export default HeroTextBlock;
