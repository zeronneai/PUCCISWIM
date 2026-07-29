import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Return Policy | PUCCII Swim",
  description:
    "PUCCII Swim return policy: 14 day returns, one free size exchange, store credit, and the hygiene requirements for swimwear.",
};

export default function ReturnPolicy() {
  return (
    <LegalLayout title="Return Policy">
      <p>
        We want you to feel confident in your PUCCII. If it isn&apos;t the perfect fit, we&apos;ll help
        you find one, because confidence should never be final.
      </p>

      <ul className="list-disc space-y-2 pl-5 marker:text-puccii-pink">
        <li>14 day return window</li>
        <li>Free size exchange (one per order) if inventory is available</li>
        <li>Store credit for eligible returns</li>
        <li>No refunds to original payment method</li>
        <li>
          Swimwear must be:
          <ul className="mt-2 list-[circle] space-y-1 pl-5 marker:text-puccii-pink">
            <li>Unworn</li>
            <li>Unwashed</li>
            <li>Free of makeup, deodorant, perfume, or sunscreen stains</li>
            <li>Hygienic liner intact</li>
            <li>Tried on over underwear</li>
          </ul>
        </li>
        <li>Sale items (20%+ off) are Final Sale.</li>
        <li>Defective items are replaced at no charge.</li>
        <li>Customer pays return shipping unless the item is defective.</li>
      </ul>
    </LegalLayout>
  );
}
