"use client";

import { HERO_MODE } from "@/lib/media";
import HeroMedia from "./HeroMedia";
import HeroTextBlock from "./HeroTextBlock";
import SequenceHero from "./SequenceHero";

export default function Hero() {
  // Scroll-scrub sequence hero once frames exist; static media otherwise.
  if (HERO_MODE === "sequence") return <SequenceHero />;

  return (
    <section
      id="hero"
      // -mt-16 pulls the media up UNDER the transparent nav (nav height = h-16),
      // so the nav truly sits over the media. 100svh (never 100vh) for iOS chrome.
      className="relative -mt-16 h-[100svh] w-full overflow-hidden"
    >
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

      <HeroTextBlock />
    </section>
  );
}
