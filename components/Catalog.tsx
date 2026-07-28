"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { PRODUCTS, SILHOUETTES, type Product } from "@/lib/products";
import ProductCard from "./ProductCard";
import QuickView from "./QuickView";
import { SketchUnderline } from "./SketchUnderline";

type Filter = { kind: "all" } | { kind: "silhouette"; value: string } | { kind: "color"; value: string };

// Distinct colors present in the catalog, for the color-dot filters.
const COLORS = Array.from(
  new Map(PRODUCTS.map((p) => [p.colorName, p.swatch])).entries(),
).map(([name, swatch]) => ({ name, swatch }));

export default function Catalog() {
  const [filter, setFilter] = useState<Filter>({ kind: "all" });
  const [active, setActive] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    if (filter.kind === "all") return PRODUCTS;
    if (filter.kind === "silhouette") return PRODUCTS.filter((p) => p.silhouette === filter.value);
    return PRODUCTS.filter((p) => p.colorName === filter.value);
  }, [filter]);

  const isActive = (f: Filter) =>
    f.kind === filter.kind &&
    (f.kind === "all" || (filter.kind !== "all" && "value" in filter && f.value === filter.value));

  return (
    <section id="shop" className="scroll-mt-20 bg-cream py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-6">
          <p className="font-hand text-2xl text-puccii-pink">the drop</p>
          <h2 className="relative inline-block text-[clamp(2.2rem,8vw,3.5rem)] font-extrabold text-ink">
            Shop Endless Summer
            <SketchUnderline className="absolute -bottom-2 left-0 h-4 w-[70%]" />
          </h2>
          <p className="mt-3 max-w-md text-ink-soft">
            Eight sets. Every one two pieces, top and bottom included. All $39.
          </p>
        </div>

        {/* Filter chip row - horizontally scrollable with momentum */}
        <div className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
          style={{ scrollSnapType: "x proximity", WebkitOverflowScrolling: "touch" }}
        >
          <FilterChip active={isActive({ kind: "all" })} onClick={() => setFilter({ kind: "all" })}>
            All
          </FilterChip>
          {SILHOUETTES.map((s) => (
            <FilterChip
              key={s}
              active={isActive({ kind: "silhouette", value: s })}
              onClick={() => setFilter({ kind: "silhouette", value: s })}
            >
              {s}
            </FilterChip>
          ))}
          <span className="mx-1 my-auto h-6 w-px shrink-0 bg-ink/10" aria-hidden />
          {COLORS.map((c) => (
            <FilterChip
              key={c.name}
              active={isActive({ kind: "color", value: c.name })}
              onClick={() => setFilter({ kind: "color", value: c.name })}
            >
              <span
                aria-hidden
                className="inline-block h-4 w-4 rounded-full ring-1 ring-ink/15"
                style={{ backgroundColor: c.swatch }}
              />
              {c.name.replace(" white", "").replace(" yellow", "").replace(" pink", "").replace(" blue", "")}
            </FilterChip>
          ))}
        </div>

        {/* Grid - 1 col mobile (BRIEF §4), 2 at sm, 3 at lg */}
        <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} onQuickView={setActive} priority={i < 3} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="py-10 text-center text-ink-soft">Nothing in that filter. Try another.</p>
        )}
      </div>

      <QuickView product={active} onClose={() => setActive(null)} />
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{ scrollSnapAlign: "start" }}
      className={`flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-bold capitalize transition-all ${
        active
          ? "bg-puccii-pink text-cream shadow-[0_10px_24px_-12px_rgba(240,107,176,0.9)]"
          : "bg-puccii-blush/40 text-ink hover:bg-puccii-blush/70"
      }`}
    >
      {children}
    </button>
  );
}
