import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Boxes, Users, Gauge } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { RelatedLinks } from "@/components/marketing/related-links";
import { ResendCalculator } from "@/components/marketing/resend-calculator";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import {
  compare,
  formatCount,
  formatUsd,
  RESEND_FREE_DAILY_CAP,
  RESEND_PRICING_SOURCE_URL,
  RESEND_PRICING_URL,
  RESEND_VERIFIED_ON,
  workedScenarios,
} from "@/lib/resend-comparison";

export const metadata: Metadata = buildMetadata({
  title: "Resend vs day3 pricing calculator",
  description:
    "Move three sliders and see which is cheaper. Resend bills transactional by send and marketing by contact; day3 bills every email the same way. Both price lists, side by side.",
  path: "/resend-pricing-calculator",
  ogEyebrow: "Pricing calculator",
  ogTitle: "Resend or day3? Move the slider.",
  keywords: [
    "resend pricing calculator",
    "resend vs day3 pricing",
    "resend alternative pricing",
    "resend broadcasts cost",
    "email pricing comparison calculator",
    "cheaper than resend",
  ],
});

const faqs = [
  {
    q: "Is day3 cheaper than Resend?",
    a: "It depends on the mix. Resend is cheaper at the very bottom, because its free plan covers 3,000 transactional emails and 1,000 contacts and day3's free tier only sends to your own team. It's also cheaper if you mail a small list almost every day, because Resend's marketing plan charges by contact and not by send. Everywhere in between, day3 is cheaper, usually several times over, because marketing and transactional come out of one allowance instead of two subscriptions.",
  },
  {
    q: "Why does Resend show two prices?",
    a: "Because it sells two things. Transactional email, through the /emails API, is billed by how many you send. Marketing email, through broadcasts, is billed by how many contacts you store, with unlimited sends inside that tier. Broadcasts don't draw down the transactional allowance, so a team doing both pays two subscriptions.",
  },
  {
    q: "How does day3 price the same work?",
    a: "One number. Every email counts as one send, whether it's a password reset or a launch note, and the monthly plan is the cheapest tier that covers the total. Subscribers are free and unlimited, so growing the list never moves the bill on its own.",
  },
  {
    q: "When is Resend the better buy?",
    a: "When you're small enough to live on the free tier, when transactional is genuinely the whole job, or when you mail a modest list at very high frequency. A flat fee per contact beats a per-send price once the sends per contact get high enough, and the calculator will show you exactly where that line falls for your numbers.",
  },
  {
    q: "Are these Resend's real prices?",
    a: `Yes, read off Resend's own pricing page on ${RESEND_VERIFIED_ON} and linked from this page so you can check. Where their pricing offers more than one way to cover a volume, the calculator charges the cheaper one, including pay-as-you-go overage when that beats moving up a plan.`,
  },
  {
    q: "Does the calculator include add-ons?",
    a: "No. Dedicated IPs, extra domains and SSO are add-ons on Resend's side, and this compares base plans only. If you need a dedicated IP, add $30/mo to the Resend column.",
  },
];

const models = [
  {
    icon: Boxes,
    title: "Two buckets, or one",
    body: "On Resend, broadcasts don't touch your transactional allowance, so the two jobs are two subscriptions. On day3 a send is a send: resets and newsletters draw down the same monthly number.",
  },
  {
    icon: Users,
    title: "Contacts, or sends",
    body: "Resend's marketing plan is priced by how many contacts you store, with unlimited sends inside the tier. day3 never charges for a contact. The list can be any size; only what you send moves the price.",
  },
  {
    icon: Gauge,
    title: "Where that flips",
    body: "A flat contact fee wins when you mail a small list constantly. A per-send price wins when the list is large and you write to it at a normal cadence. The calculator shows which side of that line you're on.",
  },
];

export default function ResendPricingCalculatorPage() {
  const rows = workedScenarios.map((row) => ({
    ...row,
    verdict: compare(row.scenario),
  }));

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Resend pricing calculator", path: "/resend-pricing-calculator" },
        ])}
      />

      <SiteHeader />

      <main id="main">
        <section className="border-b border-border bg-oat/30">
          <Container className="py-16 text-center sm:py-20">
            <p className="text-sm font-medium uppercase tracking-wider text-caramel">
              Pricing calculator
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Resend or day3? Move the sliders.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Resend bills transactional by the send and marketing by the
              contact, so a team doing both pays two subscriptions. day3 bills
              every email the same way, out of one. Here is what that actually
              costs.
            </p>
          </Container>
        </section>

        <section>
          <Container className="py-12 sm:py-16">
            <ResendCalculator />
            <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
              Resend&apos;s figures were read off{" "}
              <a
                href={RESEND_PRICING_URL}
                rel="nofollow noopener"
                className="underline underline-offset-2 hover:text-foreground"
              >
                their pricing page
              </a>{" "}
              on {RESEND_VERIFIED_ON}. Base plans only, no add-ons. day3&apos;s
              figures come straight from{" "}
              <Link
                href="/pricing"
                className="underline underline-offset-2 hover:text-foreground"
              >
                our own ladder
              </Link>
              .
            </p>
          </Container>
        </section>

        <section className="border-t border-border">
          <Container className="py-16 sm:py-20">
            <h2 className="text-center font-display text-3xl text-foreground sm:text-4xl">
              Why the two bills look so different
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {models.map((model) => (
                <div
                  key={model.title}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <model.icon className="size-5 text-caramel" aria-hidden />
                  <h3 className="mt-4 font-medium text-foreground">
                    {model.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {model.body}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-t border-border bg-oat/30">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                Six worked examples
              </h2>
              <p className="mt-4 text-muted-foreground">
                The same arithmetic as the calculator, run on six shapes of team.
                Two of them go Resend&apos;s way.
              </p>
            </div>

            <div className="mt-12 overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full min-w-[46rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="p-4 font-medium text-muted-foreground">
                      Setup
                    </th>
                    <th className="p-4 font-medium text-muted-foreground">
                      Emails / mo
                    </th>
                    <th className="p-4 font-medium text-muted-foreground">
                      Resend
                    </th>
                    <th className="p-4 font-medium text-muted-foreground">
                      day3
                    </th>
                    <th className="p-4 font-medium text-muted-foreground">
                      Cheaper
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ label, scenario, verdict }) => (
                    <tr key={label} className="border-b border-border last:border-0">
                      <td className="p-4">
                        <span className="font-medium text-foreground">
                          {label}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {formatCount(scenario.transactional)} transactional,{" "}
                          {formatCount(scenario.contacts)} contacts,{" "}
                          {scenario.campaignsPerMonth === 0
                            ? "no campaigns"
                            : `${scenario.campaignsPerMonth} campaign${scenario.campaignsPerMonth === 1 ? "" : "s"} a month`}
                        </span>
                      </td>
                      <td className="p-4 tabular-nums text-muted-foreground">
                        {formatCount(verdict.totalEmails)}
                      </td>
                      <td className="p-4 tabular-nums text-foreground">
                        {verdict.resend.totalUsd === null
                          ? "Custom"
                          : formatUsd(verdict.resend.totalUsd)}
                      </td>
                      <td className="p-4 tabular-nums text-foreground">
                        {verdict.day3.priceUsd === null
                          ? "Custom"
                          : formatUsd(verdict.day3.priceUsd)}
                      </td>
                      <td className="p-4">
                        <span
                          className={
                            verdict.winner === "day3"
                              ? "font-medium text-caramel"
                              : "font-medium text-foreground"
                          }
                        >
                          {verdict.winner === "tie"
                            ? "Level"
                            : verdict.winner === "day3"
                              ? "day3"
                              : verdict.winner === "resend"
                                ? "Resend"
                                : "Ask"}
                        </span>
                        {verdict.savingUsd ? (
                          <span className="mt-0.5 block text-xs text-muted-foreground tabular-nums">
                            by {formatUsd(verdict.savingUsd)}/mo
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </section>

        <section className="border-t border-border">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                When Resend is the better buy
              </h2>
              <div className="mt-8 space-y-6 text-muted-foreground">
                <p className="leading-relaxed">
                  <span className="font-medium text-foreground">
                    When you&apos;re starting out.
                  </span>{" "}
                  Resend&apos;s free plan carries 3,000 transactional emails a
                  month, capped at {RESEND_FREE_DAILY_CAP}{" "}
                  a day, plus 1,000
                  marketing contacts with unlimited broadcasts to them.
                  day3&apos;s free tier only sends to your own team, so the first
                  real email costs $1. If you fit inside Resend&apos;s free
                  plan, stay there.
                </p>
                <p className="leading-relaxed">
                  <span className="font-medium text-foreground">
                    When you mail a small list constantly.
                  </span>{" "}
                  Resend charges nothing per marketing send, so 5,000 contacts
                  mailed daily costs the same $40 as 5,000 contacts mailed once.
                  Per-send pricing can&apos;t beat a flat fee at that frequency,
                  and day3 doesn&apos;t pretend otherwise.
                </p>
                <p className="leading-relaxed">
                  <span className="font-medium text-foreground">
                    When transactional is the whole job.
                  </span>{" "}
                  If you have no list, no campaigns and no plans for either,
                  you&apos;re buying one pipe from a company whose entire
                  business is that pipe. day3&apos;s campaign half would be
                  weight you never use, even where the number is lower.
                </p>
                <p className="leading-relaxed">
                  And you can run both. Campaigns on day3, transactional
                  wherever it is now, costs you a second DNS record and nothing
                  else.{" "}
                  <Link
                    href="/compare/resend-alternative"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    The longer comparison
                  </Link>{" "}
                  goes through the rest of it.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-t border-border bg-oat/30">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-2xl text-foreground sm:text-3xl">
                How this is calculated
              </h2>
              <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li>
                  Resend&apos;s prices were read off{" "}
                  <a
                    href={RESEND_PRICING_SOURCE_URL}
                    rel="nofollow noopener"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    their published price list
                  </a>{" "}
                  on {RESEND_VERIFIED_ON}. Prices change; check the source before
                  you quote this anywhere that matters.
                </li>
                <li>
                  Where more than one Resend plan covers a volume, the cheapest
                  is used, including pay-as-you-go overage when that beats
                  moving up a tier. The comparison is deliberately run at
                  Resend&apos;s best price, not their worst.
                </li>
                <li>
                  Marketing cost is priced on contacts stored, because that is
                  how Resend bills it. A list you don&apos;t mail this month
                  still costs its tier.
                </li>
                <li>
                  Base plans only. Dedicated IPs ($30/mo), extra domains
                  ($20/mo) and SSO ($150/mo) are Resend add-ons and are not
                  counted on either side.
                </li>
                <li>
                  day3&apos;s number is the cheapest tier on{" "}
                  <Link
                    href="/pricing"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    our published ladder
                  </Link>{" "}
                  that covers transactional plus marketing sends combined. The
                  page reads it live, so it cannot go stale.
                </li>
              </ul>
            </div>
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
              One domain. One allowance. One bill.
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
                render={<Link href="/compare/resend-alternative" />}
              >
                day3 vs Resend, in full
              </Button>
            </div>
          </Container>
        </section>

        <RelatedLinks
          refs={[
            "compare:resend-alternative",
            "page:/pricing",
            "page:/pricing/for",
            "page:/how-it-works",
            "feature:api",
            "for:startups",
          ]}
          heading="Keep reading"
          className="border-t border-border"
        />
      </main>
      <SiteFooter />
    </>
  );
}
