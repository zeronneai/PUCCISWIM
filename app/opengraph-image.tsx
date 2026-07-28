import { ImageResponse } from "next/og";

// nodejs runtime (not edge): matches the API routes, avoids edge bundling quirks
// during "Generating static pages", and this route reads no process.env at all.
export const runtime = "nodejs";
export const alt = "PUCCII Swim — Endless Summer Collection";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded OG image generated at the edge — always present, no static asset needed.
// (Drop a bespoke public/og.jpg in later if you want a photo-based card.)
export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #FBB9D8 0%, #F06BB0 55%, #F6DFA0 100%)",
          color: "#2B1B24",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#FFF8F1",
          }}
        >
          Pre-order · Endless Summer
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginTop: 20 }}>
          <div style={{ fontSize: 150, fontWeight: 800, color: "#2B1B24", lineHeight: 1 }}>
            PUCCII
          </div>
          <div style={{ fontSize: 96, fontWeight: 700, color: "#FFF8F1" }}>swim</div>
        </div>
        <div style={{ fontSize: 52, fontWeight: 700, marginTop: 24, color: "#2B1B24" }}>
          Bold. Beautiful. Unapologetic.
        </div>
        <div style={{ fontSize: 40, marginTop: 30, color: "#FFF8F1", fontWeight: 600 }}>
          Two-piece sets · $39 each · @pucciiswim
        </div>
      </div>
    ),
    { ...size },
  );
}
