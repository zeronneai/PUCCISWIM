// Media helpers. Every asset lives in public/ (public/media and public/hero),
// already converted and sized for the web, so nothing is fetched from an
// external CDN. The function names are kept from when these built Cloudinary
// URLs, so the components did not have to change.
//
// Images are stored at 1200px wide. A smaller variant, when one exists, sits
// next to it as `<name>-w<width>.<ext>` (for example model-w300.webp).
//
// Videos are H.264 in an MP4 container (plays everywhere, Safari included).
// Each one has its first frame next to it as a .jpg with the same name.

// Image URL. The default width is the stored file; any other width resolves to
// the `-w<width>` variant.
export function cldImage(url: string, width = 1200): string {
  if (width === 1200) return url;
  return url.replace(/(\.[a-z0-9]+)$/i, `-w${width}$1`);
}

// Video URL: the stored MP4 as is.
export function cldVideo(url: string): string {
  return url;
}

// Poster for a video: its first frame, stored beside it as .jpg.
export function cldPoster(url: string): string {
  return url.replace(/\.(mp4|mov|m4v|webm)$/i, ".jpg");
}
