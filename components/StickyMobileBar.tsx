"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/cart/CartContext";
import { formatCents } from "@/lib/format";

/**
 * Thumb-zone bag bar (BRIEF §4). Appears after the hero, hides on scroll-down,
 * shows on scroll-up. Mobile only.
 */
export default function StickyMobileBar() {
  const { count, subtotalCents, openCart } = useCart();
  const [visible, setVisible] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const pastHero = y > window.innerHeight * 0.7;
      const goingUp = y < lastY.current;
      setVisible(pastHero && (goingUp || y < lastY.current + 4));
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const show = visible && count > 0;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
          className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-safe pt-0 md:hidden"
        >
          <button
            onClick={openCart}
            className="flex w-full items-center justify-between rounded-full bg-ink px-5 py-4 text-cream shadow-[0_-8px_30px_-12px_rgba(43,27,36,0.5)]"
          >
            <span className="flex items-center gap-2 font-bold">
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-puccii-pink px-1.5 text-sm">
                {count}
              </span>
              View bag
            </span>
            <span className="flex items-center gap-2 font-bold">
              {formatCents(subtotalCents)}
              <span aria-hidden>→</span>
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
