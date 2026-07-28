"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  DPR_CAP,
  PIN_DESKTOP,
  PIN_MOBILE,
  PRELOAD_POOL,
  PRIORITY_FRAMES,
  SEQUENCE,
  sequenceFrameSrc,
  type Orientation,
} from "@/lib/media";
import HeroTextBlock from "./HeroTextBlock";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function getOrientation(): Orientation {
  if (typeof window === "undefined") return "landscape";
  return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
}

/**
 * Scroll-scrub hero. A per-orientation WebP frame sequence is painted on a
 * pinned <canvas> as the user scrolls, via a GSAP proxy tween {p:0->1}.
 * Preserves the recipe's core: nearest-earlier-ready render, manual
 * object-cover, DPR cap, 3-wave preload (pool of 6), no-black-flash rebuild on
 * orientation change, StrictMode-safe cleanup, and 3 fallback levels.
 */
export default function SequenceHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lcpImgRef = useRef<HTMLImageElement>(null);

  // Survives orientation rebuilds so a resize/rebuild never flashes black.
  const lastDrawnImageRef = useRef<HTMLImageElement | null>(null);
  // Current scrub target, readable by async loaders.
  const desiredRef = useRef(0);

  const [orientation, setOrientation] = useState<Orientation>("landscape");
  const [reduced, setReduced] = useState(false);
  const [videoFallback, setVideoFallback] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mount-time environment reads.
  useEffect(() => {
    setMounted(true);
    setOrientation(getOrientation());
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Track orientation; a change re-runs the main effect (it's in its deps).
  useEffect(() => {
    const onResize = () => setOrientation(getOrientation());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ---- Main effect: build canvas + scrub timeline (skipped if reduced/video) ----
  useEffect(() => {
    if (!mounted || reduced || videoFallback) return;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const cfg = SEQUENCE[orientation];
    const N = cfg.frames;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let disposed = false;
    const images: (HTMLImageElement | undefined)[] = new Array(N);
    const ready: boolean[] = new Array(N).fill(false);
    let drawnIndex = -1;

    function draw(img: HTMLImageElement) {
      if (!ctx || !canvas) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      if (!iw || !ih) return;
      const scale = Math.max(cw / iw, ch / ih); // object-cover
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      lastDrawnImageRef.current = img;
    }

    // Paint the nearest decoded frame at/behind `desired` — never a gap.
    function render(desired: number) {
      let idx = Math.max(0, Math.min(N - 1, desired));
      while (idx > 0 && !ready[idx]) idx--;
      if (idx === drawnIndex) return;
      const img = images[idx];
      if (!img) return;
      draw(img);
      drawnIndex = idx;
    }

    function sizeCanvas() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      // Resize wipes the bitmap — repaint whatever we last had.
      if (lastDrawnImageRef.current) draw(lastDrawnImageRef.current);
    }

    function loadFrame(i: number): Promise<void> {
      return new Promise((resolve) => {
        if (disposed || images[i]) return resolve();
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (disposed) return resolve();
          ready[i] = true;
          images[i] = img;
          // Unblock whatever the scroll currently wants.
          if (i <= desiredRef.current) render(desiredRef.current);
          resolve();
        };
        img.onerror = () => {
          // Frame 0 missing => the whole sequence is unavailable -> MP4 fallback.
          if (i === 0 && !disposed) setVideoFallback(true);
          resolve();
        };
        img.src = sequenceFrameSrc(cfg.dir, i);
        images[i] = img;
      });
    }

    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    // ---- 3-wave preload ----
    (async () => {
      // Wave 1: the current progress frame first (key when rotating mid-scroll).
      await loadFrame(desiredRef.current);
      if (disposed) return;
      // Wave 2: first PRIORITY_FRAMES in parallel.
      await Promise.all(
        Array.from({ length: Math.min(PRIORITY_FRAMES, N) }, (_, i) => loadFrame(i)),
      );
      if (disposed) return;
      // Wave 3: the rest through a pool of PRELOAD_POOL workers.
      const queue: number[] = [];
      for (let i = 0; i < N; i++) if (!images[i]) queue.push(i);
      const worker = async () => {
        while (!disposed && queue.length) {
          const next = queue.shift();
          if (next === undefined) break;
          await loadFrame(next);
        }
      };
      await Promise.all(Array.from({ length: PRELOAD_POOL }, () => worker()));
    })();

    // ---- Scrub timeline: tween a proxy, not the canvas ----
    const proxy = { p: 0 };
    const runway = orientation === "portrait" ? PIN_MOBILE : PIN_DESKTOP;
    const overlay = overlayRef.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${runway}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
    tl.to(proxy, {
      p: 1,
      ease: "none",
      onUpdate: () => {
        const desired = Math.round(proxy.p * (N - 1));
        desiredRef.current = desired;
        render(desired);
        // Persistent block, fades out only in the last ~12% of the pin.
        if (overlay) {
          const fade = proxy.p <= 0.88 ? 1 : Math.max(0, 1 - (proxy.p - 0.88) / 0.12);
          overlay.style.opacity = String(fade);
        }
      },
    });

    return () => {
      disposed = true;
      window.removeEventListener("resize", sizeCanvas);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [mounted, orientation, reduced, videoFallback]);

  const cfg = SEQUENCE[orientation];

  // ---- Fallback 1: reduced motion — static poster + block, no pin/scrub ----
  if (mounted && reduced) {
    return (
      <section id="hero" className="relative -mt-16 h-[100svh] w-full overflow-hidden">
        <GradientBase />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cfg.poster}
          alt="PUCCII Swim — Endless Summer"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <Scrims />
        <HeroTextBlock />
      </section>
    );
  }

  return (
    <section id="hero" ref={sectionRef} className="relative -mt-16 h-[100svh] w-full overflow-hidden">
      {/* Palette gradient behind everything — the ultimate no-black-flash base. */}
      <GradientBase />

      {/* Fallback 3 / LCP: frame 1 painted immediately under the canvas. */}
      {!videoFallback && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={lcpImgRef}
          src={sequenceFrameSrc(cfg.dir, 0)}
          alt="PUCCII Swim — Endless Summer"
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}

      {/* The scrubbed canvas. */}
      {!videoFallback && (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
      )}

      {/* Fallback 2: sequence failed to load -> scrub a light MP4 instead. */}
      {videoFallback && <VideoFallback orientation={orientation} sectionRef={sectionRef} />}

      <Scrims />
      <HeroTextBlock ref={overlayRef} />
    </section>
  );
}

/** Palette base so a missing/loading frame is warm pink, never black. */
function GradientBase() {
  return (
    <div className="absolute inset-0 -z-20" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-paper-pink via-puccii-blush to-sand" />
    </div>
  );
}

/** Two subtle scrims only (adaptation #2): top for the nav, bottom for the text. */
function Scrims() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[120px]"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.25), transparent)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[40%]"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }}
        aria-hidden
      />
    </>
  );
}

/** Fallback 2: scrub a light MP4 by setting currentTime = p * duration. */
function VideoFallback({
  orientation,
  sectionRef,
}: {
  orientation: Orientation;
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cfg = SEQUENCE[orientation];

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    const proxy = { p: 0 };
    const runway = orientation === "portrait" ? PIN_MOBILE : PIN_DESKTOP;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top top", end: `+=${runway}`, pin: true, scrub: 1 },
    });
    tl.to(proxy, {
      p: 1,
      ease: "none",
      onUpdate: () => {
        if (video.duration) video.currentTime = proxy.p * video.duration;
      },
    });
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [orientation, sectionRef]);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 -z-10 h-full w-full object-cover"
      poster={cfg.poster}
      preload="none"
      muted
      playsInline
      onError={(e) => (e.currentTarget.style.display = "none")}
    >
      <source src={cfg.fallback} type="video/mp4" />
    </video>
  );
}
