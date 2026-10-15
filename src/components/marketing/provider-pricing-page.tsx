import * as React from "react";
import Link from "next/link";
import { ArrowRight, Users, Send, Scale, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/marketing/container";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { RelatedLinks } from "@/components/marketing/related-links";
import {
  ProviderCalculator,
  type ProviderKey,
} from "@/components/marketing/provider-calculator";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site";
import { formatCount, formatUsd } from "@/lib/resend-comparison";
import {
  compare,
  sendsPhrase,
  type ProviderModel,
  type Scenario,
} from "@/lib/provider-comparison";

/**
 * The page body shared by /kit-pricing-calculator,
 * /mailchimp-pricing-calculator and /mailerlite-pricing-calculator.
 *
 * Laid out like /beehiiv-pricing-calculator: hero, calculator, the two
 * meters, worked examples, where the other tool wins, how to move, how it's
 * calculated, questions. Each route supplies its own copy and its own model;
 * every number on the page is read from that model, so copy and calculator
 * cannot disagree.
 */

export type ProviderPageProps = {
  provider: ProviderKey;
  model: ProviderModel;
  path: string;
  h1: string;
  lede: string;
  meters: { icon?: LucideIcon; title: string; body: string }[];
  worked: { label: string; scenario: Scenario }[];
  /** One line under the worked-examples heading, naming the price basis. */
  workedBasis: string;
  wins: { title: string; body: React.ReactNode }[];
  compareSlug: string;
  /** The move. `importLive` comes from the provider's flag constant. */
  move: {
    importLive: boolean;
    /** Shown while the importer is not live: the CSV route, step by step. */
    csvSteps: { title: string; body: string }[];
    /** What does not come across, stated plainly. */
    caveat: string;
  };
  howCalculated: React.ReactNode[];
  faqs: { q: string; a: string }[];
  related: string[];
};

const defaultIcons = [Users, Send, Scale];
const words = ["None", "One", "Two", "Three", "Four", "Five", "Six"];

export function ProviderPricingPage(props: ProviderPageProps) {
  const { model } = props;
  const rows = props.worked.map((row) => ({
    ...row,
    verdict: compare(model, row.scenario),
  }));
  const providerWins = rows.filter((r) => r.verdict.winner === "provider").length;

  return (
    <>
      <JsonLd data={faqSchema(props.faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: `${model.name} pricing calculator`, path: props.path },
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
              {props.h1}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {props.lede}
            </p>
          </Container>
        </section>

        <section>
          <Container className="py-12 sm:py-16">
            <ProviderCalculator provider={props.provider} />
            <p className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
              {model.name}&apos;s figures were read off{" "}
              <a
                href={model.pricingUrl}
                rel="nofollow noopener"
                className="underline underline-offset-2 hover:text-foreground"
              >
                their pricing page
              </a>{" "}
              on {model.verifiedOn}. day3&apos;s come straight from{" "}
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
              {props.meters.map((meter, i) => {
                const Icon = meter.icon ?? defaultIcons[i % defaultIcons.length];
                return (
                  <div
                    key={meter.title}
                    className="rounded-xl border border-border bg-card p-6"
                  >
                    <Icon className="size-5 text-caramel" aria-hidden />
                    <h3 className="mt-4 font-medium text-foreground">{meter.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {meter.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        <section className="border-t border-border bg-oat/30">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                {words[rows.length] ?? rows.length} worked examples
              </h2>
              <p className="mt-4 text-muted-foreground">
                The same arithmetic as the calculator, {props.workedBasis}.{" "}
                {providerWins === 1
                  ? "One goes"
                  : `${words[providerWins] ?? providerWins} go`}{" "}
                {model.name}&apos;s way.
              </p>
            </div>

            <div className="mt-12 overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full min-w-[46rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="p-4 font-medium text-muted-foreground">Setup</th>
                    <th className="p-4 font-medium text-muted-foreground">Emails / mo</th>
                    <th className="p-4 font-medium text-muted-foreground">{model.name}</th>
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
                          {sendsPhrase(scenario.sendsPerMonth)}
                        </span>
                      </td>
                      <td className="p-4 tabular-nums text-muted-foreground">
                        {formatCount(verdict.totalEmails)}
                      </td>
                      <td className="p-4 tabular-nums text-foreground">
                        {verdict.provider.priceUsd === null
                          ? "Custom"
                          : `${verdict.provider.lowerBound ? "from " : ""}${formatUsd(verdict.provider.priceUsd)}`}
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {verdict.provider.plan}
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
                              : verdict.winner === "provider"
                                ? model.name
                                : "Ask"}
                        </span>
                        {verdict.savingUsd ? (
                          <span className="mt-0.5 block text-xs text-muted-foreground tabular-nums">
                            by {verdict.savingIsFloor ? "at least " : ""}
                            {formatUsd(verdict.savingUsd)}/mo
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
                Where {model.name} wins
              </h2>
              <div className="mt-8 space-y-6 text-muted-foreground">
                {props.wins.map((win) => (
                  <p key={win.title} className="leading-relaxed">
                    <span className="font-medium text-foreground">{win.title}</span>{" "}
                    {win.body}
                  </p>
                ))}
                <p className="leading-relaxed">
                  day3 is built for a different job: a software team telling its
                  users what shipped, plus the transactional email from the same
                  domain.{" "}
                  <Link
                    href={`/compare/${props.compareSlug}`}
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
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                Moving from {model.name}
              </h2>
              {props.move.importLive ? (
                <div className="mt-8 rounded-xl border border-caramel/40 bg-card p-6">
                  <p className="font-medium text-foreground">
                    Import from {model.name}: paste your API key, subscribers and
                    unsubscribes come over.
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    No export, no spreadsheet. Anyone who unsubscribed on{" "}
                    {model.name} arrives unsubscribed, so the move never mails
                    someone who left.
                  </p>
                </div>
              ) : (
                <ol className="mt-8 space-y-5">
                  {props.move.csvSteps.map((step, i) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-card text-sm font-medium text-foreground tabular-nums">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">{step.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
              <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
                {props.move.caveat}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                The day3 side of the move, from domain records to a test send, is{" "}
                <Link
                  href="/migrate"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  shown screen by screen
                </Link>
                .
              </p>
            </div>
          </Container>
        </section>

        <section className="border-t border-border">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-2xl text-foreground sm:text-3xl">
                How this is calculated
              </h2>
              <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {props.howCalculated.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
                <li>
                  day3&apos;s number is the cheapest tier on{" "}
                  <Link
                    href="/pricing"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    our published ladder
                  </Link>{" "}
                  that covers subscribers times sends. The page reads it live, so
                  it cannot go stale. day3&apos;s free tier sends only to your
                  own team, so the first real email costs $1.
                </li>
              </ul>
            </div>
          </Container>
        </section>

        <section className="border-t border-border bg-oat/30">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                Questions
              </h2>
              <dl className="mt-10 divide-y divide-border border-t border-border">
                {props.faqs.map((faq) => (
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

        <section className="border-t border-border">
          <Container className="py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Unlimited subscribers. Pay for the sends.
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
                render={<Link href={`/compare/${props.compareSlug}`} />}
              >
                day3 vs {model.name}, in full
              </Button>
            </div>
          </Container>
        </section>

        <RelatedLinks
          refs={props.related}
          heading="Keep reading"
          className="border-t border-border"
        />
      </main>
      <SiteFooter />
    </>
  );
}
