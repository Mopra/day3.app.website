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
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Billed by what you send: $5/mo for 10,000 emails, $20/mo for 50,000, $50/mo for 200,000. Every plan includes unlimited subscribers.",
};

const faqs = [
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
    a: "You'll see the meter filling up before you ever hit it. If you need more headroom, move up a plan in a couple of clicks.",
  },
  {
    q: "Is there a free tier?",
    a: "No. day3 is intentionally cheap, not free — $5/mo keeps the senders honest and the deliverability clean for everyone.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PreviewBanner />
      <SiteHeader />
      <main id="main">
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 text-center sm:py-24">
            <h1 className="mx-auto max-w-2xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Priced by what you send
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              The bill follows the emails you send, not the size of your list.
              Every plan includes unlimited subscribers.
            </p>
          </Container>
        </section>

        <section>
          <Container className="py-16 sm:py-20">
            <PricingCards />
            <p className="mt-8 text-center text-sm text-muted-foreground">
              All plans include{" "}
              <span className="font-medium text-foreground">
                unlimited subscribers
              </span>
              , campaigns, audiences, analytics, and one-click unsubscribe.
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
              Pick a plan and start sending
            </h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                render={<a href={siteConfig.signupUrl} />}
              >
                Start sending
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                render={<Link href="/#model" />}
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
