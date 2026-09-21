import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/marketing/container";
import { Logo } from "@/components/marketing/logo";
import { docsLinks, siteConfig, socialLinks } from "@/lib/site";

type FooterLink = {
  label: string;
  href: string;
  /** Leaves day3.app. Rendered as a plain anchor rather than a routed Link. */
  external?: boolean;
};

/**
 * The footer columns.
 *
 * "Developers" is a column of its own rather than a line inside Product because
 * most of it points at docs.day3.app, and a docs site that appears only in the
 * header is a docs site half the traffic never sees. The deep links matter more
 * than the front door: someone who scrolled this far is looking for a specific
 * thing, and landing them on the page that answers it beats another hop.
 */
const footerNav: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Features", href: "/features" },
      { label: "Who it's for", href: "/for" },
      { label: "Compare", href: "/compare" },
      { label: "Pricing", href: "/pricing" },
      { label: "Deliverability", href: "/deliverability" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "API docs", href: docsLinks.index.href, external: true },
      { label: "Quickstart", href: docsLinks.quickstart.href, external: true },
      /*
        The on-site product page, not /email-api: that one is a paid-ads landing
        page, deliberately kept out of the sitemap and the footer.
      */
      { label: "API & MCP", href: "/features/api" },
      { label: "MCP server", href: docsLinks.mcp.href, external: true },
      { label: "Webhooks", href: docsLinks.webhooks.href, external: true },
      { label: "Migrate a list", href: docsLinks.migrate.href, external: true },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Guides", href: "/blog" },
      { label: "About", href: "/about" },
      { label: "Changelog", href: "/changelog" },
      { label: "Contact", href: `mailto:${siteConfig.contactEmail}` },
      { label: "Log in", href: siteConfig.loginUrl },
      { label: "Sign up", href: siteConfig.signupUrl },
    ],
  },
  {
    heading: "Trust",
    links: [
      { label: "Security", href: "/security" },
      { label: "GDPR", href: "/gdpr" },
      { label: "Sub-processors", href: "/legal/subprocessors" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "DPA", href: "/legal/dpa" },
      { label: "Acceptable use", href: "/legal/acceptable-use" },
    ],
  },
];

function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-14">
        {/*
          Five nav columns now, so the gutter tightens on the widest breakpoint
          to keep a label like "Sub-processors" on one line.
        */}
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-3 lg:grid-cols-[1.5fr_repeat(5,1fr)]">
          <div className="max-w-xs md:col-span-3 lg:col-span-1">
            <Logo />
            {/*
              The canonical one-liner, rendered from `siteConfig` rather than
              typed out here, so the boilerplate under the wordmark is character
              for character the line that appears on every external profile. The
              blurb this replaced ("No marketing suite") also argued the opposite
              of the current positioning, which now leads with marketing email.
            */}
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {siteConfig.oneLiner}
            </p>
            {socialLinks.length ? (
              <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded text-sm text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {footerNav.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              {/*
                A <p>, not an <h2>. These labels used to add a heading apiece to
                the outline of every page on the site, which told a crawler the
                footer was as structurally important as the content above it. The
                nav's aria-label carries the same information for screen readers.
              */}
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.heading}
              </p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => {
                  const className =
                    "rounded text-sm text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
                  return (
                    <li key={link.label}>
                      {link.external ? (
                        <a href={link.href} className={className}>
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className={className}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          {/* Made in EU badge */}
          <div className="flex items-center gap-3">
            <Image
              src="/eu.svg"
              alt="European Union flag"
              width={60}
              height={40}
              className="rounded"
            />
            <div className="flex flex-col text-[oklch(0.45_0.15_255)]">
              <span className="text-sm font-medium">Made and hosted in the</span>
              <span className="text-sm font-bold">European Union</span>
            </div>
          </div>

          {/* Business info and copyright */}
          <div className="flex flex-col items-center gap-1 sm:items-end">
            <p>
              <a
                href="https://pradsgaardlabs.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground"
              >
                Pradsgaard Labs EMV
              </a>{" "}
              | CVR: DK46156153
            </p>
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export { SiteFooter };
