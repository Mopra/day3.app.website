import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/marketing/container";
import { resolveLinks } from "@/lib/internal-links";

type RelatedLinksProps = {
  /** Refs into the link mesh, e.g. ["feature:campaigns", "page:/pricing"]. */
  refs: readonly string[];
  /** Section heading. Defaults to a neutral one. */
  heading?: string;
  className?: string;
};

/**
 * The "keep reading" block at the foot of a templated page.
 *
 * Renders nothing when no ref resolves, so a page with a stale mesh entry ends
 * cleanly rather than showing an empty heading.
 */
function RelatedLinks({
  refs,
  heading = "Related reading",
  className,
}: RelatedLinksProps) {
  const links = resolveLinks(refs);
  if (!links.length) return null;

  return (
    <section className={className ?? "border-t border-border"}>
      <Container className="py-16 sm:py-20">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">
          {heading}
        </h2>
        <ul className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <li key={link.href} className="flex bg-card">
              <Link
                href={link.href}
                className="group flex h-full w-full flex-col p-6 transition-colors duration-200 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <span className="font-medium text-foreground">{link.label}</span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {link.description}
                </span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-caramel">
                  Read on
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export { RelatedLinks };
