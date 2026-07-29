// Mya's real photo and video shoots. URLs are the raw Cloudinary sources; the
// components apply the delivery transforms (see lib/cloudinary.ts).
// While an array is EMPTY, its section does not render at all (no placeholders).

export type PhotoItem = { url: string; alt: string; styleId?: string };
export type VideoItem = { url: string; alt: string };
export type VideoGroup = { heading: string; items: VideoItem[] };

// Gallery 1, stills. Shown after the story hook, before the catalog.
// Order matters: it drives the asymmetric desktop layout.
export const PHOTO_SESSION: PhotoItem[] = [
  {
    url: "https://res.cloudinary.com/dsprn0ew4/image/upload/v1785335025/13FAEF1D-1E7F-4D8F-927E-0934A6D19E81_iuumgy.png",
    alt: "Mya Mercedes posing on the sand in a PUCCII Swim set",
  },
  {
    url: "https://res.cloudinary.com/dsprn0ew4/image/upload/v1785335026/IMG_1043_okepgi.jpg",
    alt: "Mya Mercedes by the water wearing PUCCII Swim",
  },
  {
    url: "https://res.cloudinary.com/dsprn0ew4/image/upload/v1785335026/93616FAA-8BEC-4219-9DDC-02CB8E1D7697_vfzfis.png",
    alt: "Mya Mercedes soaking up the sun in a PUCCII Swim bikini",
  },
  {
    url: "https://res.cloudinary.com/dsprn0ew4/image/upload/v1785335031/A1B3AB26-1341-43B8-8643-EAA6FC150EAA_vy5c25.png",
    alt: "Mya Mercedes at the beach in PUCCII Swim",
  },
  {
    url: "https://res.cloudinary.com/dsprn0ew4/image/upload/v1785335031/41B17DAF-CB27-454A-8F7D-0C6E13F17B7B_wo0iqy.png",
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
        url: "https://res.cloudinary.com/dsprn0ew4/video/upload/v1785335103/event2_cl61lo.mp4",
        alt: "Mya Mercedes walking a swimwear runway show",
      },
    ],
  },
  {
    heading: "off duty",
    items: [
      {
        url: "https://res.cloudinary.com/dsprn0ew4/video/upload/v1785335059/dji_mimo_20260627_133122_20260627143104_1782595440051_video_zu0sns.mp4",
        alt: "Mya Mercedes off duty by the water in PUCCII Swim",
      },
      {
        url: "https://res.cloudinary.com/dsprn0ew4/video/upload/v1785335039/dji_mimo_20260627_142118_20260627142110_1782973130800_video_se5wul.mp4",
        alt: "Mya Mercedes relaxing at the beach in PUCCII Swim",
      },
    ],
  },
];

// A single clip tucked inside the story, like a taped-in memory. Not part of
// the gallery above.
export const STORY_MEMORY_VIDEO: VideoItem = {
  url: "https://res.cloudinary.com/dsprn0ew4/video/upload/v1785336857/dji_mimo_20260627_142700_20260627142643_1782973118887_video_aishpu.mp4",
  alt: "Mya Mercedes at the beach, a PUCCII Swim moment",
};
