"use client";

import { useState } from "react";

// Wordmark with the white background already removed and trimmed.
const LOGO_URL =
  "/media/logo.png";

/**
 * Brand wordmark image with a typographic fallback (BRIEF: keep the text
 * wordmark if the image fails). `tone="light"` renders it as a light silhouette
 * for dark backgrounds (footer, mobile menu); `tone="natural"` leaves it as-is.
 */
export default function Logo({
  className = "",
  heightClass = "h-7",
  tone = "natural",
  fallback,
}: {
  className?: string;
  heightClass?: string;
  tone?: "natural" | "light";
  fallback: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_URL}
      alt="PUCCII Swim"
      onError={() => setFailed(true)}
      className={`${heightClass} w-auto object-contain ${
        tone === "light" ? "[filter:brightness(0)_invert(1)]" : ""
      } ${className}`}
    />
  );
}
