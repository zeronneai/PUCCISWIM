import Stripe from "stripe";

let cached: Stripe | null = null;

/** Lazily construct the Stripe client so a missing key doesn't crash the build. */
export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  // Pin to the version this stripe SDK ships with (omit to accept the SDK default).
  cached = new Stripe(key);
  return cached;
}
