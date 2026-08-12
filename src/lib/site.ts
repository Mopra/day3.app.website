import {
  Infinity as InfinityIcon,
  Gauge,
  Send,
  Users,
  BarChart3,
  PenLine,
  ShieldCheck,
  Feather,
  type LucideIcon,
} from "lucide-react";

export const siteConfig = {
  name: "day3",
  promise: "You're billed on emails sent, not on the size of your list.",
  signupUrl: "https://go.day3.app",
  loginUrl: "https://go.day3.app/login",
  // day3's own subscribe form. We dogfood the product to capture product-update
  // signups. The popup is wired up by embed.js (loaded once in the root layout)
  // wherever a `<SubscribeButton>` carries the matching data attributes.
  subscribeFormId: "frm_y2w9edh1fqcpanb48vz4",
  embedScriptUrl: "https://go.day3.app/embed.js",
  contactEmail: "hello@day3.app",
  // Display string for the footer. Kept in step with `company.city` below.
  location: "Herning, Denmark",
};

/*
  There was a `navLinks` array here. Nothing imported it: the real navigation is
  `primaryNav` in site-header.tsx, built from the content modules so it cannot
  drift from the pages that exist. A second, stale copy of the nav was worse than
  no copy, so it is gone.
*/

/**
 * Company + founder facts. The single source of truth for both the JSON-LD
 * entity signals (what search and AI answer engines read) and the human copy on
 * the About / trust pages. Change a fact once, here.
 */
export const company = {
  legalName: "Pradsgaard Labs EMV",
  // A real, registered entity is a strong trust + EEAT signal. CVR is the Danish
  // company registration number, independently verifiable.
  cvr: "DK46156153",
  website: "https://pradsgaardlabs.com",
  founder: "Morten Pradsgaard",
  founderTitle: "Founder & engineer",
  // Also the maker of exit1.dev. A real, verifiable track record is an EEAT win.
  alsoBuilds: { name: "exit1.dev", href: "https://exit1.dev" },
  foundingYear: 2026, // TODO: confirm for schema.org foundingDate
  city: "Herning",
  country: "Denmark",
  countryCode: "DK",
};

/**
 * Public profiles for day3 / its founder. Wired into JSON-LD `sameAs`, the
 * single strongest entity-disambiguation signal we can hand an AI answer engine
 * ("this day3 is this verified identity across the web"). Add a profile here and
 * it flows into the structured data and the footer automatically.
 */
export const socialLinks: { label: string; href: string }[] = [
  { label: "GitHub", href: "https://github.com/Mopra/day3.app" },
  // TODO: add LinkedIn / X profiles to further strengthen the sameAs entity signal.
];

export type Subprocessor = {
  name: string;
  purpose: string;
  location: string;
  url: string;
};

/**
 * Third parties that may process personal data on day3's behalf. Drives
 * /legal/subprocessors and the summary on /security. Everything here is
 * EU-region, which is the whole point of day3's data story.
 */
export const subprocessors: Subprocessor[] = [
  {
    name: "Vercel",
    purpose: "Application hosting, edge network and content delivery",
    location: "European Union",
    url: "https://vercel.com",
  },
  {
    name: "Supabase",
    purpose: "Database, authentication and file storage",
    location: "European Union",
    url: "https://supabase.com",
  },
  {
    name: "Amazon SES",
    purpose: "Outbound email delivery",
    location: "European Union (Stockholm)",
    url: "https://aws.amazon.com/ses/",
  },
  // TODO: payment processor (e.g. Stripe) once billing is live.
];

export type PricingTier = {
  /** Short label, e.g. "10k". Matches the in-app plan name. */
  name: string;
  /** Display price, e.g. "$5". */
  price: string;
  /** Numeric monthly price in USD. Drives the bandwidth slider math. */
  priceUsd: number;
  /** Display email allowance, e.g. "10,000". */
  emails: string;
  /** Numeric monthly email allowance. */
  emailsValue: number;
  emailsNote: string;
  blurb: string;
  /** The "Most popular" pick, highlighted in the slider carousel. */
  popular?: boolean;
};

/**
 * The paid plan ladder, mirroring `src/lib/plans-catalog.ts` in the app. day3
 * sells sending bandwidth: every plan has unlimited subscribers and every
 * feature, including the AI writing assistant, so the only axis that changes
 * is the monthly email allowance. (Higher tiers carry a larger AI allowance,
 * but no tier is without one.) The always-on free tier is deliberately not
 * listed here: it buys no bandwidth, so it isn't a plan you pick. It's just
 * what an account is before it subscribes. It isn't silent, though; sandbox mode
 * sends 100 real emails a month to the org's own members.
 */
export const pricingTiers: PricingTier[] = [
  {
    name: "1k",
    price: "$1",
    priceUsd: 1,
    emails: "1,000",
    emailsValue: 1000,
    emailsNote: "emails / month",
    blurb: "The lowest way in. A first list and your earliest updates.",
  },
  {
    name: "5k",
    price: "$3",
    priceUsd: 3,
    emails: "5,000",
    emailsValue: 5000,
    emailsNote: "emails / month",
    blurb: "A small list you email a few times a month.",
  },
  {
    name: "10k",
    price: "$5",
    priceUsd: 5,
    emails: "10,000",
    emailsValue: 10000,
    emailsNote: "emails / month",
    blurb: "A growing list on a regular update rhythm.",
    popular: true,
  },
  {
    name: "25k",
    price: "$8",
    priceUsd: 8,
    emails: "25,000",
    emailsValue: 25000,
    emailsNote: "emails / month",
    blurb: "Frequent sends to a list that's finding its traction.",
  },
  {
    name: "50k",
    price: "$14",
    priceUsd: 14,
    emails: "50,000",
    emailsValue: 50000,
    emailsNote: "emails / month",
    blurb: "An established list you mail on a steady schedule.",
  },
  {
    name: "100k",
    price: "$25",
    priceUsd: 25,
    emails: "100,000",
    emailsValue: 100000,
    emailsNote: "emails / month",
    blurb: "A large list that hears from you often.",
  },
  {
    name: "250k",
    price: "$60",
    priceUsd: 60,
    emails: "250,000",
    emailsValue: 250000,
    emailsNote: "emails / month",
    blurb: "Serious volume. A big list, mailed often.",
  },
  {
    name: "500k",
    price: "$115",
    priceUsd: 115,
    emails: "500,000",
    emailsValue: 500000,
    emailsNote: "emails / month",
    blurb: "High-volume sending without a sales call.",
  },
  {
    name: "1M",
    price: "$220",
    priceUsd: 220,
    emails: "1,000,000",
    emailsValue: 1000000,
    emailsNote: "emails / month",
    blurb: "A million emails a month, self-serve. Need more? Just ask.",
  },
];

/**
 * The cheapest plan that covers a given monthly send volume.
 *
 * Every worked pricing example on the site reads its price through this rather
 * than writing a figure into copy, so moving the ladder can never leave a stale
 * number sitting in a sentence.
 */
export function cheapestTierFor(monthlyEmails: number): PricingTier {
  return (
    pricingTiers.find((tier) => tier.emailsValue >= monthlyEmails) ??
    pricingTiers[pricingTiers.length - 1]
  );
}

export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const features: Feature[] = [
  {
    title: "Unlimited subscribers",
    description:
      "The list can be any size. It never changes what you pay.",
    icon: Users,
  },
  {
    title: "Billed on sends",
    description:
      "You pay for the emails you send. That's the only number that moves the price.",
    icon: Gauge,
  },
  {
    title: "Campaigns",
    description:
      "Write the email, choose who gets it, send. It all fits on one screen.",
    icon: Send,
  },
  {
    title: "Audiences",
    description:
      "Plain lists of subscribers. Import them, keep them clean, send to them.",
    icon: Users,
  },
  {
    title: "Delivery & engagement stats",
    description:
      "Sent, delivered, opened, clicked, bounced, unsubscribed. Enough to tell whether an email landed and got read.",
    icon: BarChart3,
  },
  {
    title: "Editor",
    description:
      "A composer that gets out of the way. Type the update and send it.",
    icon: PenLine,
  },
  {
    title: "Delivery",
    description:
      "Authenticated domains, one-click unsubscribe, and sensible sending defaults.",
    icon: ShieldCheck,
  },
  {
    title: "No upsell path",
    description:
      "No funnels, no lifecycle automation, no sales call before you can send.",
    icon: Feather,
  },
];

export const InfinitySymbol = InfinityIcon;
