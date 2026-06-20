import * as React from "react";
import Link from "next/link";

import { Container } from "@/components/marketing/container";
import { Logo } from "@/components/marketing/logo";
import { siteConfig } from "@/lib/site";

const footerNav = [
  {
    heading: "Product",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "How it works", href: "/#model" },
      { label: "Features", href: "/#features" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Contact", href: `mailto:${siteConfig.contactEmail}` },
      { label: "Log in", href: siteConfig.loginUrl },
      { label: "Start sending", href: siteConfig.signupUrl },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Email marketing billed on what you send, not how many people you
              keep on the list.
            </p>
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

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>{siteConfig.location}</p>
        </div>
      </Container>
    </footer>
  );
}

export { SiteFooter };
