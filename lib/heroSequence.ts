// Scroll-scrub hero frames. Each master video was cut into 100 stills (one per
// percent of its length) and they live in public/hero/<orientation>/ as
// frame-000.webp .. frame-099.webp, next to poster.jpg and fallback.mp4.
// Landscape frames are 1600px wide, portrait frames 900px.

export const HERO_FRAME_COUNT = 100;

const BASE = "/hero";

export type Orientation = "landscape" | "portrait";

// i goes 0..99
export function frameSrc(o: Orientation, i: number) {
  return `${BASE}/${o}/frame-${String(i).padStart(3, "0")}.webp`;
}

export function posterSrc(o: Orientation) {
  return `${BASE}/${o}/poster.jpg`;
}

// The last-resort fallback (the frame sequence already failed): H.264 in MP4 so
// Safari cannot fail a second time on WebM or HEVC.
export function videoFallbackSrc(o: Orientation) {
  return `${BASE}/${o}/fallback.mp4`;
}

// ---- Tuning (editable) -----------------------------------------------------
// Short footage (a continuous walk): shorter runways than the recipe.
export const PIN_DESKTOP = 2200;
export const PIN_MOBILE = 1700;

// Recipe preload knobs.
export const PRIORITY_FRAMES = 25;
export const PRELOAD_POOL = 6;
export const DPR_CAP = 2.5;

// Three beats, all in the SAME spot (centered, lower third) - only the text
// swaps. Ranges are normalized progress (0..1) and shared by both orientations.
// The gap between b2 (ends 0.56) and b3 (starts 0.82) is deliberate: the two
// women walk to the sea hand in hand with no text, then throw their arms up.
// b3 lands exactly on that final beat.
export type Beat = {
  id: "b1" | "b2" | "b3";
  in: number;
  out: number; // >1 means "stays to the end"
  text: string;
  kind: "body" | "climax";
  accent?: string; // one word rendered in the handwriting font (butter gold)
};

export const BEATS: Beat[] = [
  { id: "b1", in: 0.0, out: 0.26, text: "What you've been waiting for.", kind: "body", accent: "waiting" },
  { id: "b2", in: 0.3, out: 0.56, text: "It's finally here.", kind: "body", accent: "finally" },
  { id: "b3", in: 0.82, out: 1.01, text: "ENDLESS SUMMER", kind: "climax" },
];
