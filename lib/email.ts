import { Resend } from "resend";
import { getProduct } from "./products";
import { formatCents } from "./format";
import { SITE } from "./site";

export type OrderLine = { id: string; size: string; qty: number };

export type OrderPayload = {
  lines: OrderLine[];
  totalCents: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  instagram: string;
  sessionId: string;
};

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

// Resend requires a verified sender. Set RESEND_FROM in prod; this is a safe default.
const FROM = process.env.RESEND_FROM || "PUCCII Swim <onboarding@resend.dev>";

function linesTable(lines: OrderLine[]): string {
  const rows = lines
    .map((l) => {
      const p = getProduct(l.id);
      const name = p?.name ?? l.id;
      const color = p?.colorName ?? "";
      return `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0d8e5;">${name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0d8e5;">${color}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0d8e5;font-weight:700;">${l.size}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0d8e5;text-align:center;">${l.qty}</td>
      </tr>`;
    })
    .join("");
  return `<table style="width:100%;border-collapse:collapse;font-size:14px;">
    <thead><tr style="text-align:left;color:#6b4a5c;">
      <th style="padding:8px 12px;">Set</th><th style="padding:8px 12px;">Color</th>
      <th style="padding:8px 12px;">Size</th><th style="padding:8px 12px;text-align:center;">Qty</th>
    </tr></thead><tbody>${rows}</tbody></table>`;
}

function linesText(lines: OrderLine[]): string {
  return lines
    .map((l) => {
      const p = getProduct(l.id);
      return `• ${p?.name ?? l.id} (${p?.colorName ?? ""}), Size ${l.size} × ${l.qty}`;
    })
    .join("\n");
}

/** Owner notification (BRIEF §3.2 Layer 2). Never throws. */
export async function sendOwnerEmail(order: OrderPayload): Promise<void> {
  const resend = getResend();
  const to = process.env.OWNER_EMAIL;
  if (!resend || !to) {
    console.warn("[email] owner email skipped: RESEND_API_KEY or OWNER_EMAIL missing");
    return;
  }
  const dash = `https://dashboard.stripe.com/payments`;
  const total = formatCents(order.totalCents);

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: `🩷 New PUCCII pre-order: ${total}`,
      text: `New PUCCII pre-order: ${total}

${linesText(order.lines)}

Total: ${total}

Customer
  Name: ${order.customerName || "n/a"}
  Email: ${order.customerEmail || "n/a"}
  Phone: ${order.customerPhone || "n/a"}
  Instagram: ${order.instagram || "n/a"}

Stripe session: ${order.sessionId}
Dashboard: ${dash}
`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto;color:#2b1b24;">
        <h1 style="font-size:22px;">🩷 New PUCCII pre-order: ${total}</h1>
        ${linesTable(order.lines)}
        <p style="font-size:18px;font-weight:800;margin:14px 0;">Total: ${total}</p>
        <div style="background:#fff8f1;border-radius:14px;padding:14px 16px;font-size:14px;">
          <strong>Customer</strong><br/>
          Name: ${order.customerName || "n/a"}<br/>
          Email: <a href="mailto:${order.customerEmail}">${order.customerEmail || "n/a"}</a><br/>
          Phone: ${order.customerPhone || "n/a"}<br/>
          Instagram: <strong>${order.instagram || "n/a"}</strong>
        </div>
        <p style="font-size:13px;color:#6b4a5c;margin-top:14px;">
          Stripe session: ${order.sessionId}<br/>
          <a href="${dash}">Open Stripe dashboard →</a>
        </p>
        <p style="font-size:13px;color:#6b4a5c;">Reminder: DM the customer within 24 hours to arrange delivery or pickup.</p>
      </div>`,
    });
  } catch (err) {
    console.error("[email] owner send failed", err);
  }
}

/** On-brand confirmation to the customer (BRIEF §3.2). Never throws. */
export async function sendCustomerEmail(order: OrderPayload): Promise<void> {
  const resend = getResend();
  if (!resend || !order.customerEmail) {
    console.warn("[email] customer email skipped: RESEND_API_KEY or email missing");
    return;
  }
  const total = formatCents(order.totalCents);
  try {
    await resend.emails.send({
      from: FROM,
      to: order.customerEmail,
      subject: "🩷 Your PUCCII pre-order is in, we'll DM you within 24 hours",
      text: `Hi ${order.customerName || "gorgeous"}!

Thank you for pre-ordering PUCCII Swim, Endless Summer. 🌴

${linesText(order.lines)}

Total: ${total}

This is a pre-order. We'll slide into your DMs (${order.instagram || "your Instagram"}) within 24 hours to arrange delivery or pickup.

be bold, be beachy, be PUCCII 🩷
${SITE.name} · @${SITE.igHandle}
`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:560px;margin:auto;color:#2b1b24;">
        <div style="background:#f06bb0;color:#fff8f1;padding:24px;border-radius:20px 20px 0 0;">
          <h1 style="margin:0;font-size:24px;">You're in, ${order.customerName || "gorgeous"}! 🩷</h1>
          <p style="margin:6px 0 0;opacity:.9;">Endless Summer · Pre-order confirmed</p>
        </div>
        <div style="background:#fff8f1;padding:24px;border-radius:0 0 20px 20px;">
          ${linesTable(order.lines)}
          <p style="font-size:18px;font-weight:800;margin:14px 0;">Total: ${total}</p>
          <p style="font-size:15px;line-height:1.5;">
            This is a <strong>pre-order</strong>. We'll DM you within <strong>24 hours</strong>
            ${order.instagram ? `at <strong>${order.instagram}</strong>` : ""} to arrange delivery or pickup.
          </p>
          <p style="font-family:cursive;font-size:22px;color:#f06bb0;margin-top:18px;">be bold, be beachy, be PUCCII</p>
          <p style="font-size:13px;color:#6b4a5c;">${SITE.name} · <a href="${SITE.igUrl}">@${SITE.igHandle}</a></p>
        </div>
      </div>`,
    });
  } catch (err) {
    console.error("[email] customer send failed", err);
  }
}
