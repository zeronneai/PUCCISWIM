"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { useCart } from "@/cart/CartContext";
import { formatUSD } from "@/lib/format";
import type { Product, Size } from "@/lib/products";

const SWAP =
  "transition-[opacity,transform] duration-[400ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]";

function HangerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 6.5a1.6 1.6 0 1 1 1.2 1.55c-.5.13-.7.5-.7.95v1M12 10v1.2L4.5 16.2c-.9.6-.5 2 .6 2h13.8c1.1 0 1.5-1.4.6-2L12 11.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProductCard({
  product,
  onQuickView,
  priority = false,
}: {
  product: Product;
  onQuickView: (p: Product) => void;
  priority?: boolean;
}) {
  const { addItem } = useCart();
  const [size, setSize] = useState<Size | null>(null);
  const [hint, setHint] = useState(false);
  const [added, setAdded] = useState(false);
  const [swapped, setSwapped] = useState(false); // mobile chip toggle
  const [modelFailed, setModelFailed] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  function handleAdd() {
    if (!size) {
      setHint(true);
      return;
    }
    addItem(product.id, size, 1, imgRef.current, product.imageModel);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  // Desktop: swap on group hover (CSS). Mobile: swap on chip tap (state).
  const modelSrc = modelFailed ? product.imageFlat : product.imageModel;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-[28px] bg-sand/60 shadow-[0_18px_40px_-24px_rgba(43,27,36,0.35)]"
    >
      {/* Media (relative wrapper holds the swap button + the mobile chip) */}
      <div className="relative">
        <button
          onClick={() => onQuickView(product)}
          className="relative block w-full overflow-hidden"
          aria-label={`Quick view ${product.name}`}
        >
          {/* 4/5 box, both images stacked absolute -> zero layout shift on swap */}
          <div
            ref={imgRef}
            className="relative aspect-[4/5] w-full bg-gradient-to-br from-puccii-blush to-paper-pink"
          >
            {/* Model image — shown first */}
            <Image
              src={modelSrc}
              alt={`${product.name} in ${product.colorName}, worn on the beach`}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, 33vw"
              onError={() => setModelFailed(true)}
              className={`object-cover group-hover:scale-[1.03] group-hover:opacity-0 ${SWAP} ${
                swapped ? "scale-[1.03] opacity-0" : "scale-100 opacity-100"
              }`}
            />
            {/* Flat-lay — revealed on swap (rendered in-DOM so it's preloaded) */}
            <Image
              src={product.imageFlat}
              alt={`${product.name} flat lay — two-piece set, top and bottom`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={`object-cover group-hover:scale-100 group-hover:opacity-100 ${SWAP} ${
                swapped ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"
              }`}
            />
          </div>

          <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-puccii-pink backdrop-blur">
            Pre-order
          </span>
          <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-[11px] font-semibold text-cream backdrop-blur">
            Top + bottom
          </span>
        </button>

        {/* Mobile-only swap chip (does NOT open the sheet) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSwapped((v) => !v);
          }}
          aria-label={swapped ? "View on model" : "View product photo"}
          className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-cream/70 text-ink shadow-md backdrop-blur-md active:scale-95 md:hidden"
        >
          <HangerIcon />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-xl font-bold leading-tight text-ink">{product.name}</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-soft">
              <span
                aria-hidden
                className="inline-block h-3 w-3 rounded-full ring-1 ring-ink/15"
                style={{ backgroundColor: product.swatch }}
              />
              {product.colorName} · {product.silhouette}
            </p>
          </div>
          <p className="shrink-0 font-display text-lg font-bold text-ink">{formatUSD(product.priceUSD)}</p>
        </div>

        <p className="text-sm text-ink-soft">{product.blurb}</p>

        {/* Size pills — big tap targets */}
        <div
          className="flex flex-wrap gap-2"
          role="radiogroup"
          aria-label={`Choose a size for ${product.name}`}
        >
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
                className={`grid h-11 min-w-11 place-items-center rounded-full px-3 text-sm font-bold transition-all ${
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

        <AnimatePresence>
          {hint && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm font-semibold text-puccii-pink"
            >
              Pick your size first ✨
            </motion.p>
          )}
        </AnimatePresence>

        <button
          onClick={handleAdd}
          className="mt-auto flex h-12 w-full items-center justify-center gap-2 rounded-full bg-puccii-pink text-base font-bold text-cream shadow-[0_14px_30px_-14px_rgba(240,107,176,0.8)] transition-transform active:scale-[0.98]"
        >
          {added ? "Added to bag 🩷" : `Pre-order · ${formatUSD(product.priceUSD)}`}
        </button>
      </div>
    </motion.article>
  );
}
