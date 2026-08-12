import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Infinity as InfinityIcon, Gauge, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SectionHeading } from "@/components/marketing/section-heading";
import { UsageMeter } from "@/components/marketing/usage-meter";
import { Reveal } from "@/components/marketing/reveal";
import { RelatedLinks } from "@/components/marketing/related-links";
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  howToSchema,
} from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { cheapestTierFor, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "How send-based email pricing works",
  description:
    "day3 bills by emails sent, not by subscribers kept. Unlimited subscribers on every plan, one monthly cap, and worked examples of what that actually costs.",
  path: "/how-it-works",
  ogEyebrow: "How it works",
  ogTitle: "Billed on emails sent, not list size",
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
      "Import 200 contacts or 200,000, same price. Subscribers are free and unlimited, so a growing audience never grows your bill.",
    icon: InfinityIcon,
  },
  {
    title: "Send when you have something to say",
    description:
      "Each email to each subscriber is one send. A campaign to 1,000 people uses 1,000 emails, the only number that touches your bill.",
    icon: Gauge,
  },
  {
    title: "Watch one monthly cap",
    description:
      "Your plan has a monthly email allotment. The meter fills as you send and pauses cleanly at the cap, with no surprise overage. Need more room? Move up a plan.",
    icon: MailCheck,
  },
];

/**
 * Worked scenarios, priced off the live ladder rather than written down. The last
 * row is deliberately the case where this model is the *worse* deal: a page that
 * only shows the wins is a page a careful reader stops believing.
 */
const scenarios: {
  subscribers: number;
  cadence: string;
  monthlySends: number;
  verdict: "wins" | "loses";
}[] = [
  { subscribers: 2_000, cadence: "Once a month", monthlySends: 2_000, verdict: "wins" },
  { subscribers: 10_000, cadence: "Twice a month", monthlySends: 20_000, verdict: "wins" },
  { subscribers: 25_000, cadence: "Once a month", monthlySends: 25_000, verdict: "wins" },
  { subscribers: 60_000, cadence: "Every other month", monthlySends: 30_000, verdict: "wins" },
  { subscribers: 1_000, cadence: "Every day", monthlySends: 30_000, verdict: "loses" },
];

const faqs = [
  {
    q: "How is day3's pricing different from Mailchimp or ConvertKit?",
    a: "Most tools charge by subscriber count, so your bill climbs as you grow, even if you rarely email. day3 charges by emails sent. Subscribers are unlimited and free.",
  },
  {
    q: "What counts as one send?",
    a: "One email to one subscriber. A campaign to 1,000 subscribers is 1,000 sends against your monthly allotment. Transactional email through the API counts the same way, out of the same allowance.",
  },
  {
    q: "What happens if I hit my monthly limit?",
    a: "Sending pauses cleanly at the cap. No overage, no surprise charge. Move up a plan for more headroom and sending resumes immediately.",
  },
  {
    q: "Do unused emails roll over?",
    a: "No. Your allotment resets each billing period. Pick the plan that matches how often you send.",
  },
  {
    q: "Why is this cheaper for most teams?",
    a: "List size and sending frequency are different things. A founder with 50,000 subscribers who emails monthly pays far less than on a per-subscriber plan priced for that list.",
  },
  {
    q: "When is send-based pricing the worse deal?",
    a: "When you mail a small list very often. Divide your monthly sends by your subscriber count: below about one, send-based pricing is working in your favour. Well above one, meaning a daily or weekly letter to a modest list, a per-subscriber plan can cost less. We'd rather you did that arithmetic than discovered it later.",
  },
  {
    q: "Does a test send count against my allowance?",
    a: "Yes, because it's a real email through the real pipeline. Test sends only reach addresses you name, so the cost is a handful of emails rather than a campaign.",
  },
  {
    q: "Can I change plans mid-month?",
    a: "Yes, up or down, and changes apply from the next billing period. Since allowances don't roll over, the usual pattern is moving up for the month you make a big send and back down afterwards.",
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
      <JsonLd
        data={howToSchema({
          name: "How send-based email pricing works",
          description:
            "How to run an email list billed by emails sent rather than by subscriber count.",
          steps,
        })}
      />

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
              Most email marketing tools turn a growing list into a growing bill.
              day3 doesn&apos;t. Keep as many subscribers as you like, and pay only
              for the emails you send.
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

        {/* The two curves */}
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 sm:py-24">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                Why the two models diverge
              </h2>
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
                <p>
                  A list and a sending schedule grow at different rates. The list
                  compounds: every launch, every mention, every month of organic
                  signups adds to it, and nothing takes people off it except
                  unsubscribes. Sending stays roughly flat, because it&apos;s
                  governed by how often you ship something worth announcing, which
                  is a function of engineering time rather than of audience size.
                </p>
                <p>
                  Per-subscriber pricing meters the first curve. Send-based pricing
                  meters the second. For a software team those two numbers drift
                  apart month after month, and the gap between them is most of what
                  you&apos;d otherwise be paying.
                </p>
                <p>
                  There&apos;s a second effect that matters more than it sounds.
                  When contacts cost money, every list decision is quietly a
                  billing decision: prune the inactive, don&apos;t add the trial
                  signups, delete the churned accounts. That&apos;s optimising your
                  list for your invoice rather than for your business. When
                  subscribers are free, the right list is simply the accurate one.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Worked scenarios */}
        <section className="border-b border-border">
          <Container className="py-20 sm:py-24">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                The arithmetic, on real numbers
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Every price below is read straight off the current plan ladder, so
                this table can never disagree with{" "}
                <Link
                  href="/pricing"
                  className="font-medium text-foreground underline underline-offset-4 hover:text-caramel"
                >
                  the pricing page
                </Link>
                .
              </p>

              <div className="mt-8 overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[36rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="p-4 font-medium text-muted-foreground">
                        Subscribers
                      </th>
                      <th className="p-4 font-medium text-muted-foreground">
                        You email them
                      </th>
                      <th className="p-4 font-medium text-muted-foreground">
                        Emails / month
                      </th>
                      <th className="p-4 font-medium text-muted-foreground">
                        Your plan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarios.map((row) => {
                      const tier = cheapestTierFor(row.monthlySends);
                      return (
                        <tr
                          key={`${row.subscribers}-${row.cadence}`}
                          className="border-b border-border last:border-0"
                        >
                          <td className="p-4 tabular-nums text-foreground">
                            {row.subscribers.toLocaleString("en-US")}
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {row.cadence}
                          </td>
                          <td className="p-4 tabular-nums text-muted-foreground">
                            {row.monthlySends.toLocaleString("en-US")}
                          </td>
                          <td className="p-4 font-medium text-foreground">
                            {tier.price}/mo
                            {row.verdict === "loses" ? (
                              <span className="mt-1 block text-xs font-normal text-muted-foreground">
                                Here a per-subscriber plan may be cheaper
                              </span>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/*
                The honest bound. Naming the case where our own model loses costs
                one row and buys the reader's trust in the other four.
              */}
              <div className="mt-8 rounded-xl border border-border bg-secondary/20 p-6">
                <h3 className="font-medium text-foreground">
                  Where send-based pricing loses
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  Divide your monthly sends by your subscriber count. Below about
                  one, meaning you don&apos;t email everyone every month, this
                  model is working for you and the gap widens as the list grows.
                  Well above one, meaning a daily or weekly letter to a modest
                  list, a per-subscriber plan can genuinely cost less. That last
                  row is the shape: 1,000 people emailed every day is 30,000 sends
                  against a list most tools would charge very little to hold.
                </p>
              </div>
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
                  description="No contact tax, no surprise overage. The plan price is the price, and the meter shows exactly where you stand."
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

        <RelatedLinks
          refs={[
            "page:/pricing",
            "compare:mailchimp-alternative",
            "compare:convertkit-alternative",
            "for:startups",
            "feature:audiences",
            "page:/blog",
          ]}
          heading="Related reading"
          className="border-b border-border"
        />

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
