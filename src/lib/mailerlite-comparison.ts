import { formatCount } from "@/lib/resend-comparison";
import {
  tierFor,
  type ProviderModel,
  type ProviderQuote,
  type Scenario,
} from "@/lib/provider-comparison";

/**
 * The cost model behind /mailerlite-pricing-calculator.
 *
 * Re-verify by opening https://www.mailerlite.com/pricing, stepping the
 * subscriber slider through every tier on both "Billed yearly" and "Billed
 * monthly" (USD), then bump MAILERLITE_VERIFIED_ON. Yearly is the monthly
 * price less 10%, which is how MailerLite shows it ($12 becomes $10.80).
 *
 * MailerLite meters both: Free holds 250 subscribers and 2,500 emails a month,
 * Comfort sends up to 10x the ceiling of its subscriber tier, and Power sends
 * without a cap (under a fair use policy). The model takes the cheapest plan
 * whose allowance covers the sends.
 */

/** The date the figures below were last read off MailerLite's own pricing page. */
export const MAILERLITE_VERIFIED_ON = "2026-10-15";
export const MAILERLITE_PRICING_URL = "https://www.mailerlite.com/pricing";

/**
 * The one-click importer ("paste your MailerLite API key") is being built in
 * the app. While this is false the page describes the CSV route instead. Flip
 * it to true the day the importer ships.
 */
export const MAILERLITE_API_IMPORT_LIVE = false;

/** MailerLite Free: up to 250 subscribers and 2,500 emails a month. */
export const MAILERLITE_FREE_LIMIT = 250;
export const MAILERLITE_FREE_SENDS = 2_500;

/** Above this, MailerLite's Enterprise plan is priced through sales. */
export const MAILERLITE_MAX_PUBLISHED = 200_000;

/** Comfort's monthly email cap, as a multiple of its tier's ceiling. */
const COMFORT_MULTIPLE = 10;

/** Monthly-billing price per tier ceiling, USD, as published on MAILERLITE_VERIFIED_ON. */
export const mailerliteTiers: { max: number; comfort: number; power: number }[] = [
  { max: 500, comfort: 12, power: 25 },
  { max: 1_000, comfort: 19, power: 39 },
  { max: 2_500, comfort: 33, power: 49 },
  { max: 5_000, comfort: 49, power: 69 },
  { max: 8_000, comfort: 69, power: 99 },
  { max: 10_000, comfort: 89, power: 129 },
  { max: 15_000, comfort: 129, power: 179 },
  { max: 20_000, comfort: 159, power: 219 },
  { max: 25_000, comfort: 179, power: 239 },
  { max: 30_000, comfort: 229, power: 279 },
  { max: 35_000, comfort: 249, power: 309 },
  { max: 40_000, comfort: 269, power: 329 },
  { max: 45_000, comfort: 289, power: 359 },
  { max: 50_000, comfort: 319, power: 389 },
  { max: 60_000, comfort: 359, power: 419 },
  { max: 70_000, comfort: 379, power: 439 },
  { max: 80_000, comfort: 399, power: 459 },
  { max: 90_000, comfort: 419, power: 469 },
  { max: 100_000, comfort: 439, power: 489 },
  { max: 110_000, comfort: 489, power: 599 },
  { max: 120_000, comfort: 529, power: 649 },
  { max: 130_000, comfort: 559, power: 689 },
  { max: 140_000, comfort: 589, power: 719 },
  { max: 150_000, comfort: 619, power: 759 },
  { max: 160_000, comfort: 659, power: 829 },
  { max: 170_000, comfort: 699, power: 899 },
  { max: 180_000, comfort: 739, power: 959 },
  { max: 190_000, comfort: 779, power: 1_029 },
  { max: 200_000, comfort: 819, power: 1_119 },
];

/** Yearly billing is 10% off, per month, to the cent. */
function perMonth(monthly: number, option: string): number {
  return option === "yearly" ? Math.round(monthly * 0.9 * 100) / 100 : monthly;
}

function mailerliteCost(subscribers: number, emails: number, option: string): ProviderQuote {
  if (subscribers <= MAILERLITE_FREE_LIMIT && emails <= MAILERLITE_FREE_SENDS)
    return {
      priceUsd: 0,
      plan: "Free",
      label: `Free, up to ${formatCount(MAILERLITE_FREE_LIMIT)} subscribers`,
    };

  if (subscribers > MAILERLITE_MAX_PUBLISHED)
    return { priceUsd: null, plan: "Enterprise", label: "Enterprise, priced by sales" };

  const tier = tierFor(mailerliteTiers, subscribers)!;

  if (emails <= tier.max * COMFORT_MULTIPLE)
    return {
      priceUsd: perMonth(tier.comfort, option),
      plan: "Comfort",
      label: `Comfort, up to ${formatCount(tier.max)} subscribers`,
    };

  return {
    priceUsd: perMonth(tier.power, option),
    plan: "Power",
    label: `Power, up to ${formatCount(tier.max)} subscribers`,
  };
}

export const mailerliteModel: ProviderModel = {
  name: "MailerLite",
  longName: "MailerLite",
  pricingUrl: MAILERLITE_PRICING_URL,
  verifiedOn: MAILERLITE_VERIFIED_ON,
  optionsLabel: "MailerLite billing",
  options: [
    { id: "yearly", label: "Yearly" },
    { id: "monthly", label: "Monthly" },
  ],
  defaultOption: "yearly",
  optionsNote: "day3 is monthly either way.",
  subscriberStops: [
    250, 500, 1_000, 2_500, 5_000, 10_000, 15_000, 25_000, 50_000, 75_000,
    100_000, 150_000, 200_000,
  ],
  defaultSubscribers: 10_000,
  sendsLine: (subscribers) => {
    if (subscribers <= MAILERLITE_FREE_LIMIT) return "2,500 a month on Free";
    const tier = tierFor(mailerliteTiers, subscribers);
    return tier
      ? `${formatCount(tier.max * COMFORT_MULTIPLE)} on Comfort, unlimited on Power`
      : "Custom on Enterprise";
  },
  columnNote: (_subscribers, quote) =>
    quote.plan === "Free"
      ? "MailerLite Free holds 250 subscribers and 2,500 emails a month."
      : quote.plan === "Power"
        ? "More sends than Comfort includes, so this is Power, which sends without a cap."
        : "Billed by subscribers, with a send allowance of 10x the tier on Comfort.",
  freeLimit: MAILERLITE_FREE_LIMIT,
  cost: mailerliteCost,
};

/** Worked rows for the static table. Yearly billing throughout. */
export const mailerliteWorkedScenarios: { label: string; scenario: Scenario }[] = [
  {
    label: "A tiny list, mailed weekly",
    scenario: { subscribers: 250, sendsPerMonth: 4, option: "yearly" },
  },
  {
    label: "A first list, mailed weekly",
    scenario: { subscribers: 2_500, sendsPerMonth: 4, option: "yearly" },
  },
  {
    label: "A SaaS changelog, mailed monthly",
    scenario: { subscribers: 10_000, sendsPerMonth: 1, option: "yearly" },
  },
  {
    label: "A founder newsletter, mailed weekly",
    scenario: { subscribers: 25_000, sendsPerMonth: 4, option: "yearly" },
  },
  {
    label: "A big list, mailed twice a month",
    scenario: { subscribers: 100_000, sendsPerMonth: 2, option: "yearly" },
  },
  {
    label: "A daily newsletter",
    scenario: { subscribers: 25_000, sendsPerMonth: 30, option: "yearly" },
  },
];
