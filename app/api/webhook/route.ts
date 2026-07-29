import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { buildOrderPayload } from "@/lib/order";
import { notifyOrder } from "@/lib/notify";

export const runtime = "nodejs";
// We need the raw body for signature verification: never let Next parse it.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();

  if (!secret || !sig) {
    console.error("[webhook] missing STRIPE_WEBHOOK_SECRET or signature");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  // Signature verification is a security gate: a bad signature is a real 400
  // (Stripe needs to know). Everything AFTER this returns 200 so processing
  // failures never trigger endless retries.
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object as Stripe.Checkout.Session;
      const full = await getStripe().checkout.sessions.retrieve(session.id, {
        expand: ["line_items"],
      });
      const payload = buildOrderPayload(full);
      await notifyOrder(payload); // never throws
    } catch (err) {
      console.error("[webhook] processing error (still returning 200)", err);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
