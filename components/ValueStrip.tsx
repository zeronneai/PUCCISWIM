"use client";

import { motion } from "motion/react";

function IconSet() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M6 14c4-3 8-3 14-3s10 0 14 3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M9 14c1 5 4 8 11 8s10-3 11-8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M14 26c2 5 3 8 6 8s4-3 6-8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
function IconSize() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M5 20h30M5 20l5-5M5 20l5 5M35 20l-5-5M35 20l-5 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconDrop() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M20 6c6 8 10 12 10 18a10 10 0 1 1-20 0c0-6 4-10 10-18Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  );
}
function IconSoft() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M20 30s-11-6.5-11-14a6 6 0 0 1 11-3 6 6 0 0 1 11 3c0 7.5-11 14-11 14Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  );
}

const ITEMS = [
  { icon: <IconSet />, title: "Two-piece sets", sub: "Top + bottom, $39" },
  { icon: <IconSize />, title: "XS – L", sub: "Four true-to-size fits" },
  { icon: <IconDrop />, title: "Pre-order drop", sub: "Endless Summer" },
  { icon: <IconSoft />, title: "Buttery soft", sub: "Fully lined" },
];

export default function ValueStrip() {
  return (
    <section className="bg-cream py-8 sm:py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
        {ITEMS.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="flex flex-col items-center gap-1.5 rounded-[24px] bg-puccii-blush/45 px-3 py-5 text-center text-puccii-pink"
          >
            {it.icon}
            <p className="mt-1 text-sm font-bold text-ink sm:text-base">{it.title}</p>
            <p className="text-xs text-ink-soft sm:text-sm">{it.sub}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
