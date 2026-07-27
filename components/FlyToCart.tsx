"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCart } from "@/cart/CartContext";
import SmartImage from "./SmartImage";

/** Renders the flying product thumbnails that animate from card → cart icon. */
export default function FlyToCart() {
  const { flights, endFlight, cartIconRef } = useCart();

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden>
      <AnimatePresence>
        {flights.map((f) => {
          const target = cartIconRef.current?.getBoundingClientRect();
          const toX = target ? target.left + target.width / 2 - (f.from.left + f.from.width / 2) : 0;
          const toY = target ? target.top + target.height / 2 - (f.from.top + f.from.height / 2) : -200;
          return (
            <motion.div
              key={f.id}
              initial={{
                position: "fixed",
                top: f.from.top,
                left: f.from.left,
                width: f.from.width,
                height: f.from.height,
                opacity: 0.95,
                borderRadius: 24,
              }}
              animate={{
                x: toX,
                y: toY,
                scale: 0.12,
                opacity: 0.2,
                borderRadius: 999,
              }}
              transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
              onAnimationComplete={() => endFlight(f.id)}
              className="overflow-hidden shadow-lg"
              style={{ position: "fixed" }}
            >
              <div className="relative h-full w-full">
                <SmartImage src={f.src} alt="" fill sizes="200px" className="object-cover" />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
