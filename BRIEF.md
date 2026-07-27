# PUCCII SWIM — Build Brief v2 (for Claude Code)

> Save as `BRIEF.md` in the repo root. This **replaces** v1. Read it fully before writing code.
> **v2 changes:** pre-order model — no shipping, no addresses, no tax. Payment + owner notification only. Scope is deliberately small. **Mobile is the primary target, not a responsive afterthought.**

---

## 0. TASK

A single-page **pre-order storefront** for **PUCCII Swim**, launching tomorrow. Traffic comes almost entirely from an Instagram story link — assume a phone, one thumb, and 8 seconds of patience.

It must: look expensive and fun, show 8 swimsuits, let someone pick a size, pay $45, and notify the owner that a sale happened. Nothing else.

All copy in **English**.

---

## 1. SCOPE FENCE — READ THIS TWICE

**BUILD:**
- Sticky nav + cart
- Hero
- Catalog grid (8 products, size selector, add to bag)
- Quick-view bottom sheet
- Cart drawer
- Stripe Checkout (pre-order) + success page
- Owner notification on purchase
- Brand section (Meet Mya)
- Fit guide + FAQ
- Footer + minimal legal pages

**DO NOT BUILD** (do not "helpfully" add these):
- ❌ Shipping options, shipping rates, address collection, free-shipping progress bars
- ❌ Tax / Stripe Tax
- ❌ Accounts, login, order history, admin dashboard
- ❌ Inventory system, stock counters, "only 3 left"
- ❌ Reviews, testimonials, ratings, press logos, trust badges
- ❌ Newsletter signup, popups, exit-intent modals, cookie banners
- ❌ Multi-page routing beyond the legal pages
- ❌ Blog, lookbook page, wishlist, product comparison
- ❌ CMS, database, tests, monorepo, Storybook, design-system package
- ❌ Analytics beyond `@vercel/analytics` (one line)

If you think something is missing, **ask before building it**.

---

## 2. STACK

- Next.js 15 App Router + TypeScript
- Tailwind CSS v4
- `motion/react` for animation
- Stripe Checkout (hosted) via one route handler
- Resend for the owner notification email
- Deploy: Vercel
- Product data: typed `lib/products.ts`. No DB.
- Images: `next/image`, `.webp`, `public/products/`

Dependencies allowed: `next`, `react`, `motion`, `stripe`, `resend`, `@vercel/analytics`. That's it.

---

## 3. THE PRE-ORDER MODEL — how payment works

This is a **pre-order / drop**. The customer pays now; fulfillment is coordinated by the owner afterward.

### 3.1 Checkout session (`app/api/checkout/route.ts`)
```ts
// POST { items: { productId, size, qty }[] }
// Re-derive every price on the SERVER from lib/products.ts. Never trust the client.
stripe.checkout.sessions.create({
  mode: "payment",
  line_items: items.map(i => ({
    quantity: i.qty,
    price_data: {
      currency: "usd",
      unit_amount: 4500,
      product_data: {
        name: `${product.name} — Size ${i.size}`,
        description: "PUCCII Swim · Endless Summer Collection · Pre-order",
        images: [`${SITE_URL}${product.image}`],
      },
    },
  })),
  // NO shipping_address_collection
  // NO automatic_tax
  // NO shipping_options
  phone_number_collection: { enabled: true },
  custom_fields: [{
    key: "instagram",
    label: { type: "custom", custom: "Instagram handle (so we can reach you)" },
    type: "text",
    optional: false,
  }],
  custom_text: {
    submit: { message: "This is a pre-order. We'll DM you within 24 hours to arrange delivery or pickup." },
  },
  allow_promotion_codes: true,
  metadata: { order: JSON.stringify(compactLines) },
  success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url:  `${SITE_URL}/?canceled=1`,
})
```
Stripe collects the email automatically. Email + phone + IG handle is everything the owner needs. **Validate**: unknown `productId`, invalid size, or `qty` outside 1–5 → 400.

### 3.2 Owner notification — two layers, build both
**Layer 1 (zero code, I'll enable it):** Stripe Dashboard → Settings → Notifications → email on successful payment, plus the Stripe mobile app for push. Add a line to the README telling me to turn this on.

**Layer 2 (build this):** `app/api/webhook/route.ts` handling `checkout.session.completed`:
- Verify the signature with `STRIPE_WEBHOOK_SECRET` (raw body — use `await req.text()`).
- Send **one email via Resend** to `OWNER_EMAIL` with subject `🩷 New PUCCII pre-order — $45.00` and a clean readable body:
  - Items: product name, color, **size**, qty
  - Total
  - Customer name, email, phone, Instagram handle
  - Stripe session ID and a dashboard link
- Send a second, on-brand confirmation email to the **customer** restating it's a pre-order and that she'll be contacted within 24h.
- Return 200 fast; never throw on email failure (log it, still 200, or Stripe retries forever).

Env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `OWNER_EMAIL`, `NEXT_PUBLIC_SITE_URL`. Ship `.env.example`.

### 3.3 Fallback switch
`PAYMENTS_MODE=stripe|preorder_dm`. In `preorder_dm`, the checkout button opens a pre-filled WhatsApp/Instagram DM with the cart contents instead of Stripe. One env var, no code change. Build it now so we're not stuck if the Stripe account isn't verified by morning.

### 3.4 Language everywhere
The word **"PRE-ORDER"** must appear on: the announcement bar, the add-to-bag button state, the cart drawer, the checkout button, and the success page. Nobody should be surprised. Say plainly: *"Pre-order now — we'll DM you within 24 hours to arrange delivery."*

---

## 4. MOBILE-FIRST RULES (this is the priority)

Design and build at **390px first**. Desktop is an adaptation, not the source of truth.

- Every tap target ≥ 48×48px. Size chips are big pills, not tiny squares.
- **Thumb zone**: primary actions live in the bottom third. Add a **sticky bottom bar** on mobile: `View bag (3) · $135` → opens the cart. It appears after the user scrolls past the hero and hides on scroll-down / shows on scroll-up.
- Quick-view is a **bottom sheet** with a drag handle, dismissible by swipe-down, not a modal.
- Hero uses `100svh` (never `100vh` — it breaks with iOS browser chrome).
- Cart drawer is full-height bottom sheet on mobile, right side-panel on desktop.
- Catalog: **1 column on mobile** with large images. Two tiny columns is the default mistake — don't. Optional: a 2-col compact toggle, but 1-col is the default.
- Filters are a horizontally scrollable chip row with momentum, not a dropdown.
- No hover-dependent interactions. Anything revealed on hover must be visible by default on touch.
- Images: `sizes="(max-width: 768px) 100vw, 33vw"`, `priority` only on the hero and the first product.
- Target **< 1.5s LCP on 4G**. Hero video must not block LCP — poster image loads first, video swaps in after.
- Test that horizontal scroll is impossible (`overflow-x: clip` on body) — the #1 mobile bug.
- Safe-area insets: `padding-bottom: env(safe-area-inset-bottom)` on the sticky bar.
- Motion is subtle and fast on mobile (150–250ms). Heavy parallax = desktop only.

---

## 5. BRAND & ART DIRECTION

- **PUCCII Swim** — *by Mya Mercedes & Co.* · IG `@pucciiswim` · founder `@mya_mercedes22` (model & influencer — runway, editorial, beauty; NYFW · LAFW · Miami Swim Week).
- Tagline: **"Bold. Beautiful. Unapologetic."** Collection: *Endless Summer*.
- Voice: flirty, confident, girls-trip. Reusable lines from their feed: *"be bold, be beachy, be PUCCII"*, *"beach hair, don't care"*, *"swimwear and self love"*, *"more style, more inspo, more PUCCII"*.

**Signature motif:** their IG is pink ruled notebook paper with handwritten marker notes. Use it — faint rule lines on breaker sections, a handwriting font for asides only, hand-drawn SVG underlines/hearts/arrows that draw in on scroll.

**Direction:** sun-bleached pink resort maximalism. Warm grain, soft pillowy radii (20–32px), deep soft shadows, zero hard corners.

```css
--puccii-pink:#F06BB0; --puccii-blush:#FBD3E4; --paper-pink:#FBB9D8;
--butter:#F6DFA0; --sky:#A8D2ED; --sand:#EFDCC0; --cream:#FFF8F1;
--ink:#2B1B24; --ink-soft:#6B4A5C;
```

**Fonts** (`next/font`, pick one pairing, never Inter/Roboto/Poppins/Montserrat):
- Display `Bricolage Grotesque` · Handwriting `Caveat` · Body `Hanken Grotesk`
- Alt: Display `Fraunces` (high SOFT axis) · Handwriting `Kalam` · Body `Figtree`

Headlines are huge, tight-tracked, with an occasional handwritten word swapped mid-sentence.

---

## 6. PRODUCTS

8 SKUs · **all $45.00 USD** · sizes **XS S M L XL** · every set is **two pieces, top + bottom included** (state this on the card *and* in the sheet — it's the #1 question).

| id | name | color | silhouette | file |
|---|---|---|---|---|
| `butter-halter` | Sunbutter Halter Set | Butter yellow | Halter triangle + high-cut | `..._4_15_28_PM__1_.jpeg` |
| `white-underwire` | Ivory Underwire Set | White | Underwire balconette + ruched-side | `..._4_15_28_PM__2_.jpeg` |
| `pink-bandeau` | Bubblegum Bandeau Set | Pink | Bandeau + high-leg | `..._4_15_28_PM.jpeg` |
| `sky-bandeau` | Sky Bandeau Set | Baby blue | Bandeau + high-leg | `..._4_15_29_PM__1_.jpeg` |
| `sky-halter` | Sky Halter Set | Baby blue | Halter triangle + ruched-side | `..._4_15_29_PM__2_.jpeg` |
| `butter-bandeau` | Sunbutter Bandeau Set | Butter yellow | Bandeau + high-leg | `..._4_15_29_PM__3_.jpeg` |
| `white-halter` | Ivory Halter Set | White | Halter triangle + high-waist | `..._4_15_29_PM__4_.jpeg` |
| `white-bandeau` | Ivory Bandeau Set | White | Bandeau + high-leg | `..._4_15_29_PM.jpeg` |

```ts
type Size = "XS"|"S"|"M"|"L"|"XL";
type Product = { id:string; name:string; colorName:string; swatch:string;
  silhouette:"Halter"|"Bandeau"|"Underwire"; priceUSD:45; image:string;
  blurb:string; sizes:Size[] };
```
Write a ≤12-word flirty `blurb` per SKU. **Verify the image↔product mapping visually before wiring it** — the table above is inferred from upload order.

---

## 7. PAGE STRUCTURE (in order)

1. **Announcement marquee** — `PRE-ORDER LIVE · ENDLESS SUMMER COLLECTION · $45 EVERY SET ·`
2. **Sticky nav** — wordmark · `Shop · The Brand · Fit · FAQ` (desktop only) · cart with count bubble. Mobile: wordmark + cart only, plus a full-screen pink overlay menu.
3. **Hero** — `100svh`, full-bleed video/image slot (`public/hero.mp4` + `hero-poster.jpg`, degrade gracefully if absent), oversized headline, handwritten sub-line, one primary CTA `Shop the Drop`, scroll cue.
4. **Value strip** — 4 items with hand-drawn SVG icons: *Two-piece sets · $45* · *XS–XL* · *Pre-order drop* · *Buttery soft, fully lined*.
5. **Catalog** — filter chip row (All / Halter / Bandeau / Underwire + color dots), animated layout on filter change. Cards: image on soft sand panel, name, color, `$45`, size pills, `Pre-order · $45` button. Add-to-bag fires a flying-image animation to the cart.
6. **Quick-view bottom sheet** — big image, name, price, sizes, fit notes, fabric, care, add to bag.
7. **Breaker** — pink notebook-paper band, giant handwritten *"be bold, be beachy, be PUCCII."* with a hand-drawn underline that draws in on scroll.
8. **Meet Mya** — portrait slot (`public/brand/mya.jpg`) overlapping a color block + 2–3 short paragraphs on who she is and why she built PUCCII. Link `@mya_mercedes22`. **Invent no biography facts** beyond what's in §5.
9. **Fit & Fabric** — accordion: size chart XS–XL (**leave measurements as visible `TODO` placeholders — do not fabricate body measurements**), fabric (buttery-soft four-way stretch, fully lined), care, "runs true to size".
10. **FAQ** — accordion: *What does pre-order mean? · When will I get it? · Is it a full set? · How do I pick my size? · Can I exchange? · How do I contact you?*
11. **Footer** — logo, tagline, IG links, contact email, `© 2026 Mya Mercedes & Co.`, links to `/terms`, `/privacy`, `/preorder-policy` (three short real pages — Stripe requires them; the pre-order page must state fulfillment timing and refund terms).

---

## 8. CART

React context + `localStorage` (`puccii-cart-v1`). Line = `{productId, size, qty}`; same product in two sizes = two lines. Drawer: thumbnails, size, qty steppers, remove, subtotal, `Pre-order · $XX` button. Empty state with personality. Badge animates on add. Cart persists across reload.

---

## 9. QUALITY BAR

- Lighthouse mobile: performance ≥ 90, a11y ≥ 95.
- Keyboard navigable, focus traps in sheets/drawers, pink focus rings, `aria-live` on cart updates, descriptive `alt` on every image.
- `prefers-reduced-motion` respected.
- Full SEO/OG: title `PUCCII Swim — Endless Summer Collection`, OG image `public/og.jpg`, favicon, `theme-color: #F06BB0`.
- No console errors, no unused deps, no layout shift on font load.

---

## 10. BUILD ORDER — stop and report after each phase

**Phase 1 (must work tonight):** scaffold + tokens + fonts → `lib/products.ts` + images → nav → hero → catalog → cart → Stripe checkout → success page → legal pages → deploy to Vercel → **test a real purchase in Stripe test mode, then live mode**.

**Phase 2:** webhook + Resend emails (owner + customer) → quick-view sheet → filters → sticky mobile bottom bar.

**Phase 3:** breaker section → Meet Mya → fit guide → FAQ → hand-drawn details and motion polish.

After Phase 1, report: what works, what's stubbed, and the exact env vars I must set.

---

## 11. HARD RULES

- Nothing from the DO NOT BUILD list, ever.
- No invented reviews, testimonials, press, sales numbers, or founder biography.
- No fabricated body measurements — mark `TODO`.
- Server is the price authority.
- No purple-on-white gradients, no glassmorphism cliché, no generic template layout. If a section looks like a template, redo it.
- Mobile decides. If a choice is better on desktop but worse on a 390px phone, the phone wins.

---

## 12. FIRST MESSAGE TO CLAUDE CODE

> Read `BRIEF.md` fully, including the SCOPE FENCE in §1. Then: (a) give me your one-sentence aesthetic thesis and the font pairing you picked, (b) scaffold the app with tokens and product data, (c) build Phase 1 end-to-end at 390px first and verify it locally. Ask only blocking questions; list your assumptions at the end. Do not build anything in the DO NOT BUILD list.
