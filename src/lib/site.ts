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
  contactEmail: "hello@day3.app",
  location: "Copenhagen, Denmark",
  // day3 isn't live yet — we're collecting founding members ahead of launch.
  // Flip `isPreview` to false on launch day to hide the pre-launch banner and
  // badge everywhere at once.
  isPreview: true,
  previewNote:
    "day3 launches in days, not months. Sign up now to claim a founding-member rate before we go live.",
};

/**
 * The headline pre-launch deal: a full year of the 10,000-emails/mo plan,
 * pre-paid, at a founding rate. Shown prominently on the homepage and pricing
 * page. Both CTAs route through the normal signup flow (`signupUrl`).
 */
export const foundingOffer = {
  price: "$36",
  cadence: "for your first year",
  monthlyEquivalent: "Works out to $3/mo, billed once for the year",
  emails: "10,000",
  emailsNote: "emails every month",
  total: "120,000 emails across the year",
  regularPrice: "$60", // 12 × the standard $5/mo
  savings: "40%",
  renewalNote:
    "After year one it renews at the standard $5/mo — and only if you want to keep going.",
};

export const navLinks = [
  { label: "Founding offer", href: "/#founding" },
  { label: "Pricing", href: "/#pricing" },
  { label: "How it works", href: "/#model" },
  { label: "Features", href: "/#features" },
];

export type PricingTier = {
  price: string;
  cadence: string;
  emails: string;
  emailsNote: string;
  blurb: string;
  featured?: boolean;
  // Optional callout shown on the card — e.g. the founding pre-launch rate.
  foundingNote?: string;
};

export const pricingTiers: PricingTier[] = [
  {
    price: "$5",
    cadence: "/mo",
    emails: "10,000",
    emailsNote: "emails / month",
    blurb: "A first list and a handful of campaigns.",
    foundingNote: "Founding rate: $36 for your first year",
  },
  {
    price: "$20",
    cadence: "/mo",
    emails: "50,000",
    emailsNote: "emails / month",
    blurb: "A growing list you mail on a regular schedule.",
    featured: true,
  },
  {
    price: "$50",
    cadence: "/mo",
    emails: "200,000",
    emailsNote: "emails / month",
    blurb: "A large list that hears from you often.",
  },
];

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
      "Plain lists. Segment them when it helps; leave them alone when it doesn't.",
    icon: Users,
  },
  {
    title: "Analytics",
    description:
      "Opens, clicks, unsubscribes. Enough to tell whether an email landed.",
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
