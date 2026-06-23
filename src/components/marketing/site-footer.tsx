import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/marketing/container";
import { Logo } from "@/components/marketing/logo";
import { siteConfig, socialLinks } from "@/lib/site";

const footerNav = [
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
    heading: "Company",
    links: [
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
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Email marketing billed on what you send, not how many people you
              keep on the list.
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
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="rounded text-sm text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
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
