import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Server,
  UserCheck,
  MailMinus,
  Gauge,
  Globe2,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { PreviewBanner } from "@/components/marketing/preview-banner";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Reveal } from "@/components/marketing/reveal";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Deliverability",
  description:
    "How day3 gets your email into the inbox: authenticated domains (SPF, DKIM, DMARC), proven EU sending infrastructure, permission-based lists, and automatic bounce and complaint handling.",
  path: "/deliverability",
  keywords: [
    "email deliverability",
    "does day3 land in inbox",
    "SPF DKIM DMARC email marketing",
    "email authentication",
    "avoid spam folder newsletter",
  ],
});

const practices = [
  {
    icon: ShieldCheck,
    title: "Authenticated sending",
    body: "Verify your domain and day3 handles SPF, DKIM, and DMARC for you, with automatic DNS setup. Authenticated mail is what mailbox providers trust.",
  },
  {
    icon: Server,
    title: "Proven infrastructure",
    body: "Your campaigns go out over Amazon SES — established, well-maintained sending infrastructure with a strong IP reputation, in an EU region.",
  },
  {
    icon: UserCheck,
    title: "Permission-based by default",
    body: "day3 is built for lists that opted in. Double opt-in is supported, purchased lists aren't allowed, and that keeps complaint rates — and your reputation — low.",
  },
  {
    icon: MailMinus,
    title: "One-click unsubscribe",
    body: "Every email carries a visible opt-out and a standards-based one-click unsubscribe (RFC 8058), so recipients leave cleanly instead of hitting 'spam'.",
  },
  {
    icon: Gauge,
    title: "Automatic suppression",
    body: "Bounces, complaints, and unsubscribes are caught and suppressed automatically. day3 won't keep emailing an address that's hurting your reputation.",
  },
  {
    icon: Globe2,
    title: "Sent from the EU",
    body: "Sending happens inside the European Union, alongside the rest of day3 — no detour outside the region to get your mail delivered.",
  },
];

const faqs = [
  {
    q: "Will my emails land in the inbox or in spam?",
    a: "No tool can promise the inbox — content and your own sending history matter — but day3 stacks the odds in your favour: authenticated domains (SPF/DKIM/DMARC), reputable sending infrastructure, permission-based lists, and automatic suppression of bounces and complaints.",
  },
  {
    q: "Does day3 set up SPF, DKIM, and DMARC for me?",
    a: "Yes. When you verify your sending domain, day3 walks you through DNS with automatic setup so your mail is properly authenticated. Authentication is the single biggest lever on deliverability.",
  },
  {
    q: "What actually sends day3's email?",
    a: "Amazon SES, in an EU region. It's mature, well-maintained sending infrastructure with a strong shared IP reputation — so you benefit from deliverability you'd struggle to build alone.",
  },
  {
    q: "How does day3 handle bounces and spam complaints?",
    a: "Automatically. Hard bounces and complaints are recorded and the address is suppressed, so you don't keep mailing people who bounce or report you. Sustained high rates trigger a review, because one bad sender hurts everyone's delivery.",
  },
  {
    q: "Is there always an unsubscribe link?",
    a: "Always. day3 adds a visible opt-out and a one-click unsubscribe (RFC 8058) to every send, honored immediately via a per-sender suppression list.",
  },
];

export default function DeliverabilityPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Deliverability", path: "/deliverability" },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <PreviewBanner />
      <SiteHeader />

      <main id="main">
        {/* -------------------------------------------------------- Hero */}
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 text-center sm:py-24">
            <p className="text-sm font-medium uppercase tracking-wider text-caramel">
              Deliverability
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
              An email that doesn&apos;t arrive isn&apos;t worth sending.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Getting to the inbox is the whole job. day3 handles the
              authentication, infrastructure, and hygiene that decide whether your
              email lands — so you can focus on what it says.
            </p>
          </Container>
        </section>

        {/* --------------------------------------------------- Practices */}
        <section className="border-b border-border">
          <Container className="py-20 sm:py-24">
            <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {practices.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={(i % 3) * 80}>
                    <div className="flex h-full flex-col bg-card p-7">
                      <Icon className="size-5 text-caramel" />
                      <h2 className="mt-5 font-medium text-foreground">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {item.body}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ------------------------------------------ Reputation note */}
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 sm:py-24">
            <div className="mx-auto max-w-3xl">
              <SectionHeading
                eyebrow="Shared reputation"
                title="We protect the inbox for everyone."
              />
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>
                  Deliverability is a shared resource. One sender blasting a
                  bought list can drag down delivery for everyone on the same
                  infrastructure — so day3 is strict about consent on purpose.
                </p>
                <p>
                  That&apos;s the job of our{" "}
                  <Link
                    href="/legal/acceptable-use"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-caramel"
                  >
                    Acceptable Use Policy
                  </Link>
                  : permission-based sending, no purchased lists, and prompt
                  action on abuse. It keeps the inbox open for your mail and
                  everyone else&apos;s.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ------------------------------------------------------- FAQ */}
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

        {/* -------------------------------------------------------- CTA */}
        <section>
          <Container className="py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Send email that actually arrives.
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
                See how it works
              </Button>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
