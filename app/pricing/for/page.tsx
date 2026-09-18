import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { RelatedLinks } from "@/components/marketing/related-links";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import {
  cadences,
  formatCount,
  pricingForPages,
  quoteFor,
} from "@/lib/pricing-for-content";

export const metadata: Metadata = buildMetadata({
  title: "Email pricing by list size",
  description:
    "What a newsletter to 1,000, 10,000 or 250,000 subscribers costs on day3 at monthly, weekly and twice-weekly cadence. Billed by emails sent, never by list size.",
  path: "/pricing/for",
  ogEyebrow: "Pricing by list size",
  ogTitle: "What your list costs to email",
  keywords: [
    "newsletter pricing by subscribers",
    "email marketing cost by list size",
    "cheapest newsletter tool for large list",
    "unlimited subscribers email marketing",
  ],
});

export default function PricingForHubPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Pricing", path: "/pricing" },
        { name: "By list size", path: "/pricing/for" },
      ])} />

      <SiteHeader />

      <main id="main">
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 text-center sm:py-24">
            <p className="text-sm font-medium uppercase tracking-wider text-caramel">
              Pricing by list size
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Pick your list. See the bill.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              day3 bills by emails sent, so the cost of a list depends on how often
              you write to it. Every row below is read off the live pricing ladder.
            </p>
          </Container>
        </section>

        <section className="border-b border-border">
          <Container className="py-16 sm:py-20">
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="p-4 font-medium text-muted-foreground">
                      Subscribers
                    </th>
                    {cadences.map((c) => (
                      <th key={c.label} className="p-4 font-medium text-muted-foreground">
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pricingForPages.map((page) => (
                    <tr key={page.slug} className="border-b border-border last:border-0">
                      <th scope="row" className="p-4 font-medium">
                        <Link
                          href={`/pricing/for/${page.slug}`}
                          className="inline-flex items-center gap-1.5 text-foreground underline-offset-4 hover:underline"
                        >
                          {formatCount(page.subscribers)}
                          <ArrowRight className="size-3.5 text-caramel" />
                        </Link>
                      </th>
                      {cadences.map((c) => {
                        const q = quoteFor(page.subscribers, c);
                        return (
                          <td key={c.label} className="p-4 text-foreground">
                            {q.tier ? (
                              <>
                                <span className="font-display text-base">{q.tier.price}</span>
                                <span className="text-muted-foreground">/mo</span>
                              </>
                            ) : (
                              <span className="text-muted-foreground">Talk to us</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Weekly is counted as four sends a month. Subscribers are free on every
              plan; only sends are metered.
            </p>
          </Container>
        </section>

        <RelatedLinks
          refs={[
            "page:/pricing",
            "page:/how-it-works",
            "blog:per-subscriber-vs-per-send-email-pricing",
          ]}
          heading="Keep reading"
          className="border-b border-border bg-oat/30"
        />

        <section>
          <Container className="py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Set up free. Pay when you send.
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
