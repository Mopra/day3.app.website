import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { RelatedLinks } from "@/components/marketing/related-links";
import { Inline } from "@/components/marketing/markdown-lite";
import {
  JsonLd,
  articleSchema,
  breadcrumbSchema,
  faqSchema,
} from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { blogPosts, getBlogPost, type Block } from "@/lib/blog-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
    ogEyebrow: post.topic,
    ogTitle: post.title,
    keywords: post.keywords,
  });
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

/** One typed content block. Anything wide scrolls inside its own container. */
function ContentBlock({ block }: { block: Block }) {
  if (block.kind === "p") {
    return (
      <p className="leading-relaxed text-muted-foreground">
        <Inline>{block.text}</Inline>
      </p>
    );
  }

  if (block.kind === "list") {
    return (
      <ul className="space-y-3">
        {block.items.map((item) => (
          <li key={item} className="flex gap-3 leading-relaxed text-muted-foreground">
            <span
              aria-hidden="true"
              className="mt-2.5 size-1.5 shrink-0 rounded-full bg-caramel"
            />
            <span>
              <Inline>{item}</Inline>
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.kind === "steps") {
    return (
      <ol className="space-y-3">
        {block.items.map((item, i) => (
          <li key={item} className="flex gap-3 leading-relaxed text-muted-foreground">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--caramel)_14%,transparent)] text-xs font-semibold text-caramel">
              {i + 1}
            </span>
            <span>
              <Inline>{item}</Inline>
            </span>
          </li>
        ))}
      </ol>
    );
  }

  if (block.kind === "code") {
    return (
      <figure className="overflow-hidden rounded-xl border border-border bg-espresso/[0.04] dark:bg-card">
        {block.caption ? (
          <figcaption className="border-b border-border px-5 py-3 text-xs text-muted-foreground">
            {block.caption}
          </figcaption>
        ) : null}
        <div className="overflow-x-auto">
          <pre className="p-5 text-[0.8rem] leading-relaxed text-foreground">
            <code>{block.code}</code>
          </pre>
        </div>
      </figure>
    );
  }

  if (block.kind === "note") {
    return (
      <aside className="rounded-xl border border-border border-l-2 border-l-caramel bg-secondary/25 p-5">
        <p className="font-medium text-foreground">{block.title}</p>
        <p className="mt-2 leading-relaxed text-muted-foreground">
          <Inline>{block.text}</Inline>
        </p>
      </aside>
    );
  }

  // table
  return (
    <figure className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[32rem] text-left text-sm">
        {block.caption ? (
          <caption className="border-b border-border bg-secondary/30 px-4 py-3 text-left text-xs text-muted-foreground">
            {block.caption}
          </caption>
        ) : null}
        <thead>
          <tr className="border-b border-border bg-secondary/20">
            {block.head.map((cell) => (
              <th key={cell} className="p-4 font-medium text-foreground">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row) => (
            <tr key={row.join("|")} className="border-b border-border last:border-0">
              {row.map((cell, i) => (
                <td
                  key={`${i}-${cell}`}
                  className={
                    i === 0
                      ? "p-4 align-top font-medium text-foreground"
                      : "p-4 align-top text-muted-foreground"
                  }
                >
                  <Inline>{cell}</Inline>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Guides", path: "/blog" },
        { name: post.title, path: `/blog/${post.slug}` },
      ])} />
      <JsonLd
        data={articleSchema({
          headline: post.title,
          description: post.metaDescription,
          path: `/blog/${post.slug}`,
          datePublished: post.published,
          dateModified: post.updated,
          section: post.topic,
        })}
      />
      <JsonLd data={faqSchema(post.faqs)} />

      <SiteHeader />

      <main id="main">
        <article>
          <header className="border-b border-border bg-oat/30">
            <Container className="py-16 sm:py-20">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                All guides
              </Link>
              <div className="mt-6 max-w-3xl">
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
                <h1 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
                  {post.title}
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                  {post.summary}
                </p>
              </div>
            </Container>
          </header>

          {/*
            The answer before the argument. A reader who only reads this box has
            still got what they came for, and it is the part an answer engine can
            lift cleanly.
          */}
          <section className="border-b border-border">
            <Container className="py-12 sm:py-16">
              <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card p-7">
                <h2 className="font-display text-2xl text-foreground">
                  The short version
                </h2>
                <ul className="mt-5 space-y-3">
                  {post.keyTakeaways.map((point) => (
                    <li key={point} className="flex gap-3">
                      <Check className="mt-0.5 size-4 shrink-0 text-caramel" />
                      <span className="leading-relaxed text-muted-foreground">
                        <Inline>{point}</Inline>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </section>

          <section className="border-b border-border">
            <Container className="py-16 sm:py-20">
              <div className="mx-auto flex max-w-3xl flex-col gap-14">
                {post.sections.map((section) => (
                  <section key={section.heading} className="flex flex-col gap-5">
                    <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                      {section.heading}
                    </h2>
                    {section.blocks.map((block, i) => (
                      <ContentBlock key={i} block={block} />
                    ))}
                  </section>
                ))}
              </div>
            </Container>
          </section>

          <section className="border-b border-border bg-oat/30">
            <Container className="py-16 sm:py-20">
              <div className="mx-auto max-w-3xl">
                <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                  Questions
                </h2>
                <dl className="mt-10 divide-y divide-border border-t border-border">
                  {post.faqs.map((faq) => (
                    <div
                      key={faq.q}
                      className="grid gap-2 py-6 sm:grid-cols-[1fr_1.4fr] sm:gap-8"
                    >
                      <dt className="font-medium text-foreground">{faq.q}</dt>
                      <dd className="leading-relaxed text-muted-foreground">
                        {faq.a}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Container>
          </section>
        </article>

        <RelatedLinks
          refs={post.related}
          heading="Keep reading"
          className="border-b border-border"
        />

        <section>
          <Container className="py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              day3 handles all of this by default.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Authenticated domains, one-click unsubscribe, double opt-in, and
              automatic suppression. Billed by emails sent, from $1/month.
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
                render={<Link href="/deliverability" />}
              >
                How day3 sends
              </Button>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
