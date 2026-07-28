"use client";

import { AnimatePresence, motion, useDragControls } from "motion/react";
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
  const [atEnd, setAtEnd] = useState(true); // hide the "more below" fade by default
  const imgRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  // Reset when a new product opens.
  useEffect(() => {
    setSize(null);
    setHint(false);
    setView("model");
    // Measure whether the body overflows (to show the "more below" fade).
    requestAnimationFrame(() => {
      const el = bodyRef.current;
      if (el) setAtEnd(el.scrollHeight - el.clientHeight <= 8);
    });
  }, [product?.id]);

  // Background scroll lock (iOS-safe): overflow:hidden alone doesn't hold on
  // iOS, so pin the body with position:fixed + a negative top, then restore.
  useEffect(() => {
    if (!product) return;
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

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
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

  function onBodyScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    setAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 8);
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
          <div className="absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={onClose} aria-hidden />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} details`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
            className="relative z-10 flex h-[85dvh] w-full flex-col rounded-t-[28px] bg-cream sm:max-w-lg sm:rounded-[28px]"
          >
            {/* 1. Fixed header — drag handle + close (does not scroll) */}
            <div
              className="relative shrink-0 cursor-grab touch-none pt-3"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="flex justify-center pb-2">
                <span className="h-1.5 w-12 rounded-full bg-ink/20" aria-hidden />
              </div>
              <button
                onClick={onClose}
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute right-3 top-2 grid h-10 w-10 place-items-center rounded-full bg-cream text-ink ring-1 ring-ink/10"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* 2. Scrollable body */}
            <div className="relative min-h-0 flex-1">
              <div
                ref={bodyRef}
                onScroll={onBodyScroll}
                className="absolute inset-0 overflow-y-auto overscroll-contain px-5 pb-4"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
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
                    alt={`${product.name} flat lay, two-piece set`}
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

                {/* Model / flat-lay toggle */}
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
                  Full set, top + bottom included
                </p>

                <p className="mt-3 text-ink-soft">{product.blurb}</p>

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
              </div>

              {/* "More below" fade — hides at the end of the scroll */}
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-cream to-transparent transition-opacity duration-200 ${
                  atEnd ? "opacity-0" : "opacity-100"
                }`}
                aria-hidden
              />
            </div>

            {/* 3. Fixed footer — size + primary action, ALWAYS visible */}
            <div
              className="shrink-0 border-t border-ink/10 bg-cream px-5 pt-3"
              style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
            >
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-ink">Size</p>
                  {hint && <p className="text-sm font-semibold text-puccii-pink">Pick your size first ✨</p>}
                </div>
                <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Choose a size">
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
                        className={`grid h-11 min-w-11 flex-1 place-items-center rounded-full px-4 text-base font-bold transition-all ${
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
              </div>

              <button
                onClick={handleAdd}
                className="flex h-14 w-full items-center justify-center rounded-full bg-puccii-pink text-lg font-bold text-cream shadow-[0_16px_34px_-14px_rgba(240,107,176,0.8)] transition-transform active:scale-[0.98]"
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
