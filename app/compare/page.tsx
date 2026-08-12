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
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { comparePages } from "@/lib/compare-content";

export const metadata: Metadata = buildMetadata({
  title: "day3 vs Mailchimp, Kit, Resend & beehiiv",
  description:
    "Model-level comparisons against six email tools, with migration steps and an honest note on when to stay put. They meter your list size; day3 meters emails sent.",
  path: "/compare",
  ogEyebrow: "Compare",
  ogTitle: "How day3 compares, honestly",
  keywords: [
    "email marketing comparison",
    "mailchimp alternative",
    "convertkit alternative",
    "beehiiv alternative",
    "resend alternative",
    "email tool comparison",
  ],
});

export default function CompareHubPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Compare", path: "/compare" },
      ])} />

      <SiteHeader />

      <main id="main">
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 text-center sm:py-24">
            <p className="text-sm font-medium uppercase tracking-wider text-caramel">
              Compare
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Most email tools bill you for your list. day3 bills you for sends.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              We think that&apos;s the fairer model for a small software team with
              a growing list. Here&apos;s an honest, model-level comparison with
              the tools you&apos;re probably weighing.
            </p>
          </Container>
        </section>

        <section>
          <Container className="py-16 sm:py-20">
            <div className="grid gap-5 sm:grid-cols-2">
              {comparePages.map((page, i) => (
                <Reveal key={page.slug} delay={i * 80}>
                  <Link
                    href={`/compare/${page.slug}`}
                    className="group flex h-full flex-col rounded-xl border border-border bg-card p-7 transition-colors duration-200 hover:border-caramel/40 hover:bg-secondary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <h2 className="font-display text-2xl text-foreground">
                      day3 vs. {page.competitor}
                    </h2>
                    <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">
                      {page.difference}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                      Read the comparison
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/*
          The hub used to be six cards and a headline. A page targeting "email
          marketing comparison" has to answer the comparison itself, not just
          route to it, so this is the shared argument the six pages all rest on,
          plus the accuracy policy that governs them.
        */}
        <section className="border-t border-border bg-oat/30">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                Two meters, and the one number that picks between them
              </h2>
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-foreground">
                <p>
                  Almost every email tool meters one of two things: how many people
                  are on your list, or how many emails you send them. Which is
                  cheaper for you is not a matter of taste. Divide your monthly
                  sends by your subscriber count and you have the answer.
                </p>
                <p>
                  Below roughly one, meaning you don&apos;t email everyone every
                  month, a send-based meter is cheaper and the gap widens as the
                  list grows. Above roughly one, meaning a weekly or daily letter
                  to a modest list, a per-subscriber plan can genuinely cost less.
                  Software teams usually land well below one, because lists
                  compound and release cadence doesn&apos;t.
                </p>
                <p>
                  That is the whole argument, and it is worked out properly in{" "}
                  <Link
                    href="/blog/per-subscriber-vs-per-send-email-pricing"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-caramel"
                  >
                    the pricing-model guide
                  </Link>
                  , including the cases where day3 is the wrong choice.
                </p>
              </div>

              <div className="mt-10 rounded-xl border border-border bg-card p-6">
                <h3 className="font-medium text-foreground">
                  How we write these comparisons
                </h3>
                <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">
                  <p>
                    Every page here compares pricing models and product scope, never
                    a competitor&apos;s specific prices or feature counts. Those
                    change without telling us, and a stale number on our site reads
                    as a lie rather than as an oversight. The model is the durable
                    thing, and it is the actual decision anyway.
                  </p>
                  <p>
                    Each page also carries a section saying when to stay where you
                    are. Those are written to be used, not as a rhetorical move: if
                    you need automation flows, a markdown-first writing surface, or
                    a newsletter you can monetise, day3 does not have those and the
                    page will tell you so.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-t border-border">
          <Container className="py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              See how the math works for your list.
            </h2>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                render={<Link href="/how-it-works" />}
              >
                How send-based pricing works
                <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                render={<a href={siteConfig.signupUrl} />}
              >
                Get started
              </Button>
            </div>
          </Container>
        </section>
        <RelatedLinks
          refs={["page:/how-it-works", "blog:per-subscriber-vs-per-send-email-pricing", "blog:migrate-email-list-without-losing-deliverability", "page:/pricing", "for:startups", "page:/features"]}
          heading={"Related reading"}
          className="border-t border-border"
        />
      </main>

      <SiteFooter />
    </>
  );
}
