import type { Metadata } from "next";

/**
 * The canonical production origin. Every absolute URL (canonicals, OG, JSON-LD)
 * is derived from this so there is exactly one source of truth.
 */
export const siteUrl = "https://day3.app";

/**
 * The social card for a route, rendered on demand by app/og/route.tsx.
 *
 * This exists because the file-based `app/opengraph-image.tsx` convention is
 * silently suppressed for any page that declares an `openGraph` object without
 * an `images` key, which is every page that goes through buildMetadata. The
 * result was 28 of 30 routes shipping with no card at all. Generating the URL
 * here means a card can never again go missing by omission.
 */
function ogImageUrl(title: string, eyebrow?: string): string {
  const url = new URL("/og", siteUrl);
  url.searchParams.set("title", title);
  if (eyebrow) url.searchParams.set("eyebrow", eyebrow);
  return url.toString();
}

type BuildMetadataInput = {
  /** Page title, slotted into the "%s · day3" template from the root layout. */
  title: string;
  description: string;
  /** Site-root-relative path, e.g. "/how-it-works". Used for the canonical URL. */
  path: string;
  /** Headline for the generated social card. Defaults to `title`. */
  ogTitle?: string;
  /** Small label above the headline on the generated social card. */
  ogEyebrow?: string;
  /** Override the generated card with a fixed image URL. */
  ogImage?: string;
  keywords?: string[];
};

/**
 * Single helper every page uses to declare its metadata. Guarantees each route
 * gets a unique title/description, a self-referencing canonical, a social card,
 * and matching Open Graph / Twitter tags.
 *
 * Every route must go through this, including the short legal stubs. A page that
 * hand-rolls `metadata` inherits `alternates` from the nearest layout that sets
 * it, which is how /privacy and /terms ended up declaring the homepage as their
 * canonical.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogTitle,
  ogEyebrow,
  ogImage,
  keywords,
}: BuildMetadataInput): Metadata {
  const url = new URL(path, siteUrl).toString();
  const image = ogImage ?? ogImageUrl(ogTitle ?? title, ogEyebrow);

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "day3",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
