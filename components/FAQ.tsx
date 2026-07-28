import { SITE } from "@/lib/site";
import Accordion, { type AccordionItem } from "./Accordion";

const ITEMS: AccordionItem[] = [
  {
    q: "What does pre-order mean?",
    a: (
      <p>
        You&apos;re reserving your set from the Endless Summer drop now and paying $39 to lock it in.
        After you check out, we personally DM you within 24 hours to arrange delivery or pickup.
      </p>
    ),
  },
  {
    q: "When will I get it?",
    a: (
      <p>
        We reach out within 24 hours of your order to confirm timing and how you&apos;d like to receive
        your set. Exact fulfillment windows are shared in that DM. See our pre-order policy for details.
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
        Because this is a pre-order drop, exchanges are handled case by case, so reach out and we&apos;ll do
        our best to take care of you. Full terms are on our pre-order policy page.
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
