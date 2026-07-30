"use client";

import { useEffect } from "react";
import { inject } from "@vercel/analytics";

// Vercel Web Analytics via the vanilla inject() API. It must run in the browser,
// so it fires once on mount (inject() also patches history for SPA page views).
// This is the single analytics setup: don't also mount <Analytics /> or events
// would be counted twice.
export default function VercelAnalytics() {
  useEffect(() => {
    inject();
  }, []);
  return null;
}
