import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Reveal } from "@/components/marketing/reveal";
import { RelatedLinks } from "@/components/marketing/related-links";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { audiencePages } from "@/lib/audience-content";

export const metadata: Metadata = buildMetadata({
  title: "Email for startups, indie devs & SaaS teams",
  description:
    "day3 is built for small software teams sending product updates and transactional email. Unlimited subscribers, billed by emails sent. Find your situation.",
  path: "/for",
  ogEyebrow: "Who it's for",
  ogTitle: "Built for small software teams",
  keywords: [
    "email tool for startups",
    "email tool for indie developers",
    "email tool for saas",
    "product update email tool",
    "email marketing for software teams",
  ],
});

/**
 * What every reader of these three pages has in common. This exists because the
 * hub used to be a card rack: three links and a headline, about a hundred words
 * of real content. A hub that ranks has to answer the shared question before it
 * splits the reader off into a segment.
 */
const shared = [
  {
    title: "Your list grows faster than your sending does",
    body: "Signups arrive in bursts. Sending is gated by how often you ship something worth announcing. Per-subscriber pricing charges for the first curve; day3 charges for the second.",
  },
  {
    title: "Email is a channel, not a department",
    body: "Nobody on the team is a marketer. The tool has to be usable on the afternoon you need it, without a platform to learn first or a sales call before you can send.",
  },
  {
    title: "The app already sends email",
    body: "Password resets, receipts, magic links. Running those through the same verified domain and the same monthly allowance as your updates means one reputation to keep clean instead of two.",
  },
  {
    title: "Getting compliance wrong is expensive",
    body: "One-click unsubscribe, recorded consent, automatic suppression of bounces and complaints. These are not features you want to discover you needed after Gmail starts filing you as spam.",
  },
];

const faqs = [
  {
    q: "Who is day3 built for?",
    a: "Small software teams who send product updates: startups, indie developers and solo founders, and SaaS teams shipping release notes. The common thread is a list that grows faster than the sending schedule, and no marketer on staff.",
  },
  {
    q: "Who is day3 not for?",
    a: "Marketing teams running funnels, and agencies managing client accounts. There's no A/B testing, no CRM, no landing pages, no multi-account layer, and automations are designed but not shipped. If you need a marketing platform, buy a marketing platform.",
  },
  {
    q: "Do I need to be a developer to use day3?",
    a: "No. Verifying a domain is the only technical step, and connecting Cloudflare means day3 publishes the DNS records for you. The API and MCP server are there if you want them, not a prerequisite for sending.",
  },
  {
    q: "Does day3 work for a non-software business?",
    a: "It'll send email perfectly well, but the product is shaped around product updates and transactional mail. If you're running seasonal promotions, e-commerce flows or lead nurture, a generalist tool fits better.",
  },
];

export default function AudienceHubPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Who it's for", path: "/for" },
      ])} />
      <JsonLd data={faqSchema(faqs)} />

      <SiteHeader />

      <main id="main">
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 text-center sm:py-24">
            <p className="text-sm font-medium uppercase tracking-wider text-caramel">
              Who it&apos;s for
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Built for small software teams. Not marketing departments.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              day3 is email marketing and transactional email for people whose
              actual job is shipping product. If that&apos;s you, find your
              situation below.
            </p>
          </Container>
        </section>

        <section className="border-b border-border">
          <Container className="py-16 sm:py-20">
            <div className="grid gap-5 md:grid-cols-3">
              {audiencePages.map((page, i) => {
                const Icon = page.icon;
                return (
                  <Reveal key={page.slug} delay={i * 80}>
                    <Link
                      href={`/for/${page.slug}`}
                      className="group flex h-full flex-col rounded-xl border border-border bg-card p-7 transition-colors duration-200 hover:border-caramel/40 hover:bg-secondary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Icon className="size-6 text-caramel transition-transform duration-200 group-hover:scale-110" />
                      <h2 className="mt-5 font-display text-2xl text-foreground">
                        {page.navLabel}
                      </h2>
                      <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">
                        {page.summary}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                        See why
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>

        {/* What all three have in common */}
        <section className="border-b border-border bg-oat/30">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                What all three have in common
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                A startup, a solo developer and a SaaS team look different on an
                org chart and identical on an invoice. Four things are true of all
                of them, and they&apos;re the reason day3 is priced and shaped the
                way it is.
              </p>
              <dl className="mt-10 divide-y divide-border border-t border-border">
                {shared.map((item) => (
                  <div key={item.title} className="py-6">
                    <dt className="font-medium text-foreground">{item.title}</dt>
                    <dd className="mt-2 leading-relaxed text-muted-foreground">
                      {item.body}
                    </dd>
                  </div>
                ))}
              </dl>
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
            "page:/how-it-works",
            "page:/pricing",
            "page:/features",
            "page:/deliverability",
            "page:/compare",
            "page:/blog",
          ]}
          heading="Where to go next"
          className="border-b border-border bg-oat/30"
        />

        <section>
          <Container className="py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              One model, whatever you&apos;re building.
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
                How it works
              </Button>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
