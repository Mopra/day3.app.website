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
      "A startup's list grows faster than its sending. day3 keeps subscribers unlimited and bills only by emails sent, so your email tool doesn't tax your growth. Built for product updates, not marketing suites.",
    keywords: [
      "email marketing for startups",
      "startup newsletter tool",
      "cheap email tool for startups",
      "product update emails startup",
    ],
    eyebrow: "For startups",
    title: "Your list grows fast. Your email bill shouldn't.",
    summary:
      "Startups add subscribers quickly but send sparingly. day3's send-based pricing means a fast-growing list never inflates your bill — you pay for the updates you actually send.",
    painPoints: [
      "Every tool wants to charge you more the moment your list crosses the next tier.",
      "You need to tell users what shipped — not run lifecycle automation or build funnels.",
      "You don't have time to learn a marketing platform, and you don't want a sales call to send an email.",
    ],
    benefits: [
      {
        title: "Unlimited subscribers",
        description:
          "Grow the list as fast as you can. It never changes what you pay — sends are the only meter.",
      },
      {
        title: "Live in minutes",
        description:
          "Verify a domain, import your list, write an update, send. A campaign fits on one screen.",
      },
      {
        title: "Deliverability built in",
        description:
          "Authenticated sending, double opt-in, and auto-suppression keep you out of spam folders from day one.",
      },
      {
        title: "Cheap while you're small",
        description:
          "10,000 emails a month for $5 — and the list can grow as fast as you like without changing the bill.",
      },
    ],
    faqs: [
      {
        q: "What's the best email tool for an early-stage startup?",
        a: "If your main need is emailing users about product changes — not running marketing automation — a focused, send-priced tool like day3 keeps costs flat as your list grows and stays out of your way. Subscribers are unlimited on every plan.",
      },
      {
        q: "Will day3 get more expensive as we grow?",
        a: "Only if you send more emails. Adding subscribers never raises your bill, because day3 prices by sends, not list size.",
      },
    ],
  },
  {
    slug: "indie-developers",
    navLabel: "Indie developers",
    icon: Code2,
    metaTitle: "Email for indie developers & solo founders",
    metaDescription:
      "A no-nonsense email tool for indie hackers shipping product updates. Unlimited subscribers, billed by sends, signup forms you can embed anywhere, and optional AI drafting. No marketing suite to learn.",
    keywords: [
      "email tool for indie developers",
      "indie hacker newsletter",
      "developer changelog email",
      "solo founder email tool",
    ],
    eyebrow: "For indie developers",
    title: "Ship the update, send the email, get back to building.",
    summary:
      "For indie hackers and solo founders who want to email their users about what's new — without paying per subscriber or learning a marketing platform.",
    painPoints: [
      "You're a team of one. You don't have hours to spend configuring audiences and automations.",
      "Your list is the asset you've slowly built — being charged more for keeping it feels backwards.",
      "You want signup forms you can drop into your site and a changelog email you can send in five minutes.",
    ],
    benefits: [
      {
        title: "Forms you can embed anywhere",
        description:
          "Hosted page, iframe embed, popup, or raw HTML — paste it into your site, bio, or docs. Double opt-in on by default.",
      },
      {
        title: "Billed on sends, not your list",
        description:
          "The audience you've built is free to keep. You only pay when you actually send.",
      },
      {
        title: "Optional AI drafting",
        description:
          "Stuck on wording? Draft a campaign or rewrite a line with Claude — optional, and off until you turn it on.",
      },
      {
        title: "No upsell path",
        description:
          "No funnels, no lifecycle automation, no sales call. Just the email and who gets it.",
      },
    ],
    faqs: [
      {
        q: "Is day3 good for indie hackers?",
        a: "Yes — it's deliberately minimal, priced by sends so your list stays free to grow, and includes embeddable signup forms and optional AI drafting. It's built for solo founders sending product updates, not marketing teams.",
      },
      {
        q: "Can I add a signup form to my own site?",
        a: "Yes. day3 gives you a hosted page, an auto-resizing iframe embed, a JS popup, or a plain HTML form that POSTs directly to day3 — install whichever fits your stack.",
      },
    ],
  },
  {
    slug: "saas",
    navLabel: "SaaS teams",
    icon: Building2,
    metaTitle: "Product update emails for SaaS teams",
    metaDescription:
      "Send changelogs and 'what's new' emails to your users with a tool built for exactly that. Unlimited subscribers, send-based pricing, built-in deliverability and compliance. No marketing suite required.",
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
      "Changelogs, release notes, and 'what's new' emails are a job of their own. day3 does exactly that one job well, with deliverability and compliance built in and pricing that ignores your list size.",
    painPoints: [
      "Your full marketing platform is overkill for a changelog — and it bills you by contact count.",
      "Product updates need to actually land in the inbox, every time, without you babysitting sender reputation.",
      "You need compliance — unsubscribe, suppression, consent — handled correctly, not bolted on.",
    ],
    benefits: [
      {
        title: "Built for the update use case",
        description:
          "Write the release note, pick the audience, send. No campaign-builder maze between you and a 'what's new' email.",
      },
      {
        title: "Deliverability & compliance, standard",
        description:
          "Authenticated domains, one-click unsubscribe (RFC 8058), automatic suppression of bounces and complaints, and account auto-pause on bad reputation.",
      },
      {
        title: "Unlimited subscribers",
        description:
          "Your whole user base on the list, billed only by the emails you send. List size never moves the price.",
      },
      {
        title: "Reliable, idempotent sending",
        description:
          "A retried send never duplicates an email. Updates go out once, to the right people, with live delivery stats.",
      },
    ],
    faqs: [
      {
        q: "What's the best way to send product update emails?",
        a: "Use a tool focused on that one job. day3 sends changelogs and 'what's new' emails to an audience with built-in deliverability and compliance, unlimited subscribers, and pricing based on emails sent rather than contact count.",
      },
      {
        q: "Does day3 handle unsubscribes and compliance?",
        a: "Yes. Every email includes one-click unsubscribe, bounced and complained addresses are suppressed automatically, consent IP is stored for form signups, and your mailing address is appended to footers as legally required.",
      },
    ],
  },
];

export function getAudiencePage(slug: string): AudiencePage | undefined {
  return audiencePages.find((page) => page.slug === slug);
}
