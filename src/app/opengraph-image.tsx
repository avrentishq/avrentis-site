import { ImageResponse } from "next/og";
import { BRAND, BRAND_COLORS } from "@/lib/brand";

// Default Open Graph / social-share image for every route (1200×630). Branded,
// self-contained (no external assets) — closes the missing-og:image gap and
// honours the twitter:summary_large_image card declared in layout metadata.
export const alt = `${BRAND.name} — ${BRAND.positioningStatement}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "96px",
          backgroundColor: BRAND_COLORS.navy,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            color: BRAND_COLORS.gold,
            fontSize: 30,
            letterSpacing: 8,
            textTransform: "uppercase",
            marginBottom: 28,
          }}
        >
          {BRAND.positioningStatement}
        </div>
        <div style={{ color: "#ffffff", fontSize: 96, fontWeight: 700, lineHeight: 1.05 }}>
          {BRAND.name}
        </div>
        <div style={{ color: "#94a3b8", fontSize: 44, marginTop: 28 }}>
          {BRAND.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
