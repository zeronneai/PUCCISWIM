#!/usr/bin/env bash
#
# Extract the hero scroll-scrub frame sequences (+ posters + MP4 fallbacks)
# from two master videos, one per orientation. See SEQUENCE-HERO-RECIPE.md.
#
# Usage:
#   1. Put your masters at assets/hero-master-landscape.mov and
#      assets/hero-master-portrait.mov (any ffmpeg-readable format).
#   2. Set the DURATION_* below to each master's real length in seconds.
#   3. ./scripts/extract-frames.sh
#   4. Check the printed folder sizes. Target: each set <= 5 MB (portrait is the
#      critical one — most traffic is mobile). If a set is over, LOWER the
#      matching QUALITY_* (try -5) and re-run.
#   5. Flip HERO_MODE to "sequence" in lib/media.ts.
#
set -euo pipefail

# ---- Tunables ---------------------------------------------------------------
MASTER_LG="assets/hero-master-landscape.mov"
MASTER_PT="assets/hero-master-portrait.mov"

FRAMES_LG=115      # landscape frame budget
FRAMES_PT=90       # portrait frame budget (smaller: portrait compresses worse)

DURATION_LG=5.0    # <-- set to the real landscape master length (seconds)
DURATION_PT=5.0    # <-- set to the real portrait master length (seconds)

QUALITY_LG=80      # WebP quality (0-100). Lower until lg set <= 5 MB.
QUALITY_PT=72      # WebP quality. Lower until pt set <= 5 MB.

# If a master is bigger than 1080p, uncomment the matching scale filter below.
SCALE_LG=""        # e.g. ",scale=1920:-2"
SCALE_PT=""        # e.g. ",scale=-2:1920"
# ----------------------------------------------------------------------------

OUT_LG="public/sequence/lg"
OUT_PT="public/sequence/pt"
mkdir -p "$OUT_LG" "$OUT_PT"

FPS_LG=$(echo "scale=6; $FRAMES_LG / $DURATION_LG" | bc)
FPS_PT=$(echo "scale=6; $FRAMES_PT / $DURATION_PT" | bc)

echo "==> Landscape: $FRAMES_LG frames @ ${FPS_LG} fps (q${QUALITY_LG})"
ffmpeg -y -i "$MASTER_LG" \
  -vf "fps=${FPS_LG}${SCALE_LG}" \
  -c:v libwebp -quality "$QUALITY_LG" \
  "$OUT_LG/frame-%03d.webp"

echo "==> Portrait: $FRAMES_PT frames @ ${FPS_PT} fps (q${QUALITY_PT})"
ffmpeg -y -i "$MASTER_PT" \
  -vf "fps=${FPS_PT}${SCALE_PT}" \
  -c:v libwebp -quality "$QUALITY_PT" \
  "$OUT_PT/frame-%03d.webp"

echo "==> Posters (first frame as JPG)"
ffmpeg -y -i "$MASTER_LG" -frames:v 1 -q:v 3 public/hero-poster-lg.jpg
ffmpeg -y -i "$MASTER_PT" -frames:v 1 -q:v 3 public/hero-poster-pt.jpg

echo "==> Light MP4 fallbacks (~3.5 Mbps, H.264, no audio)"
ffmpeg -y -i "$MASTER_LG" \
  -c:v libx264 -b:v 3.5M -pix_fmt yuv420p -movflags +faststart -an \
  public/hero-fallback-lg.mp4
ffmpeg -y -i "$MASTER_PT" \
  -c:v libx264 -b:v 3.5M -pix_fmt yuv420p -movflags +faststart -an \
  public/hero-fallback-pt.mp4

echo ""
echo "==> Done. Set sizes (target <= 5 MB each):"
du -sh "$OUT_LG" "$OUT_PT"
echo "If either is over 5 MB, lower QUALITY_LG / QUALITY_PT and re-run."
echo "Frame counts must match lib/media.ts SEQUENCE[*].frames ($FRAMES_LG / $FRAMES_PT)."
