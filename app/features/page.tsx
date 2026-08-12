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
import { featurePages } from "@/lib/features-content";

export const metadata: Metadata = buildMetadata({
  title: "Features: campaigns, audiences, forms, API",
  description:
    "Campaigns, unlimited audiences, signup forms, deliverability, metrics, an AI writing assistant, and a REST API with MCP. Not the parts you'll avoid.",
  path: "/features",
  ogEyebrow: "Features",
  ogTitle: "Everything day3 does, and what it doesn't",
  keywords: [
    "email marketing features",
    "newsletter tool features",
    "product update email tool",
    "email campaign software",
    "email marketing api",
  ],
});

/**
 * The deliberate gaps. Kept next to the feature list rather than buried, because
 * "what it doesn't do" is a real question people search and a page that only
 * lists capabilities is a page a careful reader discounts.
 */
const omissions = [
  {
    title: "No automation flows",
    body: "No onboarding drips, trial nurture, or win-back sequences. Triggers, waits and branches are designed but not shipped, so don't pick day3 on the strength of them.",
  },
  {
    title: "No A/B testing",
    body: "No split tests on subject lines or send times. For a changelog going to your whole user base there isn't much to split.",
  },
  {
    title: "No drag-and-drop template builder",
    body: "The composer produces clean, inbox-safe formatting from what you type. There is no canvas to arrange blocks on.",
  },
  {
    title: "No landing pages or CRM",
    body: "Signup form pages, yes. A website builder, a sales pipeline, or contact scoring, no.",
  },
  {
    title: "No monetisation layer",
    body: "No paid subscriptions, ad network, referral programme, or public archive. day3 is not a platform for running a newsletter as a media business.",
  },
  {
    title: "No agency or multi-account layer",
    body: "One organisation per account, no client sub-accounts and no white labelling.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Features", path: "/features" },
      ])} />

      <SiteHeader />

      <main id="main">
        <section className="border-b border-border bg-oat/30">
          <Container className="py-20 text-center sm:py-24">
            <p className="text-sm font-medium uppercase tracking-wider text-caramel">
              Features
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
              The parts you need to send a good email.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Not the parts that come with a manual. Here&apos;s everything day3
              does, and, just as deliberately, the bloat it leaves out.
            </p>
          </Container>
        </section>

        <section>
          <Container className="py-16 sm:py-20">
            <div className="grid gap-5 sm:grid-cols-2">
              {featurePages.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <Reveal key={feature.slug} delay={i * 80}>
                    <Link
                      href={feature.href ?? `/features/${feature.slug}`}
                      className="group flex h-full flex-col rounded-xl border border-border bg-card p-7 transition-colors duration-200 hover:border-caramel/40 hover:bg-secondary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Icon className="size-6 text-caramel transition-transform duration-200 group-hover:scale-110" />
                      <h2 className="mt-5 font-display text-2xl text-foreground">
                        {feature.title}
                      </h2>
                      <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">
                        {feature.summary}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                        Read more about {feature.navLabel.toLowerCase()}
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>

        {/*
          The omissions, stated as a list rather than gestured at in the hero. This
          is the half of "what does it do" that the card grid can't carry, and
          saying it plainly is what stops the wrong people signing up and the right
          people wondering what the catch is.
        */}
        <section className="border-t border-border bg-oat/30">
          <Container className="py-16 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                What day3 deliberately does not do
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                These are omissions, not a roadmap. If one of them is what you came
                for, a marketing platform will serve you better and we would rather
                you knew now.
              </p>
              <ul className="mt-8 space-y-4">
                {omissions.map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 size-1.5 shrink-0 rounded-full bg-caramel"
                    />
                    <span className="leading-relaxed text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {item.title}.
                      </span>{" "}
                      {item.body}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
                Automations, meaning triggers, waits and branches, are designed but
                not shipped. Everything on the cards above works today.
              </p>
            </div>
          </Container>
        </section>

        <section className="border-t border-border">
          <Container className="py-16 text-center sm:py-20">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              See it before you commit.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Sign up free to set everything up. Plans start at $1/mo when
              you&apos;re ready to send.
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
                render={<Link href="/how-it-works" />}
              >
                How the pricing works
              </Button>
            </div>
          </Container>
        </section>
        <RelatedLinks
          refs={["page:/how-it-works", "page:/pricing", "page:/deliverability", "for:saas", "page:/compare", "page:/blog"]}
          heading={"Where to go next"}
          className="border-t border-border"
        />
      </main>

      <SiteFooter />
    </>
  );
}
