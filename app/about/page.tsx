import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Infinity as InfinityIcon,
  ShieldCheck,
  MapPin,
  Ban,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { PreviewBanner } from "@/components/marketing/preview-banner";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Reveal } from "@/components/marketing/reveal";
import {
  JsonLd,
  breadcrumbSchema,
  organizationSchema,
  personSchema,
} from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { company, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About day3",
  description:
    "day3 is a small, EU-built email marketing tool with one opinion: you pay for the emails you send, never for the size of your list. Built in Copenhagen by the maker of exit1.dev.",
  path: "/about",
  keywords: [
    "about day3",
    "EU email marketing tool",
    "indie email marketing",
    "Pradsgaard Labs",
    "Copenhagen email marketing",
  ],
});

const principles = [
  {
    icon: InfinityIcon,
    title: "No tax on your list",
    body: "Keep 200 subscribers or 200,000 — the price is identical. Growing your audience never grows your bill.",
  },
  {
    icon: Ban,
    title: "No surprises, no upsell",
    body: "No overage at the end of the month. No funnel, no lifecycle-automation maze, no sales call before you can send.",
  },
  {
    icon: ShieldCheck,
    title: "Your list is yours",
    body: "We never sell, rent, or mine your subscribers. We process them to send your email and report on it — nothing else.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={personSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <PreviewBanner />
      <SiteHeader />

      <main id="main">
        {/* -------------------------------------------------------- Hero */}
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 text-center sm:py-24">
            <p className="text-sm font-medium uppercase tracking-wider text-caramel">
              About
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Email marketing should bill you for what you do, not what you keep.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              day3 is a small, EU-built email tool with a single opinion: you
              should pay for the emails you send — never for the size of your
              list.
            </p>
          </Container>
        </section>

        {/* --------------------------------------------------- Why day3 */}
        <section className="border-b border-border">
          <Container className="py-20 sm:py-24">
            <div className="mx-auto max-w-3xl">
              <SectionHeading
                eyebrow="Why it exists"
                title="Most email tools punish you for growing."
              />
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>
                  Nearly every email platform charges by subscriber count. Your
                  list grows, your bill climbs — even in the months you don&apos;t
                  send a thing. It taxes the exact thing you&apos;re trying to do:
                  build an audience.
                </p>
                <p>
                  day3 flips that. Keep as many subscribers as you like and pay
                  only when you hit send. One number, known upfront, with no
                  per-contact tax waiting at the end of the month.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ------------------------------------------------- Principles */}
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 sm:py-24">
            <SectionHeading
              align="center"
              eyebrow="What we won't do"
              title="The short list of things day3 refuses to be."
              className="mx-auto"
            />
            <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
              {principles.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={i * 90}>
                    <div className="flex h-full flex-col bg-card p-7">
                      <Icon className="size-5 text-caramel" />
                      <h2 className="mt-5 font-display text-2xl text-foreground">
                        {item.title}
                      </h2>
                      <p className="mt-3 leading-relaxed text-muted-foreground">
                        {item.body}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ------------------------------------------------ Who builds it */}
        <section className="border-b border-border">
          <Container className="py-20 sm:py-24">
            <div className="mx-auto max-w-3xl">
              <SectionHeading
                eyebrow="Who's behind it"
                title="A small operation, on purpose."
              />
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>
                  day3 is built by {company.founder} — the same person behind{" "}
                  <a
                    href={company.alsoBuilds.href}
                    className="font-medium text-foreground underline underline-offset-4 hover:text-caramel"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {company.alsoBuilds.name}
                  </a>{" "}
                  — under {company.legalName} in {company.city},{" "}
                  {company.country}. It&apos;s deliberately small: a lean, boring,
                  reliable stack, shipped by someone who&apos;d rather fix the
                  product than staff a sales team.
                </p>
                <p>
                  That means you talk to the person who builds it. Email{" "}
                  <a
                    href={`mailto:${siteConfig.contactEmail}`}
                    className="font-medium text-foreground underline underline-offset-4 hover:text-caramel"
                  >
                    {siteConfig.contactEmail}
                  </a>{" "}
                  and a human who can actually change the software reads it.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ------------------------------------------------ How it's built */}
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 sm:py-24">
            <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-[auto_1fr] sm:gap-8">
              <MapPin className="size-7 text-caramel sm:mt-1" />
              <div>
                <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                  Built in the EU, hosted in the EU.
                </h2>
                <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    day3 runs entirely in the European Union, on Vercel and
                    Supabase. Your data — and your subscribers&apos; data — stays
                    in the EU, encrypted in transit and at rest.
                  </p>
                  <p>
                    We&apos;re honest about what we are: a young product on
                    audited, enterprise-grade infrastructure. Here&apos;s exactly
                    how we handle{" "}
                    <Link
                      href="/security"
                      className="font-medium text-foreground underline underline-offset-4 hover:text-caramel"
                    >
                      security
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/gdpr"
                      className="font-medium text-foreground underline underline-offset-4 hover:text-caramel"
                    >
                      data protection
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* -------------------------------------------------------- CTA */}
        <section>
          <Container className="py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Pay for what you send. Nothing else.
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
