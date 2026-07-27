"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type SmartImageProps = Omit<ImageProps, "onError"> & {
  /** Shown inside the placeholder if the real image is missing. */
  fallbackLabel?: string;
  /** Tailwind gradient classes for the placeholder tint. */
  fallbackTint?: string;
};

/**
 * next/image that degrades to a branded placeholder when the file is absent.
 * The product .webp files ship separately (see BRIEF §6) — until they land,
 * the grid still looks intentional instead of showing broken images.
 */
export default function SmartImage({
  fallbackLabel,
  fallbackTint = "from-puccii-blush to-paper-pink",
  alt,
  className,
  fill,
  sizes,
  ...rest
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${fallbackTint} ${
          fill ? "absolute inset-0 h-full w-full" : ""
        } ${className ?? ""}`}
      >
        <span aria-hidden className="text-6xl opacity-60">🩷</span>
        {fallbackLabel ? (
          <span className="absolute bottom-3 left-3 right-3 font-hand text-lg leading-tight text-ink/70">
            {fallbackLabel}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <Image
      {...rest}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
