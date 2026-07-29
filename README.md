# PUCCII Swim: Endless Summer storefront

A single-page, mobile-first storefront. Traffic comes from an Instagram story link,
so it's designed at **390px first**: pick a size, add to bag, and check out. Checkout,
payment and fulfillment are handled by **Shopify**. Two delivery options: shipping or
free local pickup in El Paso.

> Full spec in [`BRIEF.md`](./BRIEF.md).

## Stack
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · `motion/react` · Shopify cart
permalink checkout · `@vercel/analytics`. Product data is a typed `lib/products.ts`, no
database. The catalog is **four styles** (The Bandeau, Halter, Underwire, Triangle), each
with color **variants**, all $39. A cart line is `{ styleId, variantId, size }`. Delivery
is **shipping or free local pickup** at KISSLAB, El Paso (rates and pickup details in
`lib/shipping.ts`).

## Quick start
```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL
npm run dev                  # http://localhost:3000
```

## Environment variables
| var | what it's for |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Site origin, no trailing slash. Absolute OG/metadata URLs. |

There are no payment secrets: Shopify owns checkout. The store domain and the variant id
map live in `lib/shopify.ts`.

## How checkout works
The local cart holds `{ styleId, variantId, size, qty }` lines. On checkout, `checkoutUrl()`
in `lib/shopify.ts` turns those into a Shopify cart permalink
(`https://<shop>/cart/<variantId>:<qty>,…`) and the button redirects to it in the same tab,
clearing the local bag. There is no API route and no server price logic; Shopify charges and
ships.

`SHOPIFY_VARIANTS` maps each `styleId → variantId (color) → size → numeric Shopify variant id`
and is also the single source of availability. `isAvailable(styleId, variantId, size)` reads
that map: a color with no Shopify product yet (currently the Bandeau in Sunbutter and the whole
Triangle style) shows its swatch but the add button is disabled with **Coming soon**, and it
can never be added to the bag or put in a checkout link.

## Before you launch: checklist
1. **Product photos** are served from **Cloudinary** (URLs in `lib/products.ts`, transformed
   for automatic WebP/AVIF at a capped width). Each color has one flat-lay (`variant.imageFlat`).
   If a URL ever fails to load, the card falls back to a branded placeholder.
2. **(Optional) media:** hero sequence frames and gallery clips are Cloudinary URLs; all degrade
   gracefully if absent.
3. **Shopify variant ids.** Keep `SHOPIFY_VARIANTS` in `lib/shopify.ts` in sync with the store.
   Add ids for the Bandeau in Sunbutter and the Triangle style as those products go live, and
   they stop showing "Coming soon" automatically.
4. **Fill in the size chart.** `components/FitFabric.tsx` has a `SIZE_CHART` constant at the
   top: set real inches and the table renders (cm auto-derived). Left null, the site shows
   "runs true to size" instead of placeholders.
5. **Confirm the delivery details** in `lib/shipping.ts` (shipping rates, KISSLAB address, hours,
   hold days). All shipping copy reads from here.

## Testing a purchase
1. Open a product, pick an **available** color and size, and add it to the bag.
2. Open the bag and tap **Checkout**: the tab redirects to the Shopify cart with the matching
   variant ids and quantities, and the local bag clears.
3. Confirm the items and prices on Shopify, then complete a test order there.

## Deploy
Push to a Vercel project, set `NEXT_PUBLIC_SITE_URL`, and deploy.
