import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Code2,
  PenLine,
  Repeat,
  Send,
  ShieldCheck,
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
import { Provenance } from "@/components/marketing/provenance";
import { ApiProof } from "@/components/marketing/api-proof";
import { McpProof } from "@/components/marketing/mcp-proof";
import { SubscribeButton } from "@/components/marketing/subscribe-button";
import { PanelBuildMode } from "@/components/marketing/panel-build-mode";
import { PanelDnsSync } from "@/components/marketing/panel-dns-sync";
import { PanelSending } from "@/components/marketing/panel-sending";
import { PanelActivity } from "@/components/marketing/panel-activity";
import { buildMetadata } from "@/lib/seo";
import { cheapestTierFor, pricingTiers, siteConfig } from "@/lib/site";
import { audiencePages } from "@/lib/audience-content";

/*
  ============================================================================
  Paid-ads landing page. Not a search page.
  ============================================================================

  The traffic source is kickbacks.ai, which serves ads inside the editor, so
  every visitor arrived from the line "Need email API? $1/mo" while they had a
  file open. That single fact sets everything below:

   - the hero answers the ad rather than introducing day3, because the reader
     already accepted the pitch and is here to check whether it's true;
   - real HTTP appears immediately after the hero instead of two thirds down
     the page, since the reader's question is "what does the call look like",
     not "who is this for";
   - the campaign side is still on the page, but as the thing you also get,
     which is the honest ordering for someone who came for a send API.

  It's `noindex, follow` on purpose. Structurally this is the homepage with a
  different target, and letting a near-duplicate compete with `/` and
  `/features/api` for "transactional email API" would cost more organic traffic
  than the page could ever earn. Ad pages also get rewritten on a whim, and
  nothing that changes weekly should carry search rankings. That also means no
  JSON-LD here: structured data on a noindex page is ignored, and the homepage
  already owns the Organization / WebSite / SoftwareApplication entities.
  It is deliberately absent from app/sitemap.ts and from the nav for the same
  reason.
*/
export const metadata: Metadata = {
  ...buildMetadata({
    title: "Email API from $1/mo",
    description:
      "A transactional email API priced by sends. One POST for password resets, receipts and magic links, from the same verified domain as your product updates. Plans start at $1/mo.",
    path: "/email-api",
    ogEyebrow: "Email API",
    ogTitle: "An email API, for $1 a month",
  }),
  robots: { index: false, follow: true },
};

/**
 * Every outbound signup link on this page carries the campaign, so a conversion
 * in the app can be traced back to the ad rather than landing in direct traffic.
 * GA on this site can't see it (go.day3.app is a different origin), which is
 * exactly why the parameters have to travel on the URL.
 */
const signupUrl = `${siteConfig.signupUrl}?utm_source=kickbacks&utm_medium=ide-ad&utm_campaign=email-api`;

/*
  Same clip as the homepage, same reasoning: high-key enough that most of the
  frame sits within a hair of `--background`, so the video dissolves into the
  page instead of sitting in a box.
*/
const hero = {
  video: "hero-aqueduct-weir",
  scene:
    "The aqueduct still stands and the water still runs over the weir beneath it, unattended.",
  grain: 20,
};

const entryTier = pricingTiers[0];
const popularTier = pricingTiers.find((t) => t.popular) ?? entryTier;

/*
  The headline is the ad, finished. Both halves stay under twenty characters so
  they hold at `lg:text-7xl`, and the break falls on the comma so the price
  lands alone on line two carrying the weight, the same device the homepage uses
  for its audience.

  The figure is read off the ladder rather than typed, so the hero can never
  quote a price the pricing section below it contradicts.
*/
const heroTitle = ["An email API,", `for ${entryTier.price} a month.`];

/**
 * The three facts the ad's price claim has to survive. Two prices and the thing
 * that removes the risk of checking, because "is this real" and "do I have to
 * pay to find out" are the same hesitation wearing two hats.
 */
const priceFacts = [
  { value: `${entryTier.price}/mo`, label: `for ${entryTier.emails} emails` },
  // The second label drops the noun the first one established, so the row reads
  // as one sentence of facts instead of stuttering "emails" three times.
  { value: `${popularTier.price}/mo`, label: `for ${popularTier.emails}` },
  { value: "Free", label: "to build the integration" },
];

/**
 * The four things that stand between a developer and shipping the email their
 * app owes a user, each paired with the part of day3 that removes it.
 *
 * `pain` is quoted the way people say it, which is why the grammar is loose.
 * The panels are the homepage's, unchanged: the copy is written to what each one
 * actually shows, so nothing here promises motion the panel doesn't perform.
 */
const painBlocks = [
  {
    pain: "I'm not putting a card in to find out if it works.",
    title: "Build the whole integration first.",
    body: "The full REST API on the free tier, transactional sends included, plus 100 real sends a month to your own team. Reaching everyone else starts at $1/month.",
    Panel: PanelBuildMode,
  },
  {
    pain: "DNS is the part that eats the afternoon.",
    title: "Connect Cloudflare. We write the records.",
    body: "DKIM, SPF and DMARC published for you, then rechecked until the domain verifies. No pasting TXT records into a registrar at midnight.",
    Panel: PanelDnsSync,
  },
  {
    pain: "Our resets and our launch notes run on two different vendors.",
    title: "One domain does both jobs.",
    body: "Transactional and campaigns leave the same verified domain against the same monthly allowance. One reputation to keep clean, one place to look when something doesn't arrive.",
    Panel: PanelSending,
  },
  {
    pain: "Did jane@ actually get the reset?",
    title: "Every email, per address.",
    body: "queued, sent, delivered, or the bounce that explains why not. Searchable per person, and bad addresses suppress themselves before they cost you the inbox.",
    Panel: PanelActivity,
  },
];

/**
 * What send-based pricing means next to the tools this reader already knows.
 * Resend leads, because it's the one a developer is actually holding up against
 * this page.
 *
 * Model-level only, never a competitor's dollar figure. Their prices change
 * without telling us and a stale one reads as a lie, which costs more trust
 * than the comparison earns.
 */
const priceComparisons: {
  name: string;
  model: string;
  body: string;
  /** The comparison page for this row, where one exists. */
  href?: string;
}[] = [
  {
    name: "Resend",
    model: "Priced by sends, dev-first",
    body: "Closest to day3 on the meter. day3 adds the list layer: audiences, segments, forms, compliance.",
    href: "/compare/resend-alternative",
  },
  {
    name: "Mailchimp, Kit, beehiiv",
    model: "Priced by contacts",
    body: "The bill climbs as your user table grows, and arrives in the months you send nothing.",
    href: "/compare/mailchimp-alternative",
  },
  {
    name: "day3",
    model: "Priced by emails sent",
    body: `${popularTier.emails} emails is ${popularTier.price}, at 500 users or 50,000.`,
  },
];

/**
 * Six cards, ordered for someone who came for a send endpoint: the API first,
 * the campaign side last. One line each. A grid people scan is a grid that
 * answers "is my job in here", nothing more.
 */
const coreFeatures = [
  {
    title: "Transactional email",
    description: "POST /v1/emails. Resets, receipts, magic links.",
    icon: Send,
  },
  {
    title: "REST API and MCP",
    description: "Contacts, audiences, segments, campaigns. One bearer key.",
    icon: Code2,
  },
  {
    title: "Retry-safe by default",
    description: "An Idempotency-Key resolves to exactly one email.",
    icon: Repeat,
  },
  {
    title: "Domains that verify themselves",
    description: "DKIM, SPF and DMARC written for you, bounces suppressed.",
    icon: ShieldCheck,
  },
  {
    title: "Status you can query",
    description: "Per email and per address, campaign or transactional.",
    icon: BarChart3,
  },
  {
    title: "The campaign side too",
    description: "Audiences, forms, topics, and a composer for the changelog.",
    icon: PenLine,
  },
];

/**
 * The objections that decide it for a developer, answered on the page rather
 * than one click away. The wrong-fit answer stays in: telling someone their
 * React Email templates don't come across costs one signup and buys the
 * credibility of every other claim here.
 */
const faqs = [
  {
    q: "Is $1/month real, or a launch price?",
    a: "Real price. Delivery costs about $0.10 per 1,000 emails, so the cheap tiers are priced against card fees, not against email. Every tier pays for itself as it stands.",
  },
  {
    q: "Can I use the API on the free tier?",
    a: "Yes, all of it, transactional sending included. Sends are sandboxed to your own org members and the 500-subscriber cap applies to API writes too, so you can integrate end to end before paying anything.",
  },
  {
    q: "What stops a retry from sending twice?",
    a: "An Idempotency-Key. Send one with the call and it resolves to exactly one email, even when the retry races its own first attempt. That's the difference between a reset flow you can trust under load and one that occasionally double-sends.",
  },
  {
    q: "Can transactional and marketing email share one domain?",
    a: "Yes, and that's the point. Both leave the same verified domain against the same monthly allowance, so a month of 18,000 resets and 2,000 launch notes is just a 20,000-email month. Unsubscribes apply to campaigns only, because leaving the newsletter shouldn't stop a receipt. Hard bounces and complaints are refused for both.",
  },
  {
    q: "How do I know an email arrived?",
    a: "POST /v1/emails returns an id you can poll: queued, sent, delivered, or the bounce that explains why not. The same events are searchable per address in the app, so support can answer without asking you.",
  },
  {
    q: "How much work is moving off my current provider?",
    a: "Three calls. Push your suppression list first so nothing re-mails the people who already opted out, then batch contacts 1,000 per call with per-row results, then import the unsubscribes with the date they left on. It's a script, not a project.",
  },
  {
    q: "Who is day3 the wrong tool for?",
    a: "Anyone who needs lifecycle automation today: triggers, waits and branches are designed but not shipped. Teams whose templates live as React Email components in the repo, since those get rebuilt in the composer rather than imported. And marketing teams wanting A/B tests, funnels or landing pages. If you need a marketing platform, buy a marketing platform.",
  },
];

export default function EmailApiLandingPage() {
  return (
    <>
      <SiteHeader />

      <main id="main">
        {/* ---------------------------------------------------------- Hero */}
        <section className="relative overflow-hidden">
          <HeroVideo name={hero.video} scene={hero.scene} grain={hero.grain} />
          {/*
            Fills exactly one viewport, minus the sticky header's h-16. Same
            measurements as the homepage hero, and for the same reasons: `svh`
            so mobile chrome doesn't push the artwork off-screen, and top
            padding in `svh` so the copy keeps its proportion of the frame
            rather than drifting into the water on a laptop.
          */}
          <Container className="flex min-h-[calc(100svh-4rem)] flex-col justify-start pt-[9svh] pb-16">
            <div className="mx-auto max-w-3xl text-center">
              <Reveal>
                <h1 className="font-display text-4xl leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                  {heroTitle[0]}
                  <br className="hidden sm:block" /> {heroTitle[1]}
                </h1>
              </Reveal>

              <Reveal delay={90}>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  One POST for password resets, receipts and magic links. Same
                  verified domain, same allowance as your product updates.
                </p>
              </Reveal>

              <Reveal delay={180}>
                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    className="group w-full sm:w-auto"
                    render={<a href={signupUrl} />}
                  >
                    Start free
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Button>
                  {/*
                    The second button goes to the code, not to pricing. This
                    reader already knows the price; the ad told them. What they
                    haven't seen is the call.
                  */}
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                    render={<Link href="#api" />}
                  >
                    See the API
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={220}>
                <p className="mt-4 text-sm text-muted-foreground">
                  No credit card. Sends to your own team are free.
                </p>
              </Reveal>

              <Reveal delay={260}>
                {/*
                  The ad promised a number, so the number is substantiated above
                  the fold, as a quiet row of facts rather than a badge. Hairline
                  rules between items on `sm+` only; they'd fight the wrap on
                  mobile, where the facts stack.
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
                      <span className="text-muted-foreground">{fact.label}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </section>

        {/*
          A brand-new name quoting $1 reads as a toy until something says
          otherwise, and a low price makes that louder rather than quieter. Two
          facts, one bar, directly under the pitch.
        */}
        <Provenance />

        {/*
          --------------------------------------------------- API, then MCP
          Hoisted above everything else, which is the one real structural
          departure from the homepage. The reader came from an ad for an email
          API; the fastest way to keep them is to show the request. MCP follows
          immediately because the ad was served inside their editor, so "your
          editor is a composer" lands on a reader who is, right now, in one.
        */}
        <ApiProof />
        <McpProof />

        {/* --------------------------------------------------------- Pains */}
        <section id="pains" className="scroll-mt-20 border-t border-border">
          <Container className="py-20 sm:py-24">
            <Reveal>
              <SectionHeading
                align="center"
                title="The parts nobody wants to build."
                description="Sending an email is one call. Everything around it is the reason this takes a week."
              />
            </Reveal>

            {/*
              Alternating sides on `lg`, stacked everywhere else. On mobile the
              copy always leads, because a panel with no sentence above it is a
              puzzle.
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
        <section id="features" className="scroll-mt-20 border-t border-border bg-oat/30">
          <Container className="py-20 sm:py-24">
            <Reveal>
              <SectionHeading title="What the $1 actually includes." />
            </Reveal>
            <Reveal
              delay={120}
              className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3"
            >
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
              buys the reader's trust in every other claim on the page.
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

        {/* ----------------------------------------------------------- Fit */}
        <section id="fit" className="scroll-mt-20 border-t border-border">
          <Container className="py-20 sm:py-24">
            <Reveal>
              <SectionHeading
                align="center"
                title="One API for both kinds of email."
                description="Password resets, receipts and magic links on one side. Changelogs and launch notes on the other. One verified domain, one monthly allowance, unlimited subscribers on every plan."
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

        {/* ------------------------------------------------------- Pricing */}
        <section id="pricing" className="scroll-mt-20 border-t border-border bg-oat/30">
          <Container className="py-20 sm:py-24">
            <Reveal>
              <SectionHeading
                align="center"
                title="One allowance, both jobs."
                description="Resets, receipts and the launch note all draw on the same monthly number. Your user table isn't metered."
              />
            </Reveal>
            {/*
              `min-w-0` on the items is load-bearing, not tidiness. A grid item's
              automatic minimum size is its min-content width, and the pricing
              carousel's min-content is the whole track of fixed-width cards.
            */}
            <div className="mt-12 grid gap-6 [&>*]:min-w-0 lg:grid-cols-[280px_1fr] lg:items-start">
              <Reveal>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <p className="text-sm font-medium text-muted-foreground">
                    Sandbox / Free
                  </p>
                  <div className="mt-2 font-display text-4xl text-foreground">
                    $0
                    <span className="text-sm font-normal text-muted-foreground">
                      /mo
                    </span>
                  </div>
                  <p className="mt-4 font-medium text-foreground">
                    Ship the integration before you pay.
                  </p>
                  <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-caramel" />
                      The full REST API and MCP server, transactional included
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
              Every plan: the full API, unlimited subscribers, and a hard monthly
              cap. No surprise bills.
            </p>

            {/*
              The number needs something to push against. Stated as models, never
              as their dollar figures: a competitor's price changes without
              telling us, and a stale one reads as a lie. (Same policy as the
              /compare pages; see compare-content.ts.)
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
              {/*
                The worked example is transactional-shaped on purpose: a month
                dominated by resets, with one campaign on top of it. Priced off
                the live ladder so the figure can't go stale in a sentence.
              */}
              <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
                18,000 password resets and 2,000 launch notes is a 20,000-email
                month:{" "}
                <span className="font-medium text-foreground">
                  {cheapestTierFor(20_000).price}/mo
                </span>
                . Split across two vendors it&apos;s two allowances, two DKIM
                setups, and two bills.
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
              <Reveal delay={180}>
                <p className="mt-10 border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">
                  Want the endpoint map, the migration playbook, and what the MCP
                  server exposes?{" "}
                  <Link
                    href="/features/api"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-caramel"
                  >
                    It&apos;s all on the API page
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
                Make your first call for free.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-lg text-muted-foreground">
                Verify a domain, mint a key, POST an email. All on the free tier,
                no card.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="group w-full sm:w-auto"
                  render={<a href={signupUrl} />}
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
                For your app&apos;s own mail and permission-based updates only. Cold
                outreach and purchased lists get paused. It keeps deliverability
                good for everyone.
              </p>

              {/*
                Setup needs DNS access, which nobody has while reading an ad in
                their editor on a locked-down work laptop. The one exit for a
                reader who fits but can't act right now, and it's day3's own
                signup form, so the ask is the thing the product does.
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
