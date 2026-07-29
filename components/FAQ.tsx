import { SITE } from "@/lib/site";
import { PICKUP } from "@/lib/pickup";
import Accordion, { type AccordionItem } from "./Accordion";

const ITEMS: AccordionItem[] = [
  {
    q: "What does pre-order mean?",
    a: (
      <p>
        You&apos;re reserving your set from the Endless Summer drop now and paying $39 to lock it in.
        Right after checkout we email you your order number and pickup details, and hold your set at{" "}
        {PICKUP.storeName} for you.
      </p>
    ),
  },
  {
    q: "When will I get it?",
    a: (
      <p>
        We email your order number and pickup details right after checkout. Pick it up in person at{" "}
        {PICKUP.storeName} in El Paso, where we hold your order for {PICKUP.holdDays} days. See our pre-order
        policy for hours and details.
      </p>
    ),
  },
  {
    q: "Where do I pick up my order?",
    a: (
      <p>
        At {PICKUP.storeName}, {PICKUP.address}. Hours: {PICKUP.hours.join("; ")}. We hold your order for{" "}
        {PICKUP.holdDays} days. Just show the order number from your confirmation email at pickup.
      </p>
    ),
  },
  {
    q: "Is it a full set?",
    a: (
      <p>
        Always. Every PUCCII style is a two-piece, with top <em>and</em> bottom included for $39. No add-ons,
        no surprises.
      </p>
    ),
  },
  {
    q: "How do I pick my size?",
    a: (
      <p>
        PUCCII runs true to size (XS to L). Between sizes? Size up on top for more coverage. Check the Fit
        &amp; Fabric section, or DM us and we&apos;ll help you choose.
      </p>
    ),
  },
  {
    q: "Can I exchange?",
    a: (
      <p>
        Yes. We offer one free size exchange per order when your size is in stock, within a 14 day
        window. Eligible returns come back as store credit, not a refund to your original payment
        method. See our{" "}
        <a href="/return-policy" className="font-semibold text-puccii-pink underline underline-offset-2">
          Return Policy
        </a>{" "}
        for the full details.
      </p>
    ),
  },
  {
    q: "How do I contact you?",
    a: (
      <p>
        DM us anytime on Instagram at{" "}
        <a href={SITE.igUrl} target="_blank" rel="noreferrer" className="font-semibold text-puccii-pink underline underline-offset-2">
          @{SITE.igHandle}
        </a>{" "}
        or email{" "}
        <a href={`mailto:${SITE.contactEmail}`} className="font-semibold text-puccii-pink underline underline-offset-2">
          {SITE.contactEmail}
        </a>
        .
      </p>
    ),
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="scroll-mt-20 bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="font-hand text-2xl text-puccii-pink">good to know</p>
        <h2 className="mb-6 text-[clamp(2rem,7vw,3.2rem)] font-extrabold text-ink">FAQ</h2>
        <Accordion items={ITEMS} />
      </div>
    </section>
  );
}
