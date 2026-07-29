// Scroll-scrub hero frames generated ON-DEMAND by Cloudinary (so_ = start
// offset in %). We never download the videos or store frames in public/ - each
// frame is just a URL. Percentages (not seconds) map any master cleanly onto
// 100 frames with zero per-video tuning: both masters here run 5 seconds, so
// the so_ percentages land on the same moments in each.

export const HERO_FRAME_COUNT = 100;

const CLOUD = "https://res.cloudinary.com/dsprn0ew4/video/upload";

const MASTERS = {
  landscape: {
    id: "v1785339368/hf_20260729_150441_3c675dd5-9d54-44b9-813e-bff0bf18f9cb_vv5bmg",
    width: 1600,
    quality: 70,
  },
  portrait: {
    id: "v1785339370/hf_20260729_150422_57a0fa85-e360-4125-b8cd-f2bc7140f031_erdwxl",
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

// The last-resort fallback (the frame sequence already failed): force H.264 in
// MP4 so Safari cannot fail a second time on WebM or HEVC.
export function videoFallbackSrc(o: Orientation) {
  return `${CLOUD}/f_mp4,vc_h264,q_auto/${MASTERS[o].id}.mp4`;
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
