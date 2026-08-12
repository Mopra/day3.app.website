import { Rocket, Code2, Building2, type LucideIcon } from "lucide-react";

/**
 * One scenario, priced off the live ladder by the template rather than written
 * into copy. Same discipline as the comparison pages: a number in a sentence goes
 * stale, a number computed from `pricingTiers` cannot.
 */
export type AudienceWorkedExample = {
  scenario: string;
  subscribers: number;
  monthlySends: number;
  /** What per-subscriber pricing would be metering instead. Never a competitor price. */
  contrast: string;
};

export type AudiencePage = {
  /** URL segment under /for. */
  slug: string;
  /** Short label for hub cards and nav. */
  navLabel: string;
  icon: LucideIcon;
  /** ISO date of the last substantive content change. Drives sitemap lastmod. */
  updated: string;

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
  /** How day3 fits, as benefit blocks. */
  benefits: { title: string; description: string }[];
  /** The pricing argument on real numbers, for this reader's shape of list. */
  worked: AudienceWorkedExample;
  /** The prose half: what this reader should actually expect. */
  deepDive: { heading: string; paragraphs: string[] };
  /** Where day3 is the wrong call for this reader. Honest, and it earns citations. */
  wrongFit: string;
  faqs: { q: string; a: string }[];
  /** Refs into the internal link mesh. See lib/internal-links.ts. */
  related: string[];
};

export const audiencePages: AudiencePage[] = [
  {
    slug: "startups",
    navLabel: "Startups",
    icon: Rocket,
    updated: "2026-08-12",
    metaTitle: "Email marketing for startups, priced by sends",
    metaDescription:
      "Your list grows faster than you send. day3 keeps subscribers unlimited and bills only by emails sent, so growth never taxes the budget. From $1/mo.",
    keywords: [
      "email marketing for startups",
      "startup newsletter tool",
      "cheap email tool for startups",
      "product update emails startup",
    ],
    eyebrow: "For startups",
    title: "Your list grows fast. Your email bill shouldn't.",
    summary:
      "You add subscribers quickly and send sparingly. day3 bills by send, not list size, so a fast-growing list never inflates the bill.",
    painPoints: [
      "Every tool raises the price the moment your list crosses the next tier.",
      "You need to tell users what shipped, not build funnels or lifecycle automation.",
      "No time to learn a marketing platform. No sales call just to send an email.",
      "Signups arrive in bursts after a launch, and most of them won't hear from you for weeks.",
    ],
    benefits: [
      {
        title: "Unlimited subscribers",
        description:
          "Add users as fast as you can acquire them. Sends are the only meter, so the bill holds flat.",
      },
      {
        title: "Live in minutes",
        description:
          "Verify a domain, import the list, write, send. A whole campaign fits on one screen.",
      },
      {
        title: "Deliverability built in",
        description:
          "Authenticated sending, double opt-in, and auto-suppression keep launch emails out of spam.",
      },
      {
        title: "Starts at $1/mo",
        description:
          "Priced for pre-revenue, and the list can grow as fast as you like without moving the bill.",
      },
    ],
    worked: {
      scenario:
        "You launch, pick up 12,000 signups over a quarter, and email the whole list twice in that time.",
      subscribers: 12_000,
      monthlySends: 8_000,
      contrast:
        "Per-subscriber pricing meters the 12,000 people on the list, every month, including the two months you sent nothing",
    },
    deepDive: {
      heading: "Why the two meters diverge for a startup",
      paragraphs: [
        "A startup's list and its sending schedule grow at completely different rates. Signups arrive in bursts, driven by a launch, a Show HN, a podcast mention. Sending stays roughly constant, because it's gated by how often you actually ship something worth telling people about, which is a function of engineering time rather than of audience size.",
        "Per-subscriber pricing charges for the first curve. Send-based pricing charges for the second. In the early months, when the list is compounding and the release cadence isn't, that difference is most of your email bill.",
        "It also removes a small but real perverse incentive. When contacts cost money, there's pressure to prune the list, to not put every signup on it, to delete the people who haven't opened anything in six months. All of that is optimising your list for your billing model rather than for your business. When subscribers are free, the correct list is simply the accurate one.",
        "The practical version: put your whole user base on it. Keep the churned accounts, marked as churned. Keep the people who unsubscribed, marked as unsubscribed. None of it costs anything and all of it is worth having when you eventually want to segment.",
      ],
    },
    wrongFit:
      "If your growth plan runs on lifecycle email, onboarding drips, trial-nurture sequences or win-back flows, day3 is the wrong tool today. Automations are designed but not shipped, so you'd be buying a promise. Pick a marketing platform, or plan to run one alongside day3 rather than instead of it.",
    faqs: [
      {
        q: "What's the best email tool for an early-stage startup?",
        a: "If you mainly email users about product changes rather than run automation, day3 keeps costs flat as the list grows. Subscribers are unlimited on every plan.",
      },
      {
        q: "Will day3 get more expensive as we grow?",
        a: "Only if you send more. Adding subscribers never raises the bill. day3 prices by sends, not list size.",
      },
      {
        q: "Can we use day3 for our app's transactional email too?",
        a: "Yes, and it's usually the reason startups pick it. Password resets, receipts and magic links go out through one API call from the same verified domain and the same monthly allowance as your campaigns, so you're not paying and configuring two vendors.",
      },
      {
        q: "What happens to our data if we stop paying?",
        a: "You drop to the free tier and keep everything: audiences, domains, drafts, sending history. It all exports as CSV or JSON whenever you want it. Nothing is held hostage to a subscription.",
      },
      {
        q: "Is $1/mo a real price or an introductory rate?",
        a: "Real. Delivery costs roughly $0.10 per 1,000 emails, so the low tiers are priced against card processing fees rather than against email. Every tier covers its own costs as it stands.",
      },
    ],
    related: [
      "page:/how-it-works",
      "compare:mailchimp-alternative",
      "feature:api",
      "page:/deliverability",
      "for:saas",
      "page:/pricing",
    ],
  },
  {
    slug: "indie-developers",
    navLabel: "Indie developers",
    icon: Code2,
    updated: "2026-08-12",
    metaTitle: "Email for indie developers & solo founders",
    metaDescription:
      "A no-nonsense email tool for indie hackers shipping product updates. Unlimited subscribers, billed by sends, embeddable forms, and an MCP server for your editor.",
    keywords: [
      "email tool for indie developers",
      "indie hacker newsletter",
      "developer changelog email",
      "solo founder email tool",
    ],
    eyebrow: "For indie developers",
    title: "Ship the update, send the email, get back to building.",
    summary:
      "Email your users about what's new, without paying per subscriber or learning a marketing platform. Built for a team of one.",
    painPoints: [
      "You're a team of one, with no hours to spend wiring up audiences and automations.",
      "The list is an asset you built by hand. Paying more just to keep it is backwards.",
      "You want a form to drop into your site and a changelog email you can send in five minutes.",
      "Writing the email is the part that stops you shipping the announcement at all.",
    ],
    benefits: [
      {
        title: "Forms you can embed anywhere",
        description:
          "Hosted page, iframe, popup, or raw HTML. Paste it into your site, bio, or docs, with double opt-in on by default.",
      },
      {
        title: "Billed on sends, not your list",
        description:
          "The audience you built stays free to keep. You pay only when you actually send.",
      },
      {
        title: "Draft it where you already work",
        description:
          "Point Claude Code, Cursor, or VS Code at day3's MCP server and describe the email next to the commits it's about. It arrives as editable composer blocks.",
      },
      {
        title: "No upsell path",
        description:
          "No funnels, no automation, no sales call. Just the email and who gets it.",
      },
    ],
    worked: {
      scenario:
        "3,000 subscribers picked up over two years, emailed roughly every six weeks when a release lands.",
      subscribers: 3_000,
      monthlySends: 3_000,
      contrast:
        "Per-subscriber pricing meters all 3,000 every month, including the five weeks in six when you send nothing",
    },
    deepDive: {
      heading: "The changelog email you keep not sending",
      paragraphs: [
        "The common failure for a solo developer isn't picking the wrong email tool, it's never sending the email. The release ships, the changelog gets written for the docs, and the announcement stays in a draft because writing it properly is a separate hour you don't have and the tool wants you to pick a template first.",
        "Two things in day3 target exactly that hour. The composer has no template step: a campaign is a subject, a body, and an audience, on one screen. And the MCP server means you can write the thing from your editor, where the commit messages and the changelog file already are, rather than from a blank text box in a browser tab.",
        "In practice that looks like telling Claude Code to draft a release email from the changelog entries since the last tag. What lands in day3 is editable blocks, not a wall of HTML, so you fix the two sentences that are wrong and send. The AI assistant in the app does the same job from a brief if you'd rather not leave the browser.",
        "Sending to a real audience from an editor needs an API key explicitly minted with the campaigns:send permission, and that permission can't be added to a key later. So an assistant holding your ordinary key can draft and preview all day and reach nobody. That's the guard that makes this safe to leave switched on.",
      ],
    },
    wrongFit:
      "If your newsletter is the product rather than an announcement channel for one, day3 is the wrong shape. There are no paid subscriptions, no archive pages, no referral or recommendation network, and no public web home for the letter. A creator platform will serve you better, and so will a markdown-first tool if writing in Markdown inside the app is the thing you actually want.",
    faqs: [
      {
        q: "Is day3 good for indie hackers?",
        a: "Yes. It's deliberately minimal, priced by sends so the list grows free, and ships embeddable forms plus AI drafting on every paid plan. Built for solo founders, not marketing teams.",
      },
      {
        q: "Can I add a signup form to my own site?",
        a: "Yes. Use a hosted page, an auto-resizing iframe, a JS popup, or a plain HTML form that POSTs to day3, whichever fits your stack.",
      },
      {
        q: "Can I write and send a campaign from my code editor?",
        a: "You can write, preview and test one. day3 runs an MCP server, so Claude Code, Cursor or VS Code can read your audiences, draft a campaign into real editable blocks, and send you a test. Sending to a real audience needs a key deliberately created with the campaigns:send permission.",
      },
      {
        q: "What does day3 cost if I only send a few times a year?",
        a: "Whatever tier covers the sends you actually make, and you can move down between sends. Since the list costs nothing in between, an occasional sender pays far less than on a per-subscriber plan. Allowances don't roll over, so pick the tier that fits the send rather than the year.",
      },
      {
        q: "Is there an API on the free tier?",
        a: "Yes, the full REST API including transactional sending. The free tier's 500-subscriber cap applies to API writes too, and sending is sandboxed to your own org members, so you can integrate end to end before paying anything.",
      },
    ],
    related: [
      "feature:api",
      "feature:signup-forms",
      "compare:buttondown-alternative",
      "page:/how-it-works",
      "feature:ai-assist",
      "page:/pricing",
    ],
  },
  {
    slug: "saas",
    navLabel: "SaaS teams",
    icon: Building2,
    updated: "2026-08-12",
    metaTitle: "Product update emails for SaaS teams",
    metaDescription:
      "Send changelogs and release notes with a tool built for that one job. Unlimited subscribers, send-based pricing, and deliverability and compliance as standard.",
    keywords: [
      "product update email tool",
      "saas changelog email",
      "release notes newsletter",
      "email tool for saas",
      "what's new emails",
    ],
    eyebrow: "For SaaS teams",
    title: "Tell your users what shipped. Reliably, every time.",
    summary:
      "Changelogs and release notes are a job of their own. day3 does that one job well, with deliverability and compliance built in and pricing that ignores list size.",
    painPoints: [
      "Your marketing platform is overkill for a changelog, and it bills by contact count.",
      "Updates have to land in the inbox every time, without anyone babysitting sender reputation.",
      "Compliance (unsubscribe, suppression, consent) has to be handled right, not bolted on.",
      "Your app already sends transactional mail through a second vendor, on a second domain, with a second reputation to watch.",
    ],
    benefits: [
      {
        title: "Built for the update use case",
        description:
          "Write the release note, pick the audience, send. No campaign-builder maze in the way.",
      },
      {
        title: "Deliverability & compliance, standard",
        description:
          "Authenticated domains, one-click unsubscribe (RFC 8058), auto-suppression of bounces and complaints, and auto-pause on bad reputation.",
      },
      {
        title: "Unlimited subscribers",
        description:
          "Put your whole user base on the list. You're billed by sends, so list size never moves the price.",
      },
      {
        title: "Sends once, never twice",
        description:
          "A retried send never duplicates. Every update goes out once, to the right people, with live delivery stats.",
      },
    ],
    worked: {
      scenario:
        "20,000 users. Your app sends 30,000 transactional emails a month, and you ship a product update to everyone twice.",
      subscribers: 20_000,
      monthlySends: 70_000,
      contrast:
        "Split across two vendors that's two allowances, two DKIM setups, two reputations and two invoices, for the same 70,000 emails",
    },
    deepDive: {
      heading: "One domain, one reputation",
      paragraphs: [
        "The usual SaaS setup has transactional mail on one vendor because engineering picked it, and campaigns on another because marketing did. It works, but it splits the thing you can least afford to split: sender reputation. Two DKIM selectors on the same domain, or worse two domains, means two reputations that mailbox providers score separately, and a bad campaign can drag down the deliverability of your password resets.",
        "Consolidating means one authenticated domain, one reputation to keep clean, and one dashboard when a customer says the reset never arrived. It also means the monthly volume is a single number against a single allowance rather than two subscriptions sized independently.",
        "The behaviours that should differ still do. Campaigns respect unsubscribes; transactional ignores them, because leaving the newsletter shouldn't stop a receipt. Both refuse hard bounces and complaints, because those addresses damage you whatever you're sending. And if bounce or complaint rates climb toward the thresholds your provider cares about, sending pauses rather than continuing until someone external makes the decision for you.",
        "For the compliance side: one-click unsubscribe is implemented to RFC 8058, which Gmail and Yahoo now expect from bulk senders rather than treat as a nicety. Consent timestamps and IPs are recorded for form signups. Your postal address is appended to campaign footers. None of that is a paid add-on.",
      ],
    },
    wrongFit:
      "If a marketing team owns email and needs approval workflows, A/B testing, multi-touch attribution or a shared content calendar, day3 will feel thin, because it is: those are deliberate omissions rather than a roadmap. It's also the wrong fit for agencies managing client accounts, since there's no multi-account or white-label layer.",
    faqs: [
      {
        q: "What's the best way to send product update emails?",
        a: "Use a tool built for that one job. day3 sends changelogs and 'what's new' emails with deliverability and compliance built in, unlimited subscribers, and pricing by sends rather than contact count.",
      },
      {
        q: "Does day3 handle unsubscribes and compliance?",
        a: "Yes. Every email carries one-click unsubscribe, bounced and complained addresses are suppressed automatically, consent IP is stored for form signups, and your mailing address is appended to footers as required.",
      },
      {
        q: "Can we send transactional and marketing email from the same domain?",
        a: "Yes, and that's the point. Both leave the same verified domain against the same monthly allowance, so there's one reputation to keep clean instead of two. Unsubscribes apply to campaigns only; hard bounces and complaints are refused for both.",
      },
      {
        q: "Does day3 support subscription topics, so users choose what they hear about?",
        a: "Yes. Topics let a contact opt into some kinds of email and not others, which usually beats an all-or-nothing unsubscribe for a product list. Saved segments cover the other direction, targeting by custom field or status.",
      },
      {
        q: "What happens if our sending reputation degrades?",
        a: "Bounce and complaint gauges are scaled to your provider's own thresholds, and sending pauses automatically if reputation crosses into risky territory rather than continuing until someone else stops you. That's a guard, not a penalty: it protects the domain your transactional mail also depends on.",
      },
    ],
    related: [
      "feature:api",
      "page:/deliverability",
      "feature:metrics",
      "page:/security",
      "compare:resend-alternative",
      "page:/gdpr",
    ],
  },
];

export function getAudiencePage(slug: string): AudiencePage | undefined {
  return audiencePages.find((page) => page.slug === slug);
}
