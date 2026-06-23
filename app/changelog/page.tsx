import * as React from "react";
import type { Metadata } from "next";

import { Container } from "@/components/marketing/container";
import { PreviewBanner } from "@/components/marketing/preview-banner";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Reveal } from "@/components/marketing/reveal";
import { MarkdownLite } from "@/components/marketing/markdown-lite";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { getReleases } from "@/lib/changelog";
import { changelogEntries } from "@/lib/changelog-content";

export const metadata: Metadata = buildMetadata({
  title: "Changelog",
  description:
    "What's new in day3 — the running log of features and improvements as we build toward launch.",
  path: "/changelog",
  keywords: ["day3 changelog", "day3 updates", "day3 what's new"],
});

// Rebuild hourly so newly published GitHub Releases appear without a redeploy.
export const revalidate = 3600;

const rowClass =
  "grid gap-2 border-b border-border py-10 first:pt-0 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-8";

export default async function ChangelogPage() {
  const releases = await getReleases();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Changelog", path: "/changelog" },
        ])}
      />

      <PreviewBanner />
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
              We&apos;re building in the open. Here&apos;s what&apos;s shipped as
              day3 heads toward launch.
            </p>
          </Container>
        </section>

        {/* ----------------------------------------------------- Entries */}
        <section>
          <Container className="py-16 sm:py-20">
            {releases.length > 0 ? (
              <ol className="mx-auto max-w-3xl">
                {releases.map((release) => (
                  <li key={release.version || release.isoDate} className={rowClass}>
                    <Reveal>
                      <time
                        dateTime={release.isoDate}
                        className="text-sm font-medium text-muted-foreground sm:pt-1"
                      >
                        {release.date}
                      </time>
                    </Reveal>
                    <Reveal delay={80}>
                      <div>
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h2 className="font-display text-2xl text-foreground">
                            {release.title}
                          </h2>
                          {release.version && release.version !== release.title ? (
                            <span className="text-sm text-muted-foreground">
                              {release.version}
                            </span>
                          ) : null}
                        </div>
                        {release.body ? (
                          <div className="mt-4">
                            <MarkdownLite>{release.body}</MarkdownLite>
                          </div>
                        ) : null}
                        <a
                          href={release.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-block rounded text-sm font-medium text-foreground underline underline-offset-4 hover:text-caramel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          View release on GitHub →
                        </a>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>
            ) : (
              <ol className="mx-auto max-w-3xl">
                {changelogEntries.map((entry) => (
                  <li key={entry.isoDate + entry.title} className={rowClass}>
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
                        <h2 className="font-display text-2xl text-foreground">
                          {entry.title}
                        </h2>
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
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>
            )}
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
