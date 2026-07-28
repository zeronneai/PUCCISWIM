// Scroll-scrub hero frames generated ON-DEMAND by Cloudinary (so_ = start
// offset in %). We never download the videos or store frames in public/ - each
// frame is just a URL. Percentages (not seconds) let the 5s and 7s masters both
// map cleanly onto 100 frames with zero per-video tuning.

export const HERO_FRAME_COUNT = 100;

const CLOUD = "https://res.cloudinary.com/dsprn0ew4/video/upload";

const MASTERS = {
  landscape: {
    id: "v1785215904/hf_20260728_050657_0425179b-3ec6-49f4-a533-2ac4df32e9da_d7tq37",
    width: 1600,
    quality: 70,
  },
  portrait: {
    id: "v1785216071/hf_20260728_051619_647beed1-7413-46a1-8a2c-be0f0fef7944_qzbm75",
    width: 900,
    quality: 65,
  },
} as const;

export type Orientation = keyof typeof MASTERS;

// i goes 0..99 -> so_0p .. so_99p (percentage of the video)
export function frameSrc(o: Orientation, i: number) {
  const m = MASTERS[o];
  return `${CLOUD}/so_${i}p,w_${m.width},c_scale,q_${m.quality}/${m.id}.webp`;
}

export function posterSrc(o: Orientation) {
  const m = MASTERS[o];
  return `${CLOUD}/so_0p,w_${m.width},c_scale,q_60/${m.id}.jpg`;
}

export function videoFallbackSrc(o: Orientation) {
  return `${CLOUD}/q_auto,f_auto/${MASTERS[o].id}.mp4`;
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
export type Beat = {
  id: "b1" | "b2" | "b3";
  in: number;
  out: number; // >1 means "stays to the end"
  text: string;
  kind: "body" | "climax";
};

export const BEATS: Beat[] = [
  { id: "b1", in: 0.0, out: 0.3, text: "What you've been waiting for.", kind: "body" },
  { id: "b2", in: 0.34, out: 0.62, text: "It's finally here.", kind: "body" },
  { id: "b3", in: 0.68, out: 1.01, text: "ENDLESS SUMMER", kind: "climax" },
];
