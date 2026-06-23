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
  // day3 isn't live yet — we're still pre-launch. Flip `isPreview` to false on
  // launch day to hide the pre-launch banner and badge everywhere at once.
  isPreview: true,
  previewNote:
    "day3 launches in days, not months. Sign up now to set things up before we go live.",
};

export const navLinks = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Features", href: "/features" },
  { label: "Compare", href: "/compare" },
  { label: "Pricing", href: "/pricing" },
];

/**
 * Company + founder facts. The single source of truth for both the JSON-LD
 * entity signals (what search and AI answer engines read) and the human copy on
 * the About / trust pages. Change a fact once, here.
 */
export const company = {
  legalName: "Pradsgaard Labs EMV",
  // A real, registered entity is a strong trust + EEAT signal. CVR is the Danish
  // company registration number — independently verifiable.
  cvr: "DK46156153",
  website: "https://pradsgaardlabs.com",
  founder: "Morten Pradsgaard",
  founderTitle: "Founder & engineer",
  // Also the maker of exit1.dev — a real, verifiable track record is an EEAT win.
  alsoBuilds: { name: "exit1.dev", href: "https://exit1.dev" },
  foundingYear: 2026, // TODO: confirm for schema.org foundingDate
  city: "Copenhagen",
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
 * EU-region — that's the whole point of day3's data story.
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
      "Plain lists of subscribers. Import them, keep them clean, send to them.",
    icon: Users,
  },
  {
    title: "Delivery stats",
    description:
      "Sent, delivered, bounced, complained, unsubscribed. Enough to tell whether an email landed.",
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
