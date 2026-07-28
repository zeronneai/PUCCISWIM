# PUCCII Swim — Endless Summer pre-order storefront

A single-page, mobile-first pre-order storefront. Traffic comes from an Instagram
story link, so it's designed at **390px first**: pick a size, pay $39, and the owner
gets notified. No shipping, no addresses, no tax — this is a pre-order drop.

> Full spec in [`BRIEF.md`](./BRIEF.md).

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · `motion/react` · Stripe Checkout
(hosted) · Resend (owner + customer email) · `@vercel/analytics`. Product data is a typed
`lib/products.ts` — no database.

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
| `RESEND_API_KEY` | Resend API key for notification emails. |
| `OWNER_EMAIL` | Where the "new pre-order" email is sent. |
| `RESEND_FROM` | Verified sender address (default works for testing). |
| `NEXT_PUBLIC_PAYMENTS_MODE` | `stripe` (default) or `preorder_dm` (DM fallback). |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Only for `preorder_dm` mode. Number without `+`. |

The app **never trusts client prices** — every line is re-derived from `lib/products.ts`
on the server in `app/api/checkout/route.ts`.

## Before you launch — checklist
1. **Product photos** are served from **Cloudinary** (URLs in `lib/products.ts`, with
   `f_auto,q_auto` for automatic WebP/AVIF). The id↔image mapping is verified. If a URL
   ever fails to load, the card falls back to a branded placeholder.
2. **(Optional) media:** `public/hero.mp4` + `public/hero-poster.jpg` for the hero, and
   `public/brand/mya.jpg` for the founder portrait. All degrade gracefully if absent.
3. **Turn on Stripe's built-in notification (zero code — do this):**
   Stripe Dashboard → **Settings → Business → Customer emails / Notifications** → enable
   email on successful payments, and install the **Stripe mobile app** for push. This is
   Layer 1; the Resend emails below are Layer 2. Run both.
4. **Fill in the size chart.** `components/FitFabric.tsx` has `TODO` placeholders for the
   XS–L measurements — add real numbers, don't guess.

## Stripe webhook setup
Layer 2 (owner + customer emails) lives in `app/api/webhook/route.ts`, handling
`checkout.session.completed`.

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
3. You land on `/success`; the webhook fires the owner + customer emails.
4. Repeat with **live** keys before going public.

## Fallback: no Stripe yet?
Set `NEXT_PUBLIC_PAYMENTS_MODE=preorder_dm` and `NEXT_PUBLIC_WHATSAPP_NUMBER`. The checkout
button then opens a pre-filled WhatsApp DM with the cart contents instead of Stripe — one
env var, no code change.

## Deploy
Push to a Vercel project, set the env vars above, and deploy. Add the production webhook
endpoint in Stripe afterward.
