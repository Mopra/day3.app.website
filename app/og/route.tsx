import { ImageResponse } from "next/og";

/**
 * The per-route social card renderer.
 *
 * One endpoint rather than a file-based `opengraph-image.tsx` in each of thirty
 * segments: the headline is the only thing that changes between routes, and
 * buildMetadata already knows every route's title, so it can hand it over as a
 * query param. `?title=` is the headline, `?eyebrow=` an optional label above it.
 *
 * The homepage keeps its own hand-set card in app/opengraph-image.tsx, because
 * its headline is a positioning statement rather than a page title.
 */

const CREAM = "#f7f1e8";
const ESPRESSO = "#241c17";
const STONE = "#5e5346";
const CARAMEL = "#b98145";

/** Long titles are the exception, but one must never blow out the card. */
function truncate(value: string, max: number): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Headlines run from ~20 to ~80 characters across the site. A fixed size would
 * either strand the short ones or overflow the long ones, so the size steps down
 * as the string grows.
 */
function headlineSize(length: number): number {
  if (length <= 30) return 72;
  if (length <= 50) return 62;
  if (length <= 70) return 52;
  return 44;
}

export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const title = truncate(
    params.get("title") || "Email marketing billed by what you send",
    96,
  );
  const eyebrow = params.get("eyebrow")?.trim();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: CREAM,
          color: ESPRESSO,
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          day3
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {eyebrow ? (
            <div
              style={{
                display: "flex",
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: CARAMEL,
              }}
            >
              {truncate(eyebrow, 40)}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              fontSize: headlineSize(title.length),
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              maxWidth: 940,
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: STONE }}>
            Unlimited subscribers. Billed by emails sent.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            height: 10,
            width: 220,
            backgroundColor: CARAMEL,
            borderRadius: 999,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        // Cards change only when a page title changes, so let the CDN keep them.
        "Cache-Control": "public, max-age=3600, s-maxage=604800, immutable",
      },
    },
  );
}
