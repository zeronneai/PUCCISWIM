// Central place for brand + site constants. No secrets here - only public values.

export const SITE = {
  name: "PUCCII Swim",
  legalName: "Mya Mercedes & Co.",
  by: "by Mya Mercedes & Co.",
  tagline: "Bold. Beautiful. Unapologetic.",
  collection: "Endless Summer",
  igHandle: "pucciiswim",
  igUrl: "https://instagram.com/pucciiswim",
  founderHandle: "mya_mercedes22",
  founderUrl: "https://instagram.com/mya_mercedes22",
  contactEmail: "pucci@myamercedesco.com",
  priceUSD: 39,
  priceCents: 3900,
} as const;

// Founder portrait for the story-hook block. Raw Cloudinary source (a .heic, so
// the component must deliver it through f_auto). Leave "" and the block falls
// back to a soft color panel, no broken image.
export const MYA_PORTRAIT =
  "https://res.cloudinary.com/dsprn0ew4/image/upload/v1785335025/IMG_2293_iobg0j.heic";

// Resolved at both build & runtime. Never trailing-slash it.
export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
