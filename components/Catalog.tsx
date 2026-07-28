"use client";

import { useState } from "react";
import { STYLES, type Style } from "@/lib/products";
import ProductCard from "./ProductCard";
import QuickView from "./QuickView";
import { SketchUnderline } from "./SketchUnderline";

export type ActiveSheet = { style: Style; variantId: string };

export default function Catalog() {
  const [active, setActive] = useState<ActiveSheet | null>(null);

  return (
    <section id="shop" className="scroll-mt-20 bg-cream py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8">
          <p className="font-hand text-2xl text-puccii-pink">the drop</p>
          <h2 className="relative inline-block text-[clamp(2.2rem,8vw,3.5rem)] font-extrabold text-ink">
            Shop Endless Summer
            <SketchUnderline className="absolute -bottom-2 left-0 h-4 w-[70%]" />
          </h2>
          <p className="mt-3 max-w-md text-ink-soft">
            Four styles, endless colors. Every set two pieces, top and bottom included. All $39.
          </p>
        </div>

        {/* Grid — 1 col mobile (BRIEF §4), 2 at sm, 4 at lg */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STYLES.map((style, i) => (
            <ProductCard
              key={style.id}
              style={style}
              onQuickView={(s, variantId) => setActive({ style: s, variantId })}
              priority={i < 2}
              eagerFlats={i < 2}
            />
          ))}
        </div>
      </div>

      <QuickView active={active} onClose={() => setActive(null)} />
    </section>
  );
}
