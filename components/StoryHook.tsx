"use client";

import { motion } from "motion/react";
import { MYA_PORTRAIT } from "@/lib/site";
import { cldImage } from "@/lib/cloudinary";
import SmartImage from "./SmartImage";

// Short teaser that sits right after the hero. Links down to the full story.
export default function StoryHook() {
  return (
    <section id="story-hook" className="relative scroll-mt-20 overflow-hidden bg-cream py-16 sm:py-24">
      <div className="paper-lines pointer-events-none absolute inset-0 opacity-25" aria-hidden />

      <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-hand text-2xl text-puccii-pink">my story</p>
          <h2 className="mt-1 text-[clamp(2.2rem,8vw,3.6rem)] font-extrabold text-ink">
            I grew up in the desert.
          </h2>

          <div className="mt-5 max-w-md space-y-4 text-lg leading-relaxed text-ink-soft">
            <p>
              El Paso, Texas. No ocean in sight, and I&apos;ve been drawn to the water my whole life.
            </p>
            <p>
              Swimwear was never just clothing to me. It&apos;s confidence. It&apos;s where I feel most
              like myself.
            </p>
            <p>
              PUCCII was the nickname my dad gave me. It&apos;s been mine since day one.
            </p>
          </div>

          <p className="mt-5 font-hand text-3xl text-ink">love, Mya</p>

          <a
            href="#the-story"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-puccii-pink underline decoration-puccii-pink/40 underline-offset-4 transition-colors hover:decoration-puccii-pink"
          >
            Read the whole story
            <span aria-hidden>↓</span>
          </a>
        </motion.div>

        {/* Portrait, asymmetric, overlapping a blush block. Soft panel until the
            real (non-AI) photo is uploaded; no broken image, no visible TODO. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-xs sm:max-w-sm"
        >
          <div className="absolute -inset-3 -rotate-3 rounded-[30px] bg-puccii-blush" aria-hidden />
          <div className="absolute -right-4 -top-4 h-16 w-16 rotate-6 rounded-[18px] bg-butter" aria-hidden />
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[26px] bg-gradient-to-br from-puccii-blush via-paper-pink to-butter shadow-[0_26px_60px_-22px_rgba(240,107,176,0.45)]">
            {MYA_PORTRAIT ? (
              <SmartImage
                src={cldImage(MYA_PORTRAIT)}
                alt="Mya Mercedes and a friend on the beach in PUCCII Swim"
                fill
                sizes="(max-width: 1024px) 80vw, 24rem"
                className="object-cover"
                fallbackLabel="Mya"
              />
            ) : (
              <span className="absolute bottom-4 left-4 -rotate-3 rounded-full bg-cream/85 px-4 py-1.5 font-hand text-2xl text-puccii-pink shadow-sm">
                hi, it&apos;s Mya 🩷
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
