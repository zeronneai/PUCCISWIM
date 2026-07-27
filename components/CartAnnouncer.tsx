"use client";

import { useCart } from "@/cart/CartContext";

/** Visually-hidden live region so screen readers hear cart changes (BRIEF §9). */
export default function CartAnnouncer() {
  const { announcement } = useCart();
  return (
    <div aria-live="polite" role="status" className="sr-only">
      {announcement}
    </div>
  );
}
