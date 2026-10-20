import { SiteHeaderClient, type NavItem } from "@/components/marketing/site-header-client";
import { siteConfig } from "@/lib/site";
import { featurePages } from "@/lib/features-content";
import { comparePages } from "@/lib/compare-content";
import { audiencePages } from "@/lib/audience-content";

/**
 * Primary navigation. The dropdowns' children are derived from the same content
 * arrays that power their hub and detail pages, so the menu can never drift out of
 * sync with the pages that actually exist.
 *
 * "Who it's for" and "Guides" are here rather than footer-only because the /for
 * pages had no nav presence at all and the guides are the whole top of the funnel.
 * Deliverability already appears inside Features, as a link-out to its own page.
 */
const primaryNav: NavItem[] = [
  { label: "How it works", href: "/how-it-works" },
  {
    label: "Features",
    href: "/features",
    children: featurePages.map((page) => ({
      label: page.navLabel,
      href: page.href ?? `/features/${page.slug}`,
      description: page.summary,
      icon: <page.icon className="size-4" aria-hidden />,
    })),
  },
  {
    label: "Who it's for",
    href: "/for",
    children: audiencePages.map((page) => ({
      label: page.navLabel,
      href: `/for/${page.slug}`,
      description: page.summary,
      icon: <page.icon className="size-4" aria-hidden />,
    })),
  },
  {
    label: "Compare",
    href: "/compare",
    children: comparePages.map((page) => ({
      label: `vs ${page.competitor}`,
      href: `/compare/${page.slug}`,
    })),
  },
  { label: "Guides", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  /*
    Docs sits last, right against the log-in / sign-up pair, because that is
    where a developer looks for it and because it is the one item here that
    leaves the marketing site. It is a top-level link rather than a child of
    Features: the API reference is a destination in its own right, and burying
    it two levels down is how a docs site goes unread.
  */
  { label: "Docs", href: siteConfig.docsUrl, external: true },
];

/**
 * Server half of the header. Builds the nav here so the content modules it is
 * derived from stay on the server; see `SiteHeaderClient`.
 */
function SiteHeader() {
  return <SiteHeaderClient nav={primaryNav} />;
}

export { SiteHeader };
