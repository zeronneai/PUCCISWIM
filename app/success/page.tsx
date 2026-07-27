import Link from "next/link";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getProduct } from "@/lib/products";
import { formatCents } from "@/lib/format";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

type OrderLine = { id: string; size: string; qty: number };

async function loadSession(sessionId?: string) {
  if (!sessionId) return null;
  try {
    const stripe = getStripe();
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return null;
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const session = await loadSession(session_id);

  let lines: OrderLine[] = [];
  try {
    lines = JSON.parse((session?.metadata?.order as string) ?? "[]");
  } catch {
    lines = [];
  }
  const name = session?.customer_details?.name?.split(" ")[0] ?? "";
  const total = session?.amount_total ?? lines.reduce((n, l) => n + l.qty * SITE.priceCents, 0);

  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-paper-pink via-puccii-blush to-cream px-5 py-16">
      <div className="paper-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      <div className="relative w-full max-w-lg rounded-[32px] bg-cream/95 p-7 text-center shadow-[0_26px_60px_-22px_rgba(240,107,176,0.5)] backdrop-blur sm:p-9">
        <span className="mb-1 inline-block rounded-full bg-puccii-pink px-4 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cream">
          Pre-order confirmed
        </span>
        <h1 className="mt-3 font-display text-[clamp(2.2rem,9vw,3.2rem)] font-extrabold leading-none text-ink">
          You&apos;re in{name ? `, ${name}` : ""}! 🩷
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-ink-soft">
          Your Endless Summer pre-order is locked in. We&apos;ll DM you within{" "}
          <strong>24 hours</strong> to arrange delivery or pickup. Check your email for a confirmation too.
        </p>

        {lines.length > 0 && (
          <ul className="mx-auto mt-6 max-w-sm divide-y divide-ink/10 rounded-[20px] bg-sand/50 px-4 text-left">
            {lines.map((l, i) => {
              const p = getProduct(l.id);
              return (
                <li key={i} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span className="font-semibold text-ink">
                    {p?.name ?? l.id}
                    <span className="font-normal text-ink-soft"> · Size {l.size}</span>
                  </span>
                  <span className="text-ink-soft">× {l.qty}</span>
                </li>
              );
            })}
            <li className="flex items-center justify-between py-3 font-bold text-ink">
              <span>Total</span>
              <span>{formatCents(total)}</span>
            </li>
          </ul>
        )}

        <p className="mt-6 font-hand text-3xl text-puccii-pink">be bold, be beachy, be PUCCII</p>

        <div className="mt-6 flex flex-col items-center gap-3">
          <a
            href={SITE.igUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full rounded-full bg-ink px-6 py-3.5 font-bold text-cream sm:w-auto"
          >
            Follow @{SITE.igHandle} for the drop
          </a>
          <Link href="/" className="text-sm font-semibold text-ink-soft underline underline-offset-2 hover:text-puccii-pink">
            Back to the shop
          </Link>
        </div>
      </div>
    </main>
  );
}
