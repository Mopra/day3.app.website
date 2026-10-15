import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users, Send, Scale } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { RelatedLinks } from "@/components/marketing/related-links";
import { BeehiivCalculator } from "@/components/marketing/beehiiv-calculator";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { formatCount, formatUsd } from "@/lib/resend-comparison";
import {
  BEEHIIV_FREE_LIMIT,
  BEEHIIV_PRICING_URL,
  BEEHIIV_VERIFIED_ON,
  beehiivCost,
  compare,
  workedScenarios,
} from "@/lib/beehiiv-comparison";

export const metadata: Metadata = buildMetadata({
  title: "beehiiv pricing calculator: beehiiv vs day3",
  description:
    "What your list costs on beehiiv's published plans against day3's per-send price. Move two sliders, including the cases where beehiiv is cheaper.",
  path: "/beehiiv-pricing-calculator",
  ogEyebrow: "Pricing calculator",
  ogTitle: "beehiiv or day3? Move the slider.",
  keywords: [
    "beehiiv pricing",
    "beehiiv pricing calculator",
    "beehiiv price increase",
    "beehiiv alternative",
    "cheaper than beehiiv",
    "beehiiv vs day3",
  ],
});

// Read live off the snapshot, so the copy can never disagree with the table.
const lite10k = beehiivCost(10_000, "yearly").priceUsd;
const pro100k = beehiivCost(100_000, "yearly").priceUsd;

const faqs = [
  {
    q: "How much does beehiiv cost?",
    a: `On ${BEEHIIV_VERIFIED_ON}, beehiiv's own pricing page listed Free up to ${formatCount(BEEHIIV_FREE_LIMIT)} subscribers, then Lite from $49/mo and Pro from $95/mo on yearly billing, both rising with the list. A 10,000-subscriber list was ${lite10k === null ? "custom" : formatUsd(lite10k)}/mo on Lite; 100,000 was ${pro100k === null ? "custom" : formatUsd(pro100k)}/mo on Pro. Monthly billing costs more. Above 250,000 subscribers it's Enterprise, priced by sales.`,
  },
  {
    q: "Is day3 cheaper than beehiiv?",
    a: "For most lists mailed weekly or less, yes, usually by several times. beehiiv prices every subscriber whether you mail them or not; day3 prices only the emails you send. beehiiv is cheaper under 2,500 subscribers, where its Free plan costs nothing, and for a list mailed close to daily, because its sends are unlimited.",
  },
  {
    q: "Why does beehiiv's price ignore how often I send?",
    a: "Because beehiiv bills by subscriber count, with unlimited sends on every plan. That's a good deal if you send daily and a poor one if you send monthly. day3 is the other way round: unlimited subscribers on every plan, billed by sends.",
  },
  {
    q: "What does beehiiv do that day3 doesn't?",
    a: "A lot, and the calculator doesn't price it. beehiiv runs a referral program, an ad network, paid subscriptions, a recommendation network, and a hosted website with a public archive of past posts. day3 does none of those. If any of them earn you money or readers, the cheaper bill is not the whole story.",
  },
  {
    q: "Are these beehiiv's real prices?",
    a: `Yes. Every beehiiv figure was read off beehiiv's own pricing page on ${BEEHIIV_VERIFIED_ON}, at each stop of its subscriber slider, on both yearly and monthly billing. Nothing is interpolated or taken from a third party. The calculator uses the cheapest plan that holds your list, and yearly billing unless you switch it.`,
  },
  {
    q: "Can I move my beehiiv list to day3?",
    a: "Yes, in one click: paste your beehiiv API key in day3, pick your publication, and the whole list comes over, names and custom fields included. Unsubscribed readers come across as unsubscribed, so nobody is re-subscribed by the move. If your beehiiv plan has no API access, export a CSV from beehiiv and upload it as it is.",
  },
];

const models = [
  {
    icon: Users,
    title: "beehiiv bills the list",
    body: "Every subscriber counts toward your tier, mailed this month or not. The bill grows as the list does.",
  },
  {
    icon: Send,
    title: "day3 bills the sends",
    body: "Subscribers are free and unlimited. Only the emails you send move the price, so a big list mailed weekly stays cheap.",
  },
  {
    icon: Scale,
    title: "Where that flips",
    body: "beehiiv's sends are unlimited, so a list mailed every day can come out cheaper there. The calculator shows where that line falls for your list.",
  },
];

export default function BeehiivPricingCalculatorPage() {
  const rows = workedScenarios.map((row) => ({
    ...row,
    verdict: compare(row.scenario),
  }));
  const beehiivWins = rows.filter((r) => r.verdict.winner === "beehiiv").length;

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "beehiiv pricing calculator", path: "/beehiiv-pricing-calculator" },
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
              What your list costs on beehiiv, and on day3.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              beehiiv bills by how many subscribers you have. day3 bills by how
              many emails you send. If your beehiiv renewal just went up, here
              is the same list priced the other way.
            </p>
          </Container>
        </section>

        <section>
          <Container className="py-12 sm:py-16">
            <BeehiivCalculator />
            <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
              beehiiv&apos;s figures were read off{" "}
              <a
                href={BEEHIIV_PRICING_URL}
                rel="nofollow noopener"
                className="underline underline-offset-2 hover:text-foreground"
              >
                their pricing page
              </a>{" "}
              on {BEEHIIV_VERIFIED_ON}. day3&apos;s come straight from{" "}
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
              Two meters, pointed at different things
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
                The same arithmetic as the calculator, on beehiiv&apos;s yearly
                prices.{" "}
                {beehiivWins === 1
                  ? "One goes"
                  : `${["None", "One", "Two", "Three", "Four", "Five", "Six"][beehiivWins]} go`}{" "}
                beehiiv&apos;s way.
              </p>
            </div>

            <div className="mt-12 overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full min-w-[46rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="p-4 font-medium text-muted-foreground">Setup</th>
                    <th className="p-4 font-medium text-muted-foreground">
                      Emails / mo
                    </th>
                    <th className="p-4 font-medium text-muted-foreground">beehiiv</th>
                    <th className="p-4 font-medium text-muted-foreground">day3</th>
                    <th className="p-4 font-medium text-muted-foreground">Cheaper</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ label, scenario, verdict }) => (
                    <tr key={label} className="border-b border-border last:border-0">
                      <td className="p-4">
                        <span className="font-medium text-foreground">{label}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {formatCount(scenario.subscribers)} subscribers,{" "}
                          {scenario.sendsPerMonth === 30
                            ? "mailed daily"
                            : `${scenario.sendsPerMonth} send${scenario.sendsPerMonth === 1 ? "" : "s"} a month`}
                        </span>
                      </td>
                      <td className="p-4 tabular-nums text-muted-foreground">
                        {formatCount(verdict.totalEmails)}
                      </td>
                      <td className="p-4 tabular-nums text-foreground">
                        {verdict.beehiiv.priceUsd === null
                          ? "Custom"
                          : formatUsd(verdict.beehiiv.priceUsd)}
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {verdict.beehiiv.plan}
                        </span>
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
                              : verdict.winner === "beehiiv"
                                ? "beehiiv"
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
                When beehiiv is the better buy
              </h2>
              <div className="mt-8 space-y-6 text-muted-foreground">
                <p className="leading-relaxed">
                  <span className="font-medium text-foreground">
                    When the list is small.
                  </span>{" "}
                  beehiiv&apos;s Free plan holds up to{" "}
                  {formatCount(BEEHIIV_FREE_LIMIT)} subscribers with unlimited
                  sends. day3&apos;s free tier only sends to your own team, so
                  the first real email costs $1. If you fit inside beehiiv Free,
                  stay there.
                </p>
                <p className="leading-relaxed">
                  <span className="font-medium text-foreground">
                    When you send every day.
                  </span>{" "}
                  beehiiv charges nothing per send, so a daily newsletter costs
                  the same as a monthly one. Per-send pricing can&apos;t beat a
                  flat fee at that frequency once the list gets big, and the
                  calculator shows where.
                </p>
                <p className="leading-relaxed">
                  <span className="font-medium text-foreground">
                    When the newsletter is the business.
                  </span>{" "}
                  Referral rewards, the ad network, paid subscriptions,
                  recommendations, and a hosted website with a public archive of
                  every post. day3 does none of those, and the price above
                  doesn&apos;t count them. If they bring you readers or revenue,
                  that is worth more than the difference.
                </p>
                <p className="leading-relaxed">
                  day3 is built for a different job: a software team telling its
                  users what shipped, plus the transactional email from the same
                  domain.{" "}
                  <Link
                    href="/compare/beehiiv-alternative"
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
                  beehiiv&apos;s prices were read off{" "}
                  <a
                    href={BEEHIIV_PRICING_URL}
                    rel="nofollow noopener"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    their pricing page
                  </a>{" "}
                  on {BEEHIIV_VERIFIED_ON}, at every stop of its subscriber
                  slider. The calculator&apos;s slider uses the same stops, so no
                  beehiiv price here is an estimate. Prices change; check the
                  source before you quote this anywhere that matters.
                </li>
                <li>
                  beehiiv&apos;s side is the cheapest plan that holds the list:
                  Free up to {formatCount(BEEHIIV_FREE_LIMIT)}, Lite up to
                  100,000, Pro up to 250,000. Above that is Enterprise, which
                  beehiiv prices through sales. Pro at the same list size is
                  shown alongside, because it&apos;s the plan that removes
                  beehiiv branding.
                </li>
                <li>
                  Yearly billing by default, which is beehiiv&apos;s lower
                  price. Switch to monthly to see what month-to-month costs.
                </li>
                <li>
                  day3&apos;s number is the cheapest tier on{" "}
                  <Link
                    href="/pricing"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    our published ladder
                  </Link>{" "}
                  that covers subscribers times sends. The page reads it live,
                  so it cannot go stale.
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
              Unlimited subscribers. Pay for the sends.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Moving takes one click: paste your beehiiv API key and your whole
              list comes over, unsubscribes included.
            </p>
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
                render={<Link href="/compare/beehiiv-alternative" />}
              >
                day3 vs beehiiv, in full
              </Button>
            </div>
          </Container>
        </section>

        <RelatedLinks
          refs={[
            "compare:beehiiv-alternative",
            "page:/pricing",
            "page:/pricing/for",
            "page:/resend-pricing-calculator",
            "blog:per-subscriber-vs-per-send-email-pricing",
            "for:saas",
          ]}
          heading="Keep reading"
          className="border-t border-border"
        />
      </main>
      <SiteFooter />
    </>
  );
}
