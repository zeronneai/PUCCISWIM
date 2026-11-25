// The single source of truth for the catalog. No DB.
// SERVER re-derives every price from here at checkout - never trust the client.
//
// The catalog is FOUR styles, each with color VARIANTS (16 pieces total, all $39).
// There are NO model photos. Each variant carries its own flat-lay:
//   variant.imageFlat - the flat-lay for that color; the card shows the active
//   variant's flat and swaps on swatch hover (desktop) / tap (mobile).
// Product photos live in public/media/products, already sized to 1000px.

export type Size = "XS" | "S" | "M" | "L";

export type Variant = {
  id: string;
  colorName: string;
  swatch: string; // hex base
  swatchPattern?: "dots" | "stripes";
  swatchAccent?: string; // hex of the dots or stripes
  imageFlat: string; // path in public/media/products
};

export type Style = {
  id: string;
  name: string;
  blurb: string; // <= 12 words, flirty
  priceUSD: 39;
  sizes: Size[]; // always ["XS","S","M","L"]
  variants: Variant[];
};

export const ALL_SIZES: Size[] = ["XS", "S", "M", "L"];

// Shared fit/fabric/care copy, identical across the line, shown in the sheet.
export const FABRIC = "Buttery-soft four-way stretch. Fully lined, front and back.";
export const CARE = "Hand wash cold, lay flat to dry. No wringing, no dryer, no chlorine soak.";
export const FIT = "Runs true to size. Between sizes? Size up on top for more coverage.";

export const STYLES: Style[] = [
  {
    id: "bandeau",
    name: "The Bandeau",
    blurb: "Strapless up top, high-leg below, made for zero tan lines.",
    priceUSD: 39,
    sizes: ALL_SIZES,
    variants: [
      {
        id: "ivory",
        colorName: "Coconut Milk",
        swatch: "#F7F5F2",
        imageFlat: "/media/products/4-35-21-pm-c8h4w7.webp",
      },
      {
        id: "bubblegum",
        colorName: "Bubble Gum",
        swatch: "#F4B6CE",
        imageFlat: "/media/products/4-35-20-pm-1-z2almc.webp",
      },
      {
        id: "sky",
        colorName: "Sky",
        swatch: "#A8D2ED",
        imageFlat: "/media/products/4-35-20-pm-n3wdj1.webp",
      },
    ],
  },
  {
    id: "halter",
    name: "The Halter",
    blurb: "A wide bow at the neck, smooth and sultry the rest of the way.",
    priceUSD: 39,
    sizes: ALL_SIZES,
    variants: [
      {
        id: "ivory",
        colorName: "Coconut Milk",
        swatch: "#F7F5F2",
        imageFlat: "/media/products/4-35-21-pm-2-nmmita.webp",
      },
      {
        id: "sky",
        colorName: "Sky",
        swatch: "#A8D2ED",
        imageFlat: "/media/products/4-35-21-pm-1-hncpil.jpg",
      },
      {
        id: "sunbutter",
        colorName: "Sunbutter",
        swatch: "#F6DFA0",
        imageFlat: "/media/products/4-35-21-pm-4-xkuxri.webp",
      },
    ],
  },
  {
    id: "underwire",
    name: "The Underwire",
    blurb: "Structured cups and ruched sides that hug every curve just right.",
    priceUSD: 39,
    sizes: ALL_SIZES,
    variants: [
      {
        id: "ivory",
        colorName: "Coconut Milk",
        swatch: "#F7F5F2",
        imageFlat: "/media/products/4-35-22-pm-wdu0fk.webp",
      },
      {
        id: "bubblegum",
        colorName: "Bubble Gum",
        swatch: "#F4B6CE",
        imageFlat: "/media/products/4-35-21-pm-3-mbkzif.webp",
      },
      {
        id: "sky",
        colorName: "Sky",
        swatch: "#A8D2ED",
        imageFlat: "/media/products/4-35-21-pm-6-n91z93.webp",
      },
      {
        id: "sunbutter",
        colorName: "Sunbutter",
        swatch: "#F6DFA0",
        imageFlat: "/media/products/4-35-21-pm-5-ti7oel.webp",
      },
    ],
  },
  {
    id: "triangle",
    name: "The Triangle",
    blurb: "String triangle, tied at the neck and hips. Flirt, your way.",
    priceUSD: 39,
    sizes: ALL_SIZES,
    variants: [
      {
        id: "bubblegum",
        colorName: "Bubble Gum",
        swatch: "#F4B6CE",
        imageFlat: "/media/products/4-35-22-pm-4-dlttuh.webp",
      },
      {
        id: "sky",
        colorName: "Sky",
        swatch: "#A8D2ED",
        imageFlat: "/media/products/4-35-23-pm-1-ea5frw.webp",
      },
      {
        id: "cherry-dot",
        colorName: "Cherry Dot",
        swatch: "#F79ABF",
        swatchPattern: "dots",
        swatchAccent: "#E23B3B",
        imageFlat: "/media/products/4-35-22-pm-1-s0h8jp.webp",
      },
      {
        id: "powder-dot",
        colorName: "Powder Dot",
        swatch: "#F4B6CE",
        swatchPattern: "dots",
        swatchAccent: "#FFFFFF",
        imageFlat: "/media/products/4-35-22-pm-3-m97qbz.webp",
      },
      {
        id: "sunspot",
        colorName: "Sunspot",
        swatch: "#F6DFA0",
        swatchPattern: "dots",
        swatchAccent: "#2B1B24",
        imageFlat: "/media/products/4-35-22-pm-2-v4gb7w.webp",
      },
      {
        id: "cabana-stripe",
        colorName: "Cabana Stripe",
        swatch: "#F4B6CE",
        swatchPattern: "stripes",
        swatchAccent: "#FFF8F1",
        imageFlat: "/media/products/4-35-23-pm-xityyy.jpg",
      },
    ],
  },
];

export const STYLES_BY_ID: Record<string, Style> = Object.fromEntries(
  STYLES.map((s) => [s.id, s]),
);

export function getStyle(id: string): Style | undefined {
  return STYLES_BY_ID[id];
}

export function getVariant(styleId: string, variantId: string): Variant | undefined {
  return STYLES_BY_ID[styleId]?.variants.find((v) => v.id === variantId);
}

export function isValidSize(style: Style, size: string): size is Size {
  return (style.sizes as string[]).includes(size);
}

// Total pieces on offer (styles × colors), used in marketing copy.
export const TOTAL_PIECES = STYLES.reduce((n, s) => n + s.variants.length, 0);

// Model reference shown in the product sheet, under the size selector.
// `photo` is a local photo of Mya in a PUCCII set: when set, the sheet
// shows a small circular thumbnail with "Mya wears a size {wears}" and a tap or
// hover opens it in a lightbox. `height` is still pending: fill it with her real
// height and the extra height line renders; left blank that line stays hidden.
export const MODEL_REFERENCE = {
  name: "Mya",
  photo: "/media/model.webp",
  height: "", // e.g. `5'8"` (owner fills this, then the height line appears)
  wears: "XS" as Size,
};
