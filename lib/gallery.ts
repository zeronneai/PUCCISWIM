// Mya's photo + video shoots. Paste Cloudinary URLs here to light the sections up.
// While an array is EMPTY, its section does not render at all — no placeholders.

export type PhotoItem = { url: string; alt: string; styleId?: string };
export type VideoItem = { url: string; poster: string; alt: string };

// Gallery 1 — stills. Shown after the story hook, before the catalog.
export const PHOTO_SESSION: PhotoItem[] = [
  // { url: "https://res.cloudinary.com/dsprn0ew4/image/upload/f_auto,q_auto,w_1000/...", alt: "Mya on the sand", styleId: "triangle" },
];

// Gallery 2 — vertical clips. Shown after the full story.
export const VIDEO_SESSION: VideoItem[] = [
  // { url: "https://res.cloudinary.com/dsprn0ew4/video/upload/f_auto,q_auto/...mp4", poster: "https://res.cloudinary.com/dsprn0ew4/video/upload/so_0,f_auto,q_auto,w_800/...jpg", alt: "Mya on the beach" },
];
