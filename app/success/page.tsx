import Link from "next/link";
import { getStripe } from "@/lib/stripe";
import { getStyle, getVariant } from "@/lib/products";
import { formatUSD } from "@/lib/format";
import { SITE } from "@/lib/site";
import { PICKUP } from "@/lib/pickup";
import SuccessActions from "@/components/SuccessActions";

export const dynamic = "force-dynamic";

type CompactLine = { styleId: string; variantId: string; size: string; qty: number };

async function loadSession(sessionId?: string) {
  if (!sessionId) return null;
  try {
    return await getStripe().checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
  } catch {
    return null;
  }
}

function PickupBlock() {
  return (
    <div className="mx-auto mt-6 max-w-sm rounded-[22px] border border-ink/10 bg-sand/40 p-5 text-left">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PICKUP.storeLogo} alt={PICKUP.storeName} className="h-9 w-auto object-contain" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-puccii-pink">Pick up at</p>
          <p className="font-display text-lg font-extrabold leading-tight text-ink">{PICKUP.storeName}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink">{PICKUP.address}</p>
      <ul className="mt-2 space-y-0.5 text-sm text-ink-soft">
        {PICKUP.hours.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-ink-soft">We hold your order for {PICKUP.holdDays} days.</p>
      <a
        href={PICKUP.mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream transition-transform active:scale-[0.98]"
      >
        Open in Maps
      </a>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-paper-pink via-puccii-blush to-cream px-5 py-16">
      <div className="paper-lines pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="relative w-full max-w-lg rounded-[32px] bg-cream/95 p-7 text-center shadow-[0_26px_60px_-22px_rgba(240,107,176,0.5)] backdrop-blur sm:p-9">
        {children}
      </div>
    </main>
  );
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const session = await loadSession(session_id);

  // Graceful fallback: never an error screen.
  if (!session) {
    return (
      <Shell>
        <SuccessActions />
        <span className="mb-1 inline-block rounded-full bg-puccii-pink px-4 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cream">
          Order received
        </span>
        <h1 className="mt-3 font-display text-[clamp(2.2rem,9vw,3.2rem)] font-extrabold leading-none text-ink">
          Thank you! 🩷
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-ink-soft">
          Your pre-order is in. Check your email for your order number and pickup details. Any
          questions, DM us on Instagram or email{" "}
          <a href={`mailto:${SITE.contactEmail}`} className="font-semibold text-puccii-pink">
            {SITE.contactEmail}
          </a>
          .
        </p>
        <PickupBlock />
        <div className="mt-6 flex flex-col items-center gap-3">
          <a
            href={SITE.igUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full rounded-full bg-ink px-6 py-3.5 font-bold text-cream sm:w-auto"
          >
            Follow @{SITE.igHandle}
          </a>
          <Link
            href="/"
            className="text-sm font-semibold text-ink-soft underline underline-offset-2 hover:text-puccii-pink"
          >
            Back to the shop
          </Link>
        </div>
      </Shell>
    );
  }

  const orderNumber = "PUCCII-" + session.id.slice(-6).toUpperCase();
  let lines: CompactLine[] = [];
  try {
    lines = JSON.parse((session.metadata?.order as string) ?? "[]");
  } catch {
    lines = [];
  }
  const firstName = session.customer_details?.name?.split(" ")[0] ?? "";
  const email = session.customer_details?.email ?? "";
  const total = session.amount_total ?? lines.reduce((n, l) => n + l.qty * SITE.priceCents, 0);

  return (
    <Shell>
      <span className="mb-1 inline-block rounded-full bg-puccii-pink px-4 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cream">
        Pre-order confirmed
      </span>
      <h1 className="mt-3 font-display text-[clamp(2rem,8vw,3rem)] font-extrabold leading-none text-ink">
        You&apos;re in{firstName ? `, ${firstName}` : ""}! 🩷
      </h1>

      {/* Order number, big and highlighted */}
      <div className="mx-auto mt-6 w-full max-w-sm rounded-[22px] bg-butter/60 px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">Show this at pickup</p>
        <p className="mt-1 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {orderNumber}
        </p>
      </div>

      {/* Summary */}
      {lines.length > 0 && (
        <ul className="mx-auto mt-5 max-w-sm divide-y divide-ink/10 rounded-[20px] bg-sand/40 px-4 text-left">
          {lines.map((l, i) => {
            const s = getStyle(l.styleId);
            const v = getVariant(l.styleId, l.variantId);
            return (
              <li key={i} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span className="font-semibold text-ink">
                  {s?.name ?? l.styleId}
                  <span className="font-normal text-ink-soft">
                    {" "}
                    · {v?.colorName ?? l.variantId} · Size {l.size}
                  </span>
                </span>
                <span className="shrink-0 text-ink-soft">× {l.qty}</span>
              </li>
            );
          })}
          <li className="flex items-center justify-between py-3 font-bold text-ink">
            <span>Total</span>
            <span>{formatUSD(total / 100)}</span>
          </li>
        </ul>
      )}

      <PickupBlock />

      {/* Email + resend */}
      <p className="mt-6 text-sm text-ink-soft">
        {email ? (
          <>A confirmation email is on its way to <strong className="text-ink">{email}</strong>.</>
        ) : (
          <>A confirmation email is on its way.</>
        )}
      </p>
      <p className="mt-1">
        <SuccessActions sessionId={session.id} />
      </p>

      <p className="mt-6 font-hand text-3xl text-puccii-pink">be bold, be beachy, be PUCCII</p>

      <div className="mt-4 flex flex-col items-center gap-3">
        <a
          href={SITE.igUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full rounded-full bg-ink px-6 py-3.5 font-bold text-cream sm:w-auto"
        >
          Follow @{SITE.igHandle}
        </a>
        <Link
          href="/"
          className="text-sm font-semibold text-ink-soft underline underline-offset-2 hover:text-puccii-pink"
        >
          Back to the shop
        </Link>
      </div>
    </Shell>
  );
}
