"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BEATS,
  DPR_CAP,
  HERO_FRAME_COUNT,
  PIN_DESKTOP,
  PIN_MOBILE,
  PRELOAD_POOL,
  PRIORITY_FRAMES,
  frameSrc,
  posterSrc,
  videoFallbackSrc,
  type Orientation,
} from "@/lib/heroSequence";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function getOrientation(): Orientation {
  if (typeof window === "undefined") return "landscape";
  return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
}

const FADE = 0.03; // beat cross-fade zone, in progress units

// opacity for a beat at progress p (0 outside its window, cross-fades at edges).
function beatOpacity(p: number, b: (typeof BEATS)[number]) {
  if (p < b.in || p >= b.out) return 0;
  // A beat starting at 0 is visible at rest (no enter-fade from nothing).
  const enter = b.in <= 0 ? 1 : Math.min(1, (p - b.in) / FADE);
  const exit = Math.min(1, (b.out - p) / FADE);
  return Math.max(0, Math.min(enter, exit, 1));
}

export default function SequenceHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null); // scaled 1.04 -> 1.00
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cueRef = useRef<HTMLDivElement>(null);

  // Persists across orientation rebuilds so a resize never flashes black.
  const lastDrawnImageRef = useRef<HTMLImageElement | null>(null);
  const desiredRef = useRef(0);

  const [orientation, setOrientation] = useState<Orientation>("landscape");
  const [reduced, setReduced] = useState(false);
  const [videoFallback, setVideoFallback] = useState(false);
  const [climaxIn, setClimaxIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOrientation(getOrientation());
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const onResize = () => setOrientation(getOrientation());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Fade the scroll cue on first scroll.
  useEffect(() => {
    const onScroll = () => {
      if (cueRef.current && window.scrollY > 6) cueRef.current.style.opacity = "0";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ---- Main effect: canvas/video + pin+scrub timeline + beats -------------
  useEffect(() => {
    if (!mounted || reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    const N = HERO_FRAME_COUNT;
    const runway = orientation === "portrait" ? PIN_MOBILE : PIN_DESKTOP;

    // Shared: drive beats + media zoom off progress (both canvas & video modes).
    function applyProgress(p: number) {
      for (let i = 0; i < BEATS.length; i++) {
        const el = beatRefs.current[i];
        if (!el) continue;
        const o = beatOpacity(p, BEATS[i]);
        el.style.opacity = String(o);
        el.style.transform = `translateY(${(1 - o) * 12}px)`;
        el.style.filter = `blur(${(1 - o) * 4}px)`;
      }
      if (mediaRef.current) mediaRef.current.style.transform = `scale(${1.04 - 0.04 * p})`;
      setClimaxIn(p >= BEATS[2].in);
    }

    // ---------- Video-fallback mode ----------
    if (videoFallback) {
      const video = videoRef.current;
      if (!video) return;
      const proxy = { p: 0 };
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top top", end: `+=${runway}`, pin: true, scrub: 1, anticipatePin: 1 },
      });
      tl.to(proxy, {
        p: 1,
        ease: "none",
        onUpdate: () => {
          if (video.duration) video.currentTime = proxy.p * video.duration;
          applyProgress(proxy.p);
        },
      });
      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    }

    // ---------- Canvas frame-sequence mode ----------
    const canvas = canvasRef.current;
    if (!canvas) return;
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
      const scale = Math.max(cw / iw, ch / ih); // manual object-cover
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      lastDrawnImageRef.current = img;
    }

    // Paint the nearest decoded frame at/behind `desired` - never a gap.
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
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      if (lastDrawnImageRef.current) draw(lastDrawnImageRef.current); // resize wipes bitmap
    }

    function loadFrame(i: number): Promise<void> {
      return new Promise((resolve) => {
        if (disposed || images[i]) return resolve();
        const img = new Image();
        img.decoding = "async";
        img.crossOrigin = "anonymous";
        img.onload = () => {
          if (disposed) return resolve();
          ready[i] = true;
          images[i] = img;
          if (i <= desiredRef.current) render(desiredRef.current);
          resolve();
        };
        img.onerror = () => {
          if (i === 0 && !disposed) setVideoFallback(true); // whole sequence unavailable
          resolve();
        };
        img.src = frameSrc(orientation, i);
        images[i] = img;
      });
    }

    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    // 3-wave preload
    (async () => {
      await loadFrame(desiredRef.current);
      if (disposed) return;
      await Promise.all(Array.from({ length: Math.min(PRIORITY_FRAMES, N) }, (_, i) => loadFrame(i)));
      if (disposed) return;
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

    const proxy = { p: 0 };
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
        applyProgress(proxy.p);
      },
    });

    return () => {
      disposed = true;
      window.removeEventListener("resize", sizeCanvas);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [mounted, orientation, reduced, videoFallback]);

  const setBeatRef = (i: number) => (el: HTMLDivElement | null) => {
    beatRefs.current[i] = el;
  };

  // ---- Fallback 1: reduced motion - static final frame + climax only ------
  if (mounted && reduced) {
    return (
      <section id="hero" className="hero-pull relative h-[100svh] w-full overflow-hidden">
        <GradientBase />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={frameSrc(orientation, HERO_FRAME_COUNT - 1)}
          alt="PUCCII Swim, Endless Summer"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <Scrims />
        <Climax show />
      </section>
    );
  }

  return (
    <section id="hero" ref={sectionRef} className="hero-pull relative h-[100svh] w-full overflow-hidden">
      <GradientBase />

      {/* Media layer (scaled 1.04 -> 1.00 across the pin) */}
      <div ref={mediaRef} className="absolute inset-0 -z-10 will-change-transform">
        {!videoFallback && (
          <>
            {/* Fallback 3 / LCP: frame 0 painted immediately under the canvas. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={frameSrc(orientation, 0)}
              alt="PUCCII Swim, Endless Summer"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
          </>
        )}
        {/* Fallback 2: sequence failed -> scrub a light MP4 instead. */}
        {videoFallback && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            poster={posterSrc(orientation)}
            preload="none"
            muted
            playsInline
            onError={(e) => (e.currentTarget.style.display = "none")}
          >
            <source src={videoFallbackSrc(orientation)} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Film grain, 5%, over the media (below scrims/text). */}
      <div className="hero-grain pointer-events-none absolute inset-0 z-[1]" aria-hidden />

      <Scrims />

      {/* Beats - all in the SAME spot; only text swaps. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[20%] z-20 flex justify-center px-6 md:bottom-[18%]">
        <div className="relative flex min-h-[7.5rem] w-full max-w-xl items-start justify-center text-center">
          {BEATS.map((b, i) => (
            <div
              key={b.id}
              ref={setBeatRef(i)}
              className="absolute inset-x-0 top-0 flex flex-col items-center"
              style={{ opacity: 0 }}
            >
              {b.kind === "climax" ? (
                <Climax show={climaxIn} inline />
              ) : (
                <p className="text-legible font-body text-xl font-medium text-cream sm:text-2xl">
                  {b.text}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue: 1px x 40px line with a gradient that loops down; fades on scroll. */}
      <div
        ref={cueRef}
        className="pointer-events-none absolute bottom-6 left-1/2 z-20 h-10 w-px -translate-x-1/2 overflow-hidden transition-opacity duration-500"
        aria-hidden
      >
        <div className="hero-cue absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-cream to-transparent" />
      </div>
    </section>
  );
}

/** Climax layer: headline + SHOP NOW. Button enters 200ms after the text. */
function Climax({ show, inline = false }: { show: boolean; inline?: boolean }) {
  return (
    <div className={inline ? "flex flex-col items-center" : "absolute inset-x-0 bottom-[18%] z-20 flex flex-col items-center px-6 text-center"}>
      <h1
        className="text-legible font-display font-semibold uppercase text-cream"
        style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)", letterSpacing: "0.15em" }}
      >
        ENDLESS SUMMER
      </h1>
      <a
        href="#shop"
        className={`text-legible pointer-events-auto mt-6 inline-flex min-h-12 items-center justify-center border border-cream px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-cream transition-all duration-500 hover:bg-cream hover:text-ink ${
          show ? "opacity-100 [transition-delay:200ms]" : "translate-y-2 opacity-0"
        }`}
      >
        Shop Now
      </a>
    </div>
  );
}

/** Palette base so a missing/loading frame is warm pink, never black. */
function GradientBase() {
  return (
    <div className="absolute inset-0 -z-20" aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-sky/70 via-paper-pink to-sand" />
    </div>
  );
}

/** Two scrims only (adaptation #3): top for the nav, bottom for the text. */
function Scrims() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[120px]"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.22), transparent)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[45%]"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.38), transparent)" }}
        aria-hidden
      />
    </>
  );
}
