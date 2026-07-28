// Single source of truth for the hero media (static + scroll-scrub sequence).

export type HeroMode = "image" | "video" | "sequence";

// Keep on "image" until the frame sets exist. Flip to "sequence" once
// /public/sequence/lg and /public/sequence/pt are populated (see
// scripts/extract-frames.sh).
export const HERO_MODE: HeroMode = "image";

// The ONLY hero headline. Change this one line (e.g. "swimwear and self love").
export const HERO_LINE = "ENDLESS SUMMER";

// --- Static "image" / "video" mode -----------------------------------------
// TODO(owner): paste the Cloudinary URL of the 3-models render here.
export const HERO_IMAGE_URL = "";
// Only used in "video" mode. The vertical file is MANDATORY on mobile.
export const HERO_VIDEO_DESKTOP = "";
export const HERO_VIDEO_MOBILE = "";

// --- Scroll-scrub "sequence" mode ------------------------------------------
// Frame budget (BRIEF adaptation #5): start at 115 landscape / 90 portrait and
// dial WebP quality down until each set is <= 5 MB. Portrait is the critical
// one — almost all traffic is mobile from Instagram.
export const SEQUENCE = {
  landscape: {
    frames: 115,
    dir: "/sequence/lg",
    poster: "/hero-poster-lg.jpg",
    fallback: "/hero-fallback-lg.mp4",
  },
  portrait: {
    frames: 90,
    dir: "/sequence/pt",
    poster: "/hero-poster-pt.jpg",
    fallback: "/hero-fallback-pt.mp4",
  },
} as const;

export type Orientation = keyof typeof SEQUENCE;

// Runway in px (adaptation #4): footage is ~5s, ~400px/s, with a floor.
export const PIN_DESKTOP = 2400;
export const PIN_MOBILE = 1800;

// Preload tuning (from the recipe).
export const PRIORITY_FRAMES = 25;
export const PRELOAD_POOL = 6;
// DPR cap: retina-sharp without paying 3x on phones.
export const DPR_CAP = 2.5;

// frame-001.webp … (3 digits, 1-indexed on disk).
export function sequenceFrameSrc(dir: string, index: number): string {
  return `${dir}/frame-${String(index + 1).padStart(3, "0")}.webp`;
}
