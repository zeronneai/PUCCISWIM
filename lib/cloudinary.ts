// Cloudinary delivery helpers. Every asset is transformed on the fly in the
// URL, nothing is downloaded or re-hosted.
//
// Images carry `f_auto,q_auto,w_1200`. The `f_auto` is mandatory: one source
// is a .heic that Chrome and Firefox cannot decode, so Cloudinary must convert
// it to WebP or JPG before the browser (or next/image) ever sees it.
//
// Videos carry `f_auto,q_auto`. The `f_auto` is mandatory here too: one source
// is a .mov that several browsers refuse to play without a re-muxed format.
//
// A poster is the same video URL with a first-frame grab (`so_0p`, start
// offset at 0 percent) delivered as a .jpg.

const UPLOAD = "/upload/";

// Insert a transform segment right after `/upload/` in a Cloudinary URL.
function inject(url: string, transform: string): string {
  const at = url.indexOf(UPLOAD);
  if (at === -1) return url;
  const head = url.slice(0, at + UPLOAD.length);
  const tail = url.slice(at + UPLOAD.length);
  return `${head}${transform}/${tail}`;
}

// Image delivery URL (WebP/AVIF via f_auto, auto quality, capped at w_1200).
export function cldImage(url: string, width = 1200): string {
  return inject(url, `f_auto,q_auto,w_${width}`);
}

// Video delivery URL (browser-friendly format via f_auto, auto quality).
export function cldVideo(url: string): string {
  return inject(url, "f_auto,q_auto");
}

// Poster for a video: the same URL, first frame (so_0p), delivered as .jpg.
export function cldPoster(url: string): string {
  return inject(url, "so_0p").replace(/\.(mp4|mov|m4v|webm)$/i, ".jpg");
}
