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
import { PreviewBanner } from "@/components/marketing/preview-banner";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SectionHeading } from "@/components/marketing/section-heading";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { FoundingOffer } from "@/components/marketing/founding-offer";
import { UsageMeter } from "@/components/marketing/usage-meter";
import { AppPreview } from "@/components/marketing/app-preview";
import { Reveal } from "@/components/marketing/reveal";
import { HeroAurora } from "@/components/marketing/hero-aurora";
import { features, foundingOffer, siteConfig } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <PreviewBanner />
      <SiteHeader />

      <main id="main">
        {/* ---------------------------------------------------------- Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_srgb,var(--caramel)_12%,transparent),transparent_70%)]"
          />
          <HeroAurora />
          <Container className="py-20 sm:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <Reveal>
                <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  Email marketing that charges
                  <br className="hidden sm:block" /> for sends, not subscribers.
                </h1>
              </Reveal>

              <Reveal delay={90}>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  Your list can grow as large as you want. The price only moves
                  when you hit send.
                </p>
              </Reveal>

              <Reveal delay={180}>
                <div className="mt-9 flex justify-center">
                  <Button
                    size="lg"
                    className="group w-full sm:w-auto"
                    render={<a href={siteConfig.signupUrl} />}
                  >
                    Become a founding member
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={260}>
                <p className="mt-5 text-sm text-muted-foreground">
                  {foundingOffer.price} for your whole first year — 10,000 emails
                  a month.{" "}
                  <a
                    href={siteConfig.signupUrl}
                    className="font-medium text-foreground underline underline-offset-4 hover:text-caramel"
                  >
                    Or just sign up free
                  </a>
                  .
                </p>
              </Reveal>
            </div>

            {/* Product preview */}
            <Reveal delay={200} className="mx-auto mt-16 max-w-4xl">
              <AppPreview />
            </Reveal>
          </Container>
        </section>

        {/* ----------------------------------------------- Founding offer */}
        <section
          id="founding"
          className="scroll-mt-20 border-t border-border bg-oat/30"
        >
          <Container className="py-20 sm:py-24">
            <Reveal className="mx-auto max-w-4xl">
              <FoundingOffer />
            </Reveal>
          </Container>
        </section>

        {/* ------------------------------------------------------- Pricing */}
        <section id="pricing" className="scroll-mt-20 border-t border-border">
          <Container className="py-20 sm:py-24">
            <Reveal>
              <SectionHeading
                align="center"
                title="What it'll cost at launch"
                description="Three plans, set by how many emails go out each month. Every one comes with unlimited subscribers. Sign up now and founding members start the 10,000-email plan at $36 for the first year."
              />
            </Reveal>
            <Reveal delay={120} className="mt-12">
              <PricingCards />
            </Reveal>
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
              <Reveal>
                <SectionHeading
                  title="Unlimited subscribers, capped by sends"
                  description="Most tools charge you more as your list grows. day3 charges for emails sent. The list can grow as large as you like — the meter only moves when you hit send."
                />
                <ul className="mt-8 space-y-4">
                  <li className="flex gap-3">
                    <InfinityIcon className="mt-0.5 size-5 shrink-0 text-caramel" />
                    <span className="text-foreground">
                      <span className="font-medium">Import any list.</span>{" "}
                      <span className="text-muted-foreground">
                        200 contacts or 200,000 — the price is the same.
                      </span>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Gauge className="mt-0.5 size-5 shrink-0 text-caramel" />
                    <span className="text-foreground">
                      <span className="font-medium">One monthly cap.</span>{" "}
                      <span className="text-muted-foreground">
                        Watch it fill as you send, and top up if you run out
                        before the month does.
                      </span>
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <MailCheck className="mt-0.5 size-5 shrink-0 text-caramel" />
                    <span className="text-foreground">
                      <span className="font-medium">Know it upfront.</span>{" "}
                      <span className="text-muted-foreground">
                        The cost is the plan price. There isn&apos;t a second
                        number waiting at the end of the month.
                      </span>
                    </span>
                  </li>
                </ul>
              </Reveal>

              <Reveal delay={120} className="lg:pl-6">
                <UsageMeter />
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ------------------------------------------------------ Features */}
        <section
          id="features"
          className="scroll-mt-20 border-t border-border bg-oat/30"
        >
          <Container className="py-20 sm:py-24">
            <Reveal>
              <SectionHeading
                title="What you get"
                description="The parts you need to send a good email. Not the parts that come with a manual."
              />
            </Reveal>
            <Reveal delay={120} className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group flex flex-col bg-card p-6 transition-colors duration-200 hover:bg-secondary/40"
                  >
                    <Icon className="size-5 text-caramel transition-transform duration-200 group-hover:scale-110" />
                    <h3 className="mt-4 font-medium text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </Reveal>
          </Container>
        </section>

        {/* ----------------------------------------------------- Final CTA */}
        <section className="border-t border-border">
          <Container className="py-20 sm:py-28">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
                Get in before we launch.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-lg text-muted-foreground">
                Sign up now to be first through the door. Founding members lock
                in a full year — 120,000 emails — for {foundingOffer.price}.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="group w-full sm:w-auto"
                  render={<a href={siteConfig.signupUrl} />}
                >
                  Become a founding member
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
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
            </Reveal>
          </Container>
        </section>

        <Separator />
      </main>

      <SiteFooter />
    </>
  );
}
