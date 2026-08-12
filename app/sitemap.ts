import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo";
import { featurePages } from "@/lib/features-content";
import { comparePages } from "@/lib/compare-content";
import { audiencePages } from "@/lib/audience-content";
import { sortedBlogPosts } from "@/lib/blog-content";
import { changelogEntries } from "@/lib/changelog-content";

/**
 * The sitemap is generated from our route list so new pages show up in search the
 * moment they ship.
 *
 * On lastmod: every URL used to carry `new Date()`, meaning every deploy claimed
 * every page had changed. Google discounts lastmod it can see is unreliable, so
 * the signal was not merely wrong, it was discarded, including for the pages where
 * recency is genuinely true. So dates are now explicit: content-driven routes read
 * theirs from the content record, and the static routes below carry the date of
 * their last substantive change. The legal pages use the date they display as
 * "last updated", so the sitemap and the page agree.
 *
 * When you change a page's content, change its date. When you only change its
 * metadata, don't.
 */

type StaticRoute = {
  path: string;
  lastModified: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

/** The date of the most recent item in a set, for index pages. */
function newestOf(dates: string[], fallback: string): string {
  return dates.length ? dates.slice().sort().reverse()[0] : fallback;
}

const LEGAL_REVIEWED = "2026-06-23";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = sortedBlogPosts();

  const staticRoutes: StaticRoute[] = [
    { path: "/", lastModified: "2026-08-12", priority: 1, changeFrequency: "weekly" },
    { path: "/pricing", lastModified: "2026-08-12", priority: 0.9, changeFrequency: "weekly" },
    { path: "/how-it-works", lastModified: "2026-08-12", priority: 0.9, changeFrequency: "monthly" },
    { path: "/features", lastModified: "2026-08-12", priority: 0.8, changeFrequency: "monthly" },
    { path: "/compare", lastModified: "2026-08-12", priority: 0.8, changeFrequency: "monthly" },
    {
      path: "/blog",
      lastModified: newestOf(
        blogPosts.map((post) => post.updated),
        "2026-08-12",
      ),
      priority: 0.8,
      changeFrequency: "weekly",
    },
    { path: "/deliverability", lastModified: "2026-08-12", priority: 0.8, changeFrequency: "monthly" },
    { path: "/for", lastModified: "2026-08-12", priority: 0.7, changeFrequency: "monthly" },
    { path: "/security", lastModified: "2026-08-12", priority: 0.6, changeFrequency: "monthly" },
    { path: "/about", lastModified: "2026-08-06", priority: 0.6, changeFrequency: "monthly" },
    {
      path: "/changelog",
      lastModified: newestOf(
        changelogEntries.map((entry) => entry.isoDate),
        "2026-08-06",
      ),
      priority: 0.6,
      changeFrequency: "weekly",
    },
    { path: "/gdpr", lastModified: LEGAL_REVIEWED, priority: 0.5, changeFrequency: "yearly" },
    { path: "/legal/dpa", lastModified: LEGAL_REVIEWED, priority: 0.3, changeFrequency: "yearly" },
    { path: "/legal/subprocessors", lastModified: LEGAL_REVIEWED, priority: 0.3, changeFrequency: "monthly" },
    { path: "/legal/acceptable-use", lastModified: LEGAL_REVIEWED, priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", lastModified: LEGAL_REVIEWED, priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", lastModified: LEGAL_REVIEWED, priority: 0.3, changeFrequency: "yearly" },
  ];

  const featureRoutes: StaticRoute[] = featurePages
    // Link-out cards (e.g. deliverability) have no page of their own.
    .filter((page) => !page.href)
    .map((page) => ({
      path: `/features/${page.slug}`,
      lastModified: page.updated,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    }));

  const compareRoutes: StaticRoute[] = comparePages.map((page) => ({
    path: `/compare/${page.slug}`,
    lastModified: page.updated,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const audienceRoutes: StaticRoute[] = audiencePages.map((page) => ({
    path: `/for/${page.slug}`,
    lastModified: page.updated,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  const blogRoutes: StaticRoute[] = blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    lastModified: post.updated,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  /*
    Only the curated entries. A GitHub release fetched hourly has no build-time
    URL, so it cannot be listed here; it stays on the index with its link out.
  */
  const changelogRoutes: StaticRoute[] = changelogEntries.map((entry) => ({
    path: `/changelog/${entry.slug}`,
    lastModified: entry.isoDate,
    priority: 0.4,
    changeFrequency: "yearly" as const,
  }));

  return [
    ...staticRoutes,
    ...featureRoutes,
    ...compareRoutes,
    ...audienceRoutes,
    ...blogRoutes,
    ...changelogRoutes,
  ].map((route) => ({
    url: new URL(route.path, siteUrl).toString(),
    lastModified: route.lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
