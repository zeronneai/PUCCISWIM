import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pre-order Policy — PUCCII Swim",
  description: "How PUCCII Swim pre-orders work: fulfillment timing and refund terms.",
};

export default function PreorderPolicy() {
  return (
    <LegalLayout title="Pre-order Policy">
      <p>
        Every item in the Endless Summer collection is sold as a <strong>pre-order</strong>. When you
        place an order you are reserving your two-piece set and paying in full ($39.00 USD per set) to
        secure it from the drop.
      </p>

      <h2>Fulfillment timing</h2>
      <p>
        After your payment is confirmed, a member of the PUCCII team will contact you within{" "}
        <strong>24 hours</strong> — by Instagram DM, phone, or email — to arrange delivery or local
        pickup and to confirm the timing for your set. Fulfillment is coordinated directly and
        personally; we&apos;ll keep you updated every step of the way. If you have not heard from us
        within 24 hours, please reach out at{" "}
        <a href={SITE.igUrl}>@{SITE.igHandle}</a>.
      </p>

      <h2>What&apos;s included</h2>
      <p>
        Each order is a complete two-piece set — top and bottom included — for $39.00. No shipping fees
        or taxes are added at checkout; any delivery arrangements are confirmed with you directly.
      </p>

      <h2>Refunds &amp; cancellations</h2>
      <p>
        Because this is a limited pre-order drop, we ask that you order thoughtfully. If you need to
        cancel, contact us within <strong>24 hours</strong> of your order and before we&apos;ve
        confirmed fulfillment, and we will issue a full refund to your original payment method. Once
        fulfillment has been arranged, cancellations and refunds are handled on a case-by-case basis.
        Refunds are processed through Stripe and may take 5–10 business days to appear.
      </p>

      <h2>Exchanges</h2>
      <p>
        Sizing exchanges are handled case by case — reach out and we&apos;ll do our best to get you into
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
