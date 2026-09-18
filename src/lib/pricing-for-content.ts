import { cheapestTierFor, pricingTiers, type PricingTier } from "@/lib/site";

/**
 * Source of truth for the programmatic /pricing/for/<n>-subscribers pages.
 *
 * These pages exist for one query shape: "newsletter pricing for 10,000
 * subscribers" and its siblings. The answer on day3 is arithmetic, so the page is
 * generated from arithmetic: a list size, a handful of sending cadences, and the
 * live ladder. Nothing here hardcodes a dollar figure, and nothing here prints a
 * competitor's price. The other model is described as a model, in line with the
 * accuracy policy in compare-content.ts.
 *
 * Adding a list size is one line in `listSizes`. Every size gets the same
 * template, the same FAQ shape, a sitemap entry and an llms.txt line.
 */

export const PRICING_FOR_UPDATED = "2026-09-18";

export type Cadence = {
  /** Short label, e.g. "Weekly". */
  label: string;
  /** Sends per subscriber per month. */
  sendsPerMonth: number;
  /** One clause describing the cadence. */
  note: string;
};

/**
 * The cadences a product-update or newsletter sender actually runs. Weekly is
 * rounded to four a month rather than 4.33 because the ladder is coarse enough
 * that the third decimal never changes the plan, and four is what people say.
 */
export const cadences: Cadence[] = [
  { label: "Monthly", sendsPerMonth: 1, note: "one update a month" },
  { label: "Twice a month", sendsPerMonth: 2, note: "every other week" },
  { label: "Weekly", sendsPerMonth: 4, note: "one issue a week" },
  { label: "Twice a week", sendsPerMonth: 9, note: "two issues a week" },
];

export const listSizes = [
  1_000, 2_500, 5_000, 10_000, 25_000, 50_000, 100_000, 250_000,
] as const;

export type ListSize = (typeof listSizes)[number];

const MAX_TIER = pricingTiers[pricingTiers.length - 1];

export type CadenceQuote = {
  cadence: Cadence;
  monthlyEmails: number;
  /** The cheapest plan that covers it, or null when it exceeds the ladder. */
  tier: PricingTier | null;
};

export function slugFor(subscribers: number): string {
  return `${subscribers}-subscribers`;
}

export function subscribersFromSlug(slug: string): ListSize | undefined {
  const match = /^(\d+)-subscribers$/.exec(slug);
  if (!match) return undefined;
  const n = Number(match[1]);
  return listSizes.find((size) => size === n);
}

export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

/** "10k", for titles where the full number reads heavy. */
export function shortCount(n: number): string {
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000) return `${n / 1_000}k`;
  return String(n);
}

export function quoteFor(subscribers: number, cadence: Cadence): CadenceQuote {
  const monthlyEmails = subscribers * cadence.sendsPerMonth;
  const tier =
    monthlyEmails > MAX_TIER.emailsValue ? null : cheapestTierFor(monthlyEmails);
  return { cadence, monthlyEmails, tier };
}

export function quotesFor(subscribers: number): CadenceQuote[] {
  return cadences.map((cadence) => quoteFor(subscribers, cadence));
}

/** The quote most readers came for. Weekly, unless it falls off the ladder. */
export function headlineQuote(subscribers: number): CadenceQuote {
  const quotes = quotesFor(subscribers);
  return quotes.find((q) => q.cadence.label === "Weekly" && q.tier) ?? quotes[0];
}

export type PricingForPage = {
  slug: string;
  subscribers: ListSize;
  updated: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  title: string;
  intro: string;
  faqs: { q: string; a: string }[];
  related: string[];
};

function priceText(q: CadenceQuote): string {
  return q.tier ? `${q.tier.price}/mo` : "above the self-serve ladder";
}

export function buildPricingForPage(subscribers: ListSize): PricingForPage {
  const count = formatCount(subscribers);
  const short = shortCount(subscribers);
  const weekly = quoteFor(subscribers, cadences[2]);
  const monthly = quoteFor(subscribers, cadences[0]);
  const headline = headlineQuote(subscribers);

  return {
    slug: slugFor(subscribers),
    subscribers,
    updated: PRICING_FOR_UPDATED,
    metaTitle: `Email pricing for ${count} subscribers`,
    metaDescription: `A weekly newsletter to ${count} subscribers costs ${priceText(weekly)} on day3. Monthly is ${priceText(monthly)}. Billed by emails sent, never by list size.`,
    keywords: [
      `newsletter pricing ${count} subscribers`,
      `email marketing cost ${short} subscribers`,
      `cheapest newsletter tool for ${count} subscribers`,
      `email marketing pricing per subscriber`,
      `unlimited subscribers email marketing`,
    ],
    title: `What emailing ${count} subscribers costs.`,
    intro: headline.tier
      ? `${priceText(headline)} for a ${headline.cadence.label.toLowerCase()} send. The list itself is free. You pay for the ${formatCount(headline.monthlyEmails)} emails that go out each month, and for nothing else.`
      : `At ${count} subscribers, a weekly send is more than the self-serve ladder covers. Monthly is ${priceText(monthly)}. Above that we set the plan up with you directly.`,
    faqs: [
      {
        q: `How much does day3 cost for ${count} subscribers?`,
        a: `Nothing for the subscribers. You pick a plan by monthly sends: ${count} contacts emailed once a month is ${formatCount(monthly.monthlyEmails)} emails, which fits the ${monthly.tier?.emails ?? "largest"} plan at ${priceText(monthly)}. Weekly is ${formatCount(weekly.monthlyEmails)} emails, ${priceText(weekly)}.`,
      },
      {
        q: "Does the price go up as the list grows?",
        a: "Only if you send more. Import another ten thousand contacts and mail them nothing, and the bill does not move. Every plan has unlimited subscribers.",
      },
      {
        q: "What happens if I go over the plan?",
        a: "Sending pauses at the cap until the month rolls over or you move up a plan. You are never billed an overage you did not choose.",
      },
      {
        q: "Do transactional emails count against the same allowance?",
        a: "Yes. Password resets, receipts and campaigns share one allowance and one domain. For most product teams transactional volume is a small share of the total.",
      },
      {
        q: "Why is this so much cheaper than per-subscriber tools?",
        a: "Per-subscriber tools charge for every address on the list every month, whether you email it or not. day3 charges for the emails that actually go out. On a list you mail weekly the gap is real but modest. On a list you mail monthly it is large.",
      },
    ],
    related: [
      "page:/pricing",
      "page:/how-it-works",
      "blog:per-subscriber-vs-per-send-email-pricing",
      "compare:mailchimp-alternative",
      "compare:kit-alternative",
      "compare:beehiiv-alternative",
    ],
  };
}

export const pricingForPages: PricingForPage[] = listSizes.map(buildPricingForPage);

export function getPricingForPage(slug: string): PricingForPage | undefined {
  const subscribers = subscribersFromSlug(slug);
  return subscribers === undefined ? undefined : buildPricingForPage(subscribers);
}
