import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Lock,
  ServerCog,
  KeyRound,
  DatabaseBackup,
  ShieldAlert,
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
import { siteConfig, subprocessors } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Security",
  description:
    "How day3 protects your data: EU-only hosting on Vercel and Supabase, encryption in transit and at rest, and an honest account of where we stand on SOC 2 and compliance.",
  path: "/security",
  keywords: [
    "day3 security",
    "EU email marketing security",
    "is day3 SOC 2 compliant",
    "where is day3 hosted",
    "email marketing data residency EU",
  ],
});

const practices = [
  {
    icon: MapPin,
    title: "EU-only data residency",
    body: "day3 runs entirely in the European Union. Your data and your subscribers' data are stored and processed in the EU — they don't leave it.",
  },
  {
    icon: Lock,
    title: "Encrypted in transit and at rest",
    body: "Every connection is served over TLS. Data at rest is encrypted by our infrastructure providers using industry-standard ciphers.",
  },
  {
    icon: ServerCog,
    title: "Audited infrastructure",
    body: "We build on Vercel and Supabase, both of which maintain SOC 2 Type II reports. The platform underneath day3 is independently audited.",
  },
  {
    icon: KeyRound,
    title: "Least-privilege access",
    body: "Access to production data is restricted to what's needed to run the service, protected by strong authentication, and kept to a minimum.",
  },
  {
    icon: DatabaseBackup,
    title: "Backups & recovery",
    body: "Your data sits in a managed Postgres database with automated backups and point-in-time recovery handled by Supabase.",
  },
  {
    icon: ShieldAlert,
    title: "Sensible sending defaults",
    body: "Authenticated domains, one-click unsubscribe, automatic bounce and complaint handling, and per-sender suppression lists by default.",
  },
];

const faqs = [
  {
    q: "Where is day3 hosted?",
    a: "Entirely in the European Union. day3 runs on Vercel (hosting and delivery) and Supabase (database, authentication and storage), both in EU regions. Your data does not leave the EU.",
  },
  {
    q: "Is day3 SOC 2 certified?",
    a: "Not yet. day3 is a young product and we won't claim a certification we don't hold. What we can say honestly: day3 is built on SOC 2 Type II–audited infrastructure (Vercel and Supabase), and a formal day3 audit is on our roadmap as we grow.",
  },
  {
    q: "Is day3 GDPR compliant?",
    a: "Yes. day3 is an EU company that processes data in the EU. We act as your data processor for the subscribers you import, offer a Data Processing Agreement, and publish the full list of sub-processors we use.",
  },
  {
    q: "Who owns the subscriber data I import?",
    a: "You do. day3 processes your contacts solely to deliver your campaigns and report on them. We never sell, rent, or use them to market anything of our own.",
  },
  {
    q: "How do I report a security issue?",
    a: `Email ${siteConfig.contactEmail} with the details. We welcome responsible disclosure, will acknowledge your report, and won't pursue researchers who act in good faith.`,
  },
];

export default function SecurityPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Security", path: "/security" },
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
              Security
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Your list is sensitive. We treat it that way.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              day3 holds your subscribers&apos; personal data, so security
              isn&apos;t a page we bolt on — it&apos;s how the product is built.
              Here&apos;s exactly what we do, stated plainly.
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

        {/* ----------------------------------------- Compliance posture */}
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 sm:py-24">
            <div className="mx-auto max-w-3xl">
              <SectionHeading
                eyebrow="Where we stand"
                title="Honest about compliance."
              />
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>
                  We won&apos;t put a badge on this page that we haven&apos;t
                  earned. day3 is not SOC 2 audited today. What is true: day3 runs
                  on infrastructure that holds SOC 2 Type II reports — Vercel and
                  Supabase — so the platform beneath us is independently audited,
                  and a formal day3 audit is on the roadmap as we grow.
                </p>
                <p>
                  On data protection we&apos;re on firmer ground. day3 is an EU
                  company processing data in the EU. We act as your{" "}
                  <Link
                    href="/gdpr"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-caramel"
                  >
                    GDPR
                  </Link>{" "}
                  data processor, offer a{" "}
                  <Link
                    href="/legal/dpa"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-caramel"
                  >
                    Data Processing Agreement
                  </Link>
                  , and publish every{" "}
                  <Link
                    href="/legal/subprocessors"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-caramel"
                  >
                    sub-processor
                  </Link>{" "}
                  that can touch your data.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ------------------------------------------- Sub-processors */}
        <section className="border-b border-border">
          <Container className="py-20 sm:py-24">
            <div className="mx-auto max-w-3xl">
              <SectionHeading
                eyebrow="Sub-processors"
                title="The short list of who can touch your data."
                description="Every vendor below is EU-region. We keep the list deliberately small."
              />
              <ul className="mt-8 divide-y divide-border border-y border-border">
                {subprocessors.map((sp) => (
                  <li
                    key={sp.name}
                    className="grid gap-1 py-4 sm:grid-cols-[1fr_1.6fr] sm:gap-6"
                  >
                    <span className="font-medium text-foreground">
                      {sp.name}
                    </span>
                    <span className="text-muted-foreground">
                      {sp.purpose} · {sp.location}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted-foreground">
                The complete, current list lives on the{" "}
                <Link
                  href="/legal/subprocessors"
                  className="font-medium text-foreground underline underline-offset-4 hover:text-caramel"
                >
                  sub-processors page
                </Link>
                .
              </p>
            </div>
          </Container>
        </section>

        {/* ------------------------------------- Responsible disclosure */}
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 sm:py-24">
            <div className="mx-auto max-w-3xl">
              <SectionHeading
                eyebrow="Responsible disclosure"
                title="Found something? Tell us."
              />
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>
                  If you believe you&apos;ve found a security vulnerability in
                  day3, email{" "}
                  <a
                    href={`mailto:${siteConfig.contactEmail}`}
                    className="font-medium text-foreground underline underline-offset-4 hover:text-caramel"
                  >
                    {siteConfig.contactEmail}
                  </a>{" "}
                  with the details and steps to reproduce. We&apos;ll acknowledge
                  your report and keep you posted on the fix.
                </p>
                <p>
                  Act in good faith — don&apos;t access or modify data that
                  isn&apos;t yours, and give us reasonable time to respond — and
                  we won&apos;t pursue or support legal action against you.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ------------------------------------------------ Security FAQ */}
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
              Questions about security or data?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
              Email a human who can actually answer them.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                render={<a href={`mailto:${siteConfig.contactEmail}`} />}
              >
                Contact us
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                render={<Link href="/gdpr" />}
              >
                Read the GDPR statement
              </Button>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
