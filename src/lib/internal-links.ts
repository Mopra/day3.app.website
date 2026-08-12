import { audiencePages } from "@/lib/audience-content";
import { blogPosts } from "@/lib/blog-content";
import { comparePages } from "@/lib/compare-content";
import { featurePages } from "@/lib/features-content";

/**
 * The internal link mesh.
 *
 * Every templated page used to carry exactly two internal links: back to its own
 * hub and out to /pricing. Fifteen pages shared whatever authority the footer
 * passed and nothing else, which is a poor way to tell a crawler which pages
 * belong to the same topic.
 *
 * The mesh lives here rather than in each content module for one reason: labels
 * and descriptions are *resolved* from the content source, so a link can never
 * describe a page differently from the page itself. A route names its neighbours
 * with short refs ("feature:campaigns"), and the resolver looks the rest up.
 */

export type InternalLink = {
  label: string;
  href: string;
  description: string;
};

/** Plain pages that aren't in one of the content arrays. */
const standalonePages: Record<string, InternalLink> = {
  "/how-it-works": {
    label: "How send-based pricing works",
    href: "/how-it-works",
    description:
      "What counts as a send, what happens at the monthly cap, and why list size never moves the bill.",
  },
  "/deliverability": {
    label: "Deliverability",
    href: "/deliverability",
    description:
      "Authenticated domains, one-click unsubscribe, and automatic suppression of bounces and complaints.",
  },
  "/pricing": {
    label: "Pricing",
    href: "/pricing",
    description:
      "Nine plans from $1/mo for 1,000 emails to $220/mo for 1,000,000. Unlimited subscribers on all of them.",
  },
  "/security": {
    label: "Security",
    href: "/security",
    description:
      "EU-only hosting and data residency, an honest compliance posture, and every sub-processor named.",
  },
  "/gdpr": {
    label: "GDPR",
    href: "/gdpr",
    description:
      "How day3 acts as your processor, the rights it upholds, and the agreements on offer.",
  },
  "/compare": {
    label: "All comparisons",
    href: "/compare",
    description:
      "How day3's send-based model stacks up against the tools that price by contact count.",
  },
  "/features": {
    label: "All features",
    href: "/features",
    description: "Everything day3 does, and the things it deliberately doesn't.",
  },
  "/for": {
    label: "Who it's for",
    href: "/for",
    description: "Startups, indie developers, and SaaS teams shipping product updates.",
  },
  "/blog": {
    label: "Guides",
    href: "/blog",
    description:
      "Practical writing on deliverability, authentication, compliance, and email pricing.",
  },
};

/**
 * Turns a ref into a link. Refs are `feature:<slug>`, `compare:<slug>`,
 * `for:<slug>`, `page:<path>`, or `blog:<slug>` (resolved lazily, see below).
 * An unknown ref returns null and is filtered out rather than throwing, so a
 * renamed slug degrades to a missing link instead of a failed build.
 */
function resolve(ref: string): InternalLink | null {
  const [kind, rest] = ref.split(":", 2);
  if (!rest) return null;

  if (kind === "page") return standalonePages[rest] ?? null;

  if (kind === "feature") {
    const page = featurePages.find((p) => p.slug === rest);
    if (!page) return null;
    return {
      label: page.navLabel,
      href: page.href ?? `/features/${page.slug}`,
      description: page.summary,
    };
  }

  if (kind === "compare") {
    const page = comparePages.find((p) => p.slug === rest);
    if (!page) return null;
    return {
      label: `day3 vs ${page.competitor}`,
      href: `/compare/${page.slug}`,
      description: page.intro,
    };
  }

  if (kind === "for") {
    const page = audiencePages.find((p) => p.slug === rest);
    if (!page) return null;
    return {
      label: page.navLabel,
      href: `/for/${page.slug}`,
      description: page.summary,
    };
  }

  if (kind === "blog") {
    const post = blogPosts.find((p) => p.slug === rest);
    if (!post) return null;
    return {
      label: post.title,
      href: `/blog/${post.slug}`,
      description: post.summary,
    };
  }

  return null;
}

export function resolveLinks(refs: readonly string[]): InternalLink[] {
  const seen = new Set<string>();
  const out: InternalLink[] = [];
  for (const ref of refs) {
    const link = resolve(ref);
    if (!link || seen.has(link.href)) continue;
    seen.add(link.href);
    out.push(link);
  }
  return out;
}
