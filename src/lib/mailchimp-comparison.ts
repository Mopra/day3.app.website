import { formatCount } from "@/lib/resend-comparison";
import {
  tierFor,
  type ProviderModel,
  type ProviderQuote,
  type Scenario,
} from "@/lib/provider-comparison";

/**
 * The cost model behind /mailchimp-pricing-calculator.
 *
 * Re-verify by opening https://mailchimp.com/pricing/marketing/?currency=USD,
 * stepping the Contacts dropdown through every tier, then bump
 * MAILCHIMP_VERIFIED_ON. Mailchimp shows prices in the visitor's local
 * currency, so the `currency=USD` parameter matters.
 *
 * Mailchimp bills monthly. For 10,000+ contacts it runs a new-customer offer,
 * 15% off the first 12 months, which on the page shows from the
 * 5,001 to 10,000 tier on Essentials and Standard and on every Premium tier.
 * The calculator opens on that offer price, the cheaper reading for Mailchimp,
 * and lets the reader switch to the list price they pay after year one.
 *
 * Unlike Kit and MailerLite, every Mailchimp plan caps monthly sends at a
 * multiple of the contact tier: Essentials 10x, Standard 12x, Premium 15x, and
 * Free 500 a month. The model picks the cheapest plan whose cap covers the
 * sends. Past every plan's cap Mailchimp charges overages it does not
 * publish, so the cheapest plan holding the contacts is shown as a floor
 * ("from"), which can only ever understate Mailchimp's bill.
 */

/** The date the figures below were last read off Mailchimp's own pricing page. */
export const MAILCHIMP_VERIFIED_ON = "2026-10-15";
export const MAILCHIMP_PRICING_URL = "https://mailchimp.com/pricing/marketing/";

/**
 * The one-click importer ("paste your Mailchimp API key") is being built in the
 * app. While this is false the page describes the CSV route instead. Flip it to
 * true the day the importer ships.
 */
export const MAILCHIMP_API_IMPORT_LIVE = false;

/** Mailchimp Free: up to 250 contacts and 500 sends a month. */
export const MAILCHIMP_FREE_LIMIT = 250;
export const MAILCHIMP_FREE_SENDS = 500;

/** Above this, Mailchimp prices through sales. */
export const MAILCHIMP_MAX_PUBLISHED = 200_000;

type Plan = "Essentials" | "Standard" | "Premium";

/** Each plan's monthly send cap, as a multiple of the contact tier's ceiling. */
const sendMultiple: Record<Plan, number> = { Essentials: 10, Standard: 12, Premium: 15 };

/**
 * List price per month at each contact tier's ceiling, USD, as published on
 * MAILCHIMP_VERIFIED_ON. Null where Mailchimp says the plan does not hold that
 * many contacts (Essentials stops at 50,000, Standard at 100,000).
 */
export const mailchimpTiers: {
  max: number;
  Essentials: number | null;
  Standard: number | null;
  Premium: number;
}[] = [
  { max: 500, Essentials: 13, Standard: 20, Premium: 350 },
  { max: 1_500, Essentials: 26.5, Standard: 45, Premium: 350 },
  { max: 2_500, Essentials: 45, Standard: 60, Premium: 350 },
  { max: 5_000, Essentials: 75, Standard: 100, Premium: 350 },
  { max: 10_000, Essentials: 110, Standard: 135, Premium: 350 },
  { max: 15_000, Essentials: 180, Standard: 230, Premium: 465 },
  { max: 20_000, Essentials: 230, Standard: 285, Premium: 535 },
  { max: 25_000, Essentials: 270, Standard: 310, Premium: 620 },
  { max: 30_000, Essentials: 300, Standard: 340, Premium: 685 },
  { max: 40_000, Essentials: 340, Standard: 410, Premium: 750 },
  { max: 50_000, Essentials: 385, Standard: 450, Premium: 815 },
  { max: 75_000, Essentials: null, Standard: 630, Premium: 900 },
  { max: 100_000, Essentials: null, Standard: 800, Premium: 1_025 },
  { max: 130_000, Essentials: null, Standard: null, Premium: 1_150 },
  { max: 150_000, Essentials: null, Standard: null, Premium: 1_325 },
  { max: 200_000, Essentials: null, Standard: null, Premium: 1_600 },
];

/** The new-customer offer: 15% off for 12 months, where the page shows it. */
function offerApplies(plan: Plan, tierMax: number): boolean {
  return plan === "Premium" || tierMax >= 10_000;
}

function price(plan: Plan, list: number, tierMax: number, option: string): number {
  if (option === "offer" && offerApplies(plan, tierMax))
    return Math.round(list * 0.85 * 100) / 100;
  return list;
}

function mailchimpCost(subscribers: number, emails: number, option: string): ProviderQuote {
  if (subscribers <= MAILCHIMP_FREE_LIMIT && emails <= MAILCHIMP_FREE_SENDS)
    return {
      priceUsd: 0,
      plan: "Free",
      label: `Free, up to ${formatCount(MAILCHIMP_FREE_LIMIT)} contacts and ${formatCount(MAILCHIMP_FREE_SENDS)} sends`,
    };

  if (subscribers > MAILCHIMP_MAX_PUBLISHED)
    return { priceUsd: null, plan: "Custom", label: "Custom plan, priced by sales" };

  const tier = tierFor(mailchimpTiers, subscribers)!;

  for (const plan of ["Essentials", "Standard", "Premium"] as const) {
    const list = tier[plan];
    if (list === null) continue;
    if (emails <= tier.max * sendMultiple[plan])
      return {
        priceUsd: price(plan, list, tier.max, option),
        plan,
        label: `${plan}, up to ${formatCount(tier.max)} contacts`,
      };
  }

  // More sends than any plan includes. Overages are charged on top and not
  // published, so the honest number is a floor: the cheapest plan that holds
  // the contacts, before overages. It can only understate Mailchimp's bill.
  const floorPlan = (["Essentials", "Standard", "Premium"] as const).find(
    (plan) => tier[plan] !== null,
  )!;
  return {
    priceUsd: price(floorPlan, tier[floorPlan]!, tier.max, option),
    plan: floorPlan,
    label: `${floorPlan}, up to ${formatCount(tier.max)} contacts, plus overages`,
    lowerBound: true,
  };
}

export const mailchimpModel: ProviderModel = {
  name: "Mailchimp",
  longName: "Mailchimp",
  pricingUrl: MAILCHIMP_PRICING_URL,
  verifiedOn: MAILCHIMP_VERIFIED_ON,
  optionsLabel: "Mailchimp price",
  options: [
    { id: "offer", label: "Year one" },
    { id: "list", label: "List price" },
  ],
  defaultOption: "offer",
  optionsNote: "Year one is 15% off from 10,000 contacts.",
  subscriberStops: [
    250, 500, 1_500, 2_500, 5_000, 10_000, 15_000, 25_000, 50_000, 75_000,
    100_000, 150_000, 200_000,
  ],
  defaultSubscribers: 10_000,
  sendsLine: () => "Capped at 10x to 15x the contact tier",
  columnNote: (_subscribers, quote) =>
    quote.lowerBound
      ? "More sends than any Mailchimp plan includes at this list size. Overages come on top of this price, so the real bill is higher."
      : quote.plan === "Free"
        ? "Mailchimp Free holds 250 contacts and 500 sends a month."
        : "Billed by contacts, with a monthly send cap on every plan.",
  freeLimit: MAILCHIMP_FREE_LIMIT,
  cost: mailchimpCost,
};

/** Worked rows for the static table. First-year offer prices throughout. */
export const mailchimpWorkedScenarios: { label: string; scenario: Scenario }[] = [
  {
    label: "A tiny list, mailed twice a month",
    scenario: { subscribers: 250, sendsPerMonth: 2, option: "offer" },
  },
  {
    label: "A first list, mailed weekly",
    scenario: { subscribers: 2_500, sendsPerMonth: 4, option: "offer" },
  },
  {
    label: "A SaaS changelog, mailed monthly",
    scenario: { subscribers: 10_000, sendsPerMonth: 1, option: "offer" },
  },
  {
    label: "A founder newsletter, mailed weekly",
    scenario: { subscribers: 25_000, sendsPerMonth: 4, option: "offer" },
  },
  {
    label: "A big list, mailed twice a month",
    scenario: { subscribers: 100_000, sendsPerMonth: 2, option: "offer" },
  },
  {
    label: "A small daily newsletter",
    scenario: { subscribers: 2_500, sendsPerMonth: 30, option: "offer" },
  },
];
