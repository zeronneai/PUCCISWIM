import type Stripe from "stripe";
import { getStyle, getVariant } from "./products";
import type { OrderPayload } from "./notify";

type CompactLine = { styleId: string; variantId: string; size: string; qty: number };

// Turn a completed Stripe Checkout session into the notification payload.
// Items come from metadata.order (what we stored when creating the session),
// resolved to real style names + color names so Mya knows exactly what to
// prepare for the customer.
export function buildOrderPayload(
  session: Stripe.Checkout.Session,
  opts?: { resend?: boolean },
): OrderPayload {
  let lines: CompactLine[] = [];
  try {
    lines = JSON.parse(session.metadata?.order ?? "[]");
  } catch {
    lines = [];
  }

  const items = lines.map((l) => {
    const style = getStyle(l.styleId);
    const variant = getVariant(l.styleId, l.variantId);
    return {
      name: style?.name ?? l.styleId,
      color: variant?.colorName ?? l.variantId,
      size: l.size,
      qty: l.qty,
    };
  });

  const instagram =
    session.custom_fields?.find((f) => f.key === "instagram")?.text?.value ?? "";

  return {
    sessionId: session.id,
    orderNumber: "PUCCII-" + session.id.slice(-6).toUpperCase(),
    name: session.customer_details?.name ?? "",
    email: session.customer_details?.email ?? "",
    phone: session.customer_details?.phone ?? "",
    instagram,
    items,
    totalUSD: (session.amount_total ?? 0) / 100,
    resend: opts?.resend,
  };
}
