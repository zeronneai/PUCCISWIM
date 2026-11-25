// Mya's real photo and video shoots. Files live in public/media, already sized for
// the web (see lib/cloudinary.ts for how variants are named).
// While an array is EMPTY, its section does not render at all (no placeholders).

export type PhotoItem = { url: string; alt: string; styleId?: string };
export type VideoItem = { url: string; alt: string };
export type VideoGroup = { heading: string; items: VideoItem[] };

// Gallery 1, stills. Shown after the story hook, before the catalog.
// Order matters: it drives the asymmetric desktop layout.
export const PHOTO_SESSION: PhotoItem[] = [
  {
    url: "/media/session/photo-1.webp",
    alt: "Mya Mercedes posing on the sand in a PUCCII Swim set",
  },
  {
    url: "/media/session/photo-2.webp",
    alt: "Mya Mercedes by the water wearing PUCCII Swim",
  },
  {
    url: "/media/session/photo-3.webp",
    alt: "Mya Mercedes soaking up the sun in a PUCCII Swim bikini",
  },
  {
    url: "/media/session/photo-4.webp",
    alt: "Mya Mercedes at the beach in PUCCII Swim",
  },
  {
    url: "/media/session/photo-5.webp",
    alt: "Mya Mercedes walking the shoreline in PUCCII Swim",
  },
];

// Gallery 2, clips in two groups. The runway group leads (most premium), the
// off-duty group follows. Orientation is detected per clip at load time, so a
// group can mix vertical and horizontal footage.
export const VIDEO_GROUPS: VideoGroup[] = [
  {
    heading: "on the runway",
    items: [
      {
        url: "/media/video/runway.mp4",
        alt: "Mya Mercedes walking a swimwear runway show",
      },
    ],
  },
  {
    heading: "off duty",
    items: [
      {
        url: "/media/video/off-duty-1.mp4",
        alt: "Mya Mercedes off duty by the water in PUCCII Swim",
      },
      {
        url: "/media/video/off-duty-2.mp4",
        alt: "Mya Mercedes relaxing at the beach in PUCCII Swim",
      },
    ],
  },
];

// A single clip tucked inside the story, like a taped-in memory. Not part of
// the gallery above.
export const STORY_MEMORY_VIDEO: VideoItem = {
  url: "/media/video/story-memory.mp4",
  alt: "Mya Mercedes at the beach, a PUCCII Swim moment",
};
