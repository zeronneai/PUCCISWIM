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

// Resolved at both build & runtime. Never trailing-slash it.
export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

// Payments switch - see BRIEF §3.3. "stripe" (default) or "preorder_dm".
export const PAYMENTS_MODE =
  (process.env.NEXT_PUBLIC_PAYMENTS_MODE as "stripe" | "preorder_dm") || "stripe";

// WhatsApp number in international format WITHOUT the + (e.g. 15551234567).
// Only used when PAYMENTS_MODE === "preorder_dm".
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

// Reassurance shown directly under the pre-order button (editable copy).
export const PREORDER_DELIVERY_NOTE =
  "Pre-order · we'll DM you within 24 hours to arrange delivery";
