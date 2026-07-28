import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service — PUCCII Swim",
  description: "The terms for shopping the PUCCII Swim pre-order drop.",
};

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service">
      <p>
        Welcome to {SITE.name}, operated by {SITE.legalName} (&quot;we,&quot; &quot;us&quot;). By placing
        a pre-order through this site you agree to these terms.
      </p>

      <h2>Pre-orders &amp; pricing</h2>
      <p>
        All products are sold as pre-orders at $39.00 USD per two-piece set. Prices are shown in US
        dollars and are charged at checkout. We reserve the right to correct pricing errors and to
        cancel and fully refund any order affected by an obvious error.
      </p>

      <h2>Payment</h2>
      <p>
        Payments are processed securely by Stripe. We do not store your full card details. By checking
        out you authorize the charge for the items in your bag. See our{" "}
        <a href="/preorder-policy">Pre-order Policy</a> for fulfillment and refund terms.
      </p>

      <h2>Product representation</h2>
      <p>
        We work to represent colors and styling as accurately as possible, but screens vary and slight
        differences are normal. All sets are two pieces (top and bottom) and are fully lined.
      </p>

      <h2>Acceptable use</h2>
      <p>
        You agree not to misuse the site, attempt to disrupt it, or use it for any unlawful purpose.
        All brand names, logos, and imagery are the property of {SITE.legalName}.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {SITE.legalName} is not liable for indirect or
        incidental damages arising from your use of the site. Our total liability for any order is
        limited to the amount you paid for that order.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email{" "}
        <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.
      </p>
    </LegalLayout>
  );
}
