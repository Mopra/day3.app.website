import { pricingTiers, type PricingTier } from "@/lib/site";
import { day3Cost, formatCount } from "@/lib/resend-comparison";

/**
 * The cost model behind /beehiiv-pricing-calculator.
 *
 * Like resend-comparison.ts, this prints a competitor's prices, so it makes the
 * staleness visible rather than hiding it: one dated snapshot, one named source,
 * both rendered on the page.
 *
 * Re-verify by opening https://www.beehiiv.com/pricing, stepping the subscriber
 * slider through every stop on both the yearly and monthly toggle, then bump
 * BEEHIIV_VERIFIED_ON. The stops below are beehiiv's own slider stops, so every
 * price here is one they publish rather than one we interpolated.
 *
 * The model is deliberately generous to beehiiv: it charges the cheapest plan
 * that holds the list (Free, then Lite, then Pro) and the yearly price unless the
 * reader switches to monthly. beehiiv's sends are unlimited on every plan, so
 * the send count never moves their side.
 */

/** The date the figures below were last read off beehiiv's own pricing page. */
export const BEEHIIV_VERIFIED_ON = "2026-10-12";
export const BEEHIIV_PRICING_URL = "https://www.beehiiv.com/pricing";

/** beehiiv's Free plan holds up to this many subscribers, at $0. */
export const BEEHIIV_FREE_LIMIT = 2_500;

export type Billing = "yearly" | "monthly";

type BeehiivStop = {
  /** "Pricing for N subscribers": the price holds for a list up to this size. */
  subscribers: number;
  /** Lite, per month. Null where beehiiv shows "Unavailable" (over 100,000). */
  lite: { yearly: number; monthly: number } | null;
  /** Pro, per month. Pro holds up to 250,000. */
  pro: { yearly: number; monthly: number };
};

/**
 * Every stop on beehiiv's subscriber slider, as published on BEEHIIV_VERIFIED_ON.
 * "Yearly" is the per-month price on yearly billing, which is how beehiiv shows it.
 */
export const beehiivStops: BeehiivStop[] = [
  { subscribers: 1_000, lite: { yearly: 49, monthly: 59 }, pro: { yearly: 95, monthly: 109 } },
  { subscribers: 2_500, lite: { yearly: 69, monthly: 79 }, pro: { yearly: 129, monthly: 149 } },
  { subscribers: 5_000, lite: { yearly: 95, monthly: 109 }, pro: { yearly: 169, monthly: 199 } },
  { subscribers: 10_000, lite: { yearly: 119, monthly: 139 }, pro: { yearly: 199, monthly: 239 } },
  { subscribers: 25_000, lite: { yearly: 169, monthly: 199 }, pro: { yearly: 299, monthly: 349 } },
  { subscribers: 50_000, lite: { yearly: 249, monthly: 299 }, pro: { yearly: 399, monthly: 469 } },
  { subscribers: 75_000, lite: { yearly: 329, monthly: 389 }, pro: { yearly: 499, monthly: 589 } },
  { subscribers: 100_000, lite: { yearly: 399, monthly: 469 }, pro: { yearly: 599, monthly: 699 } },
  { subscribers: 150_000, lite: null, pro: { yearly: 689, monthly: 799 } },
  { subscribers: 200_000, lite: null, pro: { yearly: 779, monthly: 899 } },
  { subscribers: 250_000, lite: null, pro: { yearly: 869, monthly: 999 } },
];

const MAX_BEEHIIV_SUBSCRIBERS = beehiivStops[beehiivStops.length - 1].subscribers;

export type BeehiivQuote = {
  /** Monthly price in USD, or null above Pro's limit (Enterprise, custom). */
  priceUsd: number | null;
  /** "Free", "Lite", "Pro" or "Enterprise". */
  plan: string;
  /** Short label, e.g. "Lite, up to 10,000 subscribers". */
  label: string;
  /** Pro at the same list size, for the reader who needs it. Null if n/a. */
  proUsd: number | null;
};

/** The cheapest beehiiv plan that holds `subscribers`, at the chosen billing. */
export function beehiivCost(subscribers: number, billing: Billing): BeehiivQuote {
  if (subscribers > MAX_BEEHIIV_SUBSCRIBERS)
    return {
      priceUsd: null,
      plan: "Enterprise",
      label: "Enterprise, priced by sales",
      proUsd: null,
    };

  const stop =
    beehiivStops.find((s) => s.subscribers >= subscribers) ??
    beehiivStops[beehiivStops.length - 1];

  if (subscribers <= BEEHIIV_FREE_LIMIT)
    return {
      priceUsd: 0,
      plan: "Free",
      label: `Free, up to ${formatCount(BEEHIIV_FREE_LIMIT)} subscribers`,
      proUsd: stop.pro[billing],
    };

  if (stop.lite)
    return {
      priceUsd: stop.lite[billing],
      plan: "Lite",
      label: `Lite, up to ${formatCount(stop.subscribers)} subscribers`,
      proUsd: stop.pro[billing],
    };

  return {
    priceUsd: stop.pro[billing],
    plan: "Pro",
    label: `Pro, up to ${formatCount(stop.subscribers)} subscribers`,
    proUsd: null,
  };
}

export type Scenario = {
  subscribers: number;
  /** Sends to the whole list each month. */
  sendsPerMonth: number;
  billing: Billing;
};

export type Verdict = {
  scenario: Scenario;
  /** subscribers × sends. The only number day3 bills on. */
  totalEmails: number;
  beehiiv: BeehiivQuote;
  day3: { priceUsd: number | null; label: string; tier: PricingTier | null };
  winner: "day3" | "beehiiv" | "tie" | "unknown";
  savingUsd: number | null;
  /** Yearly saving, so the page can speak in the unit renewals arrive in. */
  savingPerYearUsd: number | null;
  multiple: number | null;
};

export function compare(scenario: Scenario): Verdict {
  const totalEmails = scenario.subscribers * scenario.sendsPerMonth;
  const beehiiv = beehiivCost(scenario.subscribers, scenario.billing);
  const day3 = day3Cost(totalEmails);

  let winner: Verdict["winner"] = "unknown";
  let savingUsd: number | null = null;
  let multiple: number | null = null;

  if (beehiiv.priceUsd !== null && day3.priceUsd !== null) {
    if (beehiiv.priceUsd === day3.priceUsd) {
      winner = "tie";
      savingUsd = 0;
    } else {
      winner = day3.priceUsd < beehiiv.priceUsd ? "day3" : "beehiiv";
      savingUsd = Math.abs(beehiiv.priceUsd - day3.priceUsd);
      const low = Math.min(beehiiv.priceUsd, day3.priceUsd);
      const high = Math.max(beehiiv.priceUsd, day3.priceUsd);
      multiple = low > 0 ? Math.round((high / low) * 10) / 10 : null;
    }
  }

  return {
    scenario,
    totalEmails,
    beehiiv,
    day3,
    winner,
    savingUsd,
    savingPerYearUsd: savingUsd === null ? null : savingUsd * 12,
    multiple,
  };
}

/**
 * The lowest send frequency at which beehiiv's flat subscriber price beats
 * day3's per-send ladder, for a given list. Null when day3 stays cheaper at
 * every frequency up to `maxFrequency`.
 *
 * beehiiv's sends are unlimited, so for a big enough list mailed often enough
 * there is always a point where their flat fee wins. The page says where.
 */
export function crossoverFrequency(
  subscribers: number,
  billing: Billing,
  maxFrequency = 30,
): number | null {
  for (let sends = 1; sends <= maxFrequency; sends += 1) {
    const verdict = compare({ subscribers, sendsPerMonth: sends, billing });
    if (verdict.winner === "beehiiv") return sends;
    // Past the top of day3's ladder there is no price to compare, so treat it
    // as the point where the flat fee takes over.
    if (verdict.day3.priceUsd === null && verdict.beehiiv.priceUsd !== null)
      return sends;
  }
  return null;
}

/** Slider stops: beehiiv's own, so every beehiiv figure is a published one. */
export const subscriberStops = beehiivStops.map((s) => s.subscribers);

export const sendStops = [1, 2, 4, 8, 12, 20, 30] as const;

/** Where the calculator opens: a 10,000-person list mailed weekly. */
export const defaultScenario: Scenario = {
  subscribers: 10_000,
  sendsPerMonth: 4,
  billing: "yearly",
};

/** The top of day3's ladder, for copy that needs to say where it ends. */
export const DAY3_MAX_EMAILS = pricingTiers[pricingTiers.length - 1].emailsValue;

/**
 * Worked rows for the static table under the calculator, so the page answers
 * with JavaScript off and an answer engine finds figures in the HTML. Yearly
 * billing throughout, which is beehiiv's cheaper price.
 */
export const workedScenarios: { label: string; scenario: Scenario }[] = [
  {
    label: "A first list, mailed weekly",
    scenario: { subscribers: 2_500, sendsPerMonth: 4, billing: "yearly" },
  },
  {
    label: "A SaaS changelog, mailed monthly",
    scenario: { subscribers: 10_000, sendsPerMonth: 1, billing: "yearly" },
  },
  {
    label: "A founder newsletter, mailed weekly",
    scenario: { subscribers: 25_000, sendsPerMonth: 4, billing: "yearly" },
  },
  {
    label: "A big list, mailed weekly",
    scenario: { subscribers: 100_000, sendsPerMonth: 4, billing: "yearly" },
  },
  {
    label: "A small daily newsletter",
    scenario: { subscribers: 10_000, sendsPerMonth: 30, billing: "yearly" },
  },
  {
    label: "A bigger daily newsletter",
    scenario: { subscribers: 25_000, sendsPerMonth: 30, billing: "yearly" },
  },
];
