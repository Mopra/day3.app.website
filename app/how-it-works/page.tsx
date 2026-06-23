import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Infinity as InfinityIcon, Gauge, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { PreviewBanner } from "@/components/marketing/preview-banner";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SectionHeading } from "@/components/marketing/section-heading";
import { UsageMeter } from "@/components/marketing/usage-meter";
import { Reveal } from "@/components/marketing/reveal";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "How send-based email pricing works",
  description:
    "day3 bills you by the emails you send, not by how many subscribers you keep. Unlimited subscribers on every plan, one monthly cap, and a price you know upfront. Here's exactly how the model works.",
  path: "/how-it-works",
  keywords: [
    "email marketing priced by sends not subscribers",
    "send-based email pricing",
    "email tool unlimited subscribers",
    "stop paying per subscriber",
    "pay per email sent",
  ],
});

const steps = [
  {
    title: "Bring your whole list",
    description:
      "Import 200 contacts or 200,000 — it's the same price. Subscribers are always free and unlimited, so growing your audience never grows your bill.",
    icon: InfinityIcon,
  },
  {
    title: "Send when you have something to say",
    description:
      "Each email to each subscriber counts as one send. A campaign to 1,000 people uses 1,000 of your monthly emails. That's the only number that touches your bill.",
    icon: Gauge,
  },
  {
    title: "Watch one monthly cap",
    description:
      "Your plan comes with a monthly email allotment. The meter fills as you send, you can see it coming, and sending pauses cleanly at the cap — no surprise overage. Move up a plan whenever you need more room.",
    icon: MailCheck,
  },
];

const faqs = [
  {
    q: "How is day3's pricing different from Mailchimp or ConvertKit?",
    a: "Most email tools charge by the number of subscribers on your list, so your bill climbs as you grow — even if you barely email anyone. day3 charges by the number of emails you actually send each month. Subscribers are unlimited and free on every plan.",
  },
  {
    q: "What counts as one send?",
    a: "One email delivered to one subscriber. If you send a campaign to 1,000 subscribers, that's 1,000 sends against your monthly allotment.",
  },
  {
    q: "What happens if I hit my monthly limit?",
    a: "Sending pauses cleanly at the cap — there's no overage and no surprise charge. You'll watch the meter fill well before you reach it, and if you need more headroom you can move up a plan in a couple of clicks; sending resumes immediately.",
  },
  {
    q: "Do unused emails roll over?",
    a: "No — your allotment resets at the start of each billing period. Pick the plan that matches how often you actually send.",
  },
  {
    q: "Why is this cheaper for most teams?",
    a: "Because list size and sending frequency are different things. A founder with 50,000 subscribers who emails monthly pays far less on a send-based plan than on a per-subscriber plan priced for that list size.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "How it works", path: "/how-it-works" },
      ])} />
      <JsonLd data={faqSchema(faqs)} />

      <PreviewBanner />
      <SiteHeader />

      <main id="main">
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 text-center sm:py-24">
            <p className="text-sm font-medium uppercase tracking-wider text-caramel">
              How it works
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
              You&apos;re billed on emails sent, not on the size of your list.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Every other tool turns your growing list into a growing bill. day3
              flips that: keep as many subscribers as you like, and only pay for
              the emails you actually send.
            </p>
          </Container>
        </section>

        {/* The three-step model */}
        <section className="border-b border-border">
          <Container className="py-20 sm:py-24">
            <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <Reveal key={step.title} delay={i * 90}>
                    <div className="flex h-full flex-col bg-card p-7">
                      <div className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--caramel)_14%,transparent)] text-sm font-semibold text-caramel">
                          {i + 1}
                        </span>
                        <Icon className="size-5 text-caramel" />
                      </div>
                      <h2 className="mt-5 font-display text-2xl text-foreground">
                        {step.title}
                      </h2>
                      <p className="mt-3 leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Visual: the meter */}
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 sm:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <Reveal>
                <SectionHeading
                  title="One number to watch"
                  description="No per-contact tax, no surprise overage at the end of the month. The plan price is the price, and the meter shows you exactly where you stand."
                />
                <div className="mt-8">
                  <Button
                    size="lg"
                    render={<Link href="/pricing" />}
                    className="group"
                  >
                    See the plans
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Button>
                </div>
              </Reveal>
              <Reveal delay={120} className="lg:pl-6">
                <UsageMeter />
              </Reveal>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-b border-border">
          <Container className="py-20 sm:py-24">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                Common questions
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

        {/* CTA */}
        <section className="bg-oat/30">
          <Container className="py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Stop paying for subscribers you don&apos;t email.
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
