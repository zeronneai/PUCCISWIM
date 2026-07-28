"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  // Only swap the video in after it can actually play — poster/gradient carries LCP.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onReady = () => setVideoReady(true);
    v.addEventListener("canplay", onReady);
    // If the source 404s, we simply stay on the gradient.
    return () => v.removeEventListener("canplay", onReady);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full flex-col justify-end overflow-hidden"
    >
      {/* Base: branded gradient — this is what carries LCP and the graceful fallback. */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-paper-pink via-puccii-blush to-cream" />
      <div
        className="absolute inset-0 -z-20 opacity-60 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(120% 80% at 70% 10%, #F6DFA0 0%, transparent 45%), radial-gradient(90% 70% at 15% 30%, #A8D2ED 0%, transparent 40%)",
        }}
      />

      {/* Optional hero video — non-blocking, fades over the gradient when ready. */}
      <video
        ref={videoRef}
        className={`absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-700 ${
          videoReady ? "opacity-100" : "opacity-0"
        }`}
        poster="/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Legibility scrim at the bottom. */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-ink/45 via-ink/10 to-transparent" />

      {/* Copy */}
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-24 pt-28 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 inline-flex items-center gap-2 rounded-full bg-cream/85 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-puccii-pink backdrop-blur"
        >
          Pre-order · {SITE.collection}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="max-w-[14ch] text-[clamp(3.2rem,14vw,7rem)] font-extrabold leading-[0.9] text-cream drop-shadow-[0_2px_20px_rgba(43,27,36,0.35)]"
        >
          Bold. Beautiful.{" "}
          <span className="font-hand font-medium text-butter drop-shadow-none">
            Unapologetic.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mt-4 max-w-md text-base font-medium text-cream/95 sm:text-lg"
        >
          The Endless Summer drop is live. Two-piece sets, $39 each. Pre-order now —
          we&apos;ll DM you within 24 hours to arrange delivery.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25 }}
          className="mt-7"
        >
          <a
            href="#shop"
            className="inline-flex items-center gap-2 rounded-full bg-puccii-pink px-8 py-4 text-base font-bold text-cream shadow-[0_18px_40px_-14px_rgba(240,107,176,0.7)] transition-transform active:scale-95"
          >
            Shop the Drop
            <span aria-hidden>→</span>
          </a>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 0.6 }, y: { repeat: Infinity, duration: 1.8 } }}
        className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-cream/80"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  );
}
