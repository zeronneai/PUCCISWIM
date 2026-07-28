import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { buildOrderPayload } from "@/lib/order";
import { notifyOrder } from "@/lib/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Best-effort in-memory rate limit (per warm instance). Apps Script dedupes the
// spreadsheet row by sessionId, so a resend only re-sends the emails.
const MAX_RESENDS = 3;
const counts = new Map<string, number>();

export async function POST(req: Request) {
  let sessionId = "";
  try {
    const body = await req.json();
    sessionId = String(body?.sessionId ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  let session;
  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
  } catch {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Order not paid" }, { status: 400 });
  }

  const used = counts.get(sessionId) ?? 0;
  if (used >= MAX_RESENDS) {
    return NextResponse.json(
      { error: "Resend limit reached. Please DM us and we'll help." },
      { status: 429 },
    );
  }
  counts.set(sessionId, used + 1);

  await notifyOrder(buildOrderPayload(session, { resend: true })); // never throws

  return NextResponse.json({ ok: true, remaining: MAX_RESENDS - (used + 1) });
}
