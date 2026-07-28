import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { SITE } from "@/lib/site";
import { PICKUP } from "@/lib/pickup";

export const metadata: Metadata = {
  title: "Pre-order Policy | PUCCII Swim",
  description: "How PUCCII Swim pre-orders work: in-person pickup, timing and refund terms.",
};

export default function PreorderPolicy() {
  return (
    <LegalLayout title="Pre-order Policy">
      <p>
        Every item in the Endless Summer collection is sold as a <strong>pre-order</strong>. When you
        place an order you are reserving your two-piece set and paying in full ($39.00 USD per set) to
        secure it from the drop.
      </p>

      <h2>Pickup</h2>
      <p>
        Orders are <strong>picked up in person</strong> — there is no shipping. Right after checkout we
        email you your <strong>order number</strong> and these pickup details. Bring the order number
        (on your phone is fine) to:
      </p>
      <p>
        <strong>{PICKUP.storeName}</strong>
        <br />
        {PICKUP.address}
        <br />
        {PICKUP.hours.join(" · ")}
      </p>
      <p>
        We hold your order at {PICKUP.storeName} for <strong>{PICKUP.holdDays} days</strong> from the
        day it&apos;s ready. If you can&apos;t make it in that window, message us at{" "}
        <a href={SITE.igUrl}>@{SITE.igHandle}</a> and we&apos;ll do our best to arrange something.
      </p>

      <h2>What&apos;s included</h2>
      <p>
        Each order is a complete two-piece set, top and bottom included, for $39.00. No shipping fees or
        taxes are added at checkout.
      </p>

      <h2>Refunds &amp; cancellations</h2>
      <p>
        Because this is a limited pre-order drop, we ask that you order thoughtfully. If you need to
        cancel, contact us within <strong>24 hours</strong> of your order and before it&apos;s ready for
        pickup, and we will issue a full refund to your original payment method. After that,
        cancellations and refunds are handled on a case-by-case basis. Refunds are processed through
        Stripe and may take 5 to 10 business days to appear. Orders left unclaimed after{" "}
        {PICKUP.holdDays} days may be restocked; reach out and we&apos;ll help.
      </p>

      <h2>Exchanges</h2>
      <p>
        Sizing exchanges are handled case by case, so reach out and we&apos;ll do our best to get you into
        the right fit. PUCCII runs true to size; check our Fit &amp; Fabric guide before ordering.
      </p>

      <h2>Contact</h2>
      <p>
        The fastest way to reach us is a DM to <a href={SITE.igUrl}>@{SITE.igHandle}</a>, or email{" "}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
    </LegalLayout>
  );
}
