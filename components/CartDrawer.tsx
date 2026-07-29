"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useCart } from "@/cart/CartContext";
import { formatCents } from "@/lib/format";
import { getStyle, getVariant } from "@/lib/products";
import { SITE } from "@/lib/site";
import { DELIVERY } from "@/lib/shipping";
import SmartImage from "./SmartImage";

export default function CartDrawer() {
  const { isOpen, closeCart, lines, setQty, removeItem, subtotalCents, count, checkout } =
    useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    // iOS-safe scroll lock: pin the body with position:fixed at a negative top,
    // then restore the exact scroll position on close. A plain overflow:hidden
    // lets the page jump to the top, so closing with the X would bounce you back
    // to the hero instead of leaving you where you were.
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
      if (e.key === "Tab" && panelRef.current) {
        const els = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
        );
        if (els.length === 0) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={closeCart} aria-hidden />

          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Your bag"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="relative z-10 flex h-full w-full flex-col bg-cream shadow-2xl sm:max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <div>
                <h2 className="font-display text-xl font-extrabold text-ink">Your bag</h2>
                <p className="text-xs font-semibold uppercase tracking-wide text-puccii-pink">
                  Endless Summer collection
                </p>
              </div>
              <button
                ref={closeRef}
                onClick={closeCart}
                className="grid h-11 w-11 place-items-center rounded-full text-ink hover:bg-puccii-blush/50"
                aria-label="Close bag"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Lines */}
            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
                <span className="text-5xl" aria-hidden>👙</span>
                <p className="font-display text-2xl font-bold text-ink">Your bag&apos;s feeling shy</p>
                <p className="text-ink-soft">
                  Add a set and let&apos;s get you beach-ready. Every piece is $39, top and bottom included.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-2 rounded-full bg-puccii-pink px-6 py-3 font-bold text-cream"
                >
                  Shop the drop
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-ink/8 overflow-y-auto px-5">
                  {lines.map((l) => {
                    const s = getStyle(l.styleId);
                    const v = getVariant(l.styleId, l.variantId);
                    if (!s || !v) return null;
                    return (
                      <li key={`${l.styleId}-${l.variantId}-${l.size}`} className="flex gap-3 py-4">
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[16px] bg-cream">
                          <SmartImage
                            src={v.imageFlat}
                            alt={`${s.name} in ${v.colorName}`}
                            fill
                            sizes="80px"
                            className="object-contain"
                            fallbackLabel={s.name}
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold leading-tight text-ink">{s.name}</p>
                              <p className="text-sm text-ink-soft">
                                {v.colorName} · Size {l.size}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(l.styleId, l.variantId, l.size)}
                              className="text-sm font-semibold text-ink-soft underline decoration-ink/20 underline-offset-2 hover:text-puccii-pink"
                              aria-label={`Remove ${s.name} in ${v.colorName}, size ${l.size}`}
                            >
                              Remove
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            {/* Qty stepper */}
                            <div className="flex items-center gap-1 rounded-full bg-cream ring-1 ring-ink/12">
                              <button
                                onClick={() => setQty(l.styleId, l.variantId, l.size, l.qty - 1)}
                                className="grid h-9 w-9 place-items-center rounded-full text-lg text-ink hover:bg-puccii-blush/50"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="w-6 text-center text-sm font-bold" aria-live="polite">
                                {l.qty}
                              </span>
                              <button
                                onClick={() => setQty(l.styleId, l.variantId, l.size, l.qty + 1)}
                                disabled={l.qty >= 5}
                                className="grid h-9 w-9 place-items-center rounded-full text-lg text-ink hover:bg-puccii-blush/50 disabled:opacity-30"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <p className="font-bold text-ink">{formatCents(l.qty * SITE.priceCents)}</p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* Footer */}
                <div className="border-t border-ink/10 px-5 pb-safe pt-4">
                  <div className="mb-1 flex items-center justify-between text-lg">
                    <span className="font-semibold text-ink">Subtotal</span>
                    <span className="font-display text-xl font-extrabold text-ink">
                      {formatCents(subtotalCents)}
                    </span>
                  </div>

                  {/* Free-shipping progress: counts items, not money, and only
                      ever talks about shipping (pickup is always free). A calm
                      fact, not a countdown. */}
                  <div className="mb-3 mt-1">
                    <p className="text-xs font-semibold text-ink">
                      {count >= DELIVERY.shipping.freeAtItems
                        ? "Free shipping unlocked"
                        : "Add one more item and shipping is free"}
                    </p>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-puccii-blush/40">
                      <div
                        className="h-full rounded-full bg-puccii-pink transition-[width] duration-500 ease-out"
                        style={{
                          width: `${Math.min(count / DELIVERY.shipping.freeAtItems, 1) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Two delivery options, short list (the real charge is applied
                      at checkout, not calculated here). */}
                  <div className="mb-3 space-y-0.5 text-xs text-ink-soft">
                    <p>
                      Shipping ${DELIVERY.shipping.standard.price} · Priority $
                      {DELIVERY.shipping.priority.price} · {DELIVERY.shipping.freeLabel}
                    </p>
                    <p>Or pick up free at {DELIVERY.pickup.storeName}, El Paso</p>
                  </div>
                  <button
                    onClick={checkout}
                    className="flex h-14 w-full items-center justify-center rounded-full bg-puccii-pink text-lg font-bold text-cream shadow-[0_16px_34px_-14px_rgba(240,107,176,0.8)] transition-transform active:scale-[0.98]"
                  >
                    Checkout
                  </button>
                  <p className="mt-2 text-center text-xs text-ink-soft">
                    {count} item{count === 1 ? "" : "s"} · Secure checkout on Shopify
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
