import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { sendCustomerEmail, sendOwnerEmail, type OrderLine } from "@/lib/email";

export const runtime = "nodejs";
// We need the raw body for signature verification - never let Next parse it.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");

  // Raw body (BRIEF §3.2).
  const raw = await req.text();

  if (!secret || !sig) {
    console.error("[webhook] missing STRIPE_WEBHOOK_SECRET or signature");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Parse the order we stashed in metadata (server-authoritative lines).
    let lines: OrderLine[] = [];
    try {
      lines = JSON.parse(session.metadata?.order ?? "[]");
    } catch {
      lines = [];
    }

    const instagram =
      session.custom_fields?.find((f) => f.key === "instagram")?.text?.value ?? "";

    const order = {
      lines,
      totalCents: session.amount_total ?? 0,
      customerName: session.customer_details?.name ?? "",
      customerEmail: session.customer_details?.email ?? "",
      customerPhone: session.customer_details?.phone ?? "",
      instagram,
      sessionId: session.id,
    };

    // Send both emails, but NEVER throw - Stripe retries forever on non-200.
    await Promise.allSettled([sendOwnerEmail(order), sendCustomerEmail(order)]);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
