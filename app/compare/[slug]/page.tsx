import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Reveal } from "@/components/marketing/reveal";
import { RelatedLinks } from "@/components/marketing/related-links";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { cheapestTierFor, siteConfig } from "@/lib/site";
import { comparePages, getComparePage } from "@/lib/compare-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return comparePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getComparePage(slug);
  if (!page) return {};

  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/compare/${page.slug}`,
    ogEyebrow: `vs ${page.competitor}`,
    keywords: page.keywords,
  });
}

export default async function ComparePage({ params }: PageProps) {
  const { slug } = await params;
  const page = getComparePage(slug);
  if (!page) notFound();

  const workedTier = cheapestTierFor(page.worked.monthlySends);

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Compare", path: "/compare" },
        { name: `vs. ${page.competitor}`, path: `/compare/${page.slug}` },
      ])} />
      <JsonLd data={faqSchema(page.faqs)} />

      <SiteHeader />

      <main id="main">
        <section className="border-b border-border bg-oat/30">
          <Container className="py-16 sm:py-20">
            <Link
              href="/compare"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              All comparisons
            </Link>
            <div className="mt-6 max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-wider text-caramel">
                day3 vs. {page.competitor}
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

        {/* Comparison table */}
        <section className="border-b border-border">
          <Container className="py-16 sm:py-20">
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="p-4 font-medium text-muted-foreground">
                      &nbsp;
                    </th>
                    <th className="p-4 font-display text-base text-foreground">
                      day3
                    </th>
                    <th className="p-4 font-display text-base text-foreground">
                      {page.competitor}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {page.comparison.map((row) => (
                    <tr key={row.dimension} className="border-b border-border last:border-0">
                      <th
                        scope="row"
                        className="p-4 align-top font-medium text-foreground"
                      >
                        {row.dimension}
                      </th>
                      <td className="p-4 align-top text-foreground">
                        {row.day3}
                      </td>
                      <td className="p-4 align-top text-muted-foreground">
                        {row.competitor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Comparison reflects each product&apos;s pricing model and scope, not
              specific prices, because those change, so always check the latest on{" "}
              {page.competitor}&apos;s own site.
            </p>
          </Container>
        </section>

        {/* The difference, in prose */}
        <section className="border-b border-border bg-oat/30">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                The core difference
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                {page.difference}
              </p>
            </div>
          </Container>
        </section>

        {/*
          The same scenario through both meters. The price is read off the live
          ladder rather than written into copy, and the other side is described as
          a model, never as a figure we'd have to keep in step with someone else's
          pricing page.
        */}
        <section className="border-b border-border">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                The same numbers, both ways
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                {page.worked.scenario}
              </p>

              <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
                <div className="flex flex-col bg-card p-7">
                  <p className="text-sm font-medium uppercase tracking-wider text-caramel">
                    On day3
                  </p>
                  <p className="mt-3 font-display text-4xl text-foreground">
                    {workedTier.price}
                    <span className="text-base font-normal text-muted-foreground">
                      /mo
                    </span>
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {page.worked.monthlySends.toLocaleString("en-US")} sends a
                    month fits the {workedTier.emails}-email plan.{" "}
                    {page.worked.subscribers.toLocaleString("en-US")} subscribers
                    costs nothing, on this plan or any other.
                  </p>
                </div>
                <div className="flex flex-col bg-card p-7">
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    On {page.competitor}
                  </p>
                  <p className="mt-3 font-display text-4xl text-muted-foreground">
                    Depends
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {page.worked.otherModel}. We don&apos;t print their price
                    here, because it changes and a stale figure would be worse
                    than none. Check it on their own site and run these numbers
                    through it.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Reasons to switch */}
        <section className="border-b border-border">
          <Container className="py-16 sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Why teams move to day3
            </h2>
            <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
              {page.reasonsToSwitch.map((reason, i) => (
                <Reveal key={reason.title} delay={i * 80}>
                  <div className="flex h-full flex-col bg-card p-7">
                    <Check className="size-5 text-caramel" />
                    <h3 className="mt-4 font-medium text-foreground">
                      {reason.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {reason.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Honest counter-point */}
            <div className="mt-8 rounded-xl border border-border bg-secondary/20 p-6">
              <h3 className="font-medium text-foreground">
                When {page.competitor} is the better choice
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {page.stayIf}
              </p>
            </div>
          </Container>
        </section>

        {/*
          The question every reader on this page actually has. It goes before the
          FAQ because "how hard is the move" decides more switches than any
          feature row above it, and the caveat leads rather than hides at the end:
          a migration page that only lists wins is a migration page nobody trusts.
        */}
        <section className="border-b border-border bg-oat/30">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                Moving your list across
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Five steps, in this order. The first one is the one people skip.
              </p>

              <ol className="mt-10 space-y-8">
                {page.migration.map((step, i) => (
                  <Reveal key={step.title} delay={i * 60}>
                    <li className="grid gap-4 sm:grid-cols-[2.25rem_1fr]">
                      <span className="flex size-9 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--caramel)_14%,transparent)] font-display text-lg text-caramel">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {step.title}
                        </h3>
                        <p className="mt-2 leading-relaxed text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ol>

              <div className="mt-10 rounded-xl border border-border bg-card p-6">
                <h3 className="font-medium text-foreground">
                  What doesn&apos;t come across
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {page.migrationCaveat}
                </p>
              </div>
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

        <RelatedLinks
          refs={page.related}
          heading="Keep reading"
          className="border-b border-border bg-oat/30"
        />

        <section>
          <Container className="py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Try the send-based way.
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
