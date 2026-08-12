/**
 * Source of truth for the /compare/<slug> "alternative" pages.
 *
 * IMPORTANT. Accuracy policy: competitor claims here are deliberately about the
 * *pricing model and product philosophy* (per-subscriber vs per-send, breadth of
 * scope), which are durable and verifiable. We do NOT quote competitors' specific
 * dollar prices or feature counts, because those change often and a stale number
 * reads as misleading. Keep every comparison fair and model-level.
 *
 * The worked example holds to the same rule from the other direction: it states a
 * scenario in subscribers and sends, prices day3's side off the live ladder, and
 * describes the other model as a model. No competitor arithmetic is invented.
 */

export type CompareRow = {
  dimension: string;
  day3: string;
  competitor: string;
};

export type MigrationStep = {
  title: string;
  description: string;
};

/**
 * One scenario, run through both pricing models. `monthlySends` is what the
 * template prices off the ladder; nothing here hardcodes a dollar figure.
 */
export type WorkedExample = {
  /** The situation, in one sentence. */
  scenario: string;
  subscribers: number;
  monthlySends: number;
  /** What the other tool's meter reads, as a clause. Never a price. */
  otherModel: string;
};

export type ComparePage = {
  /** URL segment, always "<competitor>-alternative". */
  slug: string;
  /** Display name of the competitor. */
  competitor: string;
  /** ISO date of the last substantive content change. Drives sitemap lastmod. */
  updated: string;

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
  /** The same numbers through both meters. */
  worked: WorkedExample;
  /** How a move actually goes. The question every reader on this page has. */
  migration: MigrationStep[];
  /** What does not come across. Stated first, not buried. */
  migrationCaveat: string;
  /** Why teams move to day3, as bullet points. */
  reasonsToSwitch: { title: string; description: string }[];
  /** Honest "stay where you are if…". Builds trust and earns AI citations. */
  stayIf: string;
  faqs: { q: string; a: string }[];
  /** Refs into the internal link mesh. See lib/internal-links.ts. */
  related: string[];
};

/** Constant day3 facts reused across comparison rows. */
const DAY3 = {
  pricing: "By emails sent each month",
  subscribers: "Unlimited on every plan",
  freeTier:
    "Free tier sends in sandbox mode (100/mo, your own team). Paid from $1/mo to reach everyone else",
  scope: "Product updates and transactional email, on purpose narrow",
  startingPrice: "$1/mo for 1,000 emails",
};

/**
 * The migration steps that are identical whatever you are leaving, because they
 * describe day3's importer rather than the other tool. Order matters: suppressions
 * genuinely have to go first, and that is the single most-missed step in a move.
 */
function standardMigration(exportNote: string): MigrationStep[] {
  return [
    {
      title: "Bring your suppression list first",
      description:
        "Push the addresses that bounced, complained, or asked never to be mailed again before you import a single contact. Do it in this order and day3 refuses those rows on the way in, which is the guard working rather than an error. Do it after and you have a window where a re-import can mail someone who already left.",
    },
    {
      title: "Import the contacts",
      description: exportNote,
    },
    {
      title: "Carry the opt-outs across as opt-outs",
      description:
        "Contacts already marked unsubscribed import with that status and the date they left on, so your new tool honours a decision made in your old one. Nobody gets re-subscribed by a migration.",
    },
    {
      title: "Verify the sending domain",
      description:
        "Connect Cloudflare and day3 publishes DKIM, SPF and DMARC for you, then rechecks until the domain verifies. On another DNS host you get the records to paste. Authenticating the domain you already send from is what keeps your reputation intact through the move.",
    },
    {
      title: "Send one real campaign to yourself",
      description:
        "A test send goes to addresses you name, through the same pipeline and the same tracking as the real thing. Compare it against your old tool's output before you point the whole list at it.",
    },
  ];
}

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
    each tool is built around, which is durable and the actual decision anyway.
  */
  {
    slug: "resend-alternative",
    competitor: "Resend",
    updated: "2026-08-12",
    metaTitle: "A Resend alternative with the list layer built in",
    metaDescription:
      "day3 sends transactional the same shape as Resend: one POST, idempotent retries, per-email status. It brings audiences, segments, forms and compliance too.",
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
      "The difference is everything around the send. day3 is built for the campaign side too: audiences with custom fields, live segments, subscription topics, hosted signup forms, double opt-in, one-click unsubscribe. So your password resets and your product updates run on one domain, one allowance, and one bill.",
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
        day3: "Hosted pages, embeds, popups and raw HTML forms, with double opt-in on by default",
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
    worked: {
      scenario:
        "A SaaS with 9,000 users sends password resets, receipts and magic links all month, then one launch note to the whole list.",
      subscribers: 9_000,
      monthlySends: 20_000,
      otherModel:
        "Running the two jobs on separate tools means two allowances, two domains to authenticate, and two bills, even when the total volume is the same",
    },
    migration: standardMigration(
      "Batch up to 1,000 contacts per call, addressed by plain email rather than an id you have to look up first. Upsert instead of colliding, so a re-run is safe. Custom fields register themselves as merge tags on arrival.",
    ),
    migrationCaveat:
      "React Email templates do not come across. day3's emails are built in a visual composer, or written as Markdown from your AI editor over MCP, so anything living as a React component in your repo gets rebuilt rather than imported. If your templates are the valuable part, that is the real cost of the move.",
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
      "Stay with Resend if transactional email is the whole job. It's an excellent API with deep infrastructure behind it, and if you don't need audiences, forms, segments or compliance handling, day3's campaign half is weight you won't use. Stay too if your templates live as React Email components you're happy with, or if you're sending at a volume where you want a vendor whose entire business is that one pipe. Keeping both is also fine. Neither tool asks for exclusivity, and running campaigns on day3 while transactional stays where it is costs you nothing but a second DNS record.",
    faqs: [
      {
        q: "Is day3 a Resend alternative?",
        a: "For teams who need product-update emails as well as transactional, yes. day3 does both from one domain and one allowance. If you only need an email API, Resend is excellent and there's no reason to move.",
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
      {
        q: "Can I run day3 and Resend side by side?",
        a: "Yes, and it's a reasonable way to try day3. Point campaigns at day3 and leave transactional where it is. Both tools authenticate the same domain with their own DKIM selector, so the two don't collide. Nothing about day3 asks for exclusivity.",
      },
      {
        q: "Do unsubscribes apply to transactional email too?",
        a: "No, and they shouldn't. Someone who left the newsletter still needs their password reset, so POST /v1/emails ignores unsubscribe status. Hard bounces and complaints are still refused, because those addresses damage your reputation whatever the message is.",
      },
    ],
    related: [
      "feature:api",
      "page:/deliverability",
      "page:/how-it-works",
      "for:saas",
      "compare:mailchimp-alternative",
      "page:/pricing",
    ],
  },
  {
    slug: "mailchimp-alternative",
    competitor: "Mailchimp",
    updated: "2026-08-12",
    metaTitle: "A simpler, send-priced Mailchimp alternative",
    metaDescription:
      "Mailchimp bills by audience size and bundles a full marketing suite. day3 bills by sends, keeps subscribers unlimited, and does one thing: product emails.",
    keywords: [
      "mailchimp alternative",
      "cheaper than mailchimp",
      "mailchimp alternative for startups",
      "mailchimp pricing too expensive",
      "simple mailchimp alternative",
      "migrate off mailchimp",
    ],
    title: "A Mailchimp alternative that charges for sends, not your list size.",
    intro:
      "Mailchimp is a broad marketing platform, and its bill climbs as your contact count grows, even in a month you send nothing.",
    difference:
      "day3 decouples list size from price. Keep any number of subscribers and pay only for the emails you send, so a big list you email occasionally costs far less.",
    comparison: [
      { dimension: "Pricing model", day3: DAY3.pricing, competitor: "By number of contacts/audience size" },
      { dimension: "Subscriber limits", day3: DAY3.subscribers, competitor: "Tiered: more contacts cost more" },
      { dimension: "Product scope", day3: DAY3.scope, competitor: "Full marketing suite (automations, ads, CRM, sites)" },
      { dimension: "Cost of a quiet month", day3: "Nothing changes. The meter only moves when you send", competitor: "The contact bill arrives either way" },
      { dimension: "Best for", day3: "Founders & small SaaS sending updates", competitor: "Marketing teams running campaigns at scale" },
      { dimension: "Starting price", day3: DAY3.startingPrice, competitor: "Free tier, then priced by contacts" },
    ],
    worked: {
      scenario:
        "10,000 users on the list, emailed twice a month: one changelog and one launch note.",
      subscribers: 10_000,
      monthlySends: 20_000,
      otherModel:
        "A per-contact plan bills for all 10,000 contacts every month, whether you send twice, once, or not at all",
    },
    migration: standardMigration(
      "Export your Mailchimp audience to CSV and upload it with email, first_name and last_name columns. day3 dedupes, skips anyone already suppressed, and lets you retry just the failed rows instead of restarting the batch. Or script it against the API in batches of 1,000 if you'd rather not touch a spreadsheet.",
    ),
    migrationCaveat:
      "Automation journeys, landing pages, ad audiences and the CRM don't come across, because day3 has none of them. Neither do drag-and-drop template designs: your emails get rebuilt in day3's composer. Tags become custom fields and saved segments, which usually maps cleanly, but a Mailchimp account leaning hard on journeys is not a Mailchimp account day3 can replace.",
    reasonsToSwitch: [
      {
        title: "No contact tax",
        description:
          "200 contacts or 200,000, same price. The meter is sends, nothing else.",
      },
      {
        title: "Nothing to configure",
        description:
          "No journeys or automation to wire up first. Write the update, pick a list, send. Saved segments are there if you want them, not a prerequisite.",
      },
      {
        title: "Deliverability included",
        description:
          "Authenticated domains, one-click unsubscribe, and auto-suppression come standard, not as an upsell.",
      },
    ],
    stayIf:
      "Stay with Mailchimp if you need automation flows, landing pages, ads, or a CRM in one place. day3 does none of that, and automations are still in development rather than shipped. Stay too if a marketing team rather than a founder owns your email, because the collaboration, approval and reporting depth Mailchimp has built for that job is real and day3 has not tried to match it. day3 just emails your users about product changes.",
    faqs: [
      {
        q: "Is day3 cheaper than Mailchimp?",
        a: "Usually, for a growing list, because day3 never charges by contact count. Your bill tracks emails sent, not audience size. The gap widens the less often you send: a list you email monthly costs the same on day3 as one you email never, and per-contact pricing charges for both identically.",
      },
      {
        q: "Can I migrate my Mailchimp list to day3?",
        a: "Yes, by CSV or API. Export your subscribers and import them into a day3 audience, or script it against the API in batches of 1,000, bringing your custom fields and opt-outs with you. Either way the import dedupes and drops anyone who unsubscribed or bounced.",
      },
      {
        q: "What does day3 not do that Mailchimp does?",
        a: "By design: no automation flows, A/B testing, drag-and-drop template builders, landing pages, or ads. Just reliable product emails, with saved segments and subscription topics where they earn their keep.",
      },
      {
        q: "Do my Mailchimp tags and segments survive the move?",
        a: "Tags import as custom fields, which register themselves as merge tags, and you can rebuild saved segments on top of them. The segments are live rather than snapshots, so they re-evaluate as contacts change. Complex nested segment logic may need simplifying.",
      },
      {
        q: "Will moving hurt my deliverability?",
        a: "Not if you bring your suppression list first and authenticate the same sending domain. Reputation attaches to your domain rather than to the tool, so a move that keeps the domain and honours the existing opt-outs is close to invisible to mailbox providers. Sending your first day3 campaign to your most engaged segment rather than the whole list is the usual extra precaution.",
      },
    ],
    related: [
      "page:/how-it-works",
      "page:/deliverability",
      "for:startups",
      "feature:audiences",
      "compare:convertkit-alternative",
      "page:/pricing",
    ],
  },
  {
    slug: "convertkit-alternative",
    competitor: "Kit (ConvertKit)",
    updated: "2026-08-12",
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
      "day3 is for software teams shipping product and telling users about it. Subscribers stay unlimited; you pay only for sends, so the bill stays flat as the list grows.",
    comparison: [
      { dimension: "Pricing model", day3: DAY3.pricing, competitor: "By number of subscribers" },
      { dimension: "Subscriber limits", day3: DAY3.subscribers, competitor: "Tiered: more subscribers cost more" },
      { dimension: "Product scope", day3: DAY3.scope, competitor: "Creator funnels, sequences, commerce" },
      { dimension: "Cost of a quiet month", day3: "Nothing changes. The meter only moves when you send", competitor: "The subscriber bill arrives either way" },
      { dimension: "Best for", day3: "Small SaaS & indie devs", competitor: "Creators, newsletters, digital products" },
      { dimension: "Starting price", day3: DAY3.startingPrice, competitor: "Free tier, then priced by subscribers" },
    ],
    worked: {
      scenario:
        "25,000 subscribers built up over two years, emailed once a month when something ships.",
      subscribers: 25_000,
      monthlySends: 25_000,
      otherModel:
        "Per-subscriber pricing charges for all 25,000 every month, and crossing the next subscriber threshold raises the bill without you sending anything more",
    },
    migration: standardMigration(
      "Export your Kit subscribers to CSV and upload with email, first_name and last_name. day3 dedupes and skips anyone suppressed. If you'd rather script it, the API takes 1,000 contacts per call and upserts by email, so re-running is safe.",
    ),
    migrationCaveat:
      "Sequences and visual automations don't come across, because day3 doesn't have them: automations are designed but not shipped. Neither do paid subscriptions, commerce, or Kit's creator network. If a running sequence is doing real work for you, that work stops at the move rather than transferring.",
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
          "Draft or rewrite a campaign with Claude, included on every paid plan.",
      },
    ],
    stayIf:
      "Stay with Kit if you're a creator who leans on automated sequences, paid subscriptions, commerce, or visual funnels. day3 isn't a creator platform and isn't trying to become one. Stay too if your email *is* the product rather than an announcement channel for it, because Kit has built a decade of tooling for that and day3 has deliberately built none of it.",
    faqs: [
      {
        q: "Why switch from ConvertKit/Kit to day3?",
        a: "If you're a software team with a growing list you email occasionally, day3's send-based pricing usually costs less and fits closer than Kit's creator funnels.",
      },
      {
        q: "Does day3 have automated sequences like Kit?",
        a: "No. day3 leaves out automation and sequences. It sends one-off campaigns: product updates, changelogs, announcements. Automations with triggers, waits and branches are designed but not shipped, so don't pick day3 on the strength of them.",
      },
      {
        q: "Can I move my Kit subscribers without losing opt-outs?",
        a: "Yes. Import your suppression list first, then the contacts. Anyone already unsubscribed imports with that status and the date they left, so a migration can't re-subscribe someone who opted out of your Kit list.",
      },
      {
        q: "Is day3 cheaper than Kit for a large list?",
        a: "For a large list mailed occasionally, usually yes, because Kit's meter is subscribers and day3's is sends. The comparison flips if you mail the same list very frequently: at high send volume against a small list, per-subscriber pricing can be the cheaper shape. Work it out on your own numbers rather than taking our word for it.",
      },
    ],
    related: [
      "page:/how-it-works",
      "for:indie-developers",
      "feature:signup-forms",
      "compare:mailchimp-alternative",
      "compare:buttondown-alternative",
      "page:/pricing",
    ],
  },
  {
    slug: "beehiiv-alternative",
    competitor: "beehiiv",
    updated: "2026-08-12",
    metaTitle: "A focused beehiiv alternative for product emails",
    metaDescription:
      "beehiiv is a growth platform for media newsletters. day3 is a small tool for product updates, with unlimited subscribers, billed by sends.",
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
      "day3 isn't a media business tool. It's a focused way for product teams to send updates, with unlimited subscribers and a bill driven only by sends.",
    comparison: [
      { dimension: "Pricing model", day3: DAY3.pricing, competitor: "By subscriber tiers (+ paid add-ons)" },
      { dimension: "Subscriber limits", day3: DAY3.subscribers, competitor: "Tiered by subscriber count" },
      { dimension: "Product scope", day3: DAY3.scope, competitor: "Newsletter growth, monetization, ad network, websites" },
      { dimension: "Transactional email", day3: "First-class: one API call, same domain, same allowance", competitor: "Not the job it's built for" },
      { dimension: "Best for", day3: "SaaS product updates", competitor: "Media & creator newsletters scaling an audience" },
      { dimension: "Starting price", day3: DAY3.startingPrice, competitor: "Free tier, then priced by subscribers" },
    ],
    worked: {
      scenario:
        "40,000 subscribers, two sends a month: a product update and a monthly round-up.",
      subscribers: 40_000,
      monthlySends: 80_000,
      otherModel:
        "Subscriber-tier pricing is set by the 40,000, so the bill is the same whether those two sends happen or neither does",
    },
    migration: standardMigration(
      "Export your beehiiv subscribers to CSV and import with email, first_name and last_name. Suppressed and unsubscribed rows are handled rather than silently dropped, and failed rows can be retried on their own.",
    ),
    migrationCaveat:
      "Everything that makes beehiiv a media business tool stays behind: paid subscriptions, the ad network, referral programs, recommendations, and the hosted publication website. If any of those are earning you money, day3 is not a replacement, it's a downgrade.",
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
      "Stay with beehiiv if you're building a newsletter as a media product: monetizing it, running referrals, or selling ads. That's its strength; day3 doesn't compete there. Stay too if the newsletter's own website and archive matter to you, because day3 publishes signup forms but no publication site.",
    faqs: [
      {
        q: "Is day3 a good beehiiv alternative for a SaaS?",
        a: "Yes, if your goal is sending product updates to users rather than growing and monetizing a media newsletter. day3 is narrower and priced by sends.",
      },
      {
        q: "Does day3 do newsletter monetization?",
        a: "No. No paid subscriptions, ad network, or referral programs. Just reliable product emails.",
      },
      {
        q: "Does day3 host a newsletter website or archive?",
        a: "No. day3 hosts signup form pages, not a publication site, and there's no public archive of past sends. If your newsletter needs a home on the web, beehiiv gives you one and day3 doesn't.",
      },
    ],
    related: [
      "page:/how-it-works",
      "for:saas",
      "feature:campaigns",
      "page:/deliverability",
      "compare:convertkit-alternative",
      "page:/pricing",
    ],
  },
  {
    slug: "emailoctopus-alternative",
    competitor: "EmailOctopus",
    updated: "2026-08-12",
    metaTitle: "An EmailOctopus alternative priced by sends",
    metaDescription:
      "EmailOctopus prices by subscribers. day3 keeps subscribers unlimited and prices by sends, which wins for a big list you mail occasionally.",
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
      { dimension: "Transactional email", day3: "First-class: one API call, same domain, same allowance", competitor: "Not the job it's built for" },
      { dimension: "Best for", day3: "SaaS product updates", competitor: "Budget-conscious general senders" },
      { dimension: "Starting price", day3: DAY3.startingPrice, competitor: "Free tier, then priced by subscribers" },
    ],
    worked: {
      scenario:
        "30,000 subscribers, one send a month. A list that grew much faster than the sending schedule.",
      subscribers: 30_000,
      monthlySends: 30_000,
      otherModel:
        "Per-subscriber pricing is set by the 30,000 on the list, so growing to 40,000 raises the bill even if you keep sending once a month",
    },
    migration: standardMigration(
      "Export to CSV and import with email, first_name and last_name columns. day3 dedupes, skips suppressed addresses, and reports per-row results so a handful of malformed rows doesn't cost you the batch.",
    ),
    migrationCaveat:
      "EmailOctopus automations and its landing pages don't come across. day3 has neither, and automations are designed but not shipped. Your email designs get rebuilt in day3's composer rather than imported.",
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
          "Draft and refine emails with Claude, included on every paid plan.",
      },
    ],
    stayIf:
      "Stay with EmailOctopus if you have a small, stable list and want a generalist tool. Send-based pricing mainly pays off for large or fast-growing lists mailed occasionally, and at a few thousand contacts the two models land close enough that switching isn't worth the afternoon. Stay too if you need its automations or landing pages, since day3 has neither.",
    faqs: [
      {
        q: "How does day3's pricing compare to EmailOctopus?",
        a: "EmailOctopus prices by subscriber count; day3 by sends. Which is cheaper depends on list size versus sending frequency. day3 favors larger lists mailed occasionally.",
      },
      {
        q: "At what list size does day3 start winning?",
        a: "It depends on frequency rather than size alone. The rule of thumb: divide your monthly sends by your subscriber count. If that number is below about one, meaning you don't email the whole list every month, send-based pricing is working in your favour. Well above one and per-subscriber pricing may be the better shape.",
      },
      {
        q: "Does day3 have automations?",
        a: "Not yet. Triggers, waits and branches are designed but not shipped. If you're relying on EmailOctopus automations today, that's a reason to stay rather than a gap to work around.",
      },
    ],
    related: [
      "page:/how-it-works",
      "page:/pricing",
      "for:indie-developers",
      "feature:audiences",
      "compare:buttondown-alternative",
      "page:/deliverability",
    ],
  },
  {
    slug: "buttondown-alternative",
    competitor: "Buttondown",
    updated: "2026-08-12",
    metaTitle: "A Buttondown alternative for product teams",
    metaDescription:
      "Buttondown is a minimal, markdown-first newsletter tool priced by subscribers. day3 is just as minimal, priced by sends, and built for product updates.",
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
      { dimension: "Writing the email", day3: "Visual composer, plus Markdown from your editor over MCP", competitor: "Markdown, first-class" },
      { dimension: "Transactional email", day3: "First-class: one API call, same domain, same allowance", competitor: "Not the job it's built for" },
      { dimension: "Best for", day3: "Small SaaS & indie devs", competitor: "Writers & developers who like markdown" },
      { dimension: "Starting price", day3: DAY3.startingPrice, competitor: "Free tier, then priced by subscribers" },
    ],
    worked: {
      scenario:
        "8,000 subscribers on a weekly letter. Four sends a month, every month.",
      subscribers: 8_000,
      monthlySends: 32_000,
      otherModel:
        "Per-subscriber pricing is set by the 8,000, so a weekly schedule and a monthly one cost the same, which is the case where a subscriber meter can be the better deal",
    },
    migration: standardMigration(
      "Export your Buttondown subscribers to CSV and import with email, first_name and last_name. Or use the API in batches of 1,000, upserting by email so a re-run is harmless.",
    ),
    migrationCaveat:
      "If you write in Markdown and like it, note the shape of the trade: day3's composer is visual, and Markdown reaches it through the MCP server from your editor rather than as a native writing mode in the app. That's a real difference in daily feel, not just a feature checkbox. Buttondown's paid subscriptions and its archive pages also stay behind.",
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
      "Stay with Buttondown if a markdown-first flow and a small stable list are exactly what you want, and especially if you send often: a weekly letter to a modest list is the one shape where a subscriber meter can beat a send meter. Stay too if you're monetizing with paid subscriptions or you want public archive pages. day3 pulls ahead as your list grows faster than your sending schedule.",
    faqs: [
      {
        q: "Is day3 as simple as Buttondown?",
        a: "It's just as focused, since a campaign fits on one screen, while adding signup forms, built-in deliverability, and send-based pricing.",
      },
      {
        q: "Can I still write in Markdown?",
        a: "Through the MCP server, yes: describe or write the email in Claude Code, Cursor or VS Code and it arrives in day3 as editable composer blocks. It converts back too, so an email finished by hand reads out as Markdown again. But the app's own writing surface is a visual composer, not a Markdown box.",
      },
      {
        q: "Which is cheaper, day3 or Buttondown?",
        a: "It depends on how often you send. Buttondown's meter is subscribers, day3's is sends, so a big list mailed rarely favours day3 and a small list mailed weekly can favour Buttondown. Divide your monthly sends by your subscriber count: below about one, day3's model is working for you.",
      },
    ],
    related: [
      "page:/how-it-works",
      "for:indie-developers",
      "feature:signup-forms",
      "feature:api",
      "compare:emailoctopus-alternative",
      "page:/pricing",
    ],
  },
];

export function getComparePage(slug: string): ComparePage | undefined {
  return comparePages.find((page) => page.slug === slug);
}
