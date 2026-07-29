"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/cart/CartContext";
import { formatCents } from "@/lib/format";

// Persistent call-to-action, live from just past the hero all the way to the
// footer. Mobile = fixed bottom bar; desktop = floating pill, bottom-right.
// Hides on scroll-down, while the catalog is on screen, and while the cart or a
// product sheet is open. Empty bag -> scrolls to the catalog; full bag -> opens it.
export default function ShopNow() {
  const { count, subtotalCents, openCart, isOpen, sheetOpen } = useCart();
  const [pastHero, setPastHero] = useState(false);
  const [scrollShow, setScrollShow] = useState(true);
  const [catalogInView, setCatalogInView] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setPastHero(y > window.innerHeight * 0.7);
      // Show when scrolling up (or barely moving), hide when scrolling down.
      if (y > lastY.current + 6) setScrollShow(false);
      else if (y < lastY.current - 6) setScrollShow(true);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide while the catalog is on screen: the CTA is redundant there.
  useEffect(() => {
    const shop = document.getElementById("shop");
    if (!shop) return;
    const io = new IntersectionObserver(([e]) => setCatalogInView(e.isIntersecting), {
      threshold: 0,
      rootMargin: "-20% 0px -20% 0px",
    });
    io.observe(shop);
    return () => io.disconnect();
  }, []);

  const hasItems = count > 0;
  const label = hasItems ? `VIEW BAG (${count}) · ${formatCents(subtotalCents)}` : "SHOP NOW";

  function onClick() {
    if (hasItems) {
      openCart();
    } else {
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const show = pastHero && scrollShow && !catalogInView && !isOpen && !sheetOpen;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Mobile: fixed bottom bar */}
          <motion.div
            key="bar"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-safe md:hidden"
          >
            <button
              onClick={onClick}
              className="flex h-14 w-full items-center justify-center rounded-full bg-puccii-pink text-base font-extrabold uppercase tracking-wide text-ink shadow-[0_-8px_30px_-12px_rgba(43,27,36,0.5)] active:scale-[0.99]"
            >
              {label}
            </button>
          </motion.div>

          {/* Desktop: floating pill, bottom-right */}
          <motion.button
            key="pill"
            onClick={onClick}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            className="fixed bottom-6 right-6 z-[60] hidden h-14 items-center rounded-full bg-puccii-pink px-7 text-sm font-extrabold uppercase tracking-wide text-ink shadow-[0_18px_40px_-14px_rgba(240,107,176,0.9)] transition-transform hover:-translate-y-0.5 active:scale-[0.98] md:flex"
          >
            {label}
          </motion.button>
        </>
      )}
    </AnimatePresence>
  );
}
