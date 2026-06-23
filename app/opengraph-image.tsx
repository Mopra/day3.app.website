import { ImageResponse } from "next/og";

// File-based OG image. Applies to the home route and is inherited by every child
// route that doesn't define its own — so the whole site gets a branded social
// card without per-page asset work.
export const alt = "day3 — email marketing billed by what you send";
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
          justifyContent: "space-between",
          backgroundColor: "#f7f1e8",
          color: "#241c17",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: "-0.02em" }}>
          day3
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            Email marketing that charges for sends, not subscribers.
          </div>
          <div style={{ fontSize: 32, color: "#5e5346", maxWidth: 820 }}>
            Unlimited subscribers. The price only moves when you hit send.
          </div>
        </div>
        <div style={{ display: "flex", height: 10, width: 220, backgroundColor: "#b98145", borderRadius: 999 }} />
      </div>
    ),
    { ...size },
  );
}
