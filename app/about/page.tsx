import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  Infinity as InfinityIcon,
  ShieldCheck,
  MapPin,
  Ban,
  Sprout,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
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
import { company, siteConfig, socialLinks } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  // Not "About day3": the title template appends "· day3", and "About day3 · day3"
  // spent a third of the SERP line saying the brand name twice.
  title: "Why we built an email tool priced by sends",
  description:
    "day3 is a small, EU-built email tool with one opinion: you pay for the emails you send, never for your list size. Made in Denmark by the maker of exit1.dev.",
  path: "/about",
  ogEyebrow: "About",
  ogTitle: "A small EU email tool with one opinion",
  keywords: [
    "about day3",
    "EU email marketing tool",
    "indie email marketing",
    "Pradsgaard Labs",
    "Danish email marketing tool",
  ],
});

const principles = [
  {
    icon: InfinityIcon,
    title: "No tax on your list",
    body: "Keep 200 subscribers or 200,000. The price is identical. Growing your audience never grows your bill.",
  },
  {
    icon: Ban,
    title: "No surprises, no upsell",
    body: "No overage at month-end. No funnels, no sales call before you can send.",
  },
  {
    icon: ShieldCheck,
    title: "Your list is yours",
    body: "We never sell, rent, or mine your subscribers. We process them to send your email and report on it. Nothing else.",
  },
];

/**
 * The pages a careful reader goes looking for before handing over a list, in one
 * place. Linking them plainly is itself the trust signal. A tool with something
 * to hide summarises this into a badge.
 */
const trustLinks = [
  {
    href: "/security",
    label: "Security",
    description:
      "How the application, database, and mail are hosted, and what's encrypted where.",
  },
  {
    href: "/gdpr",
    label: "GDPR & data protection",
    description:
      "What we process, why, how long for, and how erasure actually works.",
  },
  {
    href: "/legal/subprocessors",
    label: "Sub-processors",
    description:
      "Every third party that can touch your data, named, with what it does.",
  },
  {
    href: "/legal/dpa",
    label: "Data processing agreement",
    description: "The DPA, in full, without asking anyone for it.",
  },
  {
    href: "/legal/acceptable-use",
    label: "Acceptable use",
    description:
      "What day3 won't send, and why deliverability holds for everyone else.",
  },
  {
    href: "/changelog",
    label: "Changelog",
    description: "Every change that shipped, dated. Judge the pace yourself.",
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
              should pay for the emails you send, never for the size of your
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
                  list grows, your bill climbs, even in the months you don&apos;t
                  send a thing. It taxes the exact thing you&apos;re trying to do:
                  build an audience.
                </p>
                <p>
                  day3 flips that: keep as many subscribers as you like and pay
                  only when you hit send. One price, known upfront.
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
                  day3 is built by {company.founder}, {company.founderTitle},
                  under {company.legalName} in {company.city},{" "}
                  {company.country}. Same person behind{" "}
                  <a
                    href={company.alsoBuilds.href}
                    className="font-medium text-foreground underline underline-offset-4 hover:text-caramel"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {company.alsoBuilds.name}
                  </a>
                  . Deliberately small, shipped by someone who&apos;d rather fix
                  the product than staff a sales team.
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

              {/*
                The verifiable half of "trust us". A name and a city are a claim;
                a registration number, a parent company, and a public code
                profile are things a stranger can go and check, including a model
                deciding whether to recommend this tool.
              */}
              <dl className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
                <div className="bg-card p-6">
                  <dt className="text-sm text-muted-foreground">
                    Registered company
                  </dt>
                  <dd className="mt-1 font-medium text-foreground">
                    <a
                      href={company.website}
                      className="underline underline-offset-4 hover:text-caramel"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {company.legalName}
                    </a>
                  </dd>
                </div>
                <div className="bg-card p-6">
                  <dt className="text-sm text-muted-foreground">
                    Danish company number
                  </dt>
                  <dd className="mt-1 font-medium tabular-nums text-foreground">
                    CVR {company.cvr}
                  </dd>
                </div>
                <div className="bg-card p-6">
                  <dt className="text-sm text-muted-foreground">
                    Written in public
                  </dt>
                  <dd className="mt-1 font-medium text-foreground">
                    {socialLinks.length ? (
                      <a
                        href={socialLinks[0].href}
                        className="underline underline-offset-4 hover:text-caramel"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {socialLinks[0].label}
                      </a>
                    ) : (
                      <Link
                        href="/changelog"
                        className="underline underline-offset-4 hover:text-caramel"
                      >
                        Changelog
                      </Link>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </Container>
        </section>

        {/* --------------------------------------------- Why $1 is real */}
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 sm:py-24">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center gap-3">
                <Calculator className="size-6 text-caramel" />
                <p className="text-sm font-medium uppercase tracking-wider text-caramel">
                  Why it costs what it costs
                </p>
              </div>
              <h2 className="mt-3 font-display text-3xl leading-tight text-foreground sm:text-4xl">
                $1 a month is the real price, not a launch price.
              </h2>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>
                  A price this low invites a fair question: is it a loss leader
                  that gets repriced the moment we have you? It isn&apos;t, and
                  the arithmetic is short enough to show you.
                </p>
                <p>
                  Delivery costs us about{" "}
                  <span className="font-medium text-foreground">
                    $0.10 per 1,000 emails
                  </span>{" "}
                  through AWS SES, and it&apos;s perfectly linear. There are no
                  volume discounts upstream for us to hand down. That&apos;s why
                  the price per thousand flattens as the plans get bigger instead
                  of collapsing.
                </p>
                <p>
                  At the cheap end the binding cost isn&apos;t email at all.
                  It&apos;s card fees. A $1 charge loses roughly a third of itself
                  to payment processing before we see it, which is why nothing
                  below $1 a month can exist and why the smallest plans sit above
                  the trend line rather than on it.
                </p>
                <p>
                  Every tier covers its own costs as it stands. Nothing here is
                  subsidised by a future price rise, and there&apos;s no venture
                  money that needs a return on a schedule.
                </p>
              </div>
              <div className="mt-8">
                <Button
                  variant="outline"
                  render={<Link href="/pricing" />}
                >
                  See the whole ladder
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* --------------------------------------------- Honest status */}
        <section className="border-b border-border">
          <Container className="py-20 sm:py-24">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center gap-3">
                <Sprout className="size-6 text-caramel" />
                <p className="text-sm font-medium uppercase tracking-wider text-caramel">
                  Where we are
                </p>
              </div>
              <h2 className="mt-3 font-display text-3xl leading-tight text-foreground sm:text-4xl">
                day3 is new. Here&apos;s what that buys you, and what it costs
                you.
              </h2>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>
                  We&apos;re not going to invent a customer count or borrow
                  someone else&apos;s logo. day3 is early, and you&apos;d find out
                  soon enough anyway.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    What that buys you:
                  </span>{" "}
                  the person who reads your email is the person who can ship the
                  fix, usually in days. Nothing is grandfathered into a legacy
                  plan, because there isn&apos;t one yet. And every change that
                  lands is dated and public in the{" "}
                  <Link
                    href="/changelog"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-caramel"
                  >
                    changelog
                  </Link>
                  , so you can judge the pace yourself rather than take our word
                  for it.
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    What it costs you:
                  </span>{" "}
                  no third-party reviews to read, no separate docs site yet, and a
                  narrower product than the platform you might be leaving. If
                  those matter more than the price and the focus, a bigger tool is
                  the right call and we&apos;d rather you knew now.
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
                    Supabase. Your data, and your subscribers&apos; data, stays
                    in the EU, encrypted in transit and at rest.
                  </p>
                  <p>
                    A young product on audited, enterprise-grade infrastructure.
                    Here&apos;s exactly how we handle{" "}
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

        {/* ------------------------------------------- Trust & transparency */}
        <section className="border-b border-border">
          <Container className="py-20 sm:py-24">
            <SectionHeading
              align="center"
              eyebrow="Trust & transparency"
              title="Everything we'd want to read before trusting a tool with a list."
              description="Written out in full rather than summarised into a badge."
              className="mx-auto"
            />
            <ul className="mx-auto mt-12 grid max-w-4xl gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
              {trustLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex h-full flex-col bg-card p-6 transition-colors duration-200 hover:bg-secondary/40"
                  >
                    <span className="font-medium text-foreground">
                      {item.label}
                    </span>
                    <span className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
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
