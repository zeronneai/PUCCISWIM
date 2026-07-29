import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getStyle, getVariant, isValidSize } from "@/lib/products";
import { SITE, SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

type IncomingItem = { styleId?: unknown; variantId?: unknown; size?: unknown; qty?: unknown };

export async function POST(req: Request) {
  let body: { items?: IncomingItem[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const items = body.items;
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "No items" }, { status: 400 });
  }

  // Validate + re-derive EVERYTHING on the server. Never trust the client price.
  const compactLines: { styleId: string; variantId: string; size: string; qty: number }[] = [];
  const line_items: {
    quantity: number;
    price_data: {
      currency: string;
      unit_amount: number;
      product_data: { name: string; description: string; images?: string[] };
    };
  }[] = [];

  for (const raw of items) {
    const styleId = String(raw.styleId ?? "");
    const variantId = String(raw.variantId ?? "");
    const size = String(raw.size ?? "");
    const qty = Number(raw.qty);

    const style = getStyle(styleId);
    if (!style) {
      return NextResponse.json({ error: `Unknown style: ${styleId}` }, { status: 400 });
    }
    const variant = getVariant(styleId, variantId);
    if (!variant) {
      return NextResponse.json(
        { error: `Unknown color for ${styleId}: ${variantId}` },
        { status: 400 },
      );
    }
    if (!isValidSize(style, size)) {
      return NextResponse.json({ error: `Invalid size for ${styleId}: ${size}` }, { status: 400 });
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > 5) {
      return NextResponse.json({ error: `Invalid quantity for ${styleId}` }, { status: 400 });
    }

    compactLines.push({ styleId: style.id, variantId: variant.id, size, qty });
    line_items.push({
      quantity: qty,
      price_data: {
        currency: "usd",
        unit_amount: SITE.priceCents, // authoritative: $39.00
        product_data: {
          name: `${style.name}, ${variant.colorName}, Size ${size}`,
          description: "PUCCII Swim · Endless Summer Collection · Pre-order",
          images: [variant.imageFlat],
        },
      },
    });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      // NO shipping_address_collection · NO automatic_tax · NO shipping_options
      phone_number_collection: { enabled: true },
      custom_fields: [
        {
          key: "instagram",
          label: { type: "custom", custom: "Instagram handle (so we can reach you)" },
          type: "text",
          optional: false,
        },
      ],
      custom_text: {
        submit: {
          message:
            "Pre-order · pick up at KISSLAB in El Paso. We'll email you your order number and pickup details.",
        },
      },
      allow_promotion_codes: true,
      metadata: { order: JSON.stringify(compactLines) },
      success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] error", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 },
    );
  }
}
