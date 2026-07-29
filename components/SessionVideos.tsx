"use client";

import { useEffect, useRef, useState } from "react";
import { VIDEO_SESSION } from "@/lib/gallery";

// "on the beach": vertical 9:16 clips in a scroll row. Only the clip in view
// plays; the rest pause (IntersectionObserver). One mute toggle for all.
// Renders nothing until VIDEO_SESSION has entries.
export default function SessionVideos() {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (VIDEO_SESSION.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { threshold: [0, 0.6, 1] },
    );
    refs.current.forEach((v) => v && io.observe(v));
    return () => io.disconnect();
  }, []);

  // Reflect the mute toggle onto every clip.
  useEffect(() => {
    refs.current.forEach((v) => {
      if (v) v.muted = muted;
    });
  }, [muted]);

  if (VIDEO_SESSION.length === 0) return null;

  return (
    <section id="session-videos" className="scroll-mt-20 bg-cream py-14 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between px-4 sm:px-6">
          <p className="font-hand text-2xl text-puccii-pink">on the beach</p>
          <button
            onClick={() => setMuted((m) => !m)}
            className="grid h-11 w-11 place-items-center rounded-full bg-ink text-cream shadow-sm transition-transform active:scale-95"
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

        <div className="no-scrollbar mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6">
          {VIDEO_SESSION.map((v, i) => (
            <div
              key={i}
              className="relative aspect-[9/16] w-[70%] shrink-0 snap-center overflow-hidden rounded-[22px] bg-ink/5 sm:w-64"
            >
              <video
                ref={(el) => {
                  refs.current[i] = el;
                }}
                src={v.url}
                poster={v.poster}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={v.alt}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
