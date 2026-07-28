// The single source of truth for the catalog. No DB.
// SERVER re-derives every price from here at checkout - never trust the client.
//
// Each product has TWO images, both on Cloudinary (f_auto,q_auto in the transform
// path so the CDN serves WebP/AVIF):
//   imageModel - the on-model beach shot, shown FIRST
//   imageFlat  - the flat-lay of the set, revealed on hover/tap swap
// The id -> image mapping below is VERIFIED - do not reorder. Components degrade
// gracefully (imageModel error -> imageFlat -> branded placeholder).

export type Size = "XS" | "S" | "M" | "L";

export type Silhouette = "Halter" | "Bandeau" | "Underwire";

export type Product = {
  id: string;
  name: string;
  colorName: string;
  swatch: string; // hex, for the color dot
  silhouette: Silhouette;
  priceUSD: 39;
  priceCents: 3900;
  imageModel: string; // absolute Cloudinary URL - shown first
  imageFlat: string; // absolute Cloudinary URL - swap target
  blurb: string; // <= 12 words, flirty
  fabric: string;
  care: string;
  fitNote: string;
  sizes: Size[];
};

export const ALL_SIZES: Size[] = ["XS", "S", "M", "L"];

const FABRIC = "Buttery-soft four-way stretch. Fully lined, front and back.";
const CARE = "Hand wash cold, lay flat to dry. No wringing, no dryer, no chlorine soak.";
const FIT = "Runs true to size. Between sizes? Size up on top for more coverage.";

const FLAT = "https://res.cloudinary.com/dsprn0ew4/image/upload/f_auto,q_auto";
const MODEL = "https://res.cloudinary.com/dsprn0ew4/image/upload/f_auto,q_auto,w_1000";

export const PRODUCTS: Product[] = [
  {
    id: "butter-halter",
    name: "Sunbutter Halter Set",
    colorName: "Butter yellow",
    swatch: "#F6DFA0",
    silhouette: "Halter",
    priceUSD: 39,
    priceCents: 3900,
    imageModel: `${MODEL}/v1785252642/Woman_wearing_swimsuit_on_beach_202607280925_qqcj3v.jpg`,
    imageFlat: `${FLAT}/v1785191667/WhatsApp_Image_2026-07-27_at_4.15.28_PM_1_dlrycv.jpg`,
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
    priceUSD: 39,
    priceCents: 3900,
    imageModel: `${MODEL}/v1785252641/Woman_laughing_on_beach_2K_202607280924_dmg209.jpg`,
    imageFlat: `${FLAT}/v1785191667/WhatsApp_Image_2026-07-27_at_4.15.28_PM_2_eeqq5e.jpg`,
    blurb: "Balconette lift with ruched sides that hug just right.",
    fabric: FABRIC,
    care: CARE,
    fitNote: "Runs true to size. The underwire gives real support, so size to your band.",
    sizes: ALL_SIZES,
  },
  {
    id: "pink-bandeau",
    name: "Bubblegum Bandeau Set",
    colorName: "Bubblegum pink",
    swatch: "#F06BB0",
    silhouette: "Bandeau",
    priceUSD: 39,
    priceCents: 3900,
    imageModel: `${MODEL}/v1785252641/Woman_wearing_swimsuit_on_beach_202607280853_2_k7fcwa.jpg`,
    imageFlat: `${FLAT}/v1785191667/WhatsApp_Image_2026-07-27_at_4.15.28_PM_cpw2eo.jpg`,
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
    priceUSD: 39,
    priceCents: 3900,
    imageModel: `${MODEL}/v1785252641/Woman_wearing_blue_swimsuit_2K_202607280852_nwy1xm.jpg`,
    imageFlat: `${FLAT}/v1785191667/WhatsApp_Image_2026-07-27_at_4.15.29_PM_1_ksl3jr.jpg`,
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
    priceUSD: 39,
    priceCents: 3900,
    imageModel: `${MODEL}/v1785252641/Woman_laughing_on_beach_2K_202607280853_dgksdk.jpg`,
    imageFlat: `${FLAT}/v1785191668/WhatsApp_Image_2026-07-27_at_4.15.29_PM_2_hn3qhk.jpg`,
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
    priceUSD: 39,
    priceCents: 3900,
    imageModel: `${MODEL}/v1785252641/Woman_laughing_on_beach_2K_202607280858_k21urr.jpg`,
    imageFlat: `${FLAT}/v1785191667/WhatsApp_Image_2026-07-27_at_4.15.29_PM_3_bkerfq.jpg`,
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
    priceUSD: 39,
    priceCents: 3900,
    imageModel: `${MODEL}/v1785252642/Woman_laughing_in_water_2K_202607280924_ubhc1i.jpg`,
    imageFlat: `${FLAT}/v1785191667/WhatsApp_Image_2026-07-27_at_4.15.29_PM_4_h4ohbu.jpg`,
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
    priceUSD: 39,
    priceCents: 3900,
    imageModel: `${MODEL}/v1785252641/Woman_wearing_swimsuit_on_beach_202607280924_frntaa.jpg`,
    imageFlat: `${FLAT}/v1785191668/WhatsApp_Image_2026-07-27_at_4.15.29_PM_d0g0tz.jpg`,
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

// Model reference shown in the product sheet, under the size selector.
// Fill `height` with Mya's real height and the line renders; left blank it stays
// hidden (absence over a visible placeholder). `wears` is the size she models.
export const MODEL_REFERENCE = {
  name: "Mya",
  height: "", // e.g. `5'8"` — owner fills this, then the line appears
  wears: "M" as Size,
};
