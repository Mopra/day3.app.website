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
  signupUrl: "https://go.day3.app/signup",
  loginUrl: "https://go.day3.app/login",
  contactEmail: "hello@day3.app",
  location: "Copenhagen, Denmark",
  // While day3 is still being finished. Flip `isPreview` to false at launch to
  // hide the preview banner and badge everywhere at once.
  isPreview: true,
  previewNote:
    "day3 is in early preview — a few things are still rough, but you can sign up and start sending today.",
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
    blurb: "A first list and a handful of campaigns.",
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
