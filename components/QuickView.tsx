"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/cart/CartContext";
import { formatUSD } from "@/lib/format";
import type { Product, Size } from "@/lib/products";
import SmartImage from "./SmartImage";

export default function QuickView({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { addItem, openCart } = useCart();
  const [size, setSize] = useState<Size | null>(null);
  const [hint, setHint] = useState(false);
  const [view, setView] = useState<"model" | "flat">("model");
  const sheetRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  // Reset selection when a new product opens.
  useEffect(() => {
    setSize(null);
    setHint(false);
    setView("model");
  }, [product?.id]);

  // Scroll lock + esc.
  useEffect(() => {
    if (!product) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  function handleAdd() {
    if (!product) return;
    if (!size) {
      setHint(true);
      return;
    }
    addItem(product.id, size, 1, imgRef.current, product.imageModel);
    onClose();
    openCart();
  }

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} details`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
            className="relative z-10 max-h-[92svh] w-full overflow-y-auto rounded-t-[28px] bg-cream sm:max-w-lg sm:rounded-[28px]"
          >
            {/* Drag handle */}
            <div className="sticky top-0 z-10 flex justify-center bg-cream/95 pb-1 pt-3 backdrop-blur">
              <span className="h-1.5 w-12 rounded-full bg-ink/20" aria-hidden />
              <button
                onClick={onClose}
                className="absolute right-3 top-2 grid h-10 w-10 place-items-center rounded-full bg-cream text-ink ring-1 ring-ink/10"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="px-5 pb-8">
              <div
                ref={imgRef}
                className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-[24px] bg-gradient-to-br from-puccii-blush to-paper-pink"
              >
                <SmartImage
                  src={product.imageModel}
                  alt={`${product.name} in ${product.colorName}, worn on the beach`}
                  fill
                  sizes="(max-width: 640px) 100vw, 32rem"
                  className={`object-cover transition-opacity duration-300 ${
                    view === "model" ? "opacity-100" : "opacity-0"
                  }`}
                  fallbackLabel={product.name}
                />
                <SmartImage
                  src={product.imageFlat}
                  alt={`${product.name} flat lay — two-piece set`}
                  fill
                  sizes="(max-width: 640px) 100vw, 32rem"
                  className={`object-cover transition-opacity duration-300 ${
                    view === "flat" ? "opacity-100" : "opacity-0"
                  }`}
                  fallbackLabel={product.name}
                />
                <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-puccii-pink">
                  Pre-order
                </span>
              </div>

              {/* Explicit model / flat-lay toggle (2 slides) */}
              <div className="mt-3 flex items-center justify-center gap-1 rounded-full bg-sand/60 p-1">
                <button
                  onClick={() => setView("model")}
                  aria-pressed={view === "model"}
                  className={`h-9 flex-1 rounded-full text-sm font-semibold transition-colors ${
                    view === "model" ? "bg-cream text-ink shadow-sm" : "text-ink-soft"
                  }`}
                >
                  On model
                </button>
                <button
                  onClick={() => setView("flat")}
                  aria-pressed={view === "flat"}
                  className={`h-9 flex-1 rounded-full text-sm font-semibold transition-colors ${
                    view === "flat" ? "bg-cream text-ink shadow-sm" : "text-ink-soft"
                  }`}
                >
                  Flat lay
                </button>
              </div>

              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-extrabold text-ink">{product.name}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
                    <span
                      aria-hidden
                      className="inline-block h-3 w-3 rounded-full ring-1 ring-ink/15"
                      style={{ backgroundColor: product.swatch }}
                    />
                    {product.colorName} · {product.silhouette}
                  </p>
                </div>
                <p className="font-display text-2xl font-extrabold text-ink">{formatUSD(product.priceUSD)}</p>
              </div>

              <p className="mt-2 rounded-full bg-butter/50 px-3 py-1 text-center text-sm font-semibold text-ink">
                Full set — top + bottom included
              </p>

              <p className="mt-3 text-ink-soft">{product.blurb}</p>

              {/* Sizes */}
              <div className="mt-4">
                <p className="mb-2 text-sm font-bold text-ink">Size</p>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Choose a size">
                  {product.sizes.map((s) => {
                    const active = size === s;
                    return (
                      <button
                        key={s}
                        role="radio"
                        aria-checked={active}
                        onClick={() => {
                          setSize(s);
                          setHint(false);
                        }}
                        className={`grid h-12 min-w-12 place-items-center rounded-full px-4 text-base font-bold transition-all ${
                          active
                            ? "bg-ink text-cream shadow-md"
                            : "bg-cream text-ink ring-1 ring-ink/12 hover:ring-puccii-pink"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
                {hint && <p className="mt-2 text-sm font-semibold text-puccii-pink">Pick your size first ✨</p>}
              </div>

              {/* Fit / fabric / care */}
              <dl className="mt-5 space-y-2 rounded-[20px] bg-sand/50 p-4 text-sm">
                <div>
                  <dt className="font-bold text-ink">Fit</dt>
                  <dd className="text-ink-soft">{product.fitNote}</dd>
                </div>
                <div>
                  <dt className="font-bold text-ink">Fabric</dt>
                  <dd className="text-ink-soft">{product.fabric}</dd>
                </div>
                <div>
                  <dt className="font-bold text-ink">Care</dt>
                  <dd className="text-ink-soft">{product.care}</dd>
                </div>
              </dl>

              <button
                onClick={handleAdd}
                className="mt-5 flex h-14 w-full items-center justify-center rounded-full bg-puccii-pink text-lg font-bold text-cream shadow-[0_16px_34px_-14px_rgba(240,107,176,0.8)] transition-transform active:scale-[0.98]"
              >
                Add to bag · Pre-order {formatUSD(product.priceUSD)}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
