// Hero media mode + static-mode config.
// The scroll-scrub sequence config lives in lib/heroSequence.ts.

export type HeroMode = "image" | "video" | "sequence";

// Scroll-scrub sequence hero (Cloudinary-generated frames).
export const HERO_MODE: HeroMode = "sequence";

// The climax / headline word. Change this one line (e.g. "swimwear and self love").
export const HERO_LINE = "ENDLESS SUMMER";

// --- Static "image" / "video" fallback modes (used only if HERO_MODE flips) --
// TODO(owner): paste a Cloudinary still URL here if you ever use "image".
export const HERO_IMAGE_URL = "";
// Only used in "video" mode. The vertical file is MANDATORY on mobile.
export const HERO_VIDEO_DESKTOP = "";
export const HERO_VIDEO_MOBILE = "";
