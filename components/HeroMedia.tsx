"use client";

import Image from "next/image";
import { useState } from "react";
import {
  HERO_IMAGE_URL,
  HERO_MODE,
  HERO_VIDEO_DESKTOP,
  HERO_VIDEO_MOBILE,
} from "@/lib/media";

const HERO_POSTER = HERO_IMAGE_URL;

function GradientFallback() {
  return (
    <div className="absolute inset-0 -z-10" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-paper-pink via-puccii-pink to-ink" />
      <div
        className="absolute inset-0 opacity-70 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(120% 80% at 70% 15%, #F6DFA0 0%, transparent 45%), radial-gradient(90% 70% at 15% 35%, #A8D2ED 0%, transparent 40%)",
        }}
      />
    </div>
  );
}

/** Static hero media for "image" / "video" modes ("sequence" is SequenceHero). */
export default function HeroMedia() {
  const [failed, setFailed] = useState(false);

  const useFallback =
    failed ||
    (HERO_MODE === "image" && !HERO_IMAGE_URL) ||
    (HERO_MODE === "video" && !HERO_VIDEO_DESKTOP);

  if (useFallback) return <GradientFallback />;

  if (HERO_MODE === "video") {
    return (
      <video
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        poster={HERO_POSTER || undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
      >
        {HERO_VIDEO_MOBILE && (
          <source media="(max-width:768px)" src={HERO_VIDEO_MOBILE} type="video/mp4" />
        )}
        <source src={HERO_VIDEO_DESKTOP} type="video/mp4" />
      </video>
    );
  }

  // "image"
  return (
    <Image
      src={HERO_IMAGE_URL}
      alt="PUCCII Swim, Endless Summer"
      fill
      priority
      sizes="100vw"
      className="-z-10 object-cover"
      onError={() => setFailed(true)}
    />
  );
}
