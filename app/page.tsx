import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Code2,
  PenLine,
  Send,
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
import { Reveal } from "@/components/marketing/reveal";
import { HeroVideo } from "@/components/marketing/hero-video";
import { ComposerShot } from "@/components/marketing/composer-shot";
import { Provenance } from "@/components/marketing/provenance";
import { ApiProof } from "@/components/marketing/api-proof";
import { McpProof } from "@/components/marketing/mcp-proof";
import { SubscribeButton } from "@/components/marketing/subscribe-button";
import { PanelBuildMode } from "@/components/marketing/panel-build-mode";
import { PanelDnsSync } from "@/components/marketing/panel-dns-sync";
import { PanelSending } from "@/components/marketing/panel-sending";
import { PanelActivity } from "@/components/marketing/panel-activity";
import {
  JsonLd,
  faqSchema,
  organizationSchema,
  softwareApplicationSchema,
  websiteSchema,
} from "@/components/seo/json-ld";
import { cheapestTierFor, pricingTiers, siteConfig } from "@/lib/site";
import { audiencePages } from "@/lib/audience-content";

/*
  Title and description come from the root layout's defaults, which the homepage
  owns. Only the canonical is declared here: the root layout deliberately no
  longer sets `alternates`, because a canonical on a layout is inherited by every
  descendant that doesn't override it.
*/
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * The hero loop. Pale watercolour study, high-key on purpose so ~58% of the
 * frame sits within a hair of `--background` and the video dissolves into the
 * page rather than sitting in a box. `scene` is not rendered. It records what
 * the loop shows, so the picture and the headline stay in step.
 */
const hero = {
  video: "hero-aqueduct-weir",
  scene:
    "The aqueduct still stands and the water still runs over the weir beneath it, unattended.",
  /*
    Two lines on purpose: the break falls after "for", so the audience lands
    alone on line two and carries the weight. Defined by the act rather than
    the job title. This segment ships software and stores, but doesn't write
    code for a living, so "developers" would send the wrong people away.
  */
  title: ["Email for", "the people who ship"],
  /*
    "The sane way" is load-bearing: it's the anti-marketing-suite promise, and
    the four nouns after it are what widen the audience from "teams with a
    newsletter" to every developer already paying something to send mail. Both
    jobs named, because they're one setup: the receipt and the changelog leave
    the same verified domain.
  */
  body: "The sane way to send everything your product emails: updates, changelogs, receipts, resets.",
  grain: 20,
};

/**
 * The three price facts that do the disrupting, read straight off the pricing
 * ladder so the hero can never quote a number the pricing section contradicts.
 * Stated bare, with no "only" and no "just", because the figures are startling enough
 * on their own and an adjective would make them sound like a promotion.
 */
const entryTier = pricingTiers[0];
const popularTier = pricingTiers.find((t) => t.popular) ?? entryTier;

const priceFacts = [
  /*
    "to reach your list" rather than "to send", because the free tier sends
    too, in sandbox, so "to send" would now be the wrong line. The label has to name
    what the dollar actually buys or it contradicts the button beside it.
  */
  { value: `${entryTier.price}/mo`, label: "to reach your list" },
  { value: `${popularTier.price}/mo`, label: `for ${popularTier.emails} emails` },
  { value: "Unlimited", label: "subscribers, every plan" },
];

/**
 * The four things that actually stand between shipping and telling users, each
 * paired with the part of day3 that removes it.
 *
 * `pain` is quoted verbatim from how people describe it, which is why the
 * grammar is loose. It's someone talking, not a headline. The panel beside it
 * animates the fix rather than screenshotting it: the page argues the problem
 * is gone, so it has to show the problem going.
 */
const painBlocks = [
  {
    pain: "I need the whole thing set up before I know if I'll use it.",
    title: "Try the whole thing before you pay.",
    body: "Domains, senders, audiences, forms, drafts, and 100 real sends a month to your own team. Reaching everyone else starts at $1/month.",
    Panel: PanelBuildMode,
  },
  {
    pain: "DNS records are not my job.",
    title: "Connect Cloudflare. We write the records.",
    body: "DKIM, SPF and DMARC published for you, then rechecked until the domain verifies. No pasting TXT records into a registry at midnight.",
    Panel: PanelDnsSync,
  },
  {
    pain: "I don't want to sit and watch a send.",
    title: "Hit send and walk away.",
    body: "Delivery goes out in batches with a hard monthly cap and no duplicates if a job retries. A rate limit pauses the send and resumes it on its own.",
    Panel: PanelSending,
  },
  {
    pain: "Did jane@ actually get it?",
    title: "Every email, accounted for.",
    body: "Delivered, opened, clicked, bounced, all searchable per person. Bad addresses suppress themselves, so one dead list doesn't cost you the inbox.",
    Panel: PanelActivity,
  },
];

/**
 * What the price means next to the tools a reader already knows.
 *
 * Model-level only, never a competitor's dollar figure. Their prices change
 * without telling us and a stale one reads as a lie, which costs more trust than
 * the comparison earns. The pricing *model* is durable, verifiable, and happens
 * to be the whole argument anyway.
 */
const priceComparisons: {
  name: string;
  model: string;
  body: string;
  /** The comparison page for this row, where one exists. */
  href?: string;
}[] = [
  {
    name: "Mailchimp, Kit, beehiiv",
    model: "Priced by contacts",
    body: "The bill climbs as you grow, and arrives in the months you send nothing.",
    href: "/compare/mailchimp-alternative",
  },
  {
    name: "Resend",
    model: "Priced by sends, dev-first",
    body: "Closest to day3 on the meter. day3 adds the campaign side: audiences, forms, topics, compliance.",
    href: "/compare/resend-alternative",
  },
  {
    name: "day3",
    model: "Priced by emails sent",
    body: `${popularTier.emails} emails is ${popularTier.price}, at 500 subscribers or 50,000.`,
  },
];

/**
 * The objections that decide it, answered on the page rather than one click
 * away on /pricing. Doubles as FAQPage structured data. These are the exact
 * questions an AI answer engine gets asked about a tool like this, and it can
 * only quote answers it can see.
 */
const faqs = [
  {
    q: "Can I try it properly before paying?",
    a: "Yes, all of it. A free account verifies a domain, imports a list, and sends for real: 100 emails a month to your own team, same pipeline, same tracking. What $1 buys is reaching everyone else.",
  },
  {
    q: "Do I have to leave my current tool to try day3?",
    a: "No. Import a copy of your list, send one update, and compare. Nothing here asks for exclusivity.",
  },
  {
    q: "Can I bring the people who unsubscribed?",
    a: "Yes. Import contacts already marked unsubscribed, and your suppression list outright, so nobody who opted out of your old tool hears from your new one.",
  },
  {
    q: "Is $1/month sustainable, or a launch price?",
    a: "Real price. Delivery costs about $0.10 per 1,000 emails, so the cheap tiers are priced against card fees, not against email. Every tier pays for itself as it stands.",
  },
  {
    q: "What happens if I stop paying?",
    a: "You drop to the free tier and keep everything: audiences, domains, drafts, history. It all comes back out as CSV or JSON.",
  },
  {
    q: "I only email a few times a year. Worth it?",
    a: "Probably, since the list costs nothing in between. Plans don't roll over, so pick the tier that covers the send you actually make and move down whenever.",
  },
  {
    q: "Who is day3 the wrong tool for?",
    a: "Marketing teams running funnels and agencies managing client accounts. No A/B testing, no CRM, no landing pages. If you need a marketing platform, buy a marketing platform.",
  },
];

/**
 * Six, not four. Transactional email and the API earned cards of their own the
 * moment they became things day3 leads with, and a reader scanning this grid
 * should not have to reach the hero's fine print to find them. One line each: a
 * grid people scan is a grid that answers "is my job in here", nothing more.
 */
const coreFeatures = [
  {
    title: "Write clean updates",
    description: "Changelogs and launch notes in a focused composer.",
    icon: PenLine,
  },
  {
    title: "Grow your audience",
    description: "Import contacts; publish forms as pages, embeds, or popups.",
    icon: Users,
  },
  {
    title: "Transactional email",
    description: "Password resets and receipts, one API call, same domain.",
    icon: Send,
  },
  {
    title: "Send with confidence",
    description: "Verified domains, automatic bounce and complaint handling.",
    icon: ShieldCheck,
  },
  {
    title: "Know what happened",
    description: "Delivered, opened, clicked. Per campaign and per person.",
    icon: BarChart3,
  },
  {
    title: "API and MCP",
    description: "Manage lists from code. Draft campaigns in your editor.",
    icon: Code2,
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={softwareApplicationSchema()} />
      <JsonLd data={faqSchema(faqs)} />

      <SiteHeader />

      <main id="main">
        {/* ---------------------------------------------------------- Hero */}
        <section className="relative overflow-hidden">
          <HeroVideo name={hero.video} scene={hero.scene} grain={hero.grain} />
          {/*
            Fills exactly one viewport. The header is `sticky` (not fixed) so it
            occupies layout space above this, hence subtracting its h-16.
            `svh` rather than `vh` so mobile browser chrome doesn't push the
            bottom of the artwork off-screen, and rather than `dvh` so the hero
            doesn't resize while the toolbar hides on scroll.

            The loop is pinned to the bottom at its own aspect ratio, so its
            height tracks viewport width (≈0.55 × width). Top padding is in
            `svh` so the copy keeps its proportion of the frame instead of
            drifting into the artwork on short viewports.

            Held under 10svh: the risk line and the price row below the buttons
            cost about two lines between them, and the padding has to give that
            back or the row lands in the water on a laptop.
          */}
          <Container className="flex min-h-[calc(100svh-4rem)] flex-col justify-start pt-[9svh] pb-16">
            <div className="mx-auto max-w-3xl text-center">
              <Reveal>
                <h1 className="font-display text-4xl leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                  {hero.title[0]}
                  <br className="hidden sm:block" /> {hero.title[1]}
                </h1>
              </Reveal>

              <Reveal delay={90}>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  {hero.body}
                </p>
              </Reveal>

              <Reveal delay={180}>
                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    className="group w-full sm:w-auto"
                    render={<a href={siteConfig.signupUrl} />}
                  >
                    Start free
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

              <Reveal delay={220}>
                {/*
                  What it costs to find out. The price row below carries the
                  rest, so this stays to one clause.
                */}
                <p className="mt-4 text-sm text-muted-foreground">
                  No credit card. Sends to your own team are free.
                </p>
              </Reveal>

              <Reveal delay={260}>
                {/*
                  Price sits above the fold because it's the disrupter, but as a
                  quiet row of facts rather than a badge. The numbers carry the
                  argument, so shouting them would undercut it. Hairline rules
                  between items on `sm+` only; they'd fight the wrap on mobile,
                  where the facts stack.
                */}
                <ul className="mt-6 flex flex-col items-center justify-center gap-y-1.5 text-sm sm:flex-row sm:flex-wrap sm:gap-x-5">
                  {priceFacts.map((fact) => (
                    <li
                      key={fact.label}
                      className="flex items-baseline gap-1.5 sm:border-l sm:border-border sm:pl-5 sm:first:border-l-0 sm:first:pl-0"
                    >
                      <span className="font-medium text-foreground tabular-nums">
                        {fact.value}
                      </span>
                      <span className="text-muted-foreground">
                        {fact.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>

            </div>
          </Container>
        </section>

        {/*
          -------------------------------------------------- Product & proof
          The evidence, before the argument. Renders nothing until the composer
          asset lands (see composer-shot.tsx); the provenance strip stands on its
          own either way.
        */}
        <ComposerShot />
        <Provenance />

        {/* --------------------------------------------------------- Pains */}
        <section id="pains" className="scroll-mt-20 border-t border-border bg-oat/30">
          <Container className="py-20 sm:py-24">
            <Reveal>
              <SectionHeading
                align="center"
                title="For the moment after you ship."
                description="The product is live. Everything between you and telling users, removed."
              />
            </Reveal>

            {/*
              Alternating sides on `lg`, stacked everywhere else. The panel is
              ordered first in the DOM on the flipped rows only visually. On
              mobile the copy always leads, because a panel with no sentence
              above it is a puzzle.
            */}
            <div className="mt-16 space-y-20 sm:space-y-24">
              {painBlocks.map((block, index) => {
                const flipped = index % 2 === 1;
                return (
                  <Reveal
                    key={block.title}
                    className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
                  >
                    <div className={flipped ? "lg:order-2" : undefined}>
                      <p className="text-lg leading-relaxed text-muted-foreground">
                        “{block.pain}”
                      </p>
                      <h3 className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-4xl">
                        {block.title}
                      </h3>
                      <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
                        {block.body}
                      </p>
                    </div>

                    <block.Panel />
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ------------------------------------------------------ Features */}
        <section id="features" className="scroll-mt-20 border-t border-border">
          <Container className="py-20 sm:py-24">
            <Reveal>
              <SectionHeading title="The parts you need. Not the parts you'll avoid." />
            </Reveal>
            <Reveal delay={120} className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
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
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </Reveal>

            {/*
              Labelled, not teased. Saying "in development" costs nothing and
              buys the reader's trust in every other claim on the page. And the
              people who need automation now can go and buy it elsewhere instead
              of signing up and discovering the gap.
            */}
            <Reveal delay={200}>
              <p className="mt-6 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Automations</span>{" "}
                are in development: triggers, waits, and branches. Everything
                else on this page ships today.
              </p>
            </Reveal>
          </Container>
        </section>

        {/*
          ------------------------------------------------------------- Fit
          The one section on this page that says what day3 *is* in the words a
          reader would search for. The hero deliberately doesn't: "Email for the
          people who ship" is doing conversion work and naming a category would
          blunt it. But the page had zero visible instances of "email marketing"
          or "transactional email", while the title tag bid on both, so the terms
          had to appear in the body somewhere. Here, where they're also true.

          It doubles as the homepage's only link into /for, which was reachable
          from the nav and footer and nothing else.
        */}
        <section id="fit" className="scroll-mt-20 border-t border-border">
          <Container className="py-20 sm:py-24">
            <Reveal>
              <SectionHeading
                align="center"
                title="Email marketing and transactional email, in one tool."
                description="Product updates, changelogs, receipts, password resets. One verified domain, one monthly allowance, unlimited subscribers on every plan."
              />
            </Reveal>

            <Reveal delay={120} className="mt-12 grid gap-5 md:grid-cols-3">
              {audiencePages.map((page) => {
                const Icon = page.icon;
                return (
                  <Link
                    key={page.slug}
                    href={`/for/${page.slug}`}
                    className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors duration-200 hover:border-caramel/40 hover:bg-secondary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon className="size-5 text-caramel transition-transform duration-200 group-hover:scale-110" />
                    <h3 className="mt-4 font-medium text-foreground">
                      {page.navLabel}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {page.summary}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-caramel">
                      See the fit
                      <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                );
              })}
            </Reveal>
          </Container>
        </section>

        {/* ----------------------------------------------------- API and MCP */}
        <ApiProof />
        <McpProof />

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
                    Sandbox / Free
                  </p>
                  <div className="mt-2 font-display text-4xl text-foreground">
                    $0<span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </div>
                  <p className="mt-4 font-medium text-foreground">
                    Try the whole thing for real.
                  </p>
                  <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-caramel" />
                      Set up domains, senders, audiences, forms, and drafts
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-caramel" />
                      100 real sends a month, to your own team
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
              Every plan: unlimited subscribers, the AI assistant, the API, and a
              hard monthly cap. No surprise bills.
            </p>

            {/*
              The number needs something to push against. Nobody carries a
              competitor's price list in their head, so $5 for 10,000 emails is
              only startling once you can see what the alternative bills you for.
              Stated as models, never as their dollar figures. A competitor's
              price changes without telling us, and a stale one reads as a lie.
              (Same policy as the /compare pages; see compare-content.ts.)
            */}
            <Reveal delay={180} className="mt-14">
              <h3 className="text-center font-display text-2xl text-foreground sm:text-3xl">
                What that means next to the tools you know
              </h3>
              <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
                {priceComparisons.map((item) => (
                  <div key={item.name} className="flex flex-col bg-card p-6">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="mt-1 text-sm font-medium text-caramel">
                      {item.model}
                    </p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                    {/*
                      The comparison pages were reachable only from the nav and
                      footer, which is a poor way to tell a crawler that the
                      homepage vouches for them. Here the link is also just useful:
                      the reader is looking at the model they're on.
                    */}
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline underline-offset-4 hover:text-caramel"
                      >
                        The full comparison
                        <ArrowRight className="size-3.5" />
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
              <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
                10,000 users, emailed twice a month, is{" "}
                <span className="font-medium text-foreground">
                  {cheapestTierFor(20_000).price}/mo
                </span>
                . Per-contact pricing bills you for all 10,000, every month.
              </p>
            </Reveal>
          </Container>
        </section>

        {/* ----------------------------------------------------- Objections */}
        <section id="questions" className="scroll-mt-20 border-t border-border">
          <Container className="py-20 sm:py-24">
            <div className="mx-auto max-w-3xl">
              <Reveal>
                <SectionHeading title="The things you're actually weighing." />
              </Reveal>
              <Reveal delay={120}>
                <dl className="mt-10 divide-y divide-border border-t border-border">
                  {faqs.map((faq) => (
                    <div
                      key={faq.q}
                      className="grid gap-2 py-6 sm:grid-cols-[1fr_1.4fr] sm:gap-8"
                    >
                      <dt className="font-medium text-foreground">{faq.q}</dt>
                      <dd className="leading-relaxed text-muted-foreground">
                        {faq.a}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
              {/*
                The one exit from this page toward the guides. Deliverability and
                authentication are the questions that come after the pricing
                ones, and they have real pages now.
              */}
              <Reveal delay={180}>
                <p className="mt-10 border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">
                  Working out authentication, unsubscribe compliance, or whether
                  to move a list?{" "}
                  <Link
                    href="/blog"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-caramel"
                  >
                    We write about all of it
                  </Link>
                  .
                </p>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ----------------------------------------------------- Final CTA */}
        <section className="border-t border-border">
          <Container className="py-20 sm:py-28">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
                Send your first one for free.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-lg text-muted-foreground">
                Domain, list, first campaign, real send to your own team. All on
                the free tier.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="group w-full sm:w-auto"
                  render={<a href={siteConfig.signupUrl} />}
                >
                  Start free
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
              <p className="mt-5 text-sm text-muted-foreground">
                No credit card. Cancel anytime.
              </p>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
                For permission-based product updates only. Cold outreach and
                purchased lists get paused. It keeps deliverability good for
                everyone.
              </p>

              {/*
                Setup needs DNS access, which nobody has on a phone at 11pm. The
                one exit for a reader who fits but can't act right now. It's day3's
                own signup form, so the ask is the thing the product does.
              */}
              <p className="mt-10 border-t border-border pt-8 text-sm text-muted-foreground">
                Can&apos;t edit DNS right now?{" "}
                <SubscribeButton
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-sm font-medium text-foreground underline underline-offset-4 hover:text-caramel"
                >
                  Get our updates
                </SubscribeButton>{" "}
                and come back to it.
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
