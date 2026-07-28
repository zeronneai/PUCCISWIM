"use client";

import { motion } from "motion/react";
import { SITE } from "@/lib/site";
import SmartImage from "./SmartImage";
import { SketchUnderline } from "./SketchUnderline";

export default function MeetMya() {
  return (
    <section id="brand" className="scroll-mt-20 bg-cream py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
        {/* Portrait overlapping a color block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="absolute -inset-4 -rotate-3 rounded-[32px] bg-butter" aria-hidden />
          <div className="absolute -inset-4 rotate-2 rounded-[32px] bg-puccii-blush" aria-hidden />
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-puccii-blush shadow-[0_26px_60px_-22px_rgba(240,107,176,0.45)]">
            <SmartImage
              src="https://res.cloudinary.com/dsprn0ew4/image/upload/f_auto,q_auto,w_900/v1785253114/Woman_s_founder_portrait_studio___202607280938_tca0er.jpg"
              alt="Mya Mercedes, founder of PUCCII Swim"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              fallbackLabel="Mya Mercedes — founder"
              fallbackTint="from-puccii-pink to-butter"
            />
          </div>
          <span className="absolute -bottom-3 left-4 -rotate-3 rounded-full bg-cream px-4 py-1.5 font-hand text-2xl text-puccii-pink shadow-md">
            hi, it&apos;s Mya 🩷
          </span>
        </motion.div>

        {/* Copy */}
        <div>
          <p className="font-hand text-2xl text-puccii-pink">meet the founder</p>
          <h2 className="relative inline-block text-[clamp(2.2rem,7vw,3.4rem)] font-extrabold text-ink">
            Mya Mercedes
            <SketchUnderline className="absolute -bottom-2 left-0 h-4 w-[60%]" />
          </h2>
          <div className="mt-5 space-y-4 text-ink-soft">
            <p>
              Mya is a model and influencer — runway, editorial and beauty, with a résumé that runs
              through NYFW, LAFW and Miami Swim Week. PUCCII Swim is the label she built around the
              way she actually wants to feel at the beach: bold, beautiful, unapologetic.
            </p>
            <p>
              Every set in the Endless Summer drop is a two-piece — top and bottom, buttery-soft and
              fully lined — designed to look expensive and feel like nothing. This is more style, more
              inspo, more PUCCII.
            </p>
          </div>
          <a
            href={SITE.founderUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-semibold text-cream transition-transform active:scale-95"
          >
            Follow @{SITE.founderHandle}
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
