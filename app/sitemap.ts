import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/seo";
import { featurePages } from "@/lib/features-content";
import { comparePages } from "@/lib/compare-content";
import { audiencePages } from "@/lib/audience-content";

/**
 * The sitemap is generated from our route list so new pages show up in search
 * the moment they ship. Keep static routes here; data-driven routes (feature
 * sub-pages) are derived from their content source.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
    { path: "/how-it-works", priority: 0.8, changeFrequency: "monthly" },
    { path: "/features", priority: 0.8, changeFrequency: "monthly" },
    { path: "/compare", priority: 0.8, changeFrequency: "monthly" },
    { path: "/for", priority: 0.7, changeFrequency: "monthly" },
    { path: "/deliverability", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/changelog", priority: 0.6, changeFrequency: "weekly" },
    { path: "/security", priority: 0.6, changeFrequency: "monthly" },
    { path: "/gdpr", priority: 0.5, changeFrequency: "yearly" },
    { path: "/legal/dpa", priority: 0.3, changeFrequency: "yearly" },
    { path: "/legal/subprocessors", priority: 0.3, changeFrequency: "monthly" },
    { path: "/legal/acceptable-use", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  ];

  const featureRoutes = featurePages.map((page) => ({
    path: `/features/${page.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const compareRoutes = comparePages.map((page) => ({
    path: `/compare/${page.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const audienceRoutes = audiencePages.map((page) => ({
    path: `/for/${page.slug}`,
    priority: 0.6,
    changeFrequency: "monthly" as const,
  }));

  return [...staticRoutes, ...featureRoutes, ...compareRoutes, ...audienceRoutes].map((route) => ({
    url: new URL(route.path, siteUrl).toString(),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
