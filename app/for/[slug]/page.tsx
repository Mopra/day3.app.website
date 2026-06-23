import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, Dot } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { PreviewBanner } from "@/components/marketing/preview-banner";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Reveal } from "@/components/marketing/reveal";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { audiencePages, getAudiencePage } from "@/lib/audience-content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return audiencePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getAudiencePage(slug);
  if (!page) return {};

  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/for/${page.slug}`,
    keywords: page.keywords,
  });
}

export default async function AudienceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getAudiencePage(slug);
  if (!page) notFound();

  const Icon = page.icon;

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Who it's for", path: "/for" },
        { name: page.navLabel, path: `/for/${page.slug}` },
      ])} />
      <JsonLd data={faqSchema(page.faqs)} />

      <PreviewBanner />
      <SiteHeader />

      <main id="main">
        <section className="border-b border-border bg-oat/30">
          <Container className="py-16 sm:py-20">
            <Link
              href="/for"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Who it&apos;s for
            </Link>
            <div className="mt-6 max-w-3xl">
              <div className="flex size-12 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--caramel)_14%,transparent)]">
                <Icon className="size-6 text-caramel" />
              </div>
              <p className="mt-6 text-sm font-medium uppercase tracking-wider text-caramel">
                {page.eyebrow}
              </p>
              <h1 className="mt-2 font-display text-4xl leading-tight text-foreground sm:text-5xl">
                {page.title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                {page.summary}
              </p>
            </div>
          </Container>
        </section>

        {/* Pain points */}
        <section className="border-b border-border">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                Sound familiar?
              </h2>
              <ul className="mt-8 space-y-4">
                {page.painPoints.map((point) => (
                  <li key={point} className="flex gap-3">
                    <Dot className="mt-0.5 size-6 shrink-0 text-caramel" />
                    <span className="leading-relaxed text-muted-foreground">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* Benefits */}
        <section className="border-b border-border bg-oat/30">
          <Container className="py-16 sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              How day3 fits
            </h2>
            <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
              {page.benefits.map((benefit, i) => (
                <Reveal key={benefit.title} delay={i * 70}>
                  <div className="flex h-full flex-col bg-card p-7">
                    <Check className="size-5 text-caramel" />
                    <h3 className="mt-4 font-medium text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </Reveal>
              ))}
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

        <section className="bg-oat/30">
          <Container className="py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Get in before we launch.
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
                render={<Link href="/features" />}
              >
                Explore the features
              </Button>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
