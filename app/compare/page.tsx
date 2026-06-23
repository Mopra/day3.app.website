import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { PreviewBanner } from "@/components/marketing/preview-banner";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Reveal } from "@/components/marketing/reveal";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { comparePages } from "@/lib/compare-content";

export const metadata: Metadata = buildMetadata({
  title: "day3 vs. the alternatives",
  description:
    "How day3 compares to Mailchimp, Kit (ConvertKit), beehiiv, EmailOctopus, and Buttondown. The short version: they price by your list size, day3 prices by emails sent — with unlimited subscribers.",
  path: "/compare",
  keywords: [
    "email marketing comparison",
    "mailchimp alternative",
    "convertkit alternative",
    "beehiiv alternative",
    "email tool comparison",
  ],
});

export default function CompareHubPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Compare", path: "/compare" },
      ])} />

      <PreviewBanner />
      <SiteHeader />

      <main id="main">
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 text-center sm:py-24">
            <p className="text-sm font-medium uppercase tracking-wider text-caramel">
              Compare
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Most email tools bill you for your list. day3 bills you for sends.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              We think that&apos;s the fairer model for a small software team with
              a growing list. Here&apos;s an honest, model-level comparison with
              the tools you&apos;re probably weighing.
            </p>
          </Container>
        </section>

        <section>
          <Container className="py-16 sm:py-20">
            <div className="grid gap-5 sm:grid-cols-2">
              {comparePages.map((page, i) => (
                <Reveal key={page.slug} delay={i * 80}>
                  <Link
                    href={`/compare/${page.slug}`}
                    className="group flex h-full flex-col rounded-xl border border-border bg-card p-7 transition-colors duration-200 hover:border-caramel/40 hover:bg-secondary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <h2 className="font-display text-2xl text-foreground">
                      day3 vs. {page.competitor}
                    </h2>
                    <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">
                      {page.difference}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                      Read the comparison
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-t border-border bg-oat/30">
          <Container className="py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              See how the math works for your list.
            </h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                render={<Link href="/how-it-works" />}
              >
                How send-based pricing works
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                render={<a href={siteConfig.signupUrl} />}
              >
                Get started
              </Button>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
