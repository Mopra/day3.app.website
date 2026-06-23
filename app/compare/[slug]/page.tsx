import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { PreviewBanner } from "@/components/marketing/preview-banner";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Reveal } from "@/components/marketing/reveal";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
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
    keywords: page.keywords,
  });
}

export default async function ComparePage({ params }: PageProps) {
  const { slug } = await params;
  const page = getComparePage(slug);
  if (!page) notFound();

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Compare", path: "/compare" },
        { name: `vs. ${page.competitor}`, path: `/compare/${page.slug}` },
      ])} />
      <JsonLd data={faqSchema(page.faqs)} />

      <PreviewBanner />
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
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-sm">
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
              specific prices — those change, so always check the latest on{" "}
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

        {/* FAQ */}
        <section className="border-b border-border bg-oat/30">
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
