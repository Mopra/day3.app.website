import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/marketing/container";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Reveal } from "@/components/marketing/reveal";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { changelogEntries } from "@/lib/changelog-content";

export const metadata: Metadata = buildMetadata({
  title: "Changelog: what's new in day3",
  description:
    "The running log of what day3 has shipped: automations in preview, webhooks, a transactional email API, an MCP server, the public API, and automatic domain authentication.",
  path: "/changelog",
  ogEyebrow: "Changelog",
  ogTitle: "What's new in day3",
  keywords: [
    "day3 changelog",
    "day3 updates",
    "day3 what's new",
    "day3 release notes",
  ],
});

const rowClass =
  "grid gap-2 border-b border-border py-10 first:pt-0 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-8";

export default function ChangelogPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Changelog", path: "/changelog" },
        ])}
      />

      <SiteHeader />

      <main id="main">
        {/* -------------------------------------------------------- Hero */}
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 text-center sm:py-24">
            <p className="text-sm font-medium uppercase tracking-wider text-caramel">
              Changelog
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
              What&apos;s new in day3.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              We&apos;re building in the open. Here&apos;s everything
              that&apos;s shipped so far.
            </p>
          </Container>
        </section>

        {/* ----------------------------------------------------- Entries */}
        <section>
          <Container className="py-16 sm:py-20">
            <ol className="mx-auto max-w-3xl">
              {changelogEntries.map((entry) => (
                <li key={entry.slug} className={rowClass}>
                  <Reveal>
                    <time
                      dateTime={entry.isoDate}
                      className="text-sm font-medium text-muted-foreground sm:pt-1"
                    >
                      {entry.date}
                    </time>
                  </Reveal>
                  <Reveal delay={80}>
                    <div>
                      {/*
                        The title links to the entry's own page. Each entry has
                        an indexable page at /changelog/<slug>, which is what
                        turns the changelog from one URL into a growing archive.
                      */}
                      <h2 className="font-display text-2xl text-foreground">
                        <Link
                          href={`/changelog/${entry.slug}`}
                          className="rounded transition-colors hover:text-caramel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {entry.title}
                        </Link>
                      </h2>
                      <p className="mt-3 leading-relaxed text-muted-foreground">
                        {entry.summary}
                      </p>
                      <ul className="mt-4 space-y-2.5">
                        {entry.items.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 leading-relaxed text-muted-foreground"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2.5 size-1.5 shrink-0 rounded-full bg-caramel"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/changelog/${entry.slug}`}
                        className="mt-4 inline-flex items-center gap-1.5 rounded text-sm font-medium text-foreground underline underline-offset-4 hover:text-caramel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        Read the full update
                        <ArrowRight aria-hidden="true" className="size-3.5" />
                        <span className="sr-only">: {entry.title}</span>
                      </Link>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
