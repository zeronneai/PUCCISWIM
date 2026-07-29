// The single source of truth for the catalog. No DB.
// SERVER re-derives every price from here at checkout - never trust the client.
//
// The catalog is FOUR styles, each with color VARIANTS (17 pieces total, all $39).
// There are NO model photos — each variant carries its own flat-lay:
//   variant.imageFlat - the flat-lay for that color; the card shows the active
//   variant's flat and swaps on swatch hover (desktop) / tap (mobile).
// Every Cloudinary URL runs through `cld()` so the transform path carries
// f_auto,q_auto,w_1000 (CDN serves WebP/AVIF, capped width).

export type Size = "XS" | "S" | "M" | "L";

export type Variant = {
  id: string;
  colorName: string;
  swatch: string; // hex base
  swatchPattern?: "dots" | "stripes";
  swatchAccent?: string; // hex of the dots or stripes
  imageFlat: string; // Cloudinary URL
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

// Shared fit/fabric/care copy — identical across the line, shown in the sheet.
export const FABRIC = "Buttery-soft four-way stretch. Fully lined, front and back.";
export const CARE = "Hand wash cold, lay flat to dry. No wringing, no dryer, no chlorine soak.";
export const FIT = "Runs true to size. Between sizes? Size up on top for more coverage.";

// Inject the transform into the Cloudinary path: everything passed in is the
// part AFTER /image/upload/ (i.e. the version + filename).
const cld = (versionPath: string) =>
  `https://res.cloudinary.com/dsprn0ew4/image/upload/f_auto,q_auto,w_1000/${versionPath}`;

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
        colorName: "Ivory",
        swatch: "#F7F5F2",
        imageFlat: cld("v1785279402/WhatsApp_Image_2026-07-28_at_4.35.21_PM_c8h4w7.jpg"),
      },
      {
        id: "bubblegum",
        colorName: "Bubblegum",
        swatch: "#F4B6CE",
        imageFlat: cld("v1785279401/WhatsApp_Image_2026-07-28_at_4.35.20_PM_1_z2almc.jpg"),
      },
      {
        id: "sky",
        colorName: "Sky",
        swatch: "#A8D2ED",
        imageFlat: cld("v1785279401/WhatsApp_Image_2026-07-28_at_4.35.20_PM_n3wdj1.jpg"),
      },
      {
        id: "sunbutter",
        colorName: "Sunbutter",
        swatch: "#F6DFA0",
        imageFlat: cld("v1785279418/WhatsApp_Image_2026-07-27_at_4.15.29_PM_3_dsd01y.jpg"),
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
        colorName: "Ivory",
        swatch: "#F7F5F2",
        imageFlat: cld("v1785279401/WhatsApp_Image_2026-07-28_at_4.35.21_PM_2_nmmita.jpg"),
      },
      {
        id: "sky",
        colorName: "Sky",
        swatch: "#A8D2ED",
        imageFlat: cld("v1785279401/WhatsApp_Image_2026-07-28_at_4.35.21_PM_1_hncpil.jpg"),
      },
      {
        id: "sunbutter",
        colorName: "Sunbutter",
        swatch: "#F6DFA0",
        imageFlat: cld("v1785279401/WhatsApp_Image_2026-07-28_at_4.35.21_PM_4_xkuxri.jpg"),
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
        colorName: "Ivory",
        swatch: "#F7F5F2",
        imageFlat: cld("v1785279409/WhatsApp_Image_2026-07-28_at_4.35.22_PM_wdu0fk.jpg"),
      },
      {
        id: "bubblegum",
        colorName: "Bubblegum",
        swatch: "#F4B6CE",
        imageFlat: cld("v1785279401/WhatsApp_Image_2026-07-28_at_4.35.21_PM_3_mbkzif.jpg"),
      },
      {
        id: "sky",
        colorName: "Sky",
        swatch: "#A8D2ED",
        imageFlat: cld("v1785279401/WhatsApp_Image_2026-07-28_at_4.35.21_PM_6_n91z93.jpg"),
      },
      {
        id: "sunbutter",
        colorName: "Sunbutter",
        swatch: "#F6DFA0",
        imageFlat: cld("v1785279401/WhatsApp_Image_2026-07-28_at_4.35.21_PM_5_ti7oel.jpg"),
      },
    ],
  },
  {
    id: "triangle",
    name: "The Triangle",
    blurb: "String triangle, tied at the neck and hips — flirt, your way.",
    priceUSD: 39,
    sizes: ALL_SIZES,
    variants: [
      {
        id: "bubblegum",
        colorName: "Bubblegum",
        swatch: "#F4B6CE",
        imageFlat: cld("v1785279402/WhatsApp_Image_2026-07-28_at_4.35.22_PM_4_dlttuh.jpg"),
      },
      {
        id: "sky",
        colorName: "Sky",
        swatch: "#A8D2ED",
        imageFlat: cld("v1785279418/WhatsApp_Image_2026-07-28_at_4.35.23_PM_1_ea5frw.jpg"),
      },
      {
        id: "cherry-dot",
        colorName: "Cherry Dot",
        swatch: "#F79ABF",
        swatchPattern: "dots",
        swatchAccent: "#E23B3B",
        imageFlat: cld("v1785279402/WhatsApp_Image_2026-07-28_at_4.35.22_PM_1_s0h8jp.jpg"),
      },
      {
        id: "powder-dot",
        colorName: "Powder Dot",
        swatch: "#F4B6CE",
        swatchPattern: "dots",
        swatchAccent: "#FFFFFF",
        imageFlat: cld("v1785279402/WhatsApp_Image_2026-07-28_at_4.35.22_PM_3_m97qbz.jpg"),
      },
      {
        id: "sunspot",
        colorName: "Sunspot",
        swatch: "#F6DFA0",
        swatchPattern: "dots",
        swatchAccent: "#2B1B24",
        imageFlat: cld("v1785279402/WhatsApp_Image_2026-07-28_at_4.35.22_PM_2_v4gb7w.jpg"),
      },
      {
        id: "cabana-stripe",
        colorName: "Cabana Stripe",
        swatch: "#F4B6CE",
        swatchPattern: "stripes",
        swatchAccent: "#FFF8F1",
        imageFlat: cld("v1785279418/WhatsApp_Image_2026-07-28_at_4.35.23_PM_xityyy.jpg"),
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

// Total pieces on offer (styles × colors) — used in marketing copy.
export const TOTAL_PIECES = STYLES.reduce((n, s) => n + s.variants.length, 0);

// Model reference shown in the product sheet, under the size selector.
// Fill `height` with Mya's real height and the line renders; left blank it stays
// hidden (absence over a visible placeholder). `wears` is the size she models.
export const MODEL_REFERENCE = {
  name: "Mya",
  height: "", // e.g. `5'8"` — owner fills this, then the line appears
  wears: "XS" as Size,
};
