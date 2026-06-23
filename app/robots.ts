import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo";

/**
 * We want everything indexed and we explicitly welcome AI crawlers — being
 * cited by ChatGPT / Claude / Perplexity is a core acquisition channel for day3.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
