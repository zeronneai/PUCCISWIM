# PUCCII Swim — Endless Summer pre-order storefront

A single-page, mobile-first pre-order storefront. Traffic comes from an Instagram
story link, so it's designed at **390px first**: pick a size, pay $39, and the owner
gets notified. No shipping, no addresses, no tax — this is a pre-order drop.

> Full spec in [`BRIEF.md`](./BRIEF.md).

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · `motion/react` · Stripe Checkout
(hosted) · Google Apps Script (order log + owner/customer emails) · `@vercel/analytics`.
Product data is a typed `lib/products.ts` — no database. The catalog is **four styles**
(The Bandeau, Halter, Underwire, Triangle), each with color **variants** (17 pieces total,
all $39). A cart line is `{ styleId, variantId, size }`. Fulfillment is **in-person pickup**
at KISSLAB, El Paso (see `lib/pickup.ts`) — no shipping.

## Quick start
```bash
npm install
cp .env.example .env.local   # fill in your keys
npm run dev                  # http://localhost:3000
```

## Environment variables
| var | what it's for |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Site origin, no trailing slash. Stripe success/cancel + OG. |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_…` / `sk_live_…`). |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the `/api/webhook` endpoint (`whsec_…`). |
| `APPS_SCRIPT_URL` | Google Apps Script `/exec` URL the webhook POSTs each paid order to. |
| `APPS_SCRIPT_SECRET` | Shared secret the Apps Script checks. Set only in Vercel — never commit. |
| `NEXT_PUBLIC_PAYMENTS_MODE` | `stripe` (default) or `preorder_dm` (DM fallback). |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Only for `preorder_dm` mode. Number without `+`. |

The app **never trusts client prices** — every line is re-derived from `lib/products.ts`
on the server in `app/api/checkout/route.ts`.

## Before you launch — checklist
1. **Product photos** are served from **Cloudinary** (URLs in `lib/products.ts`, with
   `f_auto,q_auto,w_1000` for automatic WebP/AVIF at a capped width). Each style has one
   on-model photo (`imageModel`) and one flat-lay per color (`variant.imageFlat`). If a URL
   ever fails to load, the card falls back to a branded placeholder.
2. **(Optional) media:** `public/hero.mp4` + `public/hero-poster.jpg` for the hero, and
   `public/brand/mya.jpg` for the founder portrait. All degrade gracefully if absent.
3. **Deploy the Google Apps Script** and set `APPS_SCRIPT_URL` + `APPS_SCRIPT_SECRET` in
   Vercel. The webhook POSTs each paid order (JSON `{ orderNumber, name, email, phone,
   instagram, items, totalUSD, secret }`) to that URL; your script logs the row (dedup by
   `sessionId`) and emails you + the customer. (Optional belt-and-suspenders: also enable
   Stripe Dashboard → Settings → email on successful payments + the Stripe mobile app.)
4. **Fill in the size chart.** `components/FitFabric.tsx` has a `SIZE_CHART` constant at the
   top — set real inches and the table renders (cm auto-derived). Left null, the site shows
   "runs true to size" instead of placeholders.
5. **Confirm the pickup details** in `lib/pickup.ts` (KISSLAB address, hours, hold days).

## Stripe webhook setup
`app/api/webhook/route.ts` (Node runtime) verifies the signature, retrieves the session with
`expand: ["line_items"]`, builds the order payload, and calls `notifyOrder()` (`lib/notify.ts`),
which POSTs to `APPS_SCRIPT_URL`. It never throws and always returns 200 after a valid
signature, so email failures don't cause Stripe retries. A customer can re-trigger the emails
from `/success` via `POST /api/resend-confirmation` (max 3/session; Apps Script dedupes the row).

**Local:**
```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhook
# copy the printed whsec_… into STRIPE_WEBHOOK_SECRET
```

**Production (Vercel):** Stripe Dashboard → Developers → Webhooks → add endpoint
`https://your-domain.com/api/webhook`, event `checkout.session.completed`, then copy the
signing secret into the `STRIPE_WEBHOOK_SECRET` env var.

## Testing a purchase
1. Set `NEXT_PUBLIC_PAYMENTS_MODE=stripe` and test keys.
2. Add a set to the bag → **Pre-order** → use card `4242 4242 4242 4242`, any future date/CVC.
3. You land on `/success` (order number + KISSLAB pickup block); the webhook POSTs the order
   to Apps Script, which logs it and emails you + the customer.
4. Repeat with **live** keys before going public.

## Fallback: no Stripe yet?
Set `NEXT_PUBLIC_PAYMENTS_MODE=preorder_dm` and `NEXT_PUBLIC_WHATSAPP_NUMBER`. The checkout
button then opens a pre-filled WhatsApp DM with the cart contents instead of Stripe — one
env var, no code change.

## Deploy
Push to a Vercel project, set the env vars above, and deploy. Add the production webhook
endpoint in Stripe afterward.
