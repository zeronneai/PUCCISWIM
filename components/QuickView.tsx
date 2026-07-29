"use client";

import { AnimatePresence, motion, useDragControls } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/cart/CartContext";
import { formatUSD } from "@/lib/format";
import { CARE, FABRIC, FIT, MODEL_REFERENCE, type Size } from "@/lib/products";
import { SITE } from "@/lib/site";
import { cldImage } from "@/lib/cloudinary";
import { DELIVERY } from "@/lib/shipping";
import { useFlatLayRatio, onFlatLayLoad } from "./imageRatio";
import type { ActiveSheet } from "./Catalog";
import SmartImage from "./SmartImage";
import Swatch from "./Swatch";

// Hand-drawn trust icons (same stroke style as the rest of the site).
function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 11V8.5a4 4 0 0 1 8 0V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function PayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="2.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 10h18M7 15h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function ReplyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 6h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H10l-4 3v-3H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function QuickView({
  active,
  onClose,
}: {
  active: ActiveSheet | null;
  onClose: () => void;
}) {
  const { addItem, openCart } = useCart();
  const [variantId, setVariantId] = useState<string | null>(null);
  const [size, setSize] = useState<Size | null>(null);
  const [hint, setHint] = useState(false);
  const [atEnd, setAtEnd] = useState(true);
  const [zoom, setZoom] = useState(false);
  const flatRatio = useFlatLayRatio();
  const imgRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const style = active?.style ?? null;
  const variant =
    style?.variants.find((v) => v.id === variantId) ?? style?.variants[0] ?? null;

  // Reset when a new STYLE opens (adopt the variant the card was showing).
  useEffect(() => {
    if (!active) return;
    setVariantId(active.variantId);
    setSize(null);
    setHint(false);
    setZoom(false);
    requestAnimationFrame(() => {
      const el = bodyRef.current;
      if (el) setAtEnd(el.scrollHeight - el.clientHeight <= 8);
    });
  }, [active]);

  // Background scroll lock (iOS-safe): overflow:hidden alone doesn't hold on
  // iOS, so pin the body with position:fixed + a negative top, then restore.
  useEffect(() => {
    if (!active) return;
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
  }, [active, onClose]);

  function handleAdd() {
    if (!style || !variant) return;
    if (!size) {
      setHint(true);
      return;
    }
    addItem(style.id, variant.id, size, 1, imgRef.current, variant.imageFlat);
    onClose();
    openCart();
  }

  function onBodyScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    setAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 8);
  }

  return (
    <AnimatePresence>
      {style && variant && (
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
            aria-label={`${style.name} details`}
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
            {/* Close, floats above EVERYTHING (image can never cover it) */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-40 grid h-10 w-10 place-items-center rounded-full bg-cream text-ink shadow-md ring-1 ring-ink/10 transition-transform active:scale-95"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {/* 1. Fixed header, drag handle (does not scroll) */}
            <div
              className="relative shrink-0 cursor-grab touch-none pt-3"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="flex justify-center pb-2">
                <span className="h-1.5 w-12 rounded-full bg-ink/20" aria-hidden />
              </div>
            </div>

            {/* 2. Scrollable body */}
            <div className="relative min-h-0 flex-1">
              <div
                ref={bodyRef}
                onScroll={onBodyScroll}
                className="absolute inset-0 overflow-y-auto overscroll-contain px-5 pb-4"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {/* The active variant's flat-lay. Swatches below switch it.
                    Natural ratio (shared) + object-contain on cream: the full
                    suit and its logo always show, never cropped. */}
                <div
                  ref={imgRef}
                  className="relative mx-auto w-full overflow-hidden rounded-[24px] bg-cream"
                  style={{ aspectRatio: flatRatio ?? "1 / 1" }}
                >
                  {style.variants.map((v) => (
                    <SmartImage
                      key={v.id}
                      src={v.imageFlat}
                      alt={`${SITE.name} ${style.name} in ${v.colorName}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 32rem"
                      onLoad={onFlatLayLoad}
                      className={`object-contain transition-opacity duration-300 ${
                        v.id === variant.id ? "opacity-100" : "opacity-0"
                      }`}
                      fallbackLabel={style.name}
                    />
                  ))}
                  <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-puccii-pink">
                    Pre-order
                  </span>
                </div>

                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-extrabold text-ink">{style.name}</h2>
                    <p className="mt-1 text-sm text-ink-soft">
                      Color: <span className="font-semibold text-ink">{variant.colorName}</span>
                    </p>
                  </div>
                  <p className="font-display text-2xl font-extrabold text-ink">
                    {formatUSD(style.priceUSD)}
                  </p>
                </div>

                {/* Swatch row, with the color name visible above */}
                <div className="mt-3 flex flex-wrap items-center gap-2.5" role="radiogroup" aria-label="Choose a color">
                  {style.variants.map((v) => (
                    <Swatch
                      key={v.id}
                      variant={v}
                      active={v.id === variant.id}
                      size={32}
                      onClick={() => setVariantId(v.id)}
                    />
                  ))}
                </div>

                <p className="mt-3 rounded-full bg-butter/60 px-3 py-1.5 text-center text-sm font-bold text-ink">
                  {formatUSD(style.priceUSD)} · complete set, top + bottom included
                </p>

                <p className="mt-3 text-ink-soft">{style.blurb}</p>
                <p className="mt-1 text-xs text-ink-soft">Bottom style varies slightly by color.</p>

                {/* Fit / fabric / care */}
                <dl className="mt-5 space-y-2 rounded-[20px] bg-sand/50 p-4 text-sm">
                  <div>
                    <dt className="font-bold text-ink">Fit</dt>
                    <dd className="text-ink-soft">{FIT}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-ink">Fabric</dt>
                    <dd className="text-ink-soft">{FABRIC}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-ink">Care</dt>
                    <dd className="text-ink-soft">{CARE}</dd>
                  </div>
                </dl>
              </div>

              {/* "More below" fade, hides at the end of the scroll */}
              <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-cream to-transparent transition-opacity duration-200 ${
                  atEnd ? "opacity-0" : "opacity-100"
                }`}
                aria-hidden
              />
            </div>

            {/* 3. Fixed footer, size + primary action, ALWAYS visible */}
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
                  {style.sizes.map((s) => {
                    const activeSize = size === s;
                    return (
                      <button
                        key={s}
                        role="radio"
                        aria-checked={activeSize}
                        onClick={() => {
                          setSize(s);
                          setHint(false);
                        }}
                        className={`grid h-11 min-w-11 flex-1 place-items-center rounded-full px-4 text-base font-bold transition-all ${
                          activeSize
                            ? "bg-ink text-cream shadow-md"
                            : "bg-cream text-ink ring-1 ring-ink/12 hover:ring-puccii-pink"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>

                {/* Between-sizes note */}
                <p className="mt-2 text-xs text-ink-soft">Between sizes? Size up for more coverage.</p>

                {/* Model reference photo: circular thumbnail + size line, taps
                    open a simple lightbox. Shows as soon as a photo is set. */}
                {MODEL_REFERENCE.photo ? (
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setZoom(true)}
                      aria-label={`See Mya wearing a size ${MODEL_REFERENCE.wears}, larger`}
                      className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full ring-2 ring-puccii-pink/30 transition-transform hover:scale-105 active:scale-95"
                    >
                      <SmartImage
                        src={cldImage(MODEL_REFERENCE.photo, 300)}
                        alt={`Mya wearing a size ${MODEL_REFERENCE.wears} PUCCII set`}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </button>
                    <p className="text-xs leading-snug">
                      <span className="font-semibold text-ink">
                        {MODEL_REFERENCE.name} wears a size {MODEL_REFERENCE.wears}
                      </span>
                      <span className="mt-0.5 block text-ink-soft">Tap the photo to enlarge</span>
                    </p>
                  </div>
                ) : null}

                {/* Model height, hidden until a real height is set */}
                {MODEL_REFERENCE.height ? (
                  <p className="mt-1 text-xs text-ink-soft">
                    {MODEL_REFERENCE.name} is {MODEL_REFERENCE.height} and wears a {MODEL_REFERENCE.wears}.
                  </p>
                ) : null}
              </div>

              <button
                onClick={handleAdd}
                className="flex h-14 w-full items-center justify-center rounded-full bg-puccii-pink text-lg font-bold text-cream shadow-[0_16px_34px_-14px_rgba(240,107,176,0.8)] transition-transform active:scale-[0.98]"
              >
                Add to bag · Pre-order {formatUSD(style.priceUSD)}
              </button>

              {/* Delivery line, reads the free-shipping promise from the constant */}
              <p className="mt-3 text-center text-xs text-ink-soft">
                {DELIVERY.shipping.freeLabel} · or pick up free in El Paso
              </p>

              {/* Trust row, hand-drawn icons, no generic badges */}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-ink-soft">
                <span className="flex items-center gap-1 text-[11px] font-medium">
                  <LockIcon /> Secure checkout
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium">
                  <PayIcon /> Apple Pay &amp; Google Pay
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium">
                  <ReplyIcon /> Ship or pick up
                </span>
              </div>
            </div>
          </motion.div>

          {/* Simple lightbox for the model reference photo */}
          <AnimatePresence>
            {zoom && MODEL_REFERENCE.photo && (
              <motion.div
                className="absolute inset-0 z-[90] flex items-center justify-center bg-ink/85 p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setZoom(false)}
              >
                <button
                  onClick={() => setZoom(false)}
                  aria-label="Close photo"
                  className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-cream text-ink shadow-md"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.img
                  src={cldImage(MODEL_REFERENCE.photo)}
                  alt={`Mya wearing a size ${MODEL_REFERENCE.wears} PUCCII set`}
                  initial={{ scale: 0.92 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.92 }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-full max-w-full rounded-[20px] object-contain shadow-2xl"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
