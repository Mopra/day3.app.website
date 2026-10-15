import { formatCount, formatUsd } from "@/lib/resend-comparison";
import {
  tierFor,
  type ProviderModel,
  type ProviderQuote,
  type Scenario,
} from "@/lib/provider-comparison";

/**
 * The cost model behind /kit-pricing-calculator.
 *
 * Re-verify by opening https://kit.com/pricing, stepping the subscriber slider
 * on both the yearly and monthly toggle, then bump KIT_VERIFIED_ON. The tier
 * table below is the one Kit's own pricing page renders from: each tier's
 * monthly price, with yearly billing at ten months' price for twelve (Kit shows
 * "$390 billed yearly" for the $39 tier, which it rounds up to "$33/mo"; we use
 * the exact $32.50, which is the cheaper reading for Kit).
 *
 * Kit's sends are unlimited on every plan, so the send count never moves its
 * side. The model charges the cheapest plan that holds the list: Free up to
 * 10,000 subscribers, then Creator. Pro's first-year promotion is ignored
 * because Pro is never the cheapest plan that fits.
 */

/** The date the figures below were last read off Kit's own pricing page. */
export const KIT_VERIFIED_ON = "2026-10-15";
export const KIT_PRICING_URL = "https://kit.com/pricing";

/**
 * The one-click importer ("paste your Kit API key") is being built in the app.
 * While this is false the page describes the CSV route instead. Flip it to true
 * the day the importer ships, and the page starts making the one-click claim.
 */
export const KIT_API_IMPORT_LIVE = false;

/** Kit's Free plan holds up to this many subscribers, with unlimited sends. */
export const KIT_FREE_LIMIT = 10_000;

/** Above this, Kit shows "request a demo for a custom plan". */
export const KIT_MAX_PUBLISHED = 400_000;

/** Creator, monthly billing, per tier ceiling. As published on KIT_VERIFIED_ON. */
export const kitCreatorTiers: { max: number; monthly: number }[] = [
  { max: 1_000, monthly: 39 },
  { max: 3_000, monthly: 59 },
  { max: 5_000, monthly: 89 },
  { max: 8_000, monthly: 119 },
  { max: 10_000, monthly: 139 },
  { max: 15_000, monthly: 169 },
  { max: 20_000, monthly: 189 },
  { max: 25_000, monthly: 199 },
  { max: 35_000, monthly: 259 },
  { max: 45_000, monthly: 319 },
  { max: 55_000, monthly: 379 },
  { max: 65_000, monthly: 439 },
  { max: 75_000, monthly: 499 },
  { max: 85_000, monthly: 559 },
  { max: 95_000, monthly: 619 },
  { max: 105_000, monthly: 679 },
  { max: 115_000, monthly: 739 },
  { max: 125_000, monthly: 799 },
  { max: 135_000, monthly: 859 },
  { max: 145_000, monthly: 919 },
  { max: 155_000, monthly: 979 },
  { max: 165_000, monthly: 1_039 },
  { max: 175_000, monthly: 1_099 },
  { max: 185_000, monthly: 1_159 },
  { max: 195_000, monthly: 1_219 },
  { max: 205_000, monthly: 1_279 },
  { max: 215_000, monthly: 1_339 },
  { max: 225_000, monthly: 1_399 },
  { max: 235_000, monthly: 1_459 },
  { max: 245_000, monthly: 1_519 },
  { max: 255_000, monthly: 1_579 },
  { max: 265_000, monthly: 1_639 },
  { max: 275_000, monthly: 1_699 },
  { max: 285_000, monthly: 1_759 },
  { max: 295_000, monthly: 1_819 },
  { max: 305_000, monthly: 1_879 },
  { max: 315_000, monthly: 1_939 },
  { max: 325_000, monthly: 1_999 },
  { max: 335_000, monthly: 2_059 },
  { max: 345_000, monthly: 2_119 },
  { max: 355_000, monthly: 2_179 },
  { max: 365_000, monthly: 2_239 },
  { max: 400_000, monthly: 2_299 },
];

/** Yearly billing is ten months' price for twelve. Per month, to the cent. */
function perMonth(monthly: number, option: string): number {
  return option === "yearly" ? Math.round((monthly * 10 * 100) / 12) / 100 : monthly;
}

function kitCost(subscribers: number, _emails: number, option: string): ProviderQuote {
  if (subscribers > KIT_MAX_PUBLISHED)
    return { priceUsd: null, plan: "Custom", label: "Custom plan, priced by sales" };

  const tier = tierFor(kitCreatorTiers, subscribers)!;
  const creator = perMonth(tier.monthly, option);

  if (subscribers <= KIT_FREE_LIMIT)
    return {
      priceUsd: 0,
      plan: "Free",
      label: `Free, up to ${formatCount(KIT_FREE_LIMIT)} subscribers`,
      alt: { label: "Creator, same list", priceUsd: creator },
    };

  return {
    priceUsd: creator,
    plan: "Creator",
    label: `Creator, up to ${formatCount(tier.max)} subscribers`,
  };
}

export const kitModel: ProviderModel = {
  name: "Kit",
  longName: "Kit (formerly ConvertKit)",
  pricingUrl: KIT_PRICING_URL,
  verifiedOn: KIT_VERIFIED_ON,
  optionsLabel: "Kit billing",
  options: [
    { id: "yearly", label: "Yearly" },
    { id: "monthly", label: "Monthly" },
  ],
  defaultOption: "yearly",
  optionsNote: "day3 is monthly either way.",
  subscriberStops: [
    1_000, 2_500, 5_000, 10_000, 15_000, 25_000, 50_000, 75_000, 100_000,
    150_000, 200_000, 250_000, 300_000, 400_000,
  ],
  defaultSubscribers: 25_000,
  sendsLine: () => "Unlimited on every plan",
  columnNote: (subscribers, quote) =>
    subscribers <= KIT_FREE_LIMIT
      ? `Kit's Free plan holds up to ${formatCount(KIT_FREE_LIMIT)} subscribers, but sequences and visual automations start on Creator${quote.alt ? ` (${formatUsd(quote.alt.priceUsd)}/mo for this list)` : ""}.`
      : "Billed by subscribers. The same price whether you send once or every day.",
  freeLimit: KIT_FREE_LIMIT,
  cost: kitCost,
};

/** Worked rows for the static table under the calculator. Yearly billing throughout. */
export const kitWorkedScenarios: { label: string; scenario: Scenario }[] = [
  {
    label: "A first list, mailed weekly",
    scenario: { subscribers: 5_000, sendsPerMonth: 4, option: "yearly" },
  },
  {
    label: "A list just past Kit Free, mailed weekly",
    scenario: { subscribers: 15_000, sendsPerMonth: 4, option: "yearly" },
  },
  {
    label: "A SaaS changelog, mailed monthly",
    scenario: { subscribers: 25_000, sendsPerMonth: 1, option: "yearly" },
  },
  {
    label: "A creator newsletter, mailed weekly",
    scenario: { subscribers: 50_000, sendsPerMonth: 4, option: "yearly" },
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
