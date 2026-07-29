"use client";

import { useEffect, useRef, useState } from "react";
import { VIDEO_GROUPS } from "@/lib/gallery";
import { cldVideo, cldPoster } from "@/lib/cloudinary";

// Mya's clips, in two headed groups (runway first, off duty second). Only the
// clip more than half in view plays; the rest pause (IntersectionObserver).
// One shared mute toggle sits in the bottom-right corner. Each clip's
// orientation is detected from its poster, so verticals render 9/16 and
// horizontals 16/9, object-contain on a cream panel (no forced ratio, no crop).
// Nothing autoplays above the fold: preload is "none" and posters load lazily.

type Orient = "portrait" | "landscape";

// Assign a stable global index to every clip so one observer and one mute
// toggle can drive them all.
let counter = 0;
const GROUPS = VIDEO_GROUPS.map((g) => ({
  heading: g.heading,
  items: g.items.map((it) => ({ ...it, gi: counter++ })),
}));
const TOTAL = counter;

export default function SessionVideos() {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [muted, setMuted] = useState(true);
  const [orient, setOrient] = useState<Record<number, Orient>>({});
  const [started, setStarted] = useState<Record<number, boolean>>({});

  // Play the clip that is more than 50% visible, pause the others.
  useEffect(() => {
    if (TOTAL === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { threshold: [0, 0.5, 1] },
    );
    refs.current.forEach((v) => v && io.observe(v));
    return () => io.disconnect();
  }, []);

  // Reflect the shared mute toggle onto every clip.
  useEffect(() => {
    refs.current.forEach((v) => {
      if (v) v.muted = muted;
    });
  }, [muted]);

  if (TOTAL === 0) return null;

  return (
    <section id="session-videos" className="relative scroll-mt-20 bg-cream py-14 sm:py-20">
      <div className="mx-auto max-w-6xl space-y-10">
        {GROUPS.map((group) => (
          <div key={group.heading}>
            <p className="px-4 font-hand text-2xl text-puccii-pink sm:px-6">{group.heading}</p>

            <div className="no-scrollbar mt-4 flex snap-x snap-mandatory items-center gap-4 overflow-x-auto px-4 pb-2 sm:px-6">
              {group.items.map(({ gi, url, alt }) => {
                const landscape = orient[gi] === "landscape";
                const big = gi === 0;
                const shape = landscape
                  ? `aspect-[16/9] w-[85%] ${big ? "sm:w-[34rem]" : "sm:w-[26rem]"}`
                  : `aspect-[9/16] w-[70%] ${big ? "sm:w-72" : "sm:w-60"}`;
                return (
                  <div
                    key={gi}
                    className={`relative shrink-0 snap-center overflow-hidden rounded-[22px] bg-cream ring-1 ring-ink/5 ${shape}`}
                  >
                    <video
                      ref={(el) => {
                        refs.current[gi] = el;
                      }}
                      src={cldVideo(url)}
                      muted
                      loop
                      playsInline
                      preload="none"
                      aria-label={alt}
                      onPlaying={() => setStarted((s) => (s[gi] ? s : { ...s, [gi]: true }))}
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                    {/* Poster: lazy, fades out once the clip starts. Also the
                        cheapest place to detect orientation. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cldPoster(url)}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      onLoad={(e) => {
                        const img = e.currentTarget;
                        const o: Orient = img.naturalWidth >= img.naturalHeight ? "landscape" : "portrait";
                        setOrient((prev) => (prev[gi] ? prev : { ...prev, [gi]: o }));
                      }}
                      className={`pointer-events-none absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
                        started[gi] ? "opacity-0" : "opacity-100"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* One shared mute toggle, bottom-right corner. */}
      <div className="pointer-events-none sticky bottom-4 z-20 mt-2 flex justify-end px-4 sm:px-6">
        <button
          onClick={() => setMuted((m) => !m)}
          className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-ink text-cream shadow-lg transition-transform active:scale-95"
          aria-label={muted ? "Unmute videos" : "Mute videos"}
        >
          {muted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M17 9l4 6M21 9l-4 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
}
