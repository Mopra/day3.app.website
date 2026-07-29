import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { PricingSlider } from "@/components/marketing/pricing-slider";
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
    "The most approachable email platform: plans start at $1/mo for 1,000 emails and scale to $220/mo for 1,000,000 — every plan includes unlimited subscribers and the AI writing assistant. Priced by emails sent, never by list size.",
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
    q: "What counts as a send?",
    a: "One email to one subscriber. A campaign to 1,000 people uses 1,000 emails. Subscribers are always free and unlimited.",
  },
  {
    q: "Do unused emails roll over?",
    a: "No — your allotment resets each billing period. Pick the plan that fits your rhythm; change it whenever.",
  },
  {
    q: "What happens if I go over?",
    a: "You can't. Sending pauses cleanly at your cap — no surprise charge. Need more room? Move up a plan in a couple of clicks.",
  },
  {
    q: "Can I try it before I pay?",
    a: "Yes. Signing up is free: connect your domain, build an audience, and set up your first campaign. You just can't send until you pick a plan.",
  },
  {
    q: "Is there a free tier?",
    a: "No free sending tier — but sending starts at just $1/mo. Sign up free to set everything up first. A tool anyone can start with, that scales as your app grows.",
  },
  {
    q: "Is the AI writing assistant included?",
    a: "Yes — on every paid plan, from $1/mo. Draft from a brief, get subject lines, rewrite highlighted copy. Bigger plans carry a bigger AI allowance, but none of them are without one.",
  },
  {
    q: "What if I send more than a million emails a month?",
    a: "Get in touch. The self-serve ladder tops out at 1,000,000 emails for $220/mo; above that we set the plan up with you directly.",
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

      <SiteHeader />
      <main id="main">
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 text-center sm:py-24">
            <span className="inline-flex items-center gap-2 rounded-full border border-caramel/30 bg-[color-mix(in_srgb,var(--caramel)_12%,transparent)] px-3.5 py-1 text-xs font-medium text-foreground">
              Unlimited subscribers on every plan
            </span>
            <h1 className="mx-auto mt-6 max-w-2xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Priced by what you send
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              You&apos;re billed on emails sent, not list size. Plans start at
              $1/mo — unlimited subscribers on every one.
            </p>
          </Container>
        </section>

        <section>
          <Container className="py-16 sm:py-20">
            <h2 className="text-center font-display text-2xl text-foreground sm:text-3xl">
              What it costs
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
              Slide to the volume you send each month. Change tiers whenever.
            </p>
            <div className="mt-12">
              <PricingSlider />
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Every plan includes{" "}
              <span className="font-medium text-foreground">
                unlimited subscribers
              </span>
              , campaigns, audiences, signup forms, metrics, the API — and the
              AI writing assistant.
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
