"use client";

import { motion } from "motion/react";

/** Hand-drawn marker underline that draws itself in when scrolled into view. */
export function SketchUnderline({
  className = "",
  color = "#F06BB0",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 24"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M4 15 C 60 6, 120 22, 180 12 S 280 6, 296 16"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

/** A little hand-drawn heart that pops in. */
export function SketchHeart({ className = "", color = "#F06BB0" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 30" fill="none" aria-hidden="true">
      <motion.path
        d="M16 27C16 27 3 19.5 3 10.5C3 6 6.5 3 10.5 3C13 3 15 4.5 16 6.5C17 4.5 19 3 21.5 3C25.5 3 29 6 29 10.5C29 19.5 16 27 16 27Z"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
    </svg>
  );
}
