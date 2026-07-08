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
  freeTier: "No free tier — paid from $1/mo, free to set up",
  scope: "Product updates & newsletters, on purpose narrow",
  startingPrice: "$1/mo for 1,000 emails",
};

export const comparePages: ComparePage[] = [
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
          "No journeys or segments to set up first. Write the update, pick a list, send.",
      },
      {
        title: "Deliverability included",
        description:
          "Authenticated domains, one-click unsubscribe, and auto-suppression come standard, not as an upsell.",
      },
    ],
    stayIf:
      "Stay with Mailchimp if you need automation, segmentation, landing pages, ads, or a CRM in one place. day3 does none of that — it just emails your users about product changes.",
    faqs: [
      {
        q: "Is day3 cheaper than Mailchimp?",
        a: "Usually, for a growing list — day3 never charges by contact count. Your bill tracks emails sent, not audience size.",
      },
      {
        q: "Can I migrate my Mailchimp list to day3?",
        a: "Yes. Export your subscribers to CSV and import them into a day3 audience. The import dedupes and drops anyone who unsubscribed or bounced.",
      },
      {
        q: "What does day3 not do that Mailchimp does?",
        a: "By design: no automation flows, segmentation, A/B testing, template builders, landing pages, or ads. Just reliable product emails.",
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
          "Draft or rewrite a campaign with Claude — included on the 10k plan and up.",
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
          "Draft and refine emails with Claude — included on the 10k plan and up.",
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
