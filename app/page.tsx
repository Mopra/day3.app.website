import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Infinity as InfinityIcon,
  Gauge,
  MailCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/marketing/container";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SectionHeading } from "@/components/marketing/section-heading";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { UsageMeter } from "@/components/marketing/usage-meter";
import { AppPreview } from "@/components/marketing/app-preview";
import { features, siteConfig } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main id="main">
        {/* ---------------------------------------------------------- Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_srgb,var(--caramel)_12%,transparent),transparent_70%)]"
          />
          <Container className="py-20 sm:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="font-medium text-foreground">
                  Start at $5/mo
                </span>
                for 10,000 emails
                <ArrowRight className="size-3.5" />
              </Link>

              <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Email marketing
                <br className="hidden sm:block" /> without the bloat.
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Unlimited subscribers, simple campaigns, and predictable pricing
                based on what you actually send. {siteConfig.promise}
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  render={<a href={siteConfig.signupUrl} />}
                >
                  Start sending
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  render={<Link href="/#pricing" />}
                >
                  See pricing
                </Button>
              </div>

              <p className="mt-5 text-sm text-muted-foreground">
                Unlimited subscribers. Pay for sends. No credit card to look
                around.
              </p>
            </div>

            {/* Product preview */}
            <div className="mx-auto mt-16 max-w-4xl">
              <AppPreview />
            </div>
          </Container>
        </section>

        {/* ------------------------------------------------------- Pricing */}
        <section
          id="pricing"
          className="scroll-mt-20 border-t border-border bg-oat/30"
        >
          <Container className="py-20 sm:py-24">
            <SectionHeading
              align="center"
              eyebrow="Pricing"
              title="Simple pricing. No subscriber tax."
              description="Three plans, priced by how many emails you send. Every plan includes unlimited subscribers. Pick one, change it whenever — no sales call."
            />
            <div className="mt-12">
              <PricingCards />
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              All plans include{" "}
              <span className="font-medium text-foreground">
                unlimited subscribers
              </span>
              . You only pay for the emails you send.
            </p>
          </Container>
        </section>

        {/* --------------------------------------------------- The model */}
        <section id="model" className="scroll-mt-20 border-t border-border">
          <Container className="py-20 sm:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <SectionHeading
                  eyebrow="The model"
                  title="Unlimited subscribers. Capped by sends."
                  description="Most tools bill you more as your list grows — punishing you for the thing you're trying to do. day3 doesn't. Grow your audience as large as you like; you're only metered on emails sent."
                />
                <ul className="mt-8 space-y-4">
                  <li className="flex gap-3">
                    <InfinityIcon className="mt-0.5 size-5 shrink-0 text-caramel" />
                    <span className="text-foreground">
                      <span className="font-medium">Add subscribers freely.</span>{" "}
                      <span className="text-muted-foreground">
                        Import a list of 200 or 200,000 — the price doesn&apos;t
                        move.
                      </span>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Gauge className="mt-0.5 size-5 shrink-0 text-caramel" />
                    <span className="text-foreground">
                      <span className="font-medium">Metered on sends.</span>{" "}
                      <span className="text-muted-foreground">
                        A simple monthly cap on emails sent. Watch it fill, top
                        up if you need to.
                      </span>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <MailCheck className="mt-0.5 size-5 shrink-0 text-caramel" />
                    <span className="text-foreground">
                      <span className="font-medium">No surprises.</span>{" "}
                      <span className="text-muted-foreground">
                        You always know the number before you hit send.
                      </span>
                    </span>
                  </li>
                </ul>
              </div>

              <div className="lg:pl-6">
                <UsageMeter />
              </div>
            </div>
          </Container>
        </section>

        {/* ------------------------------------------------------ Features */}
        <section
          id="features"
          className="scroll-mt-20 border-t border-border bg-oat/30"
        >
          <Container className="py-20 sm:py-24">
            <SectionHeading
              eyebrow="Features"
              title="The essentials, done well."
              description="Everything you need to send a good email, and nothing you'd need a manual for."
            />
            <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="flex flex-col bg-card p-6"
                  >
                    <Icon className="size-5 text-caramel" />
                    <h3 className="mt-4 font-medium text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ----------------------------------------------------- Final CTA */}
        <section className="border-t border-border">
          <Container className="py-20 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
                Take the list. Send the email. Move on.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-lg text-muted-foreground">
                Simple campaigns. Predictable pricing. No enterprise theater.
                Start at $5/mo for 10,000 emails.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  render={<a href={siteConfig.signupUrl} />}
                >
                  Start sending
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  render={<Link href="/pricing" />}
                >
                  See pricing
                </Button>
              </div>
            </div>
          </Container>
        </section>

        <Separator />
      </main>

      <SiteFooter />
    </>
  );
}
