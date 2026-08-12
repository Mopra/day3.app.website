import * as React from "react";

import { siteUrl } from "@/lib/seo";
import { company, pricingTiers, siteConfig, socialLinks } from "@/lib/site";

/**
 * Renders a single JSON-LD <script>. Structured data is what earns rich results
 * in Google and, just as importantly for day3, gives AI answer engines clean,
 * machine-readable facts to quote. Pass any of the builders below as `data`.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from our own static data, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** The publisher. Referenced by every other entity via @id. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "day3",
    /*
      Brand disambiguation. Every query Search Console has recorded for this site
      is a numeral near-miss ("day 3", "days3", "dia3") ranking in the 20s to 90s,
      because "day3" reads as a date to a search engine that has no other signal.
      Spelling out the variants people actually type is the cheapest way to say
      "these all mean the software company".
    */
    alternateName: ["day3.app", "day 3", "day3 email"],
    url: siteUrl,
    email: siteConfig.contactEmail,
    logo: `${siteUrl}/brand/day3-lockup.png`,
    description: siteConfig.promise,
    slogan: siteConfig.promise,
    /*
      The topics day3 is a credible source on. Narrow on purpose: claiming
      expertise in "marketing" would be both false and useless, while these are
      the subjects the site actually publishes substantive pages about.
    */
    knowsAbout: [
      "Email marketing",
      "Transactional email",
      "Email deliverability",
      "SPF, DKIM and DMARC authentication",
      "One-click unsubscribe (RFC 8058)",
      "GDPR compliance for email",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: siteConfig.contactEmail,
      availableLanguage: ["en", "da"],
    },
    foundingDate: String(company.foundingYear),
    founder: { "@type": "Person", name: company.founder },
    // The CVR registration number, a verifiable identifier that ties this brand
    // to a real, registered legal entity.
    identifier: {
      "@type": "PropertyValue",
      propertyID: "CVR",
      value: company.cvr,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: company.city,
      addressCountry: company.countryCode,
    },
    // sameAs is the strongest entity-disambiguation signal for AI answer engines.
    // The parent-company site is always included; social profiles join it as
    // socialLinks is filled in.
    sameAs: [company.website, ...socialLinks.map((link) => link.href)],
  };
}

/**
 * The founder, for the About page. A named, real human with a verifiable track
 * record is one of the clearest E-E-A-T signals, for Google and for the models
 * that decide which tools to recommend.
 */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: company.founder,
    jobTitle: company.founderTitle,
    worksFor: { "@id": `${siteUrl}/#organization` },
    ...(socialLinks.length
      ? { sameAs: socialLinks.map((link) => link.href) }
      : {}),
  };
}

/** The product itself, with the full plan ladder expressed as offers. */
export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "day3",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: siteUrl,
    description:
      "Email marketing for startups and indie developers, billed by emails sent rather than subscriber count. Every plan includes unlimited subscribers.",
    publisher: { "@id": `${siteUrl}/#organization` },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      // Read off the ladder rather than written down: a hardcoded bound goes
      // stale the first time pricing moves, and a price a crawler can catch us
      // contradicting is worse than no price at all. (It had: highPrice said
      // "49" long after the ladder topped out at $220.)
      lowPrice: String(Math.min(...pricingTiers.map((tier) => tier.priceUsd))),
      highPrice: String(Math.max(...pricingTiers.map((tier) => tier.priceUsd))),
      offerCount: pricingTiers.length,
      offers: pricingTiers.map((tier) => ({
        "@type": "Offer",
        price: tier.price.replace(/[^0-9.]/g, ""),
        priceCurrency: "USD",
        name: `${tier.emails} ${tier.emailsNote}`,
        url: `${siteUrl}/pricing`,
      })),
    },
  };
}

/** Turns a list of {q,a} pairs into an FAQPage, eligible for FAQ rich results. */
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

/**
 * The site as an entity, distinct from the company that publishes it.
 *
 * Emitted on the homepage only. Search engines use WebSite to tie a domain to a
 * named thing, which is the piece day3 was missing: without it, "day3" has no
 * declared identity beyond an Organization, and a brand that is also a numeral
 * needs every disambiguation signal it can get.
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "day3",
    alternateName: ["day3.app", "day 3"],
    url: siteUrl,
    description: siteConfig.promise,
    inLanguage: "en",
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

/**
 * A step-by-step process. Used on /how-it-works, where the three steps of the
 * send-based model are a genuine sequence rather than a list dressed as one.
 */
export function howToSchema({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: { title: string; description: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    publisher: { "@id": `${siteUrl}/#organization` },
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
  };
}

/**
 * An editorial page: a guide under /blog or a changelog entry. `path` is
 * root-relative and becomes both the mainEntityOfPage and the @id.
 */
export function articleSchema({
  headline,
  description,
  path,
  datePublished,
  dateModified,
  image,
  section,
}: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  section?: string;
}) {
  const url = new URL(path, siteUrl).toString();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline,
    description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished,
    dateModified: dateModified ?? datePublished,
    inLanguage: "en",
    ...(section ? { articleSection: section } : {}),
    ...(image ? { image } : {}),
    // A named human with a verifiable track record, not a faceless "Team".
    author: {
      "@type": "Person",
      name: company.founder,
      url: `${siteUrl}/about`,
    },
    publisher: { "@id": `${siteUrl}/#organization` },
    isPartOf: { "@id": `${siteUrl}/#website` },
  };
}

/** The guide index at /blog, as a Blog entity listing its posts. */
export function blogSchema(
  posts: { title: string; path: string; date: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteUrl}/blog#blog`,
    name: "day3 guides",
    description:
      "Practical writing on email deliverability, authentication, compliance, and how email pricing models actually work.",
    url: `${siteUrl}/blog`,
    inLanguage: "en",
    publisher: { "@id": `${siteUrl}/#organization` },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: new URL(post.path, siteUrl).toString(),
      datePublished: post.date,
      author: { "@type": "Person", name: company.founder },
    })),
  };
}

/** Breadcrumb trail. Pass items in order, root first. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteUrl).toString(),
    })),
  };
}
