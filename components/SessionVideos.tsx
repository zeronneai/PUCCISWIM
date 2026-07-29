"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { VIDEO_GROUPS } from "@/lib/gallery";
import { cldVideo, cldPoster } from "@/lib/cloudinary";

// Mya's clips. Both headed groups flow as one continuous gallery strip: the
// runway group is a single featured clip, so its label reads as a segment
// divider instead of sitting alone in a sparse row. Only the clip more than
// half in view plays; the rest pause. One shared mute toggle sits in the
// bottom-right corner. Orientation is read from each clip's metadata, so
// verticals render 9/16 and horizontals 16/9, object-contain on a cream panel
// (no forced ratio, no crop).
//
// Safari playback: muted is set on the element itself (React does not always
// reflect the JSX attr) plus defaultMuted, preload is "metadata" (Safari needs
// metadata before it honors a programmatic play), the play() promise is caught,
// and a tap-to-play button covers iPhone Low Power Mode. The source is forced
// to H.264/MP4 in lib/cloudinary.ts.

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
  const [needsTap, setNeedsTap] = useState<Record<number, boolean>>({});

  // Attempt play; if the browser rejects autoplay (iPhone Low Power Mode),
  // surface a tap-to-play button instead of leaving the clip frozen on its poster.
  function tryPlay(v: HTMLVideoElement) {
    const gi = Number(v.dataset.gi);
    const p = v.play();
    if (p !== undefined) {
      p.then(() => setNeedsTap((n) => (n[gi] ? { ...n, [gi]: false } : n))).catch(() =>
        setNeedsTap((n) => ({ ...n, [gi]: true })),
      );
    }
  }

  // Play the clip that is more than 50% visible, pause the others.
  useEffect(() => {
    if (TOTAL === 0) return;
    // Real muted on the element (Safari blocks autoplay without it).
    refs.current.forEach((v) => {
      if (v) {
        v.muted = true;
        v.defaultMuted = true;
      }
    });
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const v = entry.target as HTMLVideoElement;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) tryPlay(v);
          else v.pause();
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
      if (v) {
        v.muted = muted;
        v.defaultMuted = muted;
      }
    });
  }, [muted]);

  if (TOTAL === 0) return null;

  return (
    <section id="session-videos" className="relative scroll-mt-20 bg-cream py-14 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="no-scrollbar flex snap-x snap-mandatory items-center gap-4 overflow-x-auto px-4 pb-2 sm:gap-6 sm:px-6">
          {GROUPS.map((group) => (
            <Fragment key={group.heading}>
              {/* Segment label: keeps both group names while the clips read as one strip. */}
              <div className="flex shrink-0 snap-start items-center">
                <p className="w-24 -rotate-2 text-center font-hand text-2xl leading-tight text-puccii-pink sm:w-28">
                  {group.heading}
                </p>
              </div>
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
                      data-gi={gi}
                      src={cldVideo(url)}
                      poster={cldPoster(url)}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label={alt}
                      onLoadedMetadata={(e) => {
                        const v = e.currentTarget;
                        if (!v.videoWidth || !v.videoHeight) return;
                        const o: Orient = v.videoWidth >= v.videoHeight ? "landscape" : "portrait";
                        setOrient((prev) => (prev[gi] ? prev : { ...prev, [gi]: o }));
                      }}
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                    {needsTap[gi] && (
                      <button
                        onClick={() => {
                          const v = refs.current[gi];
                          if (v) tryPlay(v);
                        }}
                        aria-label="Play video"
                        className="absolute inset-0 z-10 grid place-items-center bg-ink/20"
                      >
                        <span className="grid h-14 w-14 place-items-center rounded-full bg-cream/90 text-ink shadow-lg">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
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
