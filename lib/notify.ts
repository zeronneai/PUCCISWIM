export type OrderPayload = {
  sessionId: string;
  orderNumber: string;
  name: string;
  email: string;
  phone: string;
  instagram: string;
  items: { name: string; size: string; qty: number }[];
  totalUSD: number;
  resend?: boolean; // set true when re-sending; Apps Script dedupes the row by sessionId
};

// Fire-and-forget notification to the Google Apps Script endpoint. Never throws:
// if it fails, the webhook still returns 200 so Stripe doesn't retry forever.
export async function notifyOrder(p: OrderPayload) {
  const url = process.env.APPS_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_SECRET;
  if (!url || !secret) {
    console.warn("notify: missing env");
    return;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, secret }),
      // Apps Script answers with a 302 to script.googleusercontent.com; Node's
      // fetch follows it by default. Do NOT disable redirect.
      redirect: "follow",
    });
    console.log("notify:", res.status, (await res.text()).slice(0, 200));
  } catch (err) {
    console.error("notify failed", err);
  }
}
