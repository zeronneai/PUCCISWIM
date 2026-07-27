"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { SITE } from "@/lib/site";

type Link = { href: string; label: string };

export default function MobileMenu({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: Link[];
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Lock scroll + focus the close button + esc to close + basic focus trap.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex flex-col bg-puccii-pink text-cream md:hidden"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <span className="font-display text-2xl font-extrabold">PUCCII</span>
            <button
              ref={closeRef}
              onClick={onClose}
              className="grid h-12 w-12 place-items-center rounded-full hover:bg-cream/15"
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-2 px-6 pb-16">
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={onClose}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * i + 0.05 }}
                className="font-display text-5xl font-extrabold tracking-tight"
              >
                {l.label}
              </motion.a>
            ))}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-8 font-hand text-3xl text-cream/90"
            >
              be bold, be beachy, be PUCCII
            </motion.p>
            <a
              href={SITE.igUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 w-fit rounded-full bg-cream px-5 py-2 font-semibold text-puccii-pink"
            >
              @{SITE.igHandle}
            </a>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
