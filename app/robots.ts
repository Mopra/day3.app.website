import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo";

/**
 * We want everything indexed and we explicitly welcome AI crawlers, because being
 * cited by ChatGPT / Claude / Perplexity is a core acquisition channel for day3.
 *
 * Nothing is disallowed on purpose. The one page that should not be indexed,
 * /brand/index.html, serves a noindex meta tag instead: a Disallow would stop the
 * crawl and therefore stop the crawler ever reading the instruction.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    // No `host`. It was a Yandex-only directive, deprecated by Yandex itself, and
    // ignored by every other crawler. Canonical tags do that job now.
  };
}
