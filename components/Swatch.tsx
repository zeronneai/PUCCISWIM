import type { Variant } from "@/lib/products";

// A round color swatch. Plain colors are a flat fill; patterned variants draw the
// dots (radial-gradient) or stripes (repeating-linear-gradient) in pure CSS over
// the base color, so no extra image is needed.
export function swatchStyle(variant: Variant): React.CSSProperties {
  const base: React.CSSProperties = { backgroundColor: variant.swatch };
  if (variant.swatchPattern === "dots" && variant.swatchAccent) {
    return {
      ...base,
      backgroundImage: `radial-gradient(${variant.swatchAccent} 1.5px, transparent 1.7px)`,
      backgroundSize: "6px 6px",
      backgroundPosition: "0 0, 3px 3px",
    };
  }
  if (variant.swatchPattern === "stripes" && variant.swatchAccent) {
    return {
      ...base,
      backgroundImage: `repeating-linear-gradient(45deg, ${variant.swatchAccent} 0 2.5px, transparent 2.5px 6px)`,
    };
  }
  return base;
}

export default function Swatch({
  variant,
  active = false,
  size = 28,
  className = "",
  ...rest
}: {
  variant: Variant;
  active?: boolean;
  size?: number;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label={variant.colorName}
      aria-pressed={active}
      title={variant.colorName}
      className={`shrink-0 rounded-full ring-1 ring-ink/15 transition-transform active:scale-90 ${
        active ? "ring-2 ring-offset-2 ring-offset-cream ring-ink" : "hover:ring-ink/30"
      } ${className}`}
      style={{ width: size, height: size, ...swatchStyle(variant) }}
      {...rest}
    />
  );
}
