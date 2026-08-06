import {
  Send,
  Users,
  MousePointerClick,
  ShieldCheck,
  LineChart,
  Sparkles,
  Code2,
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
  /**
   * If set, the hub card and nav menu link here instead of /features/<slug>,
   * and no detail page is generated. Used for features that have their own
   * dedicated top-level page (e.g. deliverability → /deliverability).
   */
  href?: string;

  /** The card/menu title. */
  title: string;
  /** Lede under the H1; reused as the hub-card and menu description. */
  summary: string;

  // --- Detail-page-only (omitted for link-out cards) ---
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  eyebrow?: string;
  points?: FeaturePoint[];
  /** Powers the FAQ section + FAQPage structured data (great for AI answers). */
  faqs?: { q: string; a: string }[];
};

/**
 * One entry per /features/<slug> page. This is the content source of truth for
 * the feature hub, the individual feature pages, and the sitemap. Everything
 * here is factual against PRODUCT.md, with no speculative or unbuilt claims.
 */
export const featurePages: FeaturePage[] = [
  {
    slug: "campaigns",
    navLabel: "Campaigns",
    icon: Send,
    metaTitle: "Email campaigns: write, test, and send in one place",
    metaDescription:
      "Write a product update, send yourself a test, and ship it to your list, with live delivery stats. Billed by sends, never by subscriber count.",
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
      "One email to one audience. Compose, test, and send it, all on a single screen. No funnels, no approval maze.",
    points: [
      {
        title: "A composer that gets out of the way",
        description:
          "A plain editor with clean, inbox-ready formatting, so what you write is exactly what lands. No templates to wrangle.",
      },
      {
        title: "Merge tags that personalize",
        description:
          "Drop in {{first_name}}, {{last_name}}, or {{email}}. The unsubscribe footer and your mailing address are added for you.",
      },
      {
        title: "Send yourself a test first",
        description:
          "See the real thing in your own inbox before a single subscriber gets it.",
      },
      {
        title: "Live delivery stats",
        description:
          "Sent, delivered, bounced, complained, and unsubscribed update in real time, down to each recipient.",
      },
    ],
    faqs: [
      {
        q: "What is a campaign in day3?",
        a: "A single email to one audience: a product update, changelog, or announcement. Write it, test it, send it, and watch live delivery stats.",
      },
      {
        q: "Can I personalize emails?",
        a: "Yes. Use merge tags like {{first_name}} and {{email}} in the subject or body, and day3 fills them in per recipient.",
      },
      {
        q: "Does sending a campaign cost more for a bigger list?",
        a: "No. A campaign to 1,000 subscribers uses 1,000 of your monthly emails. The subscribers themselves are always free and unlimited.",
      },
    ],
  },
  {
    slug: "audiences",
    navLabel: "Audiences",
    icon: Users,
    metaTitle: "Audiences: unlimited subscribers, plain and simple lists",
    metaDescription:
      "Keep any number of subscribers in named lists. Import from CSV, add people by hand, and filter by status. List size never changes what you pay.",
    keywords: [
      "unlimited subscribers email",
      "email list management",
      "import subscribers csv",
      "email audience tool",
    ],
    eyebrow: "Audiences",
    title: "Unlimited subscribers. Plain lists you actually understand.",
    summary:
      "A named list of subscribers. Import them, add them by hand, and filter by status. Pay the same whether it's 200 or 200,000.",
    points: [
      {
        title: "Bring any list",
        description:
          "Import a CSV of email, first name, and last name. day3 dedupes, skips suppressed addresses, and lets you retry failed rows.",
      },
      {
        title: "Add people manually",
        description:
          "Drop in a single subscriber when you need to. No spreadsheet required.",
      },
      {
        title: "Status you can see",
        description:
          "Every subscriber has a clear status (subscribed, pending, unsubscribed, bounced, complained, or suppressed), so you always know who'll receive a send.",
      },
      {
        title: "Never billed per contact",
        description:
          "Most tools raise the price as your list grows. day3 never does. Subscriber count has zero effect on your bill.",
      },
    ],
    faqs: [
      {
        q: "Is there a limit on subscribers?",
        a: "No. Every day3 plan includes unlimited subscribers. You're billed by the emails you send each month, not by list size.",
      },
      {
        q: "How do I import my existing list?",
        a: "Upload a CSV with email, first_name, and last_name columns. day3 dedupes it, skips past unsubscribes and bounces, and lets you retry failed rows. Or script it against the API if you're migrating off another provider.",
      },
    ],
  },
  {
    slug: "signup-forms",
    navLabel: "Signup forms",
    icon: MousePointerClick,
    metaTitle: "Signup forms: hosted pages, embeds, popups, and raw HTML",
    metaDescription:
      "One signup form, installed anywhere: a hosted page, an embed, a popup, or plain HTML. Double opt-in is on by default.",
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
      "One form, four ways to install it: hosted, embedded, popup, or raw HTML. Double opt-in keeps your list clean from day one.",
    points: [
      {
        title: "Hosted page",
        description:
          "A shareable link for your bio, emails, and social. No website required.",
      },
      {
        title: "Embed or popup",
        description:
          "Drop an auto-resizing embed into any site builder, or trigger a popup on click, delay, scroll, or exit intent.",
      },
      {
        title: "Raw HTML",
        description:
          "A plain form that posts straight to day3, no JavaScript, for when you want full control.",
      },
      {
        title: "Double opt-in by default",
        description:
          "New signups confirm by email before they get a campaign. Better deliverability, with GDPR consent recorded for you.",
      },
    ],
    faqs: [
      {
        q: "Where can I put a day3 signup form?",
        a: "Anywhere. Share the hosted page, embed it in any site builder, trigger a popup, or paste a raw HTML form that posts straight to day3.",
      },
      {
        q: "What is double opt-in and is it required?",
        a: "It means a new subscriber confirms their email before getting any campaign. It's on by default to protect deliverability, and you can toggle it per form.",
      },
    ],
  },
  {
    // Deliverability has its own dedicated page at /deliverability; this card
    // links there instead of a duplicate /features/deliverability detail page.
    slug: "deliverability",
    navLabel: "Deliverability",
    icon: ShieldCheck,
    href: "/deliverability",
    title: "Land in the inbox, not the spam folder.",
    summary:
      "Authenticated domains, one-click unsubscribe, and automatic suppression of bad addresses. All standard, not sold separately.",
  },
  {
    slug: "metrics",
    navLabel: "Metrics",
    icon: LineChart,
    metaTitle: "Metrics: opens, clicks, deliverability, and reputation",
    metaDescription:
      "See what happens after you send: opens, clicks, a delivery funnel, and reputation gauges, across every campaign, with a per-campaign breakdown.",
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
      "One page for deliverability, reputation, and engagement across every campaign: opens, clicks, bounces, complaints, and unsubscribes, with a per-campaign breakdown.",
    points: [
      {
        title: "Opens and clicks",
        description:
          "Opens and clicks tracked per recipient, counted once each. Every link lands only on the URL you sent.",
      },
      {
        title: "A delivery funnel",
        description:
          "Sent, delivered, opened, clicked, with the delivery rate, so you see exactly where a send lands.",
      },
      {
        title: "Reputation gauges",
        description:
          "Bounce and complaint gauges scaled to your provider's thresholds, with a clear health status, so you stay deliverable.",
      },
      {
        title: "Honest about the numbers",
        description:
          "Apple Mail and other proxies pre-load images, which can inflate opens. day3 flags that instead of pretending the number is exact.",
      },
    ],
    faqs: [
      {
        q: "Does day3 track opens and clicks?",
        a: "Yes. Opens and clicks are tracked per recipient, counted once each. A click also counts as an open, since a click proves the email was opened.",
      },
      {
        q: "Can I see deliverability and sender reputation?",
        a: "Yes. The Metrics page shows a sent-to-clicked delivery funnel plus bounce and complaint gauges scaled to your provider's thresholds, so you stay deliverable.",
      },
    ],
  },
  {
    slug: "ai-assist",
    navLabel: "AI assist",
    icon: Sparkles,
    metaTitle: "AI assist: draft and refine product emails",
    metaDescription:
      "AI that drafts a campaign from a brief, suggests subject lines and preview text, and rewrites what you highlight. Powered by Claude, included on every paid plan.",
    keywords: [
      "AI email writer",
      "AI newsletter generator",
      "subject line generator",
      "AI copywriting email",
    ],
    eyebrow: "AI assist",
    title: "A writing assistant, when you want one.",
    summary:
      "Draft a campaign from a short brief, get subject lines and preview text, and rewrite what you highlight. Powered by Claude, and included on every paid plan.",
    points: [
      {
        title: "Draft a whole campaign",
        description:
          "Give it a short brief and get back a subject line, preview text, and full body. Then make it your own.",
      },
      {
        title: "Subject line ideas",
        description:
          "Generate five alternative subject lines and pick the one that fits.",
      },
      {
        title: "Edit with AI",
        description:
          "Highlight any text and describe the change in plain words, and day3 rewrites just that selection.",
      },
      {
        title: "Included on every paid plan",
        description:
          "From $1/mo up. Bigger plans carry a bigger AI allowance, but no paid plan is without one. Every AI output stays inbox-ready with your merge tags intact.",
      },
    ],
    faqs: [
      {
        q: "Which plans include the AI assistant?",
        a: "Every paid plan, starting at $1/mo. Higher tiers come with a larger AI allowance. The free tier has none. It can send in sandbox mode, but the writing assistant is what a paid plan turns on.",
      },
      {
        q: "Which AI model does day3 use?",
        a: "It's powered by Claude (via OpenRouter). It can draft a campaign, suggest subject lines, write preview text, and rewrite selected copy, all kept inbox-ready.",
      },
      {
        q: "What happens when I use up my AI allowance?",
        a: "The AI tools switch off until the allowance resets. Writing by hand carries on untouched. Moving up a plan buys a bigger allowance.",
      },
    ],
  },
  {
    slug: "api",
    navLabel: "API",
    icon: Code2,
    metaTitle: "API & MCP: transactional email, contacts, and campaigns from code",
    metaDescription:
      "A REST API for transactional email, audiences, contacts, fields, segments, topics, suppressions, and campaigns, plus an MCP server so your AI editor can write the email. Built for migrating off another provider and keeping your app in sync.",
    keywords: [
      "email marketing API",
      "transactional email API",
      "newsletter API",
      "MCP email server",
      "migrate mailchimp list API",
      "resend alternative API",
      "subscriber sync API",
    ],
    eyebrow: "API & MCP",
    title: "All of it, over HTTPS.",
    summary:
      "One REST API for your app's transactional email, your audiences, and your campaigns, plus an MCP server that turns your AI editor into a composer. Built so migrating from another provider is one script and staying in sync afterwards is a webhook handler.",
    points: [
      {
        title: "Transactional email in one call",
        description:
          "POST /v1/emails sends password resets, receipts, and magic links from the same verified domain and the same monthly allowance as your newsletter. Send an Idempotency-Key and a network retry can never double-send, even when it races its own first attempt. Poll the email for queued → sent → delivered, or the bounce that explains why not.",
      },
      {
        title: "Built for migration",
        description:
          "Import up to 1,000 contacts per call with per-row results, address them by email or id, and upsert instead of colliding. Coming from Resend or Mailchimp is a short script, not a project.",
      },
      {
        title: "Bring your opt-outs",
        description:
          "Import contacts already marked unsubscribed with the date they left on, and push your existing suppression list straight in, so nobody who opted out ever hears from you again. Do that first and their contact rows are rejected on the way in.",
      },
      {
        title: "MCP: your editor is a composer",
        description:
          "Point Claude Code, Cursor, or VS Code at one URL and describe the email where you already work. It arrives in day3 as editable composer blocks rather than a wall of HTML. It converts back, too, so an email you finished by hand reads out as Markdown again.",
      },
      {
        title: "Keys you control, scoped to what you meant",
        description:
          "Create and revoke bearer keys on the API keys page; the key is shown once and only its hash is stored. Sending a campaign to a real audience needs a key explicitly minted with that permission, and it can't be added later, so an assistant holding an ordinary key can draft all day and reach nobody.",
      },
      {
        title: "The docs live in the app",
        description:
          "Quickstart, endpoint map, and cURL / JavaScript / Python snippets sit under your key list, pre-filled with your own audience id. Every resource page has a `</>` panel with its ids copyable, and there's a copy-paste prompt that hands the whole reference to your AI coding assistant.",
      },
    ],
    faqs: [
      {
        q: "Does day3 have an API?",
        a: "Yes. A REST API at /api/v1 covering transactional email, audiences, contacts, custom fields, segments, topics, the suppression list, and campaigns. It uses bearer API keys, JSON with snake_case, cursor pagination, machine-readable error codes, and idempotency keys on writes.",
      },
      {
        q: "Can I send transactional email through day3?",
        a: "Yes. POST /v1/emails takes from, to (up to 50 recipients), subject, and html or text, and returns an id you can poll for delivery status. It leaves from the same verified domain as your campaigns and draws on the same monthly allowance. Unsubscribes are ignored, so someone who left the newsletter still gets their password reset, but hard bounces and complaints are still refused.",
      },
      {
        q: "Can I migrate my list from another provider?",
        a: "That's what it's designed for. Batch up to 1,000 contacts per call, upsert by email, carry over custom fields, and import your unsubscribes and suppression list so the opt-outs come with you. Import the suppressions first and day3 will refuse those contacts on the way in, which is the guard working rather than an error.",
      },
      {
        q: "What is day3's MCP server?",
        a: "An HTTP endpoint at /api/mcp that lets an AI editor (Claude Code, Cursor, VS Code) read your audiences and senders, write and preview a campaign, and send you a test. Setup is one line with the same bearer key as the REST API. What it writes lands in day3 as real editable blocks, so you can finish the email in the visual composer.",
      },
      {
        q: "Can an AI assistant email my subscribers by accident?",
        a: "No. Writing, previewing, and test sends are open. A test only reaches addresses you name. Sending or scheduling to a real audience needs a key you deliberately created with the campaigns:send permission, and it can't be granted to an existing key. Both send tools are also marked destructive, so editors prompt before running them.",
      },
      {
        q: "Is the API on every plan?",
        a: "Yes, including free. The free tier's 500-subscriber cap applies to API writes too, so an import that would cross it is rejected whole rather than half-applied. Its sandbox sending means you can integrate the transactional API end to end before paying.",
      },
    ],
  },
];

export function getFeaturePage(slug: string): FeaturePage | undefined {
  return featurePages.find((page) => page.slug === slug);
}
