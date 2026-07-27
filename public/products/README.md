# Product images go here

Drop the 8 swimsuit photos in this folder as **`.webp`**, named exactly to match
`lib/products.ts`:

| file | product |
|---|---|
| `butter-halter.webp`   | Sunbutter Halter Set (butter yellow) |
| `white-underwire.webp` | Ivory Underwire Set (white) |
| `pink-bandeau.webp`    | Bubblegum Bandeau Set (pink) |
| `sky-bandeau.webp`     | Sky Bandeau Set (baby blue) |
| `sky-halter.webp`      | Sky Halter Set (baby blue) |
| `butter-bandeau.webp`  | Sunbutter Bandeau Set (butter yellow) |
| `white-halter.webp`    | Ivory Halter Set (white) |
| `white-bandeau.webp`   | Ivory Bandeau Set (white) |

**⚠️ Verify each photo matches its product before launch.** The name/color/silhouette
mapping in `lib/products.ts` was inferred from the upload order in the brief — open each
image and confirm it's the right suit. Until a file exists, the card shows a branded
pink placeholder, so the site never looks broken.

Recommended: portrait crop (4:5), ~1200px wide, compressed .webp (<200KB each).

Also add, when ready:
- `/public/hero.mp4` + `/public/hero-poster.jpg` — hero background (optional; falls back to a gradient)
- `/public/brand/mya.jpg` — founder portrait (optional; falls back to a branded block)
