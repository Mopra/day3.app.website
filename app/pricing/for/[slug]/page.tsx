import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { RelatedLinks } from "@/components/marketing/related-links";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import {
  formatCount,
  getPricingForPage,
  headlineQuote,
  pricingForPages,
  quotesFor,
} from "@/lib/pricing-for-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return pricingForPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPricingForPage(slug);
  if (!page) return {};

  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/pricing/for/${page.slug}`,
    ogEyebrow: "Pricing by list size",
    ogTitle: page.title,
    keywords: page.keywords,
  });
}

export default async function PricingForPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getPricingForPage(slug);
  if (!page) notFound();

  const count = formatCount(page.subscribers);
  const headline = headlineQuote(page.subscribers);
  const quotes = quotesFor(page.subscribers);
  const neighbours = pricingForPages.filter((p) => p.slug !== page.slug);

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Pricing", path: "/pricing" },
        { name: "By list size", path: "/pricing/for" },
        { name: `${count} subscribers`, path: `/pricing/for/${page.slug}` },
      ])} />
      <JsonLd data={faqSchema(page.faqs)} />

      <SiteHeader />

      <main id="main">
        <section className="border-b border-border bg-oat/30">
          <Container className="py-16 sm:py-20">
            <Link
              href="/pricing/for"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              All list sizes
            </Link>
            <div className="mt-6 max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-wider text-caramel">
                {count} subscribers
              </p>
              <h1 className="mt-2 font-display text-4xl leading-tight text-foreground sm:text-5xl">
                {page.title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                {page.intro}
              </p>
            </div>
          </Container>
        </section>

        {/* Headline quote plus the cadence table. Every figure is read off the ladder. */}
        <section className="border-b border-border">
          <Container className="py-16 sm:py-20">
            <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-[1fr_1.6fr]">
              <div className="flex flex-col bg-card p-7">
                <p className="text-sm font-medium uppercase tracking-wider text-caramel">
                  {headline.cadence.label} to {count}
                </p>
                <p className="mt-3 font-display text-5xl text-foreground">
                  {headline.tier ? headline.tier.price : "Ask"}
                  {headline.tier && (
                    <span className="text-base font-normal text-muted-foreground">
                      /mo
                    </span>
                  )}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {formatCount(headline.monthlyEmails)} emails a month
                  {headline.tier
                    ? ` fits the ${headline.tier.emails}-email plan. Unlimited subscribers, every feature, the AI assistant included.`
                    : ". Above the largest self-serve plan; we set it up with you."}
                </p>
              </div>
              <div className="overflow-x-auto bg-card">
                <table className="w-full min-w-[28rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="p-4 font-medium text-muted-foreground">Cadence</th>
                      <th className="p-4 font-medium text-muted-foreground">Emails / month</th>
                      <th className="p-4 font-medium text-muted-foreground">Plan</th>
                      <th className="p-4 font-medium text-muted-foreground">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.map((q) => (
                      <tr key={q.cadence.label} className="border-b border-border last:border-0">
                        <th scope="row" className="p-4 font-medium text-foreground">
                          {q.cadence.label}
                          <span className="block text-xs font-normal text-muted-foreground">
                            {q.cadence.note}
                          </span>
                        </th>
                        <td className="p-4 text-foreground">
                          {formatCount(q.monthlyEmails)}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {q.tier ? `${q.tier.emails} emails` : "Custom"}
                        </td>
                        <td className="p-4 font-display text-base text-foreground">
                          {q.tier ? (
                            <>
                              {q.tier.price}
                              <span className="font-sans text-sm text-muted-foreground">
                                /mo
                              </span>
                            </>
                          ) : (
                            <span className="font-sans text-sm text-muted-foreground">
                              Talk to us
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Weekly is counted as four sends a month. Sending pauses at the cap;
              there are no surprise overages.
            </p>
          </Container>
        </section>

        {/* The model, in prose. Other tools described as a model, never a price. */}
        <section className="border-b border-border bg-oat/30">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                Why the list is free
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Most email tools price by contacts: {count} addresses on the list
                puts you in a {count} tier, whether you mail them every day or
                once a quarter. day3 meters the thing that costs something to do,
                which is sending. Store {count} contacts, or ten times that, and
                the bill only changes when you write to them.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                We don&apos;t print other tools&apos; prices here. They change, and
                a stale figure is worse than none. Take the emails-per-month
                numbers above to their pricing page and run them yourself.
              </p>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-b border-border">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                Questions
              </h2>
              <dl className="mt-10 divide-y divide-border border-t border-border">
                {page.faqs.map((faq) => (
                  <div
                    key={faq.q}
                    className="grid gap-2 py-6 sm:grid-cols-[1fr_1.4fr] sm:gap-8"
                  >
                    <dt className="font-medium text-foreground">{faq.q}</dt>
                    <dd className="text-muted-foreground">{faq.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </section>

        {/* Sibling sizes: the mesh between the programmatic pages. */}
        <section className="border-b border-border bg-oat/30">
          <Container className="py-12 sm:py-14">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Other list sizes
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {neighbours.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/pricing/for/${p.slug}`}
                    className="inline-flex rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-foreground transition-colors hover:border-caramel/50"
                  >
                    {formatCount(p.subscribers)} subscribers
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <RelatedLinks
          refs={page.related}
          heading="Keep reading"
          className="border-b border-border"
        />

        <section>
          <Container className="py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Bring the whole list. Pay for the sends.
            </h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                render={<a href={siteConfig.signupUrl} />}
              >
                Get started
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                render={<Link href="/pricing" />}
              >
                All plans
              </Button>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
