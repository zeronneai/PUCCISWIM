// Shopify is the store of record now: it charges and ships. The site only
// builds a permalink to the Shopify cart; checkout and confirmation live there.
//
// SHOPIFY_VARIANTS maps our local styleId -> variantId (color) -> size -> the
// numeric Shopify variant id. It is also the single source of availability:
// anything not in this map has no Shopify product yet and cannot be bought.

export const SHOP_DOMAIN = "sec1h2-0p.myshopify.com";

// styleId -> variantId por color y talla
export const SHOPIFY_VARIANTS: Record<string, Record<string, Record<string, number>>> = {
  halter: {
    ivory: { XS: 59713124532510, S: 59713124630814, M: 59713124729118, L: 59713124827422 },
    sky: { XS: 59713124565278, S: 59713124663582, M: 59713124761886, L: 59713124860190 },
    sunbutter: { XS: 59713124499742, S: 59713124598046, M: 59713124696350, L: 59713124794654 },
  },
  underwire: {
    ivory: { XS: 59713101398302, S: 59713101496606, M: 59713101594910, L: 59713101693214 },
    bubblegum: { XS: 59713101332766, S: 59713101431070, M: 59713101529374, L: 59713101627678 },
    sky: { XS: 59713096941854, S: 59713096974622, M: 59713097007390, L: 59713097040158 },
    sunbutter: { XS: 59713101365534, S: 59713101463838, M: 59713101562142, L: 59713101660446 },
  },
  bandeau: {
    ivory: { XS: 59713069285662, S: 59710997791006, M: 59713069318430, L: 59713069351198 },
    bubblegum: { XS: 59713106280734, S: 59713106346270, M: 59713106411806, L: 59713106477342 },
    sky: { XS: 59713106313502, S: 59713106379038, M: 59713106444574, L: 59713106510110 },
  },
  triangle: {
    bubblegum: { XS: 59713133117726, S: 59713133150494, M: 59713133183262, L: 59713133216030 },
    sky: { XS: 59713133248798, S: 59713133281566, M: 59713133314334, L: 59713133347102 },
    "powder-dot": { XS: 59713133379870, S: 59713133412638, M: 59713133445406, L: 59713133478174 },
    "cabana-stripe": { XS: 59713133510942, S: 59713133543710, M: 59713133576478, L: 59713133609246 },
    "cherry-dot": { XS: 59713133642014, S: 59713133674782, M: 59713133707550, L: 59713133740318 },
    sunspot: { XS: 59713133773086, S: 59713133805854, M: 59713133838622, L: 59713133871390 },
  },
};

// True only when this exact color + size has a Shopify variant id. The map is
// the single source of truth: no separate list to keep in sync.
export function isAvailable(styleId: string, variantId: string, size: string): boolean {
  return typeof SHOPIFY_VARIANTS[styleId]?.[variantId]?.[size] === "number";
}

export function checkoutUrl(
  items: { styleId: string; variantId: string; size: string; qty: number }[],
): string | null {
  const parts = items
    .map((i) => {
      const id = SHOPIFY_VARIANTS[i.styleId]?.[i.variantId]?.[i.size];
      return id ? `${id}:${i.qty}` : null;
    })
    .filter(Boolean);
  if (!parts.length) return null;
  return `https://${SHOP_DOMAIN}/cart/${parts.join(",")}`;
}
