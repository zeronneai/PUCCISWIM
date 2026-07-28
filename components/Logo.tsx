"use client";

import { useState } from "react";

// Cloudinary strips the white background (make_transparent) and trims the artwork.
const LOGO_URL =
  "https://res.cloudinary.com/dsprn0ew4/image/upload/e_make_transparent:25/e_trim/f_png/v1785192067/Replicate_logo_on_white_background_202607271634_oe5ehk.png";

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
