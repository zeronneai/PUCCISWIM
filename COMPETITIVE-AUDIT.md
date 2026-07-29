# PUCCII Swim: Competitive & Experience Audit

**Purpose:** benchmark PUCCII Swim against six DTC swimwear brands and turn it into a
prioritized, launch-aware action list. **No code was changed** to produce this document.

**Method & honesty note:** this environment's network policy blocks direct page loads of
the competitor sites (all returned HTTP 403), so I could not crawl their live DOM. I used
web search to confirm the specifics that matter most (size guides, fit tools, fabric/fit
copy, payment/returns patterns) and combined it with well-established, stable knowledge of
each brand's UX. Where a detail is a general pattern rather than a freshly-verified fact,
treat it as "how this brand category behaves," not a pixel-exact claim. Verified sources
are listed at the end.

**Our current build (what I'm comparing against), by file:**
- Hero: `components/SequenceHero.tsx` (scroll-scrub, 3 text "beats", solid nav after scroll)
- Catalog: `components/Catalog.tsx` + `components/ProductCard.tsx` (1-col mobile, filter chips, model↔flat image swap, size pills on card)
- Product sheet: `components/QuickView.tsx` (bottom sheet: image toggle, blurb, fit/fabric/care, size + add-to-bag footer)
- Cart: `cart/CartContext.tsx` + `components/CartDrawer.tsx`
- Checkout: `app/api/checkout/route.ts` (Stripe hosted, phone + Instagram handle, no shipping/tax; WhatsApp fallback)
- Fit/FAQ/brand: `components/FitFabric.tsx` (size chart with **TODO** measurements), `components/FAQ.tsx`, `components/MeetMya.tsx`, `components/ValueStrip.tsx`
- Legal/policy: `app/preorder-policy/page.tsx`, `app/terms`, `app/privacy`

---

## 1. Per-brand breakdown

### triangl.com
1. **Hero:** full-bleed autoplay campaign video/imagery, almost no overlay copy, effectively **one** CTA ("Shop"). A thin top announcement bar carries shipping/promo.
2. **Catalog:** **2-column** mobile grid, on-model shots, tap/hover reveals a second image, **color swatches on the card** (styles carry many colorways), price; quick-add.
3. **Product page:** big multi-image gallery (on-model + flat), **model reference** ("model wears size S"), explicit fit notes (band parallel to floor, strap snugness, cup coverage), a **size-guide modal** with size-up/size-down-for-coverage guidance, **mix-and-match separates** (different top/bottom sizes), fabric detail. Dedicated `/pages/sizing` + `/pages/size-guide` + a "need help with sizing" popup.
4. **Cart/checkout:** slide-out cart → express wallets (Shop Pay / Apple Pay / PayPal) then hosted checkout; free-shipping-threshold messaging.
5. **Trust:** shipping/returns bar, UGC/"as seen," heavy Instagram halo.
6. **Shipping/returns:** worldwide shipping + delivery estimates + returns policy linked from PDP and footer.
7. **Premium mobile detail:** full-bleed media, buttery cart drawer, **sticky add-to-cart** on the PDP, image-forward everywhere.

### frankiesbikinis.com
1. **Hero:** campaign/lookbook video or imagery, collection/drop-driven, minimal text, 1-2 CTAs ("Shop the collection").
2. **Catalog:** 2-col mobile, on-model, color swatches, quick-shop, "new/restock" tags; **star ratings on cards**.
3. **Product page:** rich gallery + **UGC/shoppable galleries**, **reviews with fit feedback** (Okendo/Yotpo: "runs true," "size up"), model info, size guide, mix-and-match separates, "complete the look."
4. **Cart/checkout:** drawer with **Afterpay/Klarna/Shop Pay**, cross-sell upsells.
5. **Trust:** reviews + ratings, influencer/UGC, press, founder story (Francesca Aiello).
6. **Shipping/returns:** policy pages + installment messaging near price.
7. **Premium mobile detail:** editorial lookbook feel, shoppable content, drop countdowns.

### hunzag.com (Hunza G)
1. **Hero:** single editorial image/video, minimal text, one CTA.
2. **Catalog:** clean grid (2-col mobile), editorial on-model, few colorways, premium price.
3. **Product page:** the differentiator is the product: **one-size Original Crinkle™ fabric** knit as a seamless tube so it stretches to roughly **UK 6-16**, which nearly *eliminates the size decision*. Their `/pages/fit-guide` reframes sizing as **bust & bottom coverage** ranges rather than a size chart; model reference + fabric story.
4. **Cart/checkout:** drawer, Apple Pay / Shop Pay / Klarna.
5. **Trust:** press, heritage, editorial authority.
6. **Shipping/returns:** clear, premium tone.
7. **Premium mobile detail:** minimalist, fast, editorial restraint.

### andieswim.com (Andie)
1. **Hero:** lifestyle imagery with **benefit-led** copy (fit/comfort), clear CTA, often a **fit-quiz** entry point.
2. **Catalog:** 2-col mobile, on-model with fit cues, color swatches, "The [name]" naming; some styles offer length options (regular/long/tall).
3. **Product page, the sizing gold standard:** a **Fit Quiz**, a **Fit Guide**, and **live 1:1 virtual Fit Consultations with Fit Experts**; detailed bust/waist/hip **measurements**; explicit **between-sizes guidance** (size down = compression/support, size up = comfort); model height + size worn; reviews carrying fit data.
4. **Cart/checkout:** drawer, express pay, **free shipping + free returns/exchanges** promoted as a fit-risk reducer.
5. **Trust:** reviews, fit guarantee, easy exchanges, press.
6. **Shipping/returns:** free shipping & returns front-and-center (their core anxiety-killer).
7. **Premium mobile detail:** guided fit-quiz flow, clean forms.

### cupshe.com
1. **Hero:** promo/sale-heavy, urgency banners, **multiple CTAs**.
2. **Catalog:** **2-col** dense mobile grid, price + strikethrough, **star ratings**, color swatches, **bundled sets** (top+bottom as one SKU).
3. **Product page:** many images, **lots of reviews**, size chart with **detailed measurements + fit tips**, bundled two-piece, model info, urgency ("low stock"), "bought together."
4. **Cart/checkout:** drawer, **Afterpay/Klarna/PayPal**, coupons, bundle discounts.
5. **Trust:** heavy review volume + ratings, trust/secure-checkout badges, guarantees.
6. **Shipping/returns:** free-shipping thresholds + delivery estimates + returns policy, all prominent.
7. **Premium mobile detail:** **sticky add-to-cart**, fast, aggressively conversion-tuned (less "premium," more efficient).

### vitaminaswim.com (Vitamin A)
1. **Hero:** California editorial imagery/video, sustainability + lifestyle tone, minimal text, one clean CTA.
2. **Catalog:** clean 2-col mobile, on-model, color swatches, premium price.
3. **Product page:** **separates** with distinct **tops vs. bottoms fit guides**; **per-model measurements** ("model is 5'9.5", wears S, bust 32B / waist 25 / hips 35"); **fabric + sustainability story** (EcoLux = REPREVE® recycled nylon + LYCRA XTRA LIFE™); care.
4. **Cart/checkout:** drawer, express pay, Afterpay.
5. **Trust:** sustainability credentials, press, made-responsibly story.
6. **Shipping/returns:** clear policy, eco packaging note.
7. **Premium mobile detail:** editorial, unhurried, premium restraint.

**The one pattern across all six:** every brand invests disproportionately in **fit
confidence**: measurements, model reference, between-size guidance, fit quizzes/experts,
or a fabric that removes the decision (Hunza G). Swimwear's #1 purchase blocker is "will it
fit," and it's where we are weakest.

---

## A. Top 10 things they do that we don't, ranked by estimated conversion impact

> Ranked for *our* situation: pre-order, new brand, 8 SKUs, one price, no reviews/inventory.

1. **Real size guidance at the point of decision (measurements + "runs true / size up for coverage").**
   Our size chart lives in a separate `FitFabric` accordion **and still shows `TODO`** for every
   measurement. Competitors put real numbers *inside* the buying moment. This is the single
   biggest fit-anxiety and refund-risk lever for swim.
2. **Model reference: "Mya is 5'X and wears size M."**
   Triangl / Vitamin A / Andie all anchor sizing to a real body. It's cheap, needs no
   inventory or reviews, and directly converts hesitant shoppers. We have the model photos now.
3. **Clear delivery/timing expectation stated up front (not buried).**
   For a *pre-order* this is existential trust. Competitors show delivery estimates near the
   price/cart; ours only explains "we'll DM within 24h" in FAQ/policy, not at the add-to-bag moment.
4. **Express wallets visible before checkout (Apple Pay / Google Pay / Link).**
   Stripe Checkout already supports these, but shoppers don't *see* them until after redirect.
   Surfacing "Apple Pay available" reduces the friction of the hosted-checkout jump.
5. **A second/third product angle + zoom on the PDP.**
   Everyone shows multiple on-model angles + a detail/zoom. We show one model image + one
   flat-lay toggle. More angles = more fit/quality confidence for a body-worn product.
6. **On-card price installment or reassurance line ("$39, full set").**
   Competitors reduce price friction with Afterpay/Klarna lines. We can't rely on that, but we
   *under-sell* the value: "$39 for a full two-piece set" is a strong message we bury.
7. **"Between sizes?" directional advice.**
   One sentence ("between sizes, size up for more coverage") is standard everywhere and we only
   say "runs true to size." Cheap, high-trust.
8. **Sticky add-to-cart / persistent buy affordance on the product view.**
   Cupshe/Triangl keep the CTA nailed to the viewport. Our sheet footer already does this well
   *inside the sheet*, but the catalog itself relies on per-card buttons only.
9. **A crisp fabric/quality story ("buttery-soft, fully lined, four-way stretch").**
   Vitamin A/Hunza G sell fabric hard because it signals quality sight-unseen. We have the copy
   in `FitFabric` but it's not prominent at the decision point.
10. **Founder credibility used as social proof (in lieu of reviews).**
    Frankies leans on Francesca Aiello's authority. We have Mya (model/influencer, NYFW/LAFW/
    Miami Swim Week) but she's a mid-page section, not a trust signal placed near the buy.

---

## B. Five things we already do better / differently, keep these

1. **True 1-column, image-first mobile catalog.** Most competitors use 2 tiny columns on
   mobile; our large single column is more premium and more tap-friendly, the brief's bet, and
   a genuine differentiator. (`components/Catalog.tsx`)
2. **Model ↔ flat-lay swap on the card.** A frosted chip that flips to the flat-lay without
   opening the sheet is slicker than most competitors' hover-only second image, and it works on
   touch. (`components/ProductCard.tsx`)
3. **Distinct, on-brand art direction.** The handwritten-accent typography, butter-gold accents,
   and the scroll-scrub hero read as a *brand*, not a Shopify theme. Triangl-clean but ours.
4. **Honest, personal pre-order promise ("we'll DM you within 24h").** For a drop, a human
   1:1 promise is warmer and more credible than a faceless "ships in 5-7 days." Lean into it.
5. **Radically simple, one-price, one-decision funnel.** 8 sets, one price, top+bottom included,
   no bundle math, no upsell maze. That clarity is a conversion asset; protect it.

---

## C. Five worst gaps in our current experience, with where to fix each

1. **Sizing is unfinished and mis-placed.** The size chart shows literal `TODO` for every
   measurement and lives far from the buy button.
   → `components/FitFabric.tsx` (real numbers) **and** `components/QuickView.tsx` (surface a
   compact size guide + model reference inside the sheet) and `lib/products.ts` (add size/model data).
2. **No delivery/timing expectation at the decision point** for a pre-order.
   → `components/QuickView.tsx` + `components/CartDrawer.tsx` (a one-line "Pre-order · we DM you
   within 24h to arrange delivery" near the CTA), reinforced in `components/FAQ.tsx`.
3. **Thin product imagery.** One model + one flat is below the category norm of 3-5 angles.
   → `lib/products.ts` (support an image array) + `components/QuickView.tsx` (gallery/carousel).
4. **Value message ("$39 full two-piece set") is under-stated at the moment of choice.**
   → `components/ProductCard.tsx` + `components/QuickView.tsx` (make "full set, top + bottom, $39"
   a louder line, not a small pill).
5. **Trust/credibility not placed near the buy.** Mya's authority and the pre-order guarantees
   are page-bottom sections; nothing reassures at add-to-bag.
   → `components/MeetMya.tsx` (fine to keep) **plus** a small trust row in `components/QuickView.tsx`
   / `components/CartDrawer.tsx` (secure checkout · full set · DM in 24h).

---

## D. Recommendation: before launch vs. week 2

**Respecting the constraints**: no inventory features, no reviews, no loyalty, no big-catalog
merchandising. Everything below works for a new, 8-SKU, one-price, pre-order brand.

### Ship BEFORE launch (high impact, low effort, no dependencies)
1. **Fill the size chart with real bust/waist/hip numbers** and remove every `TODO`. Nothing
   converts worse than a visible placeholder in the fit section. *(FitFabric.tsx / lib data)*
2. **Add model reference**: "Mya is 5'X and wears size M" (or per-suit), inside the sheet.
   *(QuickView.tsx + lib/products.ts)*
3. **Add "between sizes? size up for more coverage"** one-liner near the size pills. *(QuickView.tsx)*
4. **State the pre-order delivery promise at the CTA**, not just in FAQ: a single reassuring line
   on the card button area, the sheet footer, and the cart. *(ProductCard / QuickView / CartDrawer)*
5. **Elevate the value line** "Full set, top + bottom, $39" at the decision point. *(ProductCard / QuickView)*
6. **A small trust row near the buy**: "Secure checkout · Apple Pay · We DM you within 24h."
   *(QuickView / CartDrawer)*, copy only, no new integrations.

### Can wait to WEEK 2
1. **Multi-angle gallery / zoom** on the PDP (needs more photography per suit). *(lib/products.ts image array + QuickView gallery)*
2. **A lightweight fit recommender** ("pick your usual size → we suggest"), not Andie's live
   experts, just a 2-question helper. Nice, not essential for 8 one-price SKUs.
3. **A shoppable Instagram/UGC strip** near the footer, once real customer/founder content exists.
4. **Founder-as-proof block placed higher** (a short "why I made PUCCII" near the catalog), once
   copy/photography is final.
5. **Express-wallet affordance polish** (an explicit "Apple Pay" mark on the cart CTA) after
   confirming what the live Stripe account surfaces.

**The through-line:** don't chase reviews, bundles, or a bigger catalog. Win on the one axis
every competitor over-invests in and where we're weakest (**fit confidence**), plus a crisp
pre-order delivery promise. Those two, placed at the moment of decision, are the highest-ROI
pre-launch moves for exactly our constraints.

---

## Sources (verified via web search)
- Triangl: [Size Guide](https://triangl.com/pages/size-guide), [Sizing](https://triangl.com/pages/sizing), [Sizing help popup](https://triangl.com/pages/need-help-with-sizing), [Home](https://triangl.com/)
- Andie: [Swim Fit Quiz](https://wear.andieswim.com/swim-fit-quiz-1), [US Size Chart](https://andieswim.com/pages/us-size-chart), [Fit Guide (AU)](https://andieswim.com.au/pages/fit-guide)
- Hunza G: [Fit Guide](https://www.hunzag.com/pages/fit-guide); one-size fabric explainer via [CNN Underscored](https://www.cnn.com/cnn-underscored/reviews/hunza-g-swimsuit), [The Quality Edit](https://www.thequalityedit.com/articles/hunza-g-swimwear-review)
- Vitamin A: [Tops Fit Guide](https://www.vitaminaswim.com/pages/fitting-room-tops), [Bottoms Fit Guide](https://www.vitaminaswim.com/pages/fitting-room-classic-bottoms), [Fabrics](https://www.vitaminaswim.com/pages/fabrics), [EcoLux](https://www.vitaminaswim.com/collections/ecolux)
- Cupshe: [Size & Fit Guide](https://www.cupshe.com/cms?name=size-fit), [Customer Reviews](https://www.cupshe.com/pages/customer-review)
- Frankies Bikinis: general category knowledge (site not reachable from this environment; patterns are stable and well-documented)

*Live page DOM could not be crawled from this environment (network policy returned 403 for
all six domains). Findings combine the searched sources above with established knowledge of
each brand; treat non-cited specifics as category patterns, not pixel-exact claims.*
