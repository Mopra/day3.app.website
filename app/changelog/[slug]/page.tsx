import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { RelatedLinks } from "@/components/marketing/related-links";
import {
  JsonLd,
  articleSchema,
  breadcrumbSchema,
} from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { changelogEntries, getChangelogEntry } from "@/lib/changelog-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return changelogEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getChangelogEntry(slug);
  if (!entry) return {};

  return buildMetadata({
    // No date in the title. It pushed the two longest entries past 60 characters,
    // and the date is already on the page, in the <time> element, and in the
    // Article schema's datePublished.
    title: entry.title,
    description: entry.metaDescription,
    path: `/changelog/${entry.slug}`,
    ogEyebrow: "Changelog",
    ogTitle: entry.title,
    keywords: ["day3 changelog", "day3 release notes", entry.title.toLowerCase()],
  });
}

/**
 * A single changelog entry, with its own URL and Article markup.
 *
 * Only the curated entries get pages: a GitHub release fetched hourly cannot be
 * prerendered or sitemapped, so it stays on the index with its link out to
 * GitHub. See changelog-content.ts.
 */
export default async function ChangelogEntryPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getChangelogEntry(slug);
  if (!entry) notFound();

  const index = changelogEntries.findIndex((e) => e.slug === entry.slug);
  const newer = index > 0 ? changelogEntries[index - 1] : undefined;
  const older =
    index < changelogEntries.length - 1 ? changelogEntries[index + 1] : undefined;

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Changelog", path: "/changelog" },
        { name: entry.title, path: `/changelog/${entry.slug}` },
      ])} />
      <JsonLd
        data={articleSchema({
          headline: entry.title,
          description: entry.summary,
          path: `/changelog/${entry.slug}`,
          datePublished: entry.isoDate,
          section: "Changelog",
        })}
      />

      <SiteHeader />

      <main id="main">
        <article>
          <header className="border-b border-border bg-oat/30">
            <Container className="py-16 sm:py-20">
              <Link
                href="/changelog"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                All updates
              </Link>
              <div className="mt-6 max-w-3xl">
                <p className="text-sm font-medium uppercase tracking-wider text-caramel">
                  Changelog
                </p>
                <h1 className="mt-2 font-display text-4xl leading-tight text-foreground sm:text-5xl">
                  {entry.title}
                </h1>
                <time
                  dateTime={entry.isoDate}
                  className="mt-4 block text-sm text-muted-foreground"
                >
                  {entry.date}
                </time>
                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                  {entry.summary}
                </p>
              </div>
            </Container>
          </header>

          <section className="border-b border-border">
            <Container className="py-16 sm:py-20">
              <div className="mx-auto max-w-3xl">
                <h2 className="font-display text-2xl text-foreground">
                  What shipped
                </h2>
                <ul className="mt-6 space-y-4">
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

                {newer || older ? (
                  <nav
                    aria-label="Other updates"
                    className="mt-12 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
                  >
                    {older ? (
                      <Link
                        href={`/changelog/${older.slug}`}
                        className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-caramel/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          Previous update
                        </span>
                        <span className="mt-1 block font-medium text-foreground">
                          {older.title}
                        </span>
                      </Link>
                    ) : (
                      <span />
                    )}
                    {newer ? (
                      <Link
                        href={`/changelog/${newer.slug}`}
                        className="group rounded-xl border border-border bg-card p-5 text-right transition-colors hover:border-caramel/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-right"
                      >
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">
                          Next update
                        </span>
                        <span className="mt-1 block font-medium text-foreground">
                          {newer.title}
                        </span>
                      </Link>
                    ) : null}
                  </nav>
                ) : null}
              </div>
            </Container>
          </section>
        </article>

        <RelatedLinks
          refs={[
            "page:/features",
            "page:/blog",
            "page:/pricing",
            "feature:api",
            "page:/how-it-works",
            "page:/deliverability",
          ]}
          heading="More about day3"
          className="border-b border-border bg-oat/30"
        />

        <section>
          <Container className="py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Try what shipped.
            </h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                render={<a href={siteConfig.signupUrl} />}
              >
                Start free
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                render={<Link href="/changelog" />}
              >
                All updates
              </Button>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
