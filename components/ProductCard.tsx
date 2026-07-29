"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { formatUSD } from "@/lib/format";
import type { Style, Variant } from "@/lib/products";
import { SITE } from "@/lib/site";
import Swatch from "./Swatch";

const SWAP =
  "transition-opacity duration-[400ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]";

export default function ProductCard({
  style,
  onQuickView,
  priority = false,
  eagerFlats = false,
}: {
  style: Style;
  onQuickView: (style: Style, variantId: string) => void;
  priority?: boolean;
  eagerFlats?: boolean;
}) {
  // `selected` is the sticky choice (mobile tap / desktop click), it carries the
  // ring and is what opens in the sheet. `hover` is the transient desktop preview.
  const [selected, setSelected] = useState<Variant | null>(null);
  const [hover, setHover] = useState<Variant | null>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  // Which flat is showing. No model photo anymore: the default is the first color.
  const shown = (canHover ? hover : null) ?? selected ?? style.variants[0];
  const openVariant = selected ?? style.variants[0];

  function toggle(v: Variant) {
    setSelected((prev) => (prev?.id === v.id ? null : v));
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-[28px] bg-sand/60 shadow-[0_18px_40px_-24px_rgba(43,27,36,0.35)]"
    >
      {/* Media: click opens the sheet with the active variant */}
      <button
        type="button"
        onClick={() => onQuickView(style, openVariant.id)}
        className="relative block w-full overflow-hidden"
        aria-label={`View ${style.name}`}
      >
        {/* 4/5 box, flats stacked absolute -> zero layout shift on swap */}
        <div className="relative aspect-[4/5] w-full bg-gradient-to-br from-puccii-blush to-paper-pink">
          {/* One flat per variant, stacked; only the active one is visible.
              In-DOM so the browser decodes ahead -> the swap is instant. */}
          {style.variants.map((v, i) => (
            <Image
              key={v.id}
              src={v.imageFlat}
              alt={`${SITE.name} ${style.name} in ${v.colorName}`}
              fill
              priority={priority && i === 0}
              loading={eagerFlats ? "eager" : undefined}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={`object-cover ${SWAP} ${
                shown.id === v.id ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-puccii-pink backdrop-blur">
            Pre-order
          </span>
          <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-3 py-1 text-[11px] font-semibold text-cream backdrop-blur">
            {style.variants.length} colors
          </span>
        </div>
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={() => onQuickView(style, openVariant.id)}
            className="text-left"
          >
            <h3 className="font-display text-xl font-bold leading-tight text-ink">{style.name}</h3>
          </button>
          <p className="shrink-0 font-display text-lg font-bold text-ink">
            {formatUSD(style.priceUSD)}
          </p>
        </div>

        <p className="text-sm text-ink-soft">{style.blurb}</p>

        {/* Swatch row, one per color. Hover (desktop) previews, tap (mobile) sticks. */}
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label={`Colors for ${style.name}`}
        >
          {style.variants.map((v) => (
            <Swatch
              key={v.id}
              variant={v}
              active={shown.id === v.id}
              onClick={() => toggle(v)}
              onMouseEnter={() => canHover && setHover(v)}
              onMouseLeave={() => canHover && setHover(null)}
            />
          ))}
        </div>

        {/* Active color name + set note */}
        <p className="min-h-[1.25rem] text-sm font-semibold text-ink">
          {shown.colorName}
          <span className="font-normal text-ink-soft"> · complete set, top + bottom</span>
        </p>
      </div>
    </motion.article>
  );
}
