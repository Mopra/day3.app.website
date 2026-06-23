import type { Metadata } from "next";

/**
 * The canonical production origin. Every absolute URL (canonicals, OG, JSON-LD)
 * is derived from this so there is exactly one source of truth.
 */
export const siteUrl = "https://day3.app";

type BuildMetadataInput = {
  /** Page title — slotted into the "%s · day3" template from the root layout. */
  title: string;
  description: string;
  /** Site-root-relative path, e.g. "/how-it-works". Used for the canonical URL. */
  path: string;
  /** Override the social-share image. Defaults to the route's own OG image. */
  ogImage?: string;
  keywords?: string[];
};

/**
 * Single helper every page uses to declare its metadata. Guarantees each route
 * gets a unique title/description, a self-referencing canonical, and matching
 * Open Graph / Twitter tags — the things that were previously inherited (wrongly)
 * from the homepage.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  keywords,
}: BuildMetadataInput): Metadata {
  const url = new URL(path, siteUrl).toString();

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
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}
