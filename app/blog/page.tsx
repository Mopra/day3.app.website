import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Reveal } from "@/components/marketing/reveal";
import { RelatedLinks } from "@/components/marketing/related-links";
import {
  JsonLd,
  blogSchema,
  breadcrumbSchema,
} from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { sortedBlogPosts } from "@/lib/blog-content";

export const metadata: Metadata = buildMetadata({
  title: "Guides to email deliverability and compliance",
  description:
    "Practical writing on SPF, DKIM and DMARC, one-click unsubscribe, GDPR consent, sender reputation, and how email pricing models actually compare.",
  path: "/blog",
  ogEyebrow: "Guides",
  ogTitle: "Email deliverability and compliance, explained",
  keywords: [
    "email deliverability guide",
    "email authentication guide",
    "email marketing compliance",
    "email pricing comparison",
    "spf dkim dmarc guide",
  ],
});

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export default function BlogIndexPage() {
  const posts = sortedBlogPosts();

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Guides", path: "/blog" },
      ])} />
      <JsonLd
        data={blogSchema(
          posts.map((post) => ({
            title: post.title,
            path: `/blog/${post.slug}`,
            date: post.published,
          })),
        )}
      />

      <SiteHeader />

      <main id="main">
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 text-center sm:py-24">
            <p className="text-sm font-medium uppercase tracking-wider text-caramel">
              Guides
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
              The parts of email that are actually hard.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Authentication, unsubscribe compliance, consent records, sender
              reputation, and the arithmetic behind email pricing. Written because
              day3 has to get all of it right, not because a content calendar
              needed filling.
            </p>
          </Container>
        </section>

        <section className="border-b border-border">
          <Container className="py-16 sm:py-20">
            <ul className="grid gap-5 md:grid-cols-2">
              {posts.map((post, i) => (
                <Reveal key={post.slug} delay={i * 70} className="flex">
                  <li className="flex w-full">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex h-full w-full flex-col rounded-xl border border-border bg-card p-7 transition-colors duration-200 hover:border-caramel/40 hover:bg-secondary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-medium uppercase tracking-wider text-caramel">
                          {post.topic}
                        </span>
                        <span aria-hidden>&middot;</span>
                        <time dateTime={post.published}>
                          {formatDate(post.published)}
                        </time>
                        <span aria-hidden>&middot;</span>
                        <span>{post.readMinutes} min read</span>
                      </div>
                      <h2 className="mt-4 font-display text-2xl leading-tight text-foreground">
                        {post.title}
                      </h2>
                      <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">
                        {post.summary}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                        Read it
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>

        <RelatedLinks
          refs={[
            "page:/deliverability",
            "page:/how-it-works",
            "page:/security",
            "page:/gdpr",
            "feature:api",
            "page:/pricing",
          ]}
          heading="Elsewhere on the site"
          className="border-b border-border bg-oat/30"
        />

        <section>
          <Container className="py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Or just try it.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Verify a domain, import a list, send a real campaign to your own
              team. All on the free tier.
            </p>
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
                render={<Link href="/pricing" />}
              >
                See pricing
              </Button>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
