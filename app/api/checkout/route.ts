import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProduct, isValidSize } from "@/lib/products";
import { SITE, SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

type IncomingItem = { productId?: unknown; size?: unknown; qty?: unknown };

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
  const compactLines: { id: string; size: string; qty: number }[] = [];
  const line_items: {
    quantity: number;
    price_data: {
      currency: string;
      unit_amount: number;
      product_data: { name: string; description: string; images?: string[] };
    };
  }[] = [];

  for (const raw of items) {
    const productId = String(raw.productId ?? "");
    const size = String(raw.size ?? "");
    const qty = Number(raw.qty);

    const product = getProduct(productId);
    if (!product) {
      return NextResponse.json({ error: `Unknown product: ${productId}` }, { status: 400 });
    }
    if (!isValidSize(product, size)) {
      return NextResponse.json({ error: `Invalid size for ${productId}: ${size}` }, { status: 400 });
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > 5) {
      return NextResponse.json({ error: `Invalid quantity for ${productId}` }, { status: 400 });
    }

    compactLines.push({ id: product.id, size, qty });
    line_items.push({
      quantity: qty,
      price_data: {
        currency: "usd",
        unit_amount: SITE.priceCents, // authoritative: $39.00
        product_data: {
          name: `${product.name} — Size ${size}`,
          description: "PUCCII Swim · Endless Summer Collection · Pre-order",
          images: [product.imageModel],
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
            "This is a pre-order. We'll DM you within 24 hours to arrange delivery or pickup.",
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
