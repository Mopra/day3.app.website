import { cheapestTierFor, pricingTiers, type PricingTier } from "@/lib/site";

/**
 * The cost model behind /resend-pricing-calculator.
 *
 * Note what this file does that no other content module does: it prints a
 * competitor's prices. compare-content.ts deliberately refuses to, because a
 * rival's feature table ages into a list of our own inaccuracies. A price
 * calculator can't dodge that, so it takes the opposite approach and makes the
 * staleness visible instead: one dated snapshot, one named source, both rendered
 * on the page. If the snapshot is older than the reader is comfortable with,
 * they can check the source in one click.
 *
 * Re-verify it by reading https://resend.com/pricing.md, which is Resend's own
 * machine-readable pricing page, then bump RESEND_VERIFIED_ON.
 *
 * The model is deliberately generous to Resend. Where their pricing offers more
 * than one way to cover a volume, we charge the cheapest one, including
 * pay-as-you-go overage when that beats moving up a plan.
 */

/** The date the figures below were last read off Resend's own pricing page. */
export const RESEND_VERIFIED_ON = "2026-09-18";
export const RESEND_PRICING_URL = "https://resend.com/pricing";
export const RESEND_PRICING_SOURCE_URL = "https://resend.com/pricing.md";

export type ResendSendingPlan = {
  name: string;
  priceUsd: number;
  includedEmails: number;
  /** Pay-as-you-go rate per 1,000 emails beyond the included volume. */
  overagePer1k: number | null;
};

/**
 * Resend bills transactional email (the /emails API) by volume sent. Two plans
 * cover 100,000 at different prices because Scale buys support and domains
 * rather than bandwidth; the calculator only cares about the cheaper one.
 */
export const resendSendingPlans: ResendSendingPlan[] = [
  { name: "Free", priceUsd: 0, includedEmails: 3_000, overagePer1k: null },
  { name: "Pro", priceUsd: 20, includedEmails: 50_000, overagePer1k: 0.9 },
  { name: "Pro", priceUsd: 35, includedEmails: 100_000, overagePer1k: 0.9 },
  { name: "Scale", priceUsd: 90, includedEmails: 100_000, overagePer1k: 0.9 },
  { name: "Scale", priceUsd: 160, includedEmails: 200_000, overagePer1k: 0.8 },
  { name: "Scale", priceUsd: 350, includedEmails: 500_000, overagePer1k: 0.7 },
  { name: "Scale", priceUsd: 650, includedEmails: 1_000_000, overagePer1k: 0.65 },
  { name: "Scale", priceUsd: 825, includedEmails: 1_500_000, overagePer1k: 0.52 },
  { name: "Scale", priceUsd: 1_150, includedEmails: 2_500_000, overagePer1k: 0.46 },
];

export type ResendMarketingPlan = {
  name: string;
  priceUsd: number;
  contacts: number;
};

/**
 * Resend bills marketing email (broadcasts) by how many contacts you store, not
 * by how many emails you send them. Sends are unlimited inside a contact tier,
 * which is the one place their model beats a per-send one outright: mail a small
 * list very often and the flat fee wins.
 */
export const resendMarketingPlans: ResendMarketingPlan[] = [
  { name: "Free", priceUsd: 0, contacts: 1_000 },
  { name: "Pro marketing", priceUsd: 40, contacts: 5_000 },
  { name: "Pro marketing", priceUsd: 80, contacts: 10_000 },
  { name: "Pro marketing", priceUsd: 120, contacts: 15_000 },
  { name: "Pro marketing", priceUsd: 180, contacts: 25_000 },
  { name: "Pro marketing", priceUsd: 250, contacts: 50_000 },
  { name: "Pro marketing", priceUsd: 450, contacts: 100_000 },
  { name: "Pro marketing", priceUsd: 650, contacts: 150_000 },
];

/** Resend's free plan also caps sending at 100 a day, not just 3,000 a month. */
export const RESEND_FREE_DAILY_CAP = 100;

const MAX_DAY3_TIER = pricingTiers[pricingTiers.length - 1];
const MAX_RESEND_SENDS =
  resendSendingPlans[resendSendingPlans.length - 1].includedEmails;
const MAX_RESEND_CONTACTS =
  resendMarketingPlans[resendMarketingPlans.length - 1].contacts;

export type PlanQuote = {
  /** Monthly price in USD, or null when the volume needs a custom plan. */
  priceUsd: number | null;
  /** Short label for the plan picked, e.g. "Pro, 50,000 / mo". */
  label: string;
};

/**
 * The cheapest way to push `emails` a month through Resend's transactional side.
 *
 * Every plan is tried both as-is and with pay-as-you-go overage on top, because
 * overage genuinely undercuts the next plan up in places: 150,000 emails is $80
 * on Pro-plus-overage against $160 on the Scale plan that includes 200,000.
 */
export function resendSendingCost(emails: number): PlanQuote {
  if (emails <= 0) return { priceUsd: 0, label: "No transactional plan needed" };
  if (emails > MAX_RESEND_SENDS)
    return { priceUsd: null, label: "Enterprise, priced case by case" };

  let best: { plan: ResendSendingPlan; total: number; extra: number } | null =
    null;

  for (const plan of resendSendingPlans) {
    const excess = Math.max(0, emails - plan.includedEmails);
    if (excess > 0 && plan.overagePer1k === null) continue;
    const extra =
      excess > 0 ? Math.ceil(excess / 1_000) * (plan.overagePer1k ?? 0) : 0;
    const total = plan.priceUsd + extra;
    if (!best || total < best.total) best = { plan, total, extra };
  }

  // Unreachable: the top plan covers everything up to MAX_RESEND_SENDS.
  if (!best) return { priceUsd: null, label: "Enterprise, priced case by case" };

  const included = `${best.plan.name}, ${formatCount(best.plan.includedEmails)} / mo`;
  return {
    priceUsd: round2(best.total),
    label: best.extra > 0 ? `${included} + overage` : included,
  };
}

/** The cheapest Resend marketing plan that holds `contacts`. */
export function resendMarketingCost(contacts: number): PlanQuote {
  if (contacts <= 0) return { priceUsd: 0, label: "No marketing plan needed" };
  if (contacts > MAX_RESEND_CONTACTS)
    return { priceUsd: null, label: "Enterprise, priced case by case" };

  const plan =
    resendMarketingPlans.find((p) => p.contacts >= contacts) ??
    resendMarketingPlans[resendMarketingPlans.length - 1];

  return {
    priceUsd: plan.priceUsd,
    label: `${plan.name}, ${formatCount(plan.contacts)} contacts`,
  };
}

/** The cheapest day3 plan that covers a month's total sends. */
export function day3Cost(totalEmails: number): PlanQuote & {
  tier: PricingTier | null;
} {
  if (totalEmails <= 0)
    return { priceUsd: 0, label: "Free, nothing to send yet", tier: null };
  if (totalEmails > MAX_DAY3_TIER.emailsValue)
    return { priceUsd: null, label: "Above the ladder, just ask", tier: null };

  const tier = cheapestTierFor(totalEmails);
  return {
    priceUsd: tier.priceUsd,
    label: `${tier.name} plan, ${tier.emails} / mo`,
    tier,
  };
}

export type Scenario = {
  /** Transactional emails a month: password resets, receipts, alerts. */
  transactional: number;
  /** Contacts on the marketing list. */
  contacts: number;
  /** Marketing sends to the whole list each month. */
  campaignsPerMonth: number;
};

export type Verdict = {
  scenario: Scenario;
  /** contacts × campaigns. */
  marketingEmails: number;
  /** transactional + marketing. The only number day3 bills on. */
  totalEmails: number;
  resend: {
    sending: PlanQuote;
    marketing: PlanQuote;
    /** Null when either half needs a custom plan. */
    totalUsd: number | null;
  };
  day3: PlanQuote & { tier: PricingTier | null };
  /** "day3", "resend", "tie", or "unknown" when a side is off its price list. */
  winner: "day3" | "resend" | "tie" | "unknown";
  /** Monthly saving of the cheaper side, when both sides have a price. */
  savingUsd: number | null;
  /** How many times cheaper the winner is. Null when the loser is free. */
  multiple: number | null;
};

export function compare(scenario: Scenario): Verdict {
  const marketingEmails = scenario.contacts * scenario.campaignsPerMonth;
  const totalEmails = scenario.transactional + marketingEmails;

  const sending = resendSendingCost(scenario.transactional);
  // A list you never mail still has to be stored, so the marketing plan is
  // priced off contacts whether or not a campaign goes out this month.
  const marketing = resendMarketingCost(scenario.contacts);
  const resendTotal =
    sending.priceUsd === null || marketing.priceUsd === null
      ? null
      : round2(sending.priceUsd + marketing.priceUsd);

  const day3 = day3Cost(totalEmails);

  let winner: Verdict["winner"] = "unknown";
  let savingUsd: number | null = null;
  let multiple: number | null = null;

  if (resendTotal !== null && day3.priceUsd !== null) {
    if (resendTotal === day3.priceUsd) {
      winner = "tie";
      savingUsd = 0;
    } else {
      winner = day3.priceUsd < resendTotal ? "day3" : "resend";
      savingUsd = round2(Math.abs(resendTotal - day3.priceUsd));
      const low = Math.min(resendTotal, day3.priceUsd);
      const high = Math.max(resendTotal, day3.priceUsd);
      multiple = low > 0 ? Math.round((high / low) * 10) / 10 : null;
    }
  }

  return {
    scenario,
    marketingEmails,
    totalEmails,
    resend: { sending, marketing, totalUsd: resendTotal },
    day3,
    winner,
    savingUsd,
    multiple,
  };
}

/**
 * The lowest campaign frequency at which Resend's flat contact fee beats day3's
 * per-send ladder, for a given list and transactional load. Null when day3 stays
 * cheaper at every frequency the ladder can reach.
 *
 * This is the honest half of the page: Resend charges nothing per marketing
 * send, so there is always a cadence where a flat fee wins, and the page says
 * where it is rather than waiting for a commenter to find it.
 */
export function crossoverFrequency(
  contacts: number,
  transactional: number,
  maxFrequency = 30,
): number | null {
  for (let campaigns = 1; campaigns <= maxFrequency; campaigns += 1) {
    const verdict = compare({ contacts, transactional, campaignsPerMonth: campaigns });
    if (verdict.winner === "resend") return campaigns;
    // Past the top of day3's ladder there is no price to compare against, so
    // treat it as the point where the flat fee takes over.
    if (verdict.day3.priceUsd === null) return campaigns;
  }
  return null;
}

export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

/** "$1", "$14", "$80.60". Whole dollars stay whole. */
export function formatUsd(n: number): string {
  return Number.isInteger(n)
    ? `$${n.toLocaleString("en-US")}`
    : `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Slider stops. Coarse on purpose: these are the volumes people actually say. */
export const transactionalStops = [
  0, 1_000, 2_500, 5_000, 10_000, 25_000, 50_000, 100_000, 200_000, 500_000,
  1_000_000,
] as const;

export const contactStops = [
  0, 500, 1_000, 2_500, 5_000, 10_000, 15_000, 25_000, 50_000, 100_000, 150_000,
] as const;

export const campaignStops = [0, 1, 2, 4, 8, 12, 20, 30] as const;

/** Where the calculator opens: a small SaaS with a list it mails weekly. */
export const defaultScenario: Scenario = {
  transactional: 10_000,
  contacts: 5_000,
  campaignsPerMonth: 4,
};

/**
 * Worked rows for the static table under the calculator. They exist so the page
 * answers the question with JavaScript off, and so an answer engine quoting it
 * has figures in the HTML rather than in a React state hook.
 */
export const workedScenarios: { label: string; scenario: Scenario }[] = [
  {
    label: "A side project just starting out",
    scenario: { transactional: 1_000, contacts: 500, campaignsPerMonth: 1 },
  },
  {
    label: "A SaaS with a small list, mailed monthly",
    scenario: { transactional: 10_000, contacts: 2_500, campaignsPerMonth: 1 },
  },
  {
    label: "A SaaS with a newsletter, mailed weekly",
    scenario: { transactional: 10_000, contacts: 10_000, campaignsPerMonth: 4 },
  },
  {
    label: "A growing product, weekly updates",
    scenario: { transactional: 50_000, contacts: 25_000, campaignsPerMonth: 4 },
  },
  {
    label: "A big list, mailed twice a month",
    scenario: { transactional: 100_000, contacts: 100_000, campaignsPerMonth: 2 },
  },
  {
    label: "A small list, mailed nearly every day",
    scenario: { transactional: 1_000, contacts: 5_000, campaignsPerMonth: 30 },
  },
];
