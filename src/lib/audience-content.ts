import { Rocket, Code2, Building2, type LucideIcon } from "lucide-react";

export type AudiencePage = {
  /** URL segment under /for. */
  slug: string;
  /** Short label for hub cards and nav. */
  navLabel: string;
  icon: LucideIcon;

  // --- SEO ---
  metaTitle: string;
  metaDescription: string;
  keywords: string[];

  // --- On-page content ---
  eyebrow: string;
  /** H1. */
  title: string;
  /** Lede under the H1; reused as the hub-card description. */
  summary: string;
  /** The reader's situation, in their words. */
  painPoints: string[];
  /** How day3 fits — benefit blocks. */
  benefits: { title: string; description: string }[];
  faqs: { q: string; a: string }[];
};

export const audiencePages: AudiencePage[] = [
  {
    slug: "startups",
    navLabel: "Startups",
    icon: Rocket,
    metaTitle: "Email marketing for startups — pay for sends, not your list",
    metaDescription:
      "Your list grows faster than you send. day3 keeps subscribers unlimited and bills only by emails sent — so growth never taxes your budget. Built for product updates, not marketing suites.",
    keywords: [
      "email marketing for startups",
      "startup newsletter tool",
      "cheap email tool for startups",
      "product update emails startup",
    ],
    eyebrow: "For startups",
    title: "Your list grows fast. Your email bill shouldn't.",
    summary:
      "You add subscribers quickly and send sparingly. day3 bills by send, not list size — so a fast-growing list never inflates the bill.",
    painPoints: [
      "Every tool raises the price the moment your list crosses the next tier.",
      "You need to tell users what shipped — not build funnels or lifecycle automation.",
      "No time to learn a marketing platform. No sales call just to send an email.",
    ],
    benefits: [
      {
        title: "Unlimited subscribers",
        description:
          "Add users as fast as you can acquire them — sends are the only meter, so the bill holds flat.",
      },
      {
        title: "Live in minutes",
        description:
          "Verify a domain, import the list, write, send — a whole campaign fits on one screen.",
      },
      {
        title: "Deliverability built in",
        description:
          "Authenticated sending, double opt-in, and auto-suppression keep launch emails out of spam.",
      },
      {
        title: "Starts at $1/mo",
        description:
          "Priced for pre-revenue — and the list can grow as fast as you like without moving the bill.",
      },
    ],
    faqs: [
      {
        q: "What's the best email tool for an early-stage startup?",
        a: "If you mainly email users about product changes — not run automation — day3 keeps costs flat as the list grows. Subscribers are unlimited on every plan.",
      },
      {
        q: "Will day3 get more expensive as we grow?",
        a: "Only if you send more. Adding subscribers never raises the bill — day3 prices by sends, not list size.",
      },
    ],
  },
  {
    slug: "indie-developers",
    navLabel: "Indie developers",
    icon: Code2,
    metaTitle: "Email for indie developers & solo founders",
    metaDescription:
      "A no-nonsense email tool for indie hackers shipping product updates. Unlimited subscribers, billed by sends, forms you can embed anywhere, and optional AI drafting. No marketing suite to learn.",
    keywords: [
      "email tool for indie developers",
      "indie hacker newsletter",
      "developer changelog email",
      "solo founder email tool",
    ],
    eyebrow: "For indie developers",
    title: "Ship the update, send the email, get back to building.",
    summary:
      "Email your users about what's new — without paying per subscriber or learning a marketing platform. Built for a team of one.",
    painPoints: [
      "You're a team of one — no hours to spend wiring up audiences and automations.",
      "The list is an asset you built by hand. Paying more just to keep it is backwards.",
      "You want a form to drop into your site and a changelog email you can send in five minutes.",
    ],
    benefits: [
      {
        title: "Forms you can embed anywhere",
        description:
          "Hosted page, iframe, popup, or raw HTML — paste it into your site, bio, or docs, with double opt-in on by default.",
      },
      {
        title: "Billed on sends, not your list",
        description:
          "The audience you built stays free to keep — you pay only when you actually send.",
      },
      {
        title: "AI drafting when you're stuck",
        description:
          "Draft a campaign or rewrite a line with Claude — included from the 10k plan up.",
      },
      {
        title: "No upsell path",
        description:
          "No funnels, no automation, no sales call — just the email and who gets it.",
      },
    ],
    faqs: [
      {
        q: "Is day3 good for indie hackers?",
        a: "Yes. It's deliberately minimal, priced by sends so the list grows free, and ships embeddable forms plus AI drafting from the 10k plan up. Built for solo founders, not marketing teams.",
      },
      {
        q: "Can I add a signup form to my own site?",
        a: "Yes. Use a hosted page, an auto-resizing iframe, a JS popup, or a plain HTML form that POSTs to day3 — whichever fits your stack.",
      },
    ],
  },
  {
    slug: "saas",
    navLabel: "SaaS teams",
    icon: Building2,
    metaTitle: "Product update emails for SaaS teams",
    metaDescription:
      "Send changelogs and 'what's new' emails with a tool built for exactly that. Unlimited subscribers, send-based pricing, built-in deliverability and compliance. No marketing suite required.",
    keywords: [
      "product update email tool",
      "saas changelog email",
      "release notes newsletter",
      "email tool for saas",
      "what's new emails",
    ],
    eyebrow: "For SaaS teams",
    title: "Tell your users what shipped — reliably, every time.",
    summary:
      "Changelogs and release notes are a job of their own. day3 does that one job well — deliverability and compliance built in, pricing that ignores list size.",
    painPoints: [
      "Your marketing platform is overkill for a changelog — and it bills by contact count.",
      "Updates have to land in the inbox every time, without anyone babysitting sender reputation.",
      "Compliance — unsubscribe, suppression, consent — has to be handled right, not bolted on.",
    ],
    benefits: [
      {
        title: "Built for the update use case",
        description:
          "Write the release note, pick the audience, send — no campaign-builder maze in the way.",
      },
      {
        title: "Deliverability & compliance, standard",
        description:
          "Authenticated domains, one-click unsubscribe (RFC 8058), auto-suppression of bounces and complaints, and auto-pause on bad reputation.",
      },
      {
        title: "Unlimited subscribers",
        description:
          "Put your whole user base on the list — you're billed by sends, so list size never moves the price.",
      },
      {
        title: "Sends once, never twice",
        description:
          "A retried send never duplicates — every update goes out once, to the right people, with live delivery stats.",
      },
    ],
    faqs: [
      {
        q: "What's the best way to send product update emails?",
        a: "Use a tool built for that one job. day3 sends changelogs and 'what's new' emails with deliverability and compliance built in, unlimited subscribers, and pricing by sends rather than contact count.",
      },
      {
        q: "Does day3 handle unsubscribes and compliance?",
        a: "Yes. Every email carries one-click unsubscribe, bounced and complained addresses are suppressed automatically, consent IP is stored for form signups, and your mailing address is appended to footers as required.",
      },
    ],
  },
];

export function getAudiencePage(slug: string): AudiencePage | undefined {
  return audiencePages.find((page) => page.slug === slug);
}
