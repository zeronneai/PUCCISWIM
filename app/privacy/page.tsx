import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy — PUCCII Swim",
  description: "How PUCCII Swim collects and uses your information.",
};

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>
        {SITE.legalName} (&quot;we&quot;) respects your privacy. This policy explains what we collect
        when you pre-order from {SITE.name} and how we use it.
      </p>

      <h2>What we collect</h2>
      <p>
        To process your pre-order and coordinate delivery, we collect your name, email address, phone
        number, and Instagram handle. Payment is handled by Stripe — we receive confirmation of your
        purchase but never see your full card number.
      </p>

      <h2>How we use it</h2>
      <p>
        We use your information solely to fulfill your order: to confirm your purchase, to DM or contact
        you within 24 hours to arrange delivery or pickup, and to provide customer support. We do not
        sell your information.
      </p>

      <h2>Who we share it with</h2>
      <p>
        We share information only with the services that make your order work: Stripe for payment
        processing and Resend for sending order confirmation emails. Each processes data under its own
        privacy terms.
      </p>

      <h2>Analytics</h2>
      <p>
        We use privacy-friendly Vercel Analytics to understand aggregate site traffic. It does not use
        cookies to track you across sites or build an advertising profile.
      </p>

      <h2>Your choices</h2>
      <p>
        You can request access to, correction of, or deletion of your personal information at any time
        by emailing <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
    </LegalLayout>
  );
}
