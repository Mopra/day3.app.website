import {
  Send,
  Users,
  MousePointerClick,
  ShieldCheck,
  LineChart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type FeaturePoint = {
  title: string;
  description: string;
};

export type FeaturePage = {
  /** URL segment under /features. */
  slug: string;
  /** Short label for hub cards and breadcrumbs. */
  navLabel: string;
  icon: LucideIcon;

  // --- SEO ---
  metaTitle: string;
  metaDescription: string;
  keywords: string[];

  // --- On-page content ---
  eyebrow: string;
  /** The page H1. */
  title: string;
  /** Lede under the H1; reused as the hub-card description. */
  summary: string;
  points: FeaturePoint[];
  /** Powers the FAQ section + FAQPage structured data (great for AI answers). */
  faqs: { q: string; a: string }[];
};

/**
 * One entry per /features/<slug> page. This is the content source of truth for
 * the feature hub, the individual feature pages, and the sitemap. Everything
 * here is factual against PRODUCT.md — no speculative or unbuilt claims.
 */
export const featurePages: FeaturePage[] = [
  {
    slug: "campaigns",
    navLabel: "Campaigns",
    icon: Send,
    metaTitle: "Email campaigns — write, test, and send in one place",
    metaDescription:
      "Compose a product update in a distraction-free editor, send yourself a test, and ship it to your list. Live delivery stats included. Billed by sends, never by subscriber count.",
    keywords: [
      "email campaign tool",
      "product update emails",
      "newsletter editor",
      "send product updates",
      "changelog email",
    ],
    eyebrow: "Campaigns",
    title: "Write the email, choose who gets it, send.",
    summary:
      "A campaign is one email to one audience. Everything you need to compose, check, and send it fits on a single screen — no funnels, no approval maze.",
    points: [
      {
        title: "A composer that gets out of the way",
        description:
          "A rich-text editor constrained to email-safe HTML, so what you write is exactly what lands in the inbox. No drag-and-drop template wrangling.",
      },
      {
        title: "Merge tags that personalize",
        description:
          "Drop in {{first_name}}, {{last_name}}, or {{email}}. The unsubscribe footer and your mailing address are appended automatically for compliance.",
      },
      {
        title: "Send yourself a test first",
        description:
          "Fire a test email to your own inbox and see the real thing before a single subscriber gets it.",
      },
      {
        title: "Live delivery stats",
        description:
          "Watch sent, delivered, bounced, complained, and unsubscribed update in real time, with a recipient-level table and an undeliverable list.",
      },
    ],
    faqs: [
      {
        q: "What is a campaign in day3?",
        a: "A campaign is a single email sent to one audience — a product update, changelog, or announcement. You write it, send a test, submit it, and day3 delivers it in batches while you watch live stats.",
      },
      {
        q: "Can I personalize emails?",
        a: "Yes. Use merge tags like {{first_name}} and {{email}} in the subject or body, and day3 fills them in per recipient at send time.",
      },
      {
        q: "Does sending a campaign cost more for a bigger list?",
        a: "The plan price is fixed. A campaign to 1,000 subscribers uses 1,000 of your monthly emails; the subscribers themselves are always free and unlimited.",
      },
    ],
  },
  {
    slug: "audiences",
    navLabel: "Audiences",
    icon: Users,
    metaTitle: "Audiences — unlimited subscribers, plain and simple lists",
    metaDescription:
      "Keep any number of subscribers in named lists. Import from CSV, add people manually, and filter by status. Your list size never changes what you pay.",
    keywords: [
      "unlimited subscribers email",
      "email list management",
      "import subscribers csv",
      "email audience tool",
    ],
    eyebrow: "Audiences",
    title: "Unlimited subscribers. Plain lists you actually understand.",
    summary:
      "An audience is a named list of subscribers. Import them, add them by hand, and filter by status. The list can be 200 people or 200,000 — it never moves the price.",
    points: [
      {
        title: "Bring any list",
        description:
          "Import subscribers from a CSV with email, first name, and last name. Imports dedupe, skip suppressed addresses, and let you retry failed rows.",
      },
      {
        title: "Add people manually",
        description:
          "Drop in a single subscriber when you need to, no spreadsheet required.",
      },
      {
        title: "Status you can see",
        description:
          "Every subscriber is subscribed, pending, unsubscribed, bounced, complained, or suppressed. Search and filter so you always know who'll actually receive a send.",
      },
      {
        title: "Never billed per contact",
        description:
          "Most tools charge you more as your list grows. day3 doesn't. Subscriber count has zero effect on your bill.",
      },
    ],
    faqs: [
      {
        q: "Is there a limit on subscribers?",
        a: "No. Every day3 plan includes unlimited subscribers. You're billed by the number of emails you send each month, not by list size.",
      },
      {
        q: "How do I import my existing list?",
        a: "Upload a CSV with email, first_name, and last_name columns. day3 dedupes the file, filters out anyone who previously unsubscribed or bounced, and tracks progress so you can retry failed rows.",
      },
    ],
  },
  {
    slug: "signup-forms",
    navLabel: "Signup forms",
    icon: MousePointerClick,
    metaTitle: "Signup forms — hosted pages, embeds, popups, and raw HTML",
    metaDescription:
      "Grow your list with one form primitive you can install anywhere: a hosted page, an iframe embed, a JS popup, or a plain HTML form. Double opt-in is on by default.",
    keywords: [
      "email signup form",
      "embeddable newsletter form",
      "double opt-in form",
      "popup email signup",
      "hosted signup page",
    ],
    eyebrow: "Signup forms",
    title: "One form, installed anywhere you can paste a snippet.",
    summary:
      "Capture new subscribers with a single form primitive and four ways to install it — hosted, embedded, popup, or raw HTML. Double opt-in protects your sender reputation from day one.",
    points: [
      {
        title: "Hosted page",
        description:
          "A shareable link for your bio, emails, and social — no website required.",
      },
      {
        title: "Embed or popup",
        description:
          "Drop an auto-resizing iframe into Webflow, WordPress, or Squarespace, or trigger a JS popup on click, delay, scroll depth, or exit intent.",
      },
      {
        title: "Raw HTML",
        description:
          "A plain <form> that POSTs straight to day3 with no JavaScript at all — for when you want full control.",
      },
      {
        title: "Double opt-in by default",
        description:
          "New signups confirm via a signed link before they're ever emailed a campaign. Better deliverability, and GDPR consent IP is stored automatically.",
      },
    ],
    faqs: [
      {
        q: "Where can I put a day3 signup form?",
        a: "Anywhere. Share the hosted page as a link, embed an auto-resizing iframe in any website builder, trigger a popup with the embed script, or paste a raw HTML form that POSTs directly to day3.",
      },
      {
        q: "What is double opt-in and is it required?",
        a: "Double opt-in means a new subscriber confirms their email via a signed link before receiving any campaign. It's on by default in day3 to protect your sender reputation, and can be toggled per form.",
      },
    ],
  },
  {
    slug: "deliverability",
    navLabel: "Deliverability",
    icon: ShieldCheck,
    metaTitle: "Deliverability — authenticated domains and clean sending, built in",
    metaDescription:
      "Verified sending domains with DKIM, SPF, and DMARC, one-click unsubscribe, and automatic suppression of bounces and complaints. Deliverability isn't an add-on in day3.",
    keywords: [
      "email deliverability",
      "DKIM SPF DMARC setup",
      "one-click unsubscribe",
      "sender reputation",
      "verified sending domain",
    ],
    eyebrow: "Deliverability",
    title: "Land in the inbox. Deliverability is built in, not sold separately.",
    summary:
      "Authenticated domains, one-click unsubscribe, and automatic suppression of bad addresses come standard. The boring, important parts of email are handled for you.",
    points: [
      {
        title: "Authenticated sending domains",
        description:
          "Verify your own domain with DKIM, SPF, and DMARC records. day3 shows you exactly what to publish and rechecks until it's verified.",
      },
      {
        title: "One-click DNS via Cloudflare",
        description:
          "Connect a Cloudflare account and day3 writes the DNS records for you — no copy-pasting TXT records by hand.",
      },
      {
        title: "One-click unsubscribe",
        description:
          "RFC 8058 List-Unsubscribe headers and a public unsubscribe page, with signed tokens so the link can't be forged.",
      },
      {
        title: "Automatic suppression",
        description:
          "Bounces, complaints, and unsubscribes are suppressed automatically so you never email a bad address twice. Sustained bad reputation auto-pauses sending to protect you.",
      },
    ],
    faqs: [
      {
        q: "Does day3 handle SPF, DKIM, and DMARC?",
        a: "Yes. You add your sending domain and day3 gives you the exact DKIM, SPF, and DMARC records to publish — or writes them for you automatically if you connect Cloudflare. Campaigns require a verified domain.",
      },
      {
        q: "How does day3 protect my sender reputation?",
        a: "Bounced, complained, and unsubscribed addresses are suppressed automatically, every email includes one-click unsubscribe, and an account with sustained bad reputation is auto-paused before it can do real damage.",
      },
    ],
  },
  {
    slug: "metrics",
    navLabel: "Metrics",
    icon: LineChart,
    metaTitle: "Metrics — opens, clicks, deliverability, and reputation",
    metaDescription:
      "See what your emails do after they send: open and click tracking, a delivery funnel, and bounce/complaint reputation gauges. One Metrics page across every campaign, with a per-campaign breakdown.",
    keywords: [
      "email open tracking",
      "email click tracking",
      "email deliverability metrics",
      "newsletter analytics",
      "email sender reputation",
    ],
    eyebrow: "Metrics",
    title: "See what happens after you hit send.",
    summary:
      "A single Metrics page pulls together deliverability, reputation, and engagement across every campaign — opens, clicks, bounces, complaints, and unsubscribes — with a sortable per-campaign breakdown.",
    points: [
      {
        title: "Opens and clicks",
        description:
          "Per-recipient open and click tracking, counted once each. Click links are signed so a redirect can only ever land on a URL you sent — never an open redirect.",
      },
      {
        title: "A delivery funnel",
        description:
          "Sent → delivered → opened → clicked, with the delivery rate, so you can see exactly where a send lands.",
      },
      {
        title: "Reputation gauges",
        description:
          "Bounce-rate and complaint-rate gauges scaled to the thresholds your email provider reviews against, with a clear health status — so you stay deliverable.",
      },
      {
        title: "Honest about the numbers",
        description:
          "Privacy proxies like Apple Mail pre-load images, which can overstate opens. day3 flags that in the UI rather than pretending the number is exact.",
      },
    ],
    faqs: [
      {
        q: "Does day3 track opens and clicks?",
        a: "Yes. Every sent email carries a signed tracking pixel for opens and signed redirect links for clicks, each counted once per recipient. A click also back-fills an open, since a click proves the email was opened.",
      },
      {
        q: "Can I see deliverability and sender reputation?",
        a: "Yes. The Metrics page shows a sent → delivered → opened → clicked funnel plus bounce-rate and complaint-rate gauges scaled to your provider's review thresholds, so you can keep your sender reputation healthy.",
      },
    ],
  },
  {
    slug: "ai-assist",
    navLabel: "AI assist",
    icon: Sparkles,
    metaTitle: "AI assist — draft and refine product emails",
    metaDescription:
      "An AI writing assistant that drafts a full campaign from a short brief, generates subject lines and preview text, and rewrites selected copy. Powered by Claude, included on the 10k plan and up.",
    keywords: [
      "AI email writer",
      "AI newsletter generator",
      "subject line generator",
      "AI copywriting email",
    ],
    eyebrow: "AI assist",
    title: "A writing assistant, when you want one.",
    summary:
      "AI help that drafts a campaign from a short brief, suggests subject lines, writes preview text, and rewrites the bits you highlight. Powered by Claude, and included on the 10k plan and up.",
    points: [
      {
        title: "Draft a whole campaign",
        description:
          "Give it a short brief and get back a subject line, preview text, and a full body — then edit it and make it your own.",
      },
      {
        title: "Subject line ideas",
        description:
          "Generate five alternative subject lines and pick the one that fits.",
      },
      {
        title: "Edit with AI",
        description:
          "Highlight any text in the editor and describe the change in plain language — 'make this punchier and add a clear call to action' — and day3 rewrites just that selection.",
      },
      {
        title: "Included from the 10k plan up",
        description:
          "The assistant comes with the 10k plan ($5/mo) and every plan above it. Every AI output runs through the same email-safe sanitizer and keeps your merge tags intact.",
      },
    ],
    faqs: [
      {
        q: "Which plans include the AI assistant?",
        a: "The AI writing assistant is included on the 10k plan ($5/mo) and up. On the 1k and 5k plans day3 works exactly the same without it — AI helps you write, but it's never required to send.",
      },
      {
        q: "Which AI model does day3 use?",
        a: "AI assist is powered by Claude (via OpenRouter) by default. It can draft a campaign from a brief, suggest subject lines, write preview text, and rewrite selected copy — all kept email-safe.",
      },
    ],
  },
];

export function getFeaturePage(slug: string): FeaturePage | undefined {
  return featurePages.find((page) => page.slug === slug);
}
