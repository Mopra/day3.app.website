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
      "Mailchimp prices by the size of your audience and bundles a full marketing suite. day3 charges by emails sent, keeps subscribers unlimited, and does one thing: product emails. Here's the difference.",
    keywords: [
      "mailchimp alternative",
      "cheaper than mailchimp",
      "mailchimp alternative for startups",
      "mailchimp pricing too expensive",
      "simple mailchimp alternative",
    ],
    title: "A Mailchimp alternative that charges for sends, not your list size.",
    intro:
      "Mailchimp is a capable, sprawling marketing platform — and you pay for that breadth, with a bill that climbs as your contact count grows. day3 goes the other way: unlimited subscribers, priced only by the emails you actually send.",
    difference:
      "Mailchimp's plans are tiered by the number of contacts in your audience, so simply growing your list raises your bill even in a month you send nothing. day3 decouples the two — your list can be any size, and you only pay for sends. If you have a big list you email occasionally, that difference is large.",
    comparison: [
      { dimension: "Pricing model", day3: DAY3.pricing, competitor: "By number of contacts/audience size" },
      { dimension: "Subscriber limits", day3: DAY3.subscribers, competitor: "Tiered — more contacts cost more" },
      { dimension: "Product scope", day3: DAY3.scope, competitor: "Full marketing suite (automations, ads, CRM, sites)" },
      { dimension: "Best for", day3: "Founders & small SaaS sending updates", competitor: "Marketing teams running campaigns at scale" },
      { dimension: "Starting price", day3: DAY3.startingPrice, competitor: "Free tier, then priced by contacts" },
    ],
    reasonsToSwitch: [
      {
        title: "Your list stops being a tax",
        description:
          "Bring 200 contacts or 200,000 — the price is identical. You're billed on what you send, full stop.",
      },
      {
        title: "Nothing to learn",
        description:
          "No journeys, no audience segments to configure before you can send. Write the update, choose the list, send.",
      },
      {
        title: "Deliverability without the dashboard",
        description:
          "Authenticated domains, one-click unsubscribe, and automatic suppression come standard — not as a higher tier.",
      },
    ],
    stayIf:
      "Stick with Mailchimp if you need marketing automation, audience segmentation, landing pages, ads, or a CRM in one place. day3 deliberately doesn't do those — it's for teams who just want to email their users about product changes.",
    faqs: [
      {
        q: "Is day3 cheaper than Mailchimp?",
        a: "For most small teams with a growing list, yes — because day3 never charges by contact count. Mailchimp's price rises as your audience grows; day3's depends only on how many emails you send each month, with unlimited subscribers on every plan.",
      },
      {
        q: "Can I migrate my Mailchimp list to day3?",
        a: "Yes. Export your subscribers to a CSV and import them into a day3 audience. The import dedupes and filters out anyone who previously unsubscribed or bounced.",
      },
      {
        q: "What does day3 not do that Mailchimp does?",
        a: "By design, day3 leaves out marketing automation flows, segmentation, A/B testing, drag-and-drop template builders, landing pages, and ads. It focuses on sending product update emails reliably.",
      },
    ],
  },
  {
    slug: "convertkit-alternative",
    competitor: "Kit (ConvertKit)",
    metaTitle: "A send-priced Kit / ConvertKit alternative",
    metaDescription:
      "Kit (formerly ConvertKit) prices by subscriber count and is built for creators and funnels. day3 bills by emails sent, keeps subscribers unlimited, and focuses on product updates for software teams.",
    keywords: [
      "convertkit alternative",
      "kit alternative",
      "convertkit alternative for saas",
      "cheaper than convertkit",
      "convertkit pricing by subscribers",
    ],
    title: "A Kit (ConvertKit) alternative built for product teams, not funnels.",
    intro:
      "Kit is excellent for creators building audiences and sales funnels — and, like most of the category, it prices by subscriber count. day3 is for software teams sending product updates, billed only by the emails you send.",
    difference:
      "Kit's plans scale with how many subscribers you have. day3 keeps subscribers unlimited and free, and charges only for sends. If your job is shipping product and emailing users about it — not running creator funnels — the model fits better and the bill stays flat as you grow.",
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
          "Changelogs and 'what's new' emails, not sales sequences. The whole tool is shaped around that one job.",
      },
      {
        title: "AI writing help when you want it",
        description:
          "Draft a campaign or rewrite a paragraph with Claude — included on the 10k plan and up.",
      },
    ],
    stayIf:
      "Stay with Kit if you're a creator who relies on automated sequences, paid newsletter subscriptions, commerce, or visual funnels. day3 doesn't try to be a creator platform.",
    faqs: [
      {
        q: "Why switch from ConvertKit/Kit to day3?",
        a: "If you're a software team rather than a creator, and you have a growing list you email occasionally, day3's send-based pricing is usually cheaper and its product-update focus is a closer fit than Kit's creator-funnel tooling.",
      },
      {
        q: "Does day3 have automated sequences like Kit?",
        a: "No — day3 deliberately omits automation flows and sequences. It sends one-off campaigns (product updates, changelogs, announcements) to an audience.",
      },
    ],
  },
  {
    slug: "beehiiv-alternative",
    competitor: "beehiiv",
    metaTitle: "A focused beehiiv alternative for product emails",
    metaDescription:
      "beehiiv is a growth platform for media newsletters. day3 is a deliberately small tool for software teams sending product updates — unlimited subscribers, billed by emails sent.",
    keywords: [
      "beehiiv alternative",
      "beehiiv alternative for saas",
      "simple newsletter tool",
      "beehiiv vs",
      "product update email tool",
    ],
    title: "A beehiiv alternative for teams who just want to email their users.",
    intro:
      "beehiiv is a powerful platform for growing and monetizing media newsletters. If you're a software team that just needs to tell users what shipped, that's a lot of surface area you won't use. day3 is the small, focused option.",
    difference:
      "beehiiv is built around newsletter growth, monetization, and audience-tier pricing. day3 isn't a media business tool — it's a way for product teams to send updates, with unlimited subscribers and a bill driven only by sends.",
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
          "No growth dashboards, referral programs, or ad network to ignore. Just the email and who gets it.",
      },
      {
        title: "Predictable, send-based price",
        description:
          "A large list you mail now and then costs the same as a small one. Sends are the only variable.",
      },
      {
        title: "Built-in deliverability",
        description:
          "Authenticated domains, double opt-in, one-click unsubscribe, and auto-suppression as standard.",
      },
    ],
    stayIf:
      "Stay with beehiiv if you're building a newsletter as a media product — monetizing it, running referrals, or selling ads. That's its strength, and day3 doesn't compete there.",
    faqs: [
      {
        q: "Is day3 a good beehiiv alternative for a SaaS?",
        a: "Yes, if your goal is sending product updates to your users rather than growing and monetizing a media newsletter. day3 is narrower, priced by sends, and includes unlimited subscribers.",
      },
      {
        q: "Does day3 do newsletter monetization?",
        a: "No. day3 doesn't include paid subscriptions, an ad network, or referral programs. It's focused on reliably sending product update emails.",
      },
    ],
  },
  {
    slug: "emailoctopus-alternative",
    competitor: "EmailOctopus",
    metaTitle: "An EmailOctopus alternative priced by sends",
    metaDescription:
      "EmailOctopus is a low-cost email tool priced by subscribers. day3 keeps subscribers unlimited and prices by emails sent — a better fit for a big list you mail occasionally.",
    keywords: [
      "emailoctopus alternative",
      "cheap email marketing tool",
      "email tool priced by sends",
      "emailoctopus vs",
    ],
    title: "An EmailOctopus alternative that doesn't count your subscribers.",
    intro:
      "EmailOctopus is a friendly, affordable email tool — and it still prices by the number of subscribers on your list. day3 removes that variable entirely: unlimited subscribers, billed only by the emails you send.",
    difference:
      "Both tools aim to be simple and cheap. The structural difference is the meter: EmailOctopus charges by subscriber count, day3 by sends. For a list that grows faster than your sending frequency, send-based pricing wins.",
    comparison: [
      { dimension: "Pricing model", day3: DAY3.pricing, competitor: "By number of subscribers" },
      { dimension: "Subscriber limits", day3: DAY3.subscribers, competitor: "Tiered by subscriber count" },
      { dimension: "Product scope", day3: DAY3.scope, competitor: "General email marketing & newsletters" },
      { dimension: "Best for", day3: "SaaS product updates", competitor: "Budget-conscious general senders" },
      { dimension: "Starting price", day3: DAY3.startingPrice, competitor: "Free tier, then priced by subscribers" },
    ],
    reasonsToSwitch: [
      {
        title: "Your list size is irrelevant to the bill",
        description:
          "Send-based pricing means a growing audience never pushes you into a higher tier.",
      },
      {
        title: "Focused on product updates",
        description:
          "day3 is shaped specifically for changelogs and 'what's new' emails from software teams.",
      },
      {
        title: "AI assist when it helps",
        description:
          "Draft and refine emails with Claude — included on the 10k plan and up.",
      },
    ],
    stayIf:
      "Stay with EmailOctopus if you have a small, stable list and prefer a generalist email tool. The send-based model mainly pays off when your list is large or growing relative to how often you send.",
    faqs: [
      {
        q: "How does day3's pricing compare to EmailOctopus?",
        a: "EmailOctopus prices by subscriber count; day3 prices by emails sent and includes unlimited subscribers on every plan. Which is cheaper depends on your list size versus how often you send — day3 favors larger or fast-growing lists mailed occasionally.",
      },
    ],
  },
  {
    slug: "buttondown-alternative",
    competitor: "Buttondown",
    metaTitle: "A Buttondown alternative for product teams",
    metaDescription:
      "Buttondown is a minimal, markdown-first newsletter tool priced by subscribers. day3 is similarly minimal but priced by emails sent, with a UI and feature set built for software product updates.",
    keywords: [
      "buttondown alternative",
      "minimal newsletter tool",
      "buttondown vs",
      "developer newsletter tool",
    ],
    title: "A Buttondown alternative, priced by sends instead of subscribers.",
    intro:
      "Buttondown nails minimal, markdown-first newsletters and is loved by developers. day3 shares the minimalism but draws the line differently — billing by sends, keeping subscribers unlimited, and shaping everything around product updates.",
    difference:
      "Both are intentionally small tools. Buttondown prices by subscriber count and centers the writing experience on markdown; day3 prices by sends, includes a rich email-safe editor, and focuses on the product-update use case with built-in deliverability and signup forms.",
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
          "Hosted pages, embeds, popups, and raw HTML forms — with double opt-in on by default.",
      },
      {
        title: "Deliverability handled",
        description:
          "Authenticated domains, suppression, and one-click unsubscribe without extra setup.",
      },
    ],
    stayIf:
      "Stay with Buttondown if a markdown-first writing flow and a small stable list are exactly what you want. day3's advantage shows up as your list grows and as you lean on forms and deliverability tooling.",
    faqs: [
      {
        q: "Is day3 as simple as Buttondown?",
        a: "It aims to be just as focused — a campaign fits on one screen — while adding signup forms and built-in deliverability, and pricing by sends rather than subscriber count.",
      },
    ],
  },
];

export function getComparePage(slug: string): ComparePage | undefined {
  return comparePages.find((page) => page.slug === slug);
}
