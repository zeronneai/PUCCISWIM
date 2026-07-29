"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { SketchUnderline } from "./SketchUnderline";
import {
  BuildingsDoodle,
  CactusDoodle,
  HeartDoodle,
  PalmDoodle,
  StarDoodle,
  WaveDoodle,
} from "./DoodleIcons";

function Pink({ children }: { children: ReactNode }) {
  return <span className="font-semibold text-puccii-pink">{children}</span>;
}

const PARAGRAPHS: { icon: ReactNode; body: ReactNode }[] = [
  {
    icon: <PalmDoodle className="h-full w-full" />,
    body: (
      <>
        Anyone who knows me knows how much I love the beach and swimwear. You&apos;d probably think I
        grew up near the ocean, but the truth is,{" "}
        <Pink>I grew up in the desert — El Paso, Texas</Pink>, to be exact.
      </>
    ),
  },
  {
    icon: <CactusDoodle className="h-full w-full" />,
    body: (
      <>
        Born and raised in the great state of Texas, where everything is bigger and better, there was
        just one thing missing: an ocean nearby. Even so, I&apos;ve always been drawn to the water, the
        beach lifestyle, and, of course, swimwear.
      </>
    ),
  },
  {
    icon: <WaveDoodle className="h-full w-full" />,
    body: (
      <>
        For me, swimwear has always been more than just clothing — it&apos;s confidence. It&apos;s where
        I feel most like myself.
      </>
    ),
  },
  {
    icon: <StarDoodle className="h-full w-full" />,
    body: (
      <>
        Over the years, I&apos;ve had the opportunity to model for some incredible swimwear designers,
        but one designer in particular changed the way I saw my future. <Pink>Krissy King</Pink> became
        a huge inspiration to me. She encouraged me to dream bigger, think outside the box, and believe
        that anything is possible.
      </>
    ),
  },
  {
    icon: <BuildingsDoodle className="h-full w-full" />,
    body: (
      <>
        When I began modeling just two years ago, she gave a young girl with only two months of
        experience the opportunity of a lifetime — to walk in a <Pink>New York Fashion Week</Pink> show.
        I modeled swimwear that day, and I haven&apos;t looked back since.
      </>
    ),
  },
  {
    icon: <HeartDoodle className="h-full w-full" />,
    body: (
      <>
        The name <Pink>PUCCII</Pink> has been part of me since the very beginning. It was the nickname
        my dad gave me, and it&apos;s stayed with me ever since. What started as a family nickname became
        something much bigger — a brand built on confidence, self-expression, and embracing who you are.
      </>
    ),
  },
];

export default function StoryFull() {
  return (
    <section id="the-story" className="scroll-mt-20 bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <p className="font-hand text-2xl text-puccii-pink">the whole story</p>
        <h2 className="mb-10 text-[clamp(2rem,7vw,3.2rem)] font-extrabold text-ink">
          From the desert to the runway
        </h2>

        <div className="space-y-8">
          {PARAGRAPHS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-[2rem_1fr] gap-4 sm:grid-cols-[2.5rem_1fr] sm:gap-6"
            >
              <div className="mt-1 h-7 w-7 text-puccii-pink sm:h-9 sm:w-9" aria-hidden>
                {p.icon}
              </div>
              <p className="max-w-prose text-lg leading-relaxed text-ink sm:text-xl">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full-bleed Confidence block — pink brush */}
      <div className="relative mt-16 overflow-hidden py-20 text-center sm:mt-24 sm:py-28">
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            backgroundColor: "#f06bb0",
            backgroundImage:
              "radial-gradient(60% 80% at 20% 30%, rgba(251,185,216,0.7) 0%, transparent 60%), radial-gradient(70% 90% at 85% 70%, rgba(246,223,160,0.45) 0%, transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-5">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-cream/90 sm:text-base">
            There is nothing more beautiful than
          </p>
          <p className="relative mx-auto mt-3 inline-block">
            <span className="font-hand text-[clamp(4rem,20vw,9rem)] leading-[0.85] text-cream">
              Confidence.
            </span>
            <SketchUnderline
              className="absolute -bottom-2 left-[4%] h-6 w-[92%] sm:-bottom-4 sm:h-9"
              color="#2b1b24"
            />
          </p>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.22em] text-cream/90 sm:text-base">
            It makes you stand out from the rest.
          </p>
        </div>
      </div>
    </section>
  );
}
