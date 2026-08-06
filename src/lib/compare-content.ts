/**
 * Source of truth for the /compare/<slug> "alternative" pages.
 *
 * IMPORTANT — accuracy policy: competitor claims here are deliberately about the
 * *pricing model and product philosophy* (per-subscriber vs per-send, breadth of
 * scope), which are durable and verifiable. We do NOT quote competitors' specific
 * dollar prices or feature counts, because those change often and a stale number
 * reads as misleading. Keep every comparison fair and model-level.
 */

export type CompareRow = {
  dimension: string;
  day3: string;
  competitor: string;
};

export type ComparePage = {
  /** URL segment, always "<competitor>-alternative". */
  slug: string;
  /** Display name of the competitor. */
  competitor: string;

  // --- SEO ---
  metaTitle: string;
  metaDescription: string;
  keywords: string[];

  // --- On-page content ---
  /** H1. */
  title: string;
  /** Lede under the H1. */
  intro: string;
  /** The core model-level distinction, one tight paragraph. */
  difference: string;
  comparison: CompareRow[];
  /** Why teams move to day3 — bullet points. */
  reasonsToSwitch: { title: string; description: string }[];
  /** Honest "stay where you are if…" — builds trust and earns AI citations. */
  stayIf: string;
  faqs: { q: string; a: string }[];
};

/** Constant day3 facts reused across comparison rows. */
const DAY3 = {
  pricing: "By emails sent each month",
  subscribers: "Unlimited on every plan",
  freeTier:
    "Free tier sends in sandbox mode (100/mo, your own team) — paid from $1/mo to reach everyone else",
  scope: "Product updates and transactional email, on purpose narrow",
  startingPrice: "$1/mo for 1,000 emails",
};

export const comparePages: ComparePage[] = [
  /*
    Resend is the one competitor this audience is most likely already paying, and
    the only one where day3 overlaps on the *transactional* side rather than
    undercutting on list pricing. So this page is written to be fair rather than
    to win: Resend's DX is genuinely good, the two tools can coexist, and the
    honest answer to "do I have to switch" is no.

    Note what this page does NOT do: enumerate what Resend's contacts API can't
    do. The internal spec keeps that table because it drove our design, but a
    competitor's API changes without telling us, and a public page listing their
    gaps ages into a page listing our inaccuracies. Every row here is about what
    each tool is built around — durable, and the actual decision anyway.
  */
  {
    slug: "resend-alternative",
    competitor: "Resend",
    metaTitle: "A Resend alternative with the list layer built in",
    metaDescription:
      "Resend is a developer-first email API. day3 sends transactional the same shape — one POST, idempotent retries, per-email status — and brings the campaign side with it: audiences, segments, topics, forms, and compliance.",
    keywords: [
      "resend alternative",
      "resend alternative for newsletters",
      "resend vs day3",
      "transactional email api alternative",
      "resend broadcasts alternative",
    ],
    title: "A Resend alternative that brings the list with it.",
    intro:
      "Resend set the bar for what an email API should feel like, and day3 sends transactional in the same shape: one POST, an idempotency key, per-email delivery status.",
    difference:
      "The difference is everything around the send. day3 is built for the campaign side too — audiences with custom fields, live segments, subscription topics, hosted signup forms, double opt-in, one-click unsubscribe — so your password resets and your product updates run on one domain, one allowance, and one bill.",
    comparison: [
      { dimension: "Pricing model", day3: DAY3.pricing, competitor: "By monthly email volume" },
      { dimension: "Subscriber limits", day3: DAY3.subscribers, competitor: "Tiered" },
      {
        dimension: "Built around",
        day3: "Product updates and transactional, one setup",
        competitor: "A developer-first email API, with broadcasts alongside it",
      },
      {
        dimension: "List layer",
        day3: "Custom fields, live segments, subscription topics, suppression list",
        competitor: "Audiences and contacts",
      },
      {
        dimension: "Growing the list",
        day3: "Hosted pages, embeds, popups and raw HTML forms — double opt-in on by default",
        competitor: "Bring your own form",
      },
      {
        dimension: "Writing the email",
        day3: "Visual composer, AI assistant, and an MCP server so your editor can draft it",
        competitor: "React Email components in your own codebase",
      },
      {
        dimension: "Best for",
        day3: "Small SaaS teams who need the campaign side too",
        competitor: "Teams who mainly need an email API",
      },
    ],
    reasonsToSwitch: [
      {
        title: "One domain, one bill",
        description:
          "Password resets and launch notes leave the same verified domain, against the same monthly allowance.",
      },
      {
        title: "The list layer is included",
        description:
          "Custom fields, live segments, topics, signup forms, double opt-in, one-click unsubscribe, automatic suppression. Nothing to build.",
      },
      {
        title: "Your opt-outs come too",
        description:
          "Import contacts already marked unsubscribed and your whole suppression list, so a move can't re-mail someone who already left.",
      },
    ],
    stayIf:
      "Stay with Resend if transactional email is the whole job. It's an excellent API with deep infrastructure behind it, and if you don't need audiences, forms, segments or compliance handling, day3's campaign half is weight you won't use. Keeping both is also fine — neither tool asks for exclusivity.",
    faqs: [
      {
        q: "Is day3 a Resend alternative?",
        a: "For teams who need product-update emails as well as transactional, yes — day3 does both from one domain and one allowance. If you only need an email API, Resend is excellent and there's no reason to move.",
      },
      {
        q: "Can day3 send transactional email like Resend?",
        a: "Yes. POST /v1/emails takes from, to, subject and html, returns an id, and gives you a status to poll. Send an Idempotency-Key and a retry can never double-send a password reset.",
      },
      {
        q: "Can I migrate my Resend audience to day3?",
        a: "Yes. Batch up to 1,000 contacts per call, addressed by plain email rather than an id you have to look up first. Custom fields register themselves as merge tags, and you can bring your unsubscribes and suppression list so the opt-outs move with you.",
      },
      {
        q: "Does day3 have React Email components?",
        a: "No. day3's emails are built in a visual composer, or written as Markdown from your AI editor over MCP. If you want your templates living as React components in your repo, Resend fits that better.",
      },
    ],
  },
  {
    slug: "mailchimp-alternative",
    competitor: "Mailchimp",
    metaTitle: "A simpler, send-priced Mailchimp alternative",
    metaDescription:
      "Mailchimp bills by audience size and bundles a full marketing suite. day3 bills by sends, keeps subscribers unlimited, and does one thing: product emails.",
    keywords: [
      "mailchimp alternative",
      "cheaper than mailchimp",
      "mailchimp alternative for startups",
      "mailchimp pricing too expensive",
      "simple mailchimp alternative",
    ],
    title: "A Mailchimp alternative that charges for sends, not your list size.",
    intro:
      "Mailchimp is a broad marketing platform, and its bill climbs as your contact count grows — even in a month you send nothing.",
    difference:
      "day3 decouples list size from price. Keep any number of subscribers and pay only for the emails you send — so a big list you email occasionally costs far less.",
    comparison: [
      { dimension: "Pricing model", day3: DAY3.pricing, competitor: "By number of contacts/audience size" },
      { dimension: "Subscriber limits", day3: DAY3.subscribers, competitor: "Tiered — more contacts cost more" },
      { dimension: "Product scope", day3: DAY3.scope, competitor: "Full marketing suite (automations, ads, CRM, sites)" },
      { dimension: "Best for", day3: "Founders & small SaaS sending updates", competitor: "Marketing teams running campaigns at scale" },
      { dimension: "Starting price", day3: DAY3.startingPrice, competitor: "Free tier, then priced by contacts" },
    ],
    reasonsToSwitch: [
      {
        title: "No contact tax",
        description:
          "200 contacts or 200,000 — same price. The meter is sends, nothing else.",
      },
      {
        title: "Nothing to configure",
        description:
          "No journeys or automation to wire up first. Write the update, pick a list, send — saved segments are there if you want them, not a prerequisite.",
      },
      {
        title: "Deliverability included",
        description:
          "Authenticated domains, one-click unsubscribe, and auto-suppression come standard, not as an upsell.",
      },
    ],
    stayIf:
      "Stay with Mailchimp if you need automation flows, landing pages, ads, or a CRM in one place. day3 does none of that — it just emails your users about product changes.",
    faqs: [
      {
        q: "Is day3 cheaper than Mailchimp?",
        a: "Usually, for a growing list — day3 never charges by contact count. Your bill tracks emails sent, not audience size.",
      },
      {
        q: "Can I migrate my Mailchimp list to day3?",
        a: "Yes — by CSV or API. Export your subscribers and import them into a day3 audience, or script it against the API in batches of 1,000, bringing your custom fields and opt-outs with you. Either way the import dedupes and drops anyone who unsubscribed or bounced.",
      },
      {
        q: "What does day3 not do that Mailchimp does?",
        a: "By design: no automation flows, A/B testing, drag-and-drop template builders, landing pages, or ads. Just reliable product emails — with saved segments and subscription topics where they earn their keep.",
      },
    ],
  },
  {
    slug: "convertkit-alternative",
    competitor: "Kit (ConvertKit)",
    metaTitle: "A send-priced Kit / ConvertKit alternative",
    metaDescription:
      "Kit (formerly ConvertKit) prices by subscriber count and targets creator funnels. day3 bills by sends and focuses on product updates for software teams.",
    keywords: [
      "convertkit alternative",
      "kit alternative",
      "convertkit alternative for saas",
      "cheaper than convertkit",
      "convertkit pricing by subscribers",
    ],
    title: "A Kit (ConvertKit) alternative built for product teams, not funnels.",
    intro:
      "Kit is built for creators growing audiences and sales funnels, and it prices by subscriber count.",
    difference:
      "day3 is for software teams shipping product and telling users about it. Subscribers stay unlimited; you pay only for sends — so the bill stays flat as the list grows.",
    comparison: [
      { dimension: "Pricing model", day3: DAY3.pricing, competitor: "By number of subscribers" },
      { dimension: "Subscriber limits", day3: DAY3.subscribers, competitor: "Tiered — more subscribers cost more" },
      { dimension: "Product scope", day3: DAY3.scope, competitor: "Creator funnels, sequences, commerce" },
      { dimension: "Best for", day3: "Small SaaS & indie devs", competitor: "Creators, newsletters, digital products" },
      { dimension: "Starting price", day3: DAY3.startingPrice, competitor: "Free tier, then priced by subscribers" },
    ],
    reasonsToSwitch: [
      {
        title: "Flat price as your list grows",
        description:
          "Crossing the next subscriber threshold never bumps your bill. Sends are the only meter.",
      },
      {
        title: "Made for product updates",
        description:
          "Changelogs and 'what's new' emails, not sales sequences. The whole tool is shaped around that job.",
      },
      {
        title: "AI writing help when you want it",
        description:
          "Draft or rewrite a campaign with Claude — included on every paid plan.",
      },
    ],
    stayIf:
      "Stay with Kit if you're a creator who leans on automated sequences, paid subscriptions, commerce, or visual funnels. day3 isn't a creator platform.",
    faqs: [
      {
        q: "Why switch from ConvertKit/Kit to day3?",
        a: "If you're a software team with a growing list you email occasionally, day3's send-based pricing usually costs less and fits closer than Kit's creator funnels.",
      },
      {
        q: "Does day3 have automated sequences like Kit?",
        a: "No — day3 leaves out automation and sequences. It sends one-off campaigns: product updates, changelogs, announcements.",
      },
    ],
  },
  {
    slug: "beehiiv-alternative",
    competitor: "beehiiv",
    metaTitle: "A focused beehiiv alternative for product emails",
    metaDescription:
      "beehiiv is a growth platform for media newsletters. day3 is a small tool for product updates — unlimited subscribers, billed by sends.",
    keywords: [
      "beehiiv alternative",
      "beehiiv alternative for saas",
      "simple newsletter tool",
      "beehiiv vs",
      "product update email tool",
    ],
    title: "A beehiiv alternative for teams who just want to email their users.",
    intro:
      "beehiiv is a platform for growing and monetizing media newsletters, priced by subscriber tier. A software team announcing what shipped won't touch most of it.",
    difference:
      "day3 isn't a media business tool. It's a focused way for product teams to send updates — unlimited subscribers, with a bill driven only by sends.",
    comparison: [
      { dimension: "Pricing model", day3: DAY3.pricing, competitor: "By subscriber tiers (+ paid add-ons)" },
      { dimension: "Subscriber limits", day3: DAY3.subscribers, competitor: "Tiered by subscriber count" },
      { dimension: "Product scope", day3: DAY3.scope, competitor: "Newsletter growth, monetization, ad network, websites" },
      { dimension: "Best for", day3: "SaaS product updates", competitor: "Media & creator newsletters scaling an audience" },
      { dimension: "Starting price", day3: DAY3.startingPrice, competitor: "Free tier, then priced by subscribers" },
    ],
    reasonsToSwitch: [
      {
        title: "Small on purpose",
        description:
          "No growth dashboards, referral programs, or ad network to ignore. Just the email and who receives it.",
      },
      {
        title: "Predictable price",
        description:
          "A large list mailed now and then costs the same as a small one. Sends are the only variable.",
      },
      {
        title: "Built-in deliverability",
        description:
          "Authenticated domains, double opt-in, one-click unsubscribe, and auto-suppression as standard.",
      },
    ],
    stayIf:
      "Stay with beehiiv if you're building a newsletter as a media product — monetizing it, running referrals, or selling ads. That's its strength; day3 doesn't compete there.",
    faqs: [
      {
        q: "Is day3 a good beehiiv alternative for a SaaS?",
        a: "Yes, if your goal is sending product updates to users rather than growing and monetizing a media newsletter. day3 is narrower and priced by sends.",
      },
      {
        q: "Does day3 do newsletter monetization?",
        a: "No — no paid subscriptions, ad network, or referral programs. Just reliable product emails.",
      },
    ],
  },
  {
    slug: "emailoctopus-alternative",
    competitor: "EmailOctopus",
    metaTitle: "An EmailOctopus alternative priced by sends",
    metaDescription:
      "EmailOctopus is a low-cost tool priced by subscribers. day3 keeps subscribers unlimited and prices by sends — better for a big list you mail occasionally.",
    keywords: [
      "emailoctopus alternative",
      "cheap email marketing tool",
      "email tool priced by sends",
      "emailoctopus vs",
    ],
    title: "An EmailOctopus alternative that doesn't count your subscribers.",
    intro:
      "EmailOctopus is a friendly, affordable email tool that still prices by the number of subscribers on your list.",
    difference:
      "day3 removes that variable: unlimited subscribers, billed only by sends. When your list grows faster than you send, that wins.",
    comparison: [
      { dimension: "Pricing model", day3: DAY3.pricing, competitor: "By number of subscribers" },
      { dimension: "Subscriber limits", day3: DAY3.subscribers, competitor: "Tiered by subscriber count" },
      { dimension: "Product scope", day3: DAY3.scope, competitor: "General email marketing & newsletters" },
      { dimension: "Best for", day3: "SaaS product updates", competitor: "Budget-conscious general senders" },
      { dimension: "Starting price", day3: DAY3.startingPrice, competitor: "Free tier, then priced by subscribers" },
    ],
    reasonsToSwitch: [
      {
        title: "List size doesn't touch the bill",
        description:
          "A growing audience never pushes you into a higher tier.",
      },
      {
        title: "Focused on product updates",
        description:
          "day3 is shaped for changelogs and 'what's new' emails from software teams.",
      },
      {
        title: "AI assist when it helps",
        description:
          "Draft and refine emails with Claude — included on every paid plan.",
      },
    ],
    stayIf:
      "Stay with EmailOctopus if you have a small, stable list and want a generalist tool. Send-based pricing mainly pays off for large or fast-growing lists mailed occasionally.",
    faqs: [
      {
        q: "How does day3's pricing compare to EmailOctopus?",
        a: "EmailOctopus prices by subscriber count; day3 by sends. Which is cheaper depends on list size versus sending frequency — day3 favors larger lists mailed occasionally.",
      },
    ],
  },
  {
    slug: "buttondown-alternative",
    competitor: "Buttondown",
    metaTitle: "A Buttondown alternative for product teams",
    metaDescription:
      "Buttondown is a minimal, markdown-first newsletter tool priced by subscribers. day3 is just as minimal but priced by sends and built for product updates.",
    keywords: [
      "buttondown alternative",
      "minimal newsletter tool",
      "buttondown vs",
      "developer newsletter tool",
    ],
    title: "A Buttondown alternative, priced by sends instead of subscribers.",
    intro:
      "Buttondown nails minimal, markdown-first newsletters and developers love it. It prices by subscriber count.",
    difference:
      "day3 shares the minimalism but draws the line differently: priced by sends, with a rich email-safe editor, signup forms, and deliverability built around product updates.",
    comparison: [
      { dimension: "Pricing model", day3: DAY3.pricing, competitor: "By number of subscribers" },
      { dimension: "Subscriber limits", day3: DAY3.subscribers, competitor: "Tiered by subscriber count" },
      { dimension: "Product scope", day3: DAY3.scope, competitor: "Minimal markdown newsletters" },
      { dimension: "Best for", day3: "Small SaaS & indie devs", competitor: "Writers & developers who like markdown" },
      { dimension: "Starting price", day3: DAY3.startingPrice, competitor: "Free tier, then priced by subscribers" },
    ],
    reasonsToSwitch: [
      {
        title: "Unlimited subscribers, flat price",
        description:
          "Grow the list without watching for the next pricing threshold.",
      },
      {
        title: "Signup forms included",
        description:
          "Hosted pages, embeds, popups, and raw HTML forms, with double opt-in on by default.",
      },
      {
        title: "Deliverability handled",
        description:
          "Authenticated domains, suppression, and one-click unsubscribe with no extra setup.",
      },
    ],
    stayIf:
      "Stay with Buttondown if a markdown-first flow and a small stable list are exactly what you want. day3 pulls ahead as your list grows and you lean on forms and deliverability.",
    faqs: [
      {
        q: "Is day3 as simple as Buttondown?",
        a: "It's just as focused — a campaign fits on one screen — while adding signup forms, built-in deliverability, and send-based pricing.",
      },
    ],
  },
];

export function getComparePage(slug: string): ComparePage | undefined {
  return comparePages.find((page) => page.slug === slug);
}
