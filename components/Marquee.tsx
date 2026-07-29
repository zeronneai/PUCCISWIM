import { DELIVERY } from "@/lib/shipping";

const ITEMS = [
  "SHOP THE DROP",
  "ENDLESS SUMMER COLLECTION",
  "$39 EVERY SET",
  "TWO-PIECE · TOP + BOTTOM",
  DELIVERY.shipping.freeLabel,
  "OR FREE PICKUP IN EL PASO",
];

export default function Marquee() {
  // Two identical tracks so the loop is seamless at -50%.
  const track = (
    <div className="flex shrink-0 items-center gap-6 pr-6" aria-hidden="true">
      {ITEMS.map((t, i) => (
        <span key={i} className="flex items-center gap-6 whitespace-nowrap">
          <span className="text-sm font-semibold uppercase tracking-[0.18em]">{t}</span>
          <span className="text-puccii-blush">✿</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden bg-puccii-pink py-2.5 text-cream">
      <span className="sr-only">
        Shop the Endless Summer collection. $39 every set. {DELIVERY.shipping.freeLabel}, or free
        pickup in El Paso.
      </span>
      <div className="flex w-max animate-marquee">
        {track}
        {track}
      </div>
    </div>
  );
}
