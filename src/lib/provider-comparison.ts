import type { PricingTier } from "@/lib/site";
import { day3Cost } from "@/lib/resend-comparison";

/**
 * The shared cost model behind the subscriber-priced calculators:
 * /kit-pricing-calculator, /mailchimp-pricing-calculator and
 * /mailerlite-pricing-calculator.
 *
 * Each provider file (kit-comparison.ts and friends) holds one dated snapshot
 * of that provider's published prices plus a `cost` function that picks the
 * cheapest plan holding the list. This file holds what they share: the verdict,
 * the crossover search, and the shape the calculator component reads.
 *
 * Same rule as beehiiv-comparison.ts: every competitor figure is one they
 * publish, read off their own pricing page on the date the page prints, and
 * wherever a choice exists the model takes the one that is cheaper for them.
 * Overstating a saving is the one mistake these pages must never make.
 */

export type ProviderQuote = {
  /** Monthly price in USD, or null where the provider prices through sales. */
  priceUsd: number | null;
  /** Plan name, e.g. "Free", "Creator", "Essentials". */
  plan: string;
  /** Short label, e.g. "Creator, up to 10,000 subscribers". */
  label: string;
  /**
   * True when priceUsd is a floor rather than the bill: the list needs more
   * sends than any plan includes, so overage charges come on top. A floor can
   * show day3 winning, never the provider winning, because the real number is
   * higher than the one we hold.
   */
  lowerBound?: boolean;
  /** A second reference price shown under the first, e.g. the paid plan when Free fits. */
  alt?: { label: string; priceUsd: number } | null;
};

export type ProviderOption = { id: string; label: string };

export type ProviderModel = {
  /** Display name, e.g. "Kit". */
  name: string;
  /** Long name for copy that needs it, e.g. "Kit (formerly ConvertKit)". */
  longName: string;
  pricingUrl: string;
  verifiedOn: string;
  /** The toggle beside the sliders: billing period, or intro offer vs list price. */
  optionsLabel: string;
  options: ProviderOption[];
  defaultOption: string;
  /** One line under the toggle. */
  optionsNote: string;
  /** Slider stops for the subscriber count. */
  subscriberStops: number[];
  defaultSubscribers: number;
  /** What the provider's side says about sends, e.g. "Unlimited on every plan". */
  sendsLine: (subscribers: number, option: string) => string;
  /** The note under the provider's price column. */
  columnNote: (subscribers: number, quote: ProviderQuote) => string;
  /** The free plan's subscriber ceiling, for copy. */
  freeLimit: number;
  /** The cheapest published plan that holds the list and the sends. */
  cost: (subscribers: number, totalEmails: number, option: string) => ProviderQuote;
};

export type Scenario = {
  subscribers: number;
  /** Sends to the whole list each month. */
  sendsPerMonth: number;
  option: string;
};

export type Winner = "day3" | "provider" | "tie" | "unknown";

export type Verdict = {
  scenario: Scenario;
  /** subscribers x sends. The only number day3 bills on. */
  totalEmails: number;
  provider: ProviderQuote;
  day3: { priceUsd: number | null; label: string; tier: PricingTier | null };
  winner: Winner;
  savingUsd: number | null;
  savingPerYearUsd: number | null;
  /** True when the saving is a floor, because the provider price is. */
  savingIsFloor: boolean;
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function compare(model: ProviderModel, scenario: Scenario): Verdict {
  const totalEmails = scenario.subscribers * scenario.sendsPerMonth;
  const provider = model.cost(scenario.subscribers, totalEmails, scenario.option);
  const day3 = day3Cost(totalEmails);

  let winner: Winner = "unknown";
  let savingUsd: number | null = null;
  let savingIsFloor = false;

  if (provider.priceUsd !== null && day3.priceUsd !== null) {
    if (provider.priceUsd === day3.priceUsd && !provider.lowerBound) {
      winner = "tie";
      savingUsd = 0;
    } else if (day3.priceUsd < provider.priceUsd) {
      winner = "day3";
      savingUsd = round2(provider.priceUsd - day3.priceUsd);
      savingIsFloor = Boolean(provider.lowerBound);
    } else if (!provider.lowerBound) {
      winner = "provider";
      savingUsd = round2(day3.priceUsd - provider.priceUsd);
    }
    // A floor that undercuts day3 proves nothing: overages sit on top of it.
  }

  return {
    scenario,
    totalEmails,
    provider,
    day3,
    winner,
    savingUsd,
    savingPerYearUsd: savingUsd === null ? null : round2(savingUsd * 12),
    savingIsFloor,
  };
}

/**
 * The lowest send frequency at which the provider's subscriber price beats
 * day3's per-send ladder for this list. Null when day3 stays cheaper (or the
 * answer is unknowable) at every frequency up to `maxFrequency`.
 */
export function crossoverFrequency(
  model: ProviderModel,
  subscribers: number,
  option: string,
  maxFrequency = 30,
): number | null {
  for (let sends = 1; sends <= maxFrequency; sends += 1) {
    const verdict = compare(model, { subscribers, sendsPerMonth: sends, option });
    if (verdict.winner === "provider") return sends;
  }
  return null;
}

export const sendStops = [1, 2, 4, 8, 12, 20, 30] as const;

export function sendsPhrase(n: number): string {
  if (n === 30) return "mailed daily";
  return `${n} send${n === 1 ? "" : "s"} a month`;
}

/** Find the first tier whose ceiling holds `subscribers`. */
export function tierFor<T extends { max: number }>(
  tiers: readonly T[],
  subscribers: number,
): T | null {
  return tiers.find((t) => t.max >= subscribers) ?? null;
}
