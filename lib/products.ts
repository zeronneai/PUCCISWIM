// The single source of truth for the catalog. No DB.
// SERVER re-derives every price from here at checkout — never trust the client.
//
// NOTE: image filenames below come from BRIEF §6 and are inferred from upload
// order. TODO(owner): drop the 8 .webp files into public/products/ and VERIFY
// each image matches its product visually before launch. Components degrade to a
// branded placeholder when a file is missing, so the site never breaks meanwhile.

export type Size = "XS" | "S" | "M" | "L" | "XL";

export type Silhouette = "Halter" | "Bandeau" | "Underwire";

export type Product = {
  id: string;
  name: string;
  colorName: string;
  swatch: string; // hex, for the color dot
  silhouette: Silhouette;
  priceUSD: 45;
  priceCents: 4500;
  image: string; // path under /public
  blurb: string; // <= 12 words, flirty
  fabric: string;
  care: string;
  fitNote: string;
  sizes: Size[];
};

export const ALL_SIZES: Size[] = ["XS", "S", "M", "L", "XL"];

const FABRIC = "Buttery-soft four-way stretch. Fully lined, front and back.";
const CARE = "Hand wash cold, lay flat to dry. No wringing, no dryer, no chlorine soak.";
const FIT = "Runs true to size. Between sizes? Size up on top for more coverage.";

export const PRODUCTS: Product[] = [
  {
    id: "butter-halter",
    name: "Sunbutter Halter Set",
    colorName: "Butter yellow",
    swatch: "#F6DFA0",
    silhouette: "Halter",
    priceUSD: 45,
    priceCents: 4500,
    image: "/products/butter-halter.webp",
    blurb: "Golden-hour glow in a barely-there halter tie.",
    fabric: FABRIC,
    care: CARE,
    fitNote: FIT,
    sizes: ALL_SIZES,
  },
  {
    id: "white-underwire",
    name: "Ivory Underwire Set",
    colorName: "Ivory white",
    swatch: "#FFFDF8",
    silhouette: "Underwire",
    priceUSD: 45,
    priceCents: 4500,
    image: "/products/white-underwire.webp",
    blurb: "Balconette lift with ruched sides that hug just right.",
    fabric: FABRIC,
    care: CARE,
    fitNote: "Runs true to size. The underwire gives real support — size to your band.",
    sizes: ALL_SIZES,
  },
  {
    id: "pink-bandeau",
    name: "Bubblegum Bandeau Set",
    colorName: "Bubblegum pink",
    swatch: "#F06BB0",
    silhouette: "Bandeau",
    priceUSD: 45,
    priceCents: 4500,
    image: "/products/pink-bandeau.webp",
    blurb: "Strapless, high-leg, and made for zero tan lines.",
    fabric: FABRIC,
    care: CARE,
    fitNote: FIT,
    sizes: ALL_SIZES,
  },
  {
    id: "sky-bandeau",
    name: "Sky Bandeau Set",
    colorName: "Baby blue",
    swatch: "#A8D2ED",
    silhouette: "Bandeau",
    priceUSD: 45,
    priceCents: 4500,
    image: "/products/sky-bandeau.webp",
    blurb: "Cloud-soft blue that makes a tan look illegal.",
    fabric: FABRIC,
    care: CARE,
    fitNote: FIT,
    sizes: ALL_SIZES,
  },
  {
    id: "sky-halter",
    name: "Sky Halter Set",
    colorName: "Baby blue",
    swatch: "#A8D2ED",
    silhouette: "Halter",
    priceUSD: 45,
    priceCents: 4500,
    image: "/products/sky-halter.webp",
    blurb: "Halter triangle up top, ruched sides for days.",
    fabric: FABRIC,
    care: CARE,
    fitNote: FIT,
    sizes: ALL_SIZES,
  },
  {
    id: "butter-bandeau",
    name: "Sunbutter Bandeau Set",
    colorName: "Butter yellow",
    swatch: "#F6DFA0",
    silhouette: "Bandeau",
    priceUSD: 45,
    priceCents: 4500,
    image: "/products/butter-bandeau.webp",
    blurb: "Sunshine bottled into a strapless, high-leg set.",
    fabric: FABRIC,
    care: CARE,
    fitNote: FIT,
    sizes: ALL_SIZES,
  },
  {
    id: "white-halter",
    name: "Ivory Halter Set",
    colorName: "Ivory white",
    swatch: "#FFFDF8",
    silhouette: "Halter",
    priceUSD: 45,
    priceCents: 4500,
    image: "/products/white-halter.webp",
    blurb: "Crisp white halter with a high-waist moment.",
    fabric: FABRIC,
    care: CARE,
    fitNote: FIT,
    sizes: ALL_SIZES,
  },
  {
    id: "white-bandeau",
    name: "Ivory Bandeau Set",
    colorName: "Ivory white",
    swatch: "#FFFDF8",
    silhouette: "Bandeau",
    priceUSD: 45,
    priceCents: 4500,
    image: "/products/white-bandeau.webp",
    blurb: "The little white set every summer secretly needs.",
    fabric: FABRIC,
    care: CARE,
    fitNote: FIT,
    sizes: ALL_SIZES,
  },
];

export const PRODUCTS_BY_ID: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p]),
);

export function getProduct(id: string): Product | undefined {
  return PRODUCTS_BY_ID[id];
}

export function isValidSize(product: Product, size: string): size is Size {
  return (product.sizes as string[]).includes(size);
}

export const SILHOUETTES: Silhouette[] = ["Halter", "Bandeau", "Underwire"];
