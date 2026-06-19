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
  promise: "Send your emails. Don't overpay. Don't think too hard.",
  signupUrl: "https://go.day3.app/signup",
  loginUrl: "https://go.day3.app/login",
  contactEmail: "hello@day3.app",
  location: "Copenhagen, Denmark",
};

export const navLinks = [
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
};

export const pricingTiers: PricingTier[] = [
  {
    price: "$5",
    cadence: "/mo",
    emails: "10,000",
    emailsNote: "emails / month",
    blurb: "For your first list and your first few campaigns.",
  },
  {
    price: "$20",
    cadence: "/mo",
    emails: "50,000",
    emailsNote: "emails / month",
    blurb: "For a growing audience and a regular sending rhythm.",
    featured: true,
  },
  {
    price: "$50",
    cadence: "/mo",
    emails: "200,000",
    emailsNote: "emails / month",
    blurb: "For an established list that hears from you often.",
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
      "Grow the list as big as you like. You're never billed for the size of your audience.",
    icon: Users,
  },
  {
    title: "Send-based pricing",
    description:
      "Pay for the emails you actually send. No subscriber tax, no surprise tiers.",
    icon: Gauge,
  },
  {
    title: "Campaigns",
    description:
      "Write an email, pick who gets it, send. The whole flow fits on one screen.",
    icon: Send,
  },
  {
    title: "Audiences",
    description:
      "Simple, honest lists. Segment when you need to, ignore it when you don't.",
    icon: Users,
  },
  {
    title: "Simple analytics",
    description:
      "Opens, clicks, unsubscribes. The numbers that matter, none of the noise.",
    icon: BarChart3,
  },
  {
    title: "Clean editor",
    description:
      "A calm, distraction-free composer. Type your update and hit send.",
    icon: PenLine,
  },
  {
    title: "Reliable delivery",
    description:
      "Authenticated domains, one-click unsubscribe, and good sending hygiene built in.",
    icon: ShieldCheck,
  },
  {
    title: "No enterprise bloat",
    description:
      "No funnels, no lifecycle orchestration, no sales calls. Just send the email.",
    icon: Feather,
  },
];

export const InfinitySymbol = InfinityIcon;
