import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { PreviewBanner } from "@/components/marketing/preview-banner";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { PricingCards } from "@/components/marketing/pricing-cards";
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  softwareApplicationSchema,
} from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description:
    "day3 is launching soon. $5/mo for 10,000 emails, $20/mo for 50,000, $50/mo for 200,000 — every plan includes unlimited subscribers. Priced by emails sent, never by list size.",
  path: "/pricing",
  keywords: [
    "email marketing pricing",
    "cheap email marketing",
    "email tool pricing by sends",
    "unlimited subscribers pricing",
  ],
});

const faqs = [
  {
    q: "When does day3 launch?",
    a: "Very soon — days, not months. Sign up now and you'll be first in, with everything set up and ready to send the moment we go live.",
  },
  {
    q: "What counts as a send?",
    a: "One email to one subscriber. A campaign to 1,000 people uses 1,000 of your monthly emails. Subscribers themselves are always free and unlimited.",
  },
  {
    q: "Do unused emails roll over?",
    a: "Your monthly allotment resets each billing period. Pick the plan that fits your usual sending rhythm — you can change plans whenever you like.",
  },
  {
    q: "What happens if I go over?",
    a: "You can't, really — sending stops cleanly when you reach your monthly cap, so there's never a surprise charge. You'll watch the meter fill long before then, and if you need more headroom you can move up a plan in a couple of clicks.",
  },
  {
    q: "Can I try it before I pay?",
    a: "Yes. Signing up is free — you can look around, connect your sending domain, build an audience, and set up your first campaign. You just can't send until you pick a plan. Think of it as setting everything up so you're ready to go live the moment you subscribe.",
  },
  {
    q: "Is there a free tier?",
    a: "There's no free sending tier — day3 is intentionally cheap, not free. You can sign up for free to set everything up, but sending requires a plan. At $5/mo for 10,000 emails, it's about as cheap as sending gets.",
  },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={faqSchema(faqs.map((f) => ({ q: f.q, a: f.a })))} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Pricing", path: "/pricing" },
      ])} />

      <PreviewBanner />
      <SiteHeader />
      <main id="main">
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 text-center sm:py-24">
            <span className="inline-flex items-center gap-2 rounded-full border border-caramel/30 bg-[color-mix(in_srgb,var(--caramel)_12%,transparent)] px-3.5 py-1 text-xs font-medium text-foreground">
              Launching very soon
            </span>
            <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Priced by what you send
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              The bill follows the emails you send, not the size of your list.
              Every plan includes unlimited subscribers — starting at $5/mo.
            </p>
          </Container>
        </section>

        <section>
          <Container className="py-16 sm:py-20">
            <h2 className="text-center font-display text-2xl text-foreground sm:text-3xl">
              What it&apos;ll cost at launch
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
              Three plans, set by how many emails you send each month. Pick the
              one that fits — you can change it whenever you like.
            </p>
            <div className="mt-12">
              <PricingCards />
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              All plans include{" "}
              <span className="font-medium text-foreground">
                unlimited subscribers
              </span>
              , campaigns, audiences, delivery stats, and one-click unsubscribe.
            </p>
          </Container>
        </section>

        <section className="border-t border-border">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                Questions
              </h2>
              <dl className="mt-10 divide-y divide-border border-t border-border">
                {faqs.map((faq) => (
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

        <section className="border-t border-border bg-oat/30">
          <Container className="py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Get set up before launch
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
                render={<Link href="/how-it-works" />}
              >
                How the model works
              </Button>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
