import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { SITE } from "@/lib/site";
import { DELIVERY } from "@/lib/shipping";

export const metadata: Metadata = {
  title: "Delivery Policy | PUCCII Swim",
  description:
    "How PUCCII Swim delivery works: shipping or free El Paso pickup, timing, store credit and returns.",
};

export default function DeliveryPolicy() {
  return (
    <LegalLayout title="Delivery Policy">
      <p>
        Every item in the Endless Summer collection is a complete two-piece set at $39.00 USD. You pay
        at checkout, and you choose how to get it: shipping or free local pickup.
      </p>

      <h2>Delivery</h2>
      <p>Two ways to get your PUCCII, and you choose one at checkout.</p>
      <p>
        <strong>Shipping.</strong>{" "}
        {DELIVERY.shipping.standard.label} is ${DELIVERY.shipping.standard.price} and{" "}
        {DELIVERY.shipping.priority.label.toLowerCase()} is ${DELIVERY.shipping.priority.price}.{" "}
        {DELIVERY.shipping.freeLabel}. The rate is calculated and charged at checkout, not here.
      </p>
      <p>
        <strong>Free local pickup ({DELIVERY.pickup.note}).</strong>{" "}
        Pick up at no cost at {DELIVERY.pickup.storeName} in El Paso. Bring your order number (on your
        phone is fine) to:
      </p>
      <p>
        <strong>{DELIVERY.pickup.storeName}</strong>
        <br />
        {DELIVERY.pickup.address}
        <br />
        {DELIVERY.pickup.hours.join(" · ")}
      </p>
      <p>
        We hold pickup orders at {DELIVERY.pickup.storeName} for{" "}
        <strong>{DELIVERY.pickup.holdDays} days</strong>{" "}
        from the day they&apos;re ready. If you can&apos;t make it in that window, message us at{" "}
        <a href={SITE.igUrl}>@{SITE.igHandle}</a>{" "}
        and we&apos;ll do our best to arrange something.
      </p>

      <h2>What&apos;s included</h2>
      <p>
        Each order is a complete two-piece set, top and bottom included, for $39.00. Any shipping is
        added at checkout; local pickup is free.
      </p>

      <h2>Cancellations &amp; store credit</h2>
      <p>
        Because this is a limited drop, we ask that you order thoughtfully. If you need to
        cancel, contact us within <strong>24 hours</strong>{" "}
        of your order and before it&apos;s ready for pickup, and we&apos;ll set you up with{" "}
        <strong>store credit</strong>. We do not issue refunds to the original payment method. After
        that, cancellations are handled case by case. Orders left unclaimed after{" "}
        {DELIVERY.pickup.holdDays} days may be restocked; reach out and we&apos;ll help.
      </p>

      <h2>Returns &amp; exchanges</h2>
      <p>
        Sizing exchanges and returns are covered by our{" "}
        <a href="/return-policy">Return Policy</a>: a 14 day window, one free size exchange per order
        when inventory allows, and store credit on eligible returns. PUCCII runs true to size; check
        our Fit &amp; Fabric guide before ordering.
      </p>

      <h2>Contact</h2>
      <p>
        The fastest way to reach us is a DM to <a href={SITE.igUrl}>@{SITE.igHandle}</a>, or email{" "}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
    </LegalLayout>
  );
}
