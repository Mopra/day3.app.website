import * as React from "react";

import { siteUrl } from "@/lib/seo";
import { company, pricingTiers, siteConfig, socialLinks } from "@/lib/site";

/**
 * Renders a single JSON-LD <script>. Structured data is what earns rich results
 * in Google and — just as importantly for day3 — gives AI answer engines clean,
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
    legalName: company.legalName,
    url: siteUrl,
    email: siteConfig.contactEmail,
    logo: `${siteUrl}/brand/day3-lockup.png`,
    description: siteConfig.promise,
    foundingDate: String(company.foundingYear),
    founder: { "@type": "Person", name: company.founder },
    // The CVR registration number — a verifiable identifier that ties this brand
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
 * record is one of the clearest E-E-A-T signals — for Google and for the models
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
      lowPrice: "1",
      highPrice: "49",
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

/** Turns a list of {q,a} pairs into an FAQPage — eligible for FAQ rich results. */
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
