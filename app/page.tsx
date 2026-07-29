import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  PenLine,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/marketing/container";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SectionHeading } from "@/components/marketing/section-heading";
import { PricingSlider } from "@/components/marketing/pricing-slider";
import { AppPreview } from "@/components/marketing/app-preview";
import { Reveal } from "@/components/marketing/reveal";
import { HeroAurora } from "@/components/marketing/hero-aurora";
import { ProductVideoTabs } from "@/components/marketing/product-video-tabs";
import {
  JsonLd,
  organizationSchema,
  softwareApplicationSchema,
} from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site";

const pains = [
  "I just shipped something, but now I need to tell users",
  "Mailchimp feels like too much",
  "I do not want to pay more because my list grew",
  "I do not want my emails branded by someone else",
  "I need this to be safe and compliant without becoming my new job",
];

const coreFeatures = [
  {
    title: "Write clean updates",
    description:
      "Updates, changelogs, and launch notes in a focused composer — subject lines, layouts, images, and test sends included.",
    icon: PenLine,
  },
  {
    title: "Grow your audience",
    description:
      "Import subscribers, add custom fields, and publish signup forms as pages, embeds, or popups.",
    icon: Users,
  },
  {
    title: "Send with confidence",
    description:
      "Verified domains, automatic bounce and complaint handling, and risk review — so your reputation stays intact.",
    icon: ShieldCheck,
  },
  {
    title: "Understand what happened",
    description:
      "See what was delivered, opened, clicked, and unsubscribed — per campaign and per person.",
    icon: BarChart3,
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={softwareApplicationSchema()} />

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
                <h1 className="font-display text-4xl leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                  Send product updates.
                  <br className="hidden sm:block" /> Not marketing campaigns.
                </h1>
              </Reveal>

              <Reveal delay={90}>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  For small teams who ship before they market. Start free, send
                  from $1/month.
                </p>
              </Reveal>

              <Reveal delay={180}>
                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    className="group w-full sm:w-auto"
                    render={<a href={siteConfig.signupUrl} />}
                  >
                    Start building for free
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                    render={<Link href="#pricing" />}
                  >
                    See pricing
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={260}>
                <p className="mt-5 text-sm text-muted-foreground">
                  Set everything up for free. Pay only when you&apos;re ready to
                  send.
                </p>
              </Reveal>
            </div>

            {/* Product preview */}
            <Reveal delay={200} className="mx-auto mt-16 max-w-4xl">
              <AppPreview />
            </Reveal>
          </Container>
        </section>

        {/* -------------------------------------------------- Product video */}
        <section id="product" className="scroll-mt-20 border-t border-border bg-oat/30">
          <Container className="py-20 sm:py-24">
            <Reveal>
              <SectionHeading
                align="center"
                title="Everything you need to tell users what changed."
                description="Write it, grow the list, send safely, see what happened. Nothing extra to learn."
              />
            </Reveal>
            <Reveal delay={120} className="mt-12">
              <ProductVideoTabs />
            </Reveal>
          </Container>
        </section>

        {/* --------------------------------------------------------- Pains */}
        <section id="pains" className="scroll-mt-20 border-t border-border">
          <Container className="py-20 sm:py-24">
            <Reveal>
              <SectionHeading
                title="For the moment after you ship."
                description="The product is live. Now users need to hear what changed."
              />
            </Reveal>
            <Reveal delay={120} className="mt-10 grid gap-3 md:grid-cols-2">
              {pains.map((pain) => (
                <div key={pain} className="rounded-xl border border-border bg-card p-5 text-lg text-foreground">
                  “{pain}”
                </div>
              ))}
            </Reveal>
          </Container>
        </section>

        {/* ------------------------------------------------------ Features */}
        <section
          id="features"
          className="scroll-mt-20 border-t border-border"
        >
          <Container className="py-20 sm:py-24">
            <Reveal>
              <SectionHeading
                title="The parts you need. Not the parts you'll avoid."
                description="Grouped around what you're doing, not a marketing-platform checklist."
              />
            </Reveal>
            <Reveal delay={120} className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {coreFeatures.map((feature) => {
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
                    <p
                      className="mt-2 text-sm leading-relaxed text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: feature.description }}
                    />
                  </div>
                );
              })}
            </Reveal>
          </Container>
        </section>

        {/* ------------------------------------------------------- Pricing */}
        <section id="pricing" className="scroll-mt-20 border-t border-border bg-oat/30">
          <Container className="py-20 sm:py-24">
            <Reveal>
              <SectionHeading
                align="center"
                title="Pricing that doesn't punish growth."
                description="No contact tax. Just pick how many emails you send each month."
              />
            </Reveal>
            <div className="mt-12 grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
              <Reveal>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <p className="text-sm font-medium text-muted-foreground">
                    Build mode / Free
                  </p>
                  <div className="mt-2 font-display text-4xl text-foreground">
                    $0<span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </div>
                  <p className="mt-4 font-medium text-foreground">
                    Build everything before you send.
                  </p>
                  <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-caramel" />
                      Set up domains, senders, audiences, forms, and drafts
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-caramel" />
                      No sending until you pick a paid plan
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-caramel" />
                      Up to 500 subscribers
                    </li>
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <PricingSlider />
              </Reveal>
            </div>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
              Free is for building. Paid is for sending — every plan includes
              unlimited subscribers, the AI writing assistant, and a hard monthly
              cap, so no surprise bills.
            </p>
          </Container>
        </section>

        {/* ----------------------------------------------------- Final CTA */}
        <section className="border-t border-border">
          <Container className="py-20 sm:py-28">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
                Start for free. Send from $1/month.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-lg text-muted-foreground">
                Set up your domain, audience, forms, and senders now. Upgrade
                when you&apos;re ready to send.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="group w-full sm:w-auto"
                  render={<a href={siteConfig.signupUrl} />}
                >
                  Start building for free
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
              <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
                For permission-based product updates only. Cold outreach and
                purchased lists get paused — it keeps deliverability good for
                everyone.
              </p>
            </Reveal>
          </Container>
        </section>

        <Separator />
      </main>

      <SiteFooter />
    </>
  );
}
