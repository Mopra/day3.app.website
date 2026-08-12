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

/**
 * Longer-form prose under the points grid.
 *
 * The points grid answers "does it do the thing"; this answers "how does it
 * actually behave", which is the half a card can't carry and the half both a
 * careful reader and an answer engine need. Every feature page that generates a
 * detail route has one.
 */
export type FeatureDeepDive = {
  heading: string;
  paragraphs: string[];
};

export type FeaturePage = {
  /** URL segment under /features. */
  slug: string;
  /** Short label for hub cards and breadcrumbs. */
  navLabel: string;
  icon: LucideIcon;
  /** ISO date of the last substantive content change. Drives sitemap lastmod. */
  updated: string;
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
  deepDive?: FeatureDeepDive;
  /** Powers the FAQ section + FAQPage structured data (great for AI answers). */
  faqs?: { q: string; a: string }[];
  /** Refs into the internal link mesh. See lib/internal-links.ts. */
  related?: string[];
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
    updated: "2026-08-12",
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
    deepDive: {
      heading: "What sending actually looks like",
      paragraphs: [
        "A campaign in day3 is one email to one audience. There is no campaign type to pick, no funnel to attach it to, and no approval chain between the draft and the send. You write it, choose who gets it, and either send it now or schedule it for later.",
        "Delivery goes out in batches rather than in one burst, which is what keeps a large send from tripping rate limits at the receiving end. If day3's own provider rate-limits mid-send, the send pauses and resumes on its own instead of failing the campaign. If a delivery job retries after a crash, nobody gets a second copy: the send is idempotent per recipient, so a retry picks up where it stopped rather than starting again.",
        "Every send is also capped by your plan's monthly allowance, checked before the batch starts rather than discovered halfway through. A campaign that would cross the cap is refused whole. That is deliberate: a partially delivered announcement is worse than one you send tomorrow on a bigger plan.",
        "While it runs, the campaign page fills in: sent, delivered, opened, clicked, bounced, complained, unsubscribed, down to individual recipients. You can close the tab. Nothing about a send needs watching.",
      ],
    },
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
      {
        q: "Can I schedule a campaign?",
        a: "Yes. Pick a time instead of sending immediately, and the campaign goes out then. Scheduling counts against the same monthly allowance at the point it sends, not when you schedule it.",
      },
      {
        q: "What happens if a send fails halfway through?",
        a: "It resumes rather than restarting. Delivery is idempotent per recipient, so a retried job never double-sends, and a provider rate limit pauses the send and picks it back up on its own.",
      },
      {
        q: "What if a campaign would exceed my monthly limit?",
        a: "It's refused before the first batch goes out, not halfway through. A partially delivered announcement is worse than sending it tomorrow on a plan with room, so day3 blocks the whole send rather than truncating it.",
      },
    ],
    related: [
      "feature:audiences",
      "feature:ai-assist",
      "feature:metrics",
      "page:/deliverability",
      "page:/how-it-works",
      "for:saas",
    ],
  },
  {
    slug: "audiences",
    navLabel: "Audiences",
    icon: Users,
    updated: "2026-08-12",
    metaTitle: "Audiences: unlimited subscribers on every plan",
    metaDescription:
      "Keep any number of subscribers in named lists. Import from CSV or the API, filter by status, and never pay for list size. Subscribers are free on every plan.",
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
    deepDive: {
      heading: "Six statuses, and why they matter",
      paragraphs: [
        "Every contact carries exactly one status, and it decides whether a send reaches them. Subscribed means they get campaigns. Pending means they signed up through a double opt-in form and haven't confirmed yet, so they don't. Unsubscribed means they left. Bounced means their address failed hard. Complained means they marked an email as spam. Suppressed means the address is blocked at the account level, whatever list it appears on.",
        "The last three are not a filing system, they are reputation protection. A hard bounce or a complaint suppresses the address automatically, and a suppressed address stays out of every future send even if you re-import it from a CSV tomorrow. That is the mechanism that stops one stale list from costing you the inbox for everything else you send.",
        "Because subscribers are free, there is no reason to prune a list to save money, which is the usual cause of accidentally deleting people you'd want back. Import your whole user base. Keep the ones who left, marked as having left. The only number that touches your bill is how many emails you actually send this month.",
        "If you're moving from another provider, import your suppression list before your contacts. day3 then refuses the contact rows that match it, which is the guard doing its job rather than an import error.",
      ],
    },
    faqs: [
      {
        q: "Is there a limit on subscribers?",
        a: "No. Every day3 plan includes unlimited subscribers. You're billed by the emails you send each month, not by list size. The one exception is the free tier, which caps at 500 subscribers because it isn't a plan you buy.",
      },
      {
        q: "How do I import my existing list?",
        a: "Upload a CSV with email, first_name, and last_name columns. day3 dedupes it, skips past unsubscribes and bounces, and lets you retry failed rows. Or script it against the API if you're migrating off another provider.",
      },
      {
        q: "What are the subscriber statuses?",
        a: "Subscribed, pending, unsubscribed, bounced, complained, and suppressed. Only subscribed contacts receive a campaign. Pending means an unconfirmed double opt-in signup. The last three are set automatically to protect your sending reputation.",
      },
      {
        q: "If a bounced address re-imports, will day3 email it again?",
        a: "No. Suppression is account-wide and survives re-import, so an address that hard-bounced or complained stays out of every send even if it appears in a fresh CSV. That's deliberate: re-mailing a known-bad address is one of the fastest ways to damage a domain's reputation.",
      },
      {
        q: "Can I keep people who unsubscribed on the list?",
        a: "Yes, and you should. They import and stay with an unsubscribed status, so you keep the record without ever mailing them. Since subscribers are free, there's no cost to keeping an accurate history.",
      },
    ],
    related: [
      "feature:signup-forms",
      "feature:campaigns",
      "feature:api",
      "page:/how-it-works",
      "compare:mailchimp-alternative",
      "page:/gdpr",
    ],
  },
  {
    slug: "signup-forms",
    navLabel: "Signup forms",
    icon: MousePointerClick,
    updated: "2026-08-12",
    metaTitle: "Email signup forms: embed, popup, or hosted page",
    metaDescription:
      "One signup form, installed four ways: a hosted page, an auto-resizing embed, a popup, or raw HTML. Double opt-in on by default, with consent recorded.",
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
    deepDive: {
      heading: "Why double opt-in is the default",
      paragraphs: [
        "A single opt-in form adds whatever someone typed straight to your list. That includes typos, other people's addresses, spam-trap addresses dropped in by bots, and the address of someone who has no idea they were signed up. Every one of those hurts you later: a typo becomes a hard bounce, a trap becomes a complaint, and both push your domain's reputation down for every subsequent send.",
        "Double opt-in adds one step. The address gets a confirmation email and stays at pending status until someone clicks the link in it. Nobody who can't receive mail at that address ever reaches your list, and nobody who didn't want to be there stays.",
        "It also produces the record the GDPR expects. day3 stores the consent timestamp and the IP the signup came from, so if anyone ever asks how a contact ended up on your list you have an answer rather than a shrug.",
        "You can turn it off per form. Sometimes that's right: a form behind a login, where you already know the address is real and the person is yours, doesn't need a confirmation round trip. Anything on the open web does.",
      ],
    },
    faqs: [
      {
        q: "Where can I put a day3 signup form?",
        a: "Anywhere. Share the hosted page, embed it in any site builder, trigger a popup, or paste a raw HTML form that posts straight to day3.",
      },
      {
        q: "What is double opt-in and is it required?",
        a: "It means a new subscriber confirms their email before getting any campaign. It's on by default to protect deliverability, and you can toggle it per form.",
      },
      {
        q: "Does day3 record consent for the GDPR?",
        a: "Yes. Form signups store a consent timestamp and the originating IP address, so you can show when and how a contact opted in. That record is what turns a list into a lawful basis rather than an assertion.",
      },
      {
        q: "When should I turn double opt-in off?",
        a: "Only where the address is already verified and the relationship already exists, such as a form behind a login. On anything reachable from the open web, leave it on: single opt-in is how bot signups and spam traps get onto a list.",
      },
      {
        q: "Can I trigger a popup on exit intent?",
        a: "Yes. The popup can fire on click, after a delay, at a scroll depth, or on exit intent, set per form. The embed script is one tag and the popup shares the same form definition, so you're not maintaining two of anything.",
      },
    ],
    related: [
      "feature:audiences",
      "page:/gdpr",
      "page:/deliverability",
      "for:indie-developers",
      "compare:buttondown-alternative",
      "page:/how-it-works",
    ],
  },
  {
    // Deliverability has its own dedicated page at /deliverability; this card
    // links there instead of a duplicate /features/deliverability detail page.
    slug: "deliverability",
    navLabel: "Deliverability",
    icon: ShieldCheck,
    updated: "2026-08-12",
    href: "/deliverability",
    title: "Land in the inbox, not the spam folder.",
    summary:
      "Authenticated domains, one-click unsubscribe, and automatic suppression of bad addresses. All standard, not sold separately.",
  },
  {
    slug: "metrics",
    navLabel: "Metrics",
    icon: LineChart,
    updated: "2026-08-12",
    metaTitle: "Email metrics: opens, clicks & sender reputation",
    metaDescription:
      "A delivery funnel, opens and clicks per recipient, and bounce and complaint gauges scaled to your provider's thresholds. Honest about open rates.",
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
    deepDive: {
      heading: "The two numbers that actually matter",
      paragraphs: [
        "Open rate is the metric everyone quotes and the one worth trusting least. Apple Mail Privacy Protection and similar proxies fetch tracking pixels on the recipient's behalf, whether or not anyone read the email, which inflates opens by an amount that varies with your audience's mail clients and can't be corrected for. day3 shows the number and says this out loud rather than presenting it as a measurement.",
        "The two that do matter are bounce rate and complaint rate, because they're the two your email provider watches to decide whether to keep carrying your mail. Both are shown as gauges scaled to the provider's own thresholds rather than as bare percentages, so you can see how much headroom you have rather than having to remember what a dangerous number looks like.",
        "Clicks are the honest engagement signal. A click requires a human action that a proxy won't fake, and day3 counts one per recipient per campaign rather than counting every time someone reopens the same email. A click also implies an open, so a clicked email is counted as opened even if the pixel never loaded.",
        "All of it is available per recipient, not just in aggregate. When someone asks whether jane@ got the release note, the answer is a search rather than an inference.",
      ],
    },
    faqs: [
      {
        q: "Does day3 track opens and clicks?",
        a: "Yes. Opens and clicks are tracked per recipient, counted once each. A click also counts as an open, since a click proves the email was opened.",
      },
      {
        q: "Can I see deliverability and sender reputation?",
        a: "Yes. The Metrics page shows a sent-to-clicked delivery funnel plus bounce and complaint gauges scaled to your provider's thresholds, so you stay deliverable.",
      },
      {
        q: "Why are my open rates unreliable?",
        a: "Because Apple Mail Privacy Protection and similar proxies pre-load tracking pixels whether or not anyone read the email. That inflates opens by an amount nobody can correct for. day3 flags this rather than presenting the number as exact. Clicks are the metric to trust, because a proxy won't click a link.",
      },
      {
        q: "What bounce rate is too high?",
        a: "Providers generally start acting well below 5%, and complaint rates matter from about 0.1%. Rather than expecting you to remember those numbers, day3 scales its gauges to your provider's own thresholds and shows a health status, so a problem reads as a problem.",
      },
      {
        q: "Can I see whether one specific person got an email?",
        a: "Yes. Delivery, opens, clicks, bounces and unsubscribes are all recorded per recipient and searchable by address, so a question about one contact is a lookup rather than a guess.",
      },
    ],
    related: [
      "page:/deliverability",
      "feature:campaigns",
      "feature:audiences",
      "for:saas",
      "page:/security",
      "page:/how-it-works",
    ],
  },
  {
    slug: "ai-assist",
    navLabel: "AI assist",
    icon: Sparkles,
    updated: "2026-08-12",
    metaTitle: "AI assist: draft and refine product emails",
    metaDescription:
      "AI that drafts a campaign from a brief, suggests subject lines, and rewrites what you highlight. Powered by Claude, included on every paid plan from $1/mo.",
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
      {
        q: "Can I cap what AI usage costs me?",
        a: "Yes. Set a monthly AI budget per account and assisted writing stops there. That's separate from the plan allowance and exists so that generous use can't turn into a surprise line item.",
      },
      {
        q: "Will AI-written emails break my formatting or merge tags?",
        a: "No. Output comes back as the same inbox-safe blocks the composer uses, with merge tags like {{first_name}} left intact rather than rewritten into prose. You can edit any of it by hand afterwards.",
      },
      {
        q: "Do I have to use the AI at all?",
        a: "No. It's a panel you open, not a step in the flow. Every campaign can be written entirely by hand, and the free tier has no AI allowance at all without losing any sending capability.",
      },
    ],
    deepDive: {
      heading: "Where AI helps and where it doesn't",
      paragraphs: [
        "The assistant is good at the parts of a product email that are structurally the same every time: turning a list of shipped changes into readable prose, producing five subject lines so you can reject four, and writing preview text, which almost everyone leaves empty and which materially affects whether an email gets opened.",
        "It is less good at knowing what matters. It has your brief and nothing else: not the support thread that prompted the change, not the customer who asked for it, not the thing you'd rather not draw attention to yet. Which is why it drafts into the composer rather than sending, and why nothing in day3 will email your list without you clicking send.",
        "If you already write in an editor, the MCP server is usually the better path than the in-app assistant. Describing the email in Claude Code or Cursor, where your changelog and your commit history already are, produces a better draft than describing it from scratch in a text box, and it arrives in day3 as editable blocks either way.",
      ],
    },
    related: [
      "feature:campaigns",
      "feature:api",
      "page:/pricing",
      "for:indie-developers",
      "compare:convertkit-alternative",
      "page:/how-it-works",
    ],
  },
  {
    slug: "api",
    navLabel: "API",
    icon: Code2,
    updated: "2026-08-12",
    metaTitle: "Email API & MCP server for transactional email",
    metaDescription:
      "A REST API for transactional email, audiences, contacts, segments and suppressions, plus an MCP server so your AI editor can draft the campaign. On every plan.",
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
    deepDive: {
      heading: "One allowance for both jobs",
      paragraphs: [
        "Most teams end up with two email vendors: one for the transactional mail their app has to send, and one for the campaigns marketing wants to send. That means two sending domains or two DKIM selectors on the same one, two reputations to watch, two dashboards to check when something doesn't arrive, and two bills.",
        "day3 collapses that. POST /v1/emails and a campaign leave from the same verified domain and draw on the same monthly allowance, so a month where you send 18,000 password resets and 2,000 launch notes is simply a 20,000-email month. There is one reputation, one place to look when a customer says they didn't get the reset, and one line on the invoice.",
        "The two paths differ where they should. Unsubscribes apply to campaigns and are ignored for transactional, because someone who left the newsletter still needs their receipt. Hard bounces and complaints are refused for both, because a dead address is a dead address and mailing it damages you either way.",
        "Retry safety is handled at the protocol level rather than left to you. Send an Idempotency-Key with a transactional call and a network retry can never produce a second email, even when the retry races the original request. That is the difference between a password reset flow you can trust under load and one that occasionally double-sends.",
      ],
    },
    related: [
      "compare:resend-alternative",
      "feature:audiences",
      "page:/deliverability",
      "for:saas",
      "page:/security",
      "page:/pricing",
    ],
  },
];

export function getFeaturePage(slug: string): FeaturePage | undefined {
  return featurePages.find((page) => page.slug === slug);
}
