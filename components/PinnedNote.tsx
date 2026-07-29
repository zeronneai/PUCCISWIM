"use client";

import { motion, useReducedMotion } from "motion/react";
import { noteSegments, type Note } from "@/lib/notes";
import { SketchUnderline } from "./SketchUnderline";

// A sticky note built entirely in code — no images. Pink paper, periwinkle rule
// lines, handwritten text, a drawn underline on the keyword, a pin, and the
// PUCCII wordmark in the corner.
export default function PinnedNote({
  note,
  size = 180,
  className = "",
}: {
  note: Note;
  size?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const segments = noteSegments(note.text);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, rotate: 0, y: 10 }}
      whileInView={reduce ? undefined : { opacity: 1, rotate: note.rotate, y: 0 }}
      whileHover={reduce ? undefined : { rotate: note.rotate * 0.35, y: -4 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ width: size, height: size, rotate: reduce ? note.rotate : undefined }}
      className={`relative select-none rounded-[4px] ${className}`}
    >
      {/* Pin */}
      <svg
        className="absolute -top-3 left-1/2 z-10 h-6 w-6 -translate-x-1/2 drop-shadow"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="7" fill="#f06bb0" />
        <circle cx="9.5" cy="9.5" r="2" fill="#fff" fillOpacity="0.9" />
      </svg>

      {/* Paper */}
      <div
        className="absolute inset-0 overflow-hidden rounded-[4px] shadow-[0_16px_34px_-12px_rgba(43,27,36,0.45)]"
        style={{
          backgroundColor: "#F2A0C4",
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 25px, rgba(138,155,224,0.45) 25px, rgba(138,155,224,0.45) 26px)",
        }}
      >
        {/* Text */}
        <div className="flex h-full w-full items-center justify-center px-4 text-center">
          <p
            className="font-hand leading-tight text-ink"
            style={{ fontSize: Math.round(size * 0.17) }}
          >
            {segments.map((seg, i) =>
              seg.underline ? (
                <span key={i} className="relative inline-block whitespace-nowrap">
                  {seg.text}
                  <SketchUnderline
                    className="absolute -bottom-1 left-0 h-2.5 w-full"
                    color="#2b1b24"
                    delay={0.35}
                    animate={!reduce}
                  />
                </span>
              ) : (
                <span key={i}>{seg.text}</span>
              ),
            )}
          </p>
        </div>

        {/* Wordmark */}
        <span
          className="absolute bottom-1.5 right-2 font-display font-extrabold uppercase tracking-tight text-white/80"
          style={{ fontSize: Math.round(size * 0.072) }}
        >
          PUCCII Swim
        </span>
      </div>
    </motion.div>
  );
}
