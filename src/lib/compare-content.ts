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
      "page:/resend-pricing-calculator",
      "page:/pricing/for",
      "feature:api",
      "docs:emails",
      "docs:migrate",
      "page:/deliverability",
      "page:/how-it-works",
      "for:saas",
      "compare:mailchimp-alternative",
    ],
  },
  {
    slug: "mailchimp-alternative",
    competitor: "Mailchimp",
    updated: "2026-09-18",
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
      "Landing pages, ad audiences and the CRM don't come across, because day3 has none of them. Customer journeys don't import either: day3 has automations with triggers, waits and branches, but you rebuild a journey on its canvas rather than move it, and day3's version is an early preview without A/B splits. Drag-and-drop template designs get rebuilt in day3's composer. Tags become custom fields and saved segments, which usually maps cleanly.",
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
      "Stay with Mailchimp if you need landing pages, ads, or a CRM in one place, or if your customer journeys lean on A/B splits and behavioural triggers beyond signups and your own API events. day3's automations cover welcome series, onboarding and win-back, and they're an early preview. Stay too if a marketing team rather than a founder owns your email, because the collaboration, approval and reporting depth Mailchimp has built for that job is real and day3 has not tried to match it. day3 just emails your users about product changes.",
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
        a: "By design: no A/B testing, drag-and-drop template builders, landing pages, or ads. Automations exist for welcome series, onboarding and win-back flows, but not Mailchimp's full journey builder. Just reliable product emails, with saved segments and subscription topics where they earn their keep.",
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
      "page:/pricing/for",
      "page:/how-it-works",
      "page:/deliverability",
      "for:startups",
      "feature:audiences",
      "compare:kit-alternative",
      "page:/pricing",
    ],
  },
  {
    slug: "kit-alternative",
    competitor: "Kit (ConvertKit)",
    updated: "2026-09-18",
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
      "Sequences and visual automations don't import. day3 has automations of its own, with triggers, waits and branches on a canvas, so a welcome or onboarding sequence can be rebuilt there, but it is an early preview and the rebuild is by hand. Paid subscriptions, commerce, and Kit's creator network don't come across at all. If a running sequence is doing real work for you, plan the rebuild before the move rather than after.",
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
      "Stay with Kit if you're a creator who leans on paid subscriptions, commerce, visual sales funnels, or automations more elaborate than a welcome or onboarding series. day3 isn't a creator platform and isn't trying to become one. Stay too if your email *is* the product rather than an announcement channel for it, because Kit has built a decade of tooling for that and day3 has deliberately built none of it.",
    faqs: [
      {
        q: "Why switch from ConvertKit/Kit to day3?",
        a: "If you're a software team with a growing list you email occasionally, day3's send-based pricing usually costs less and fits closer than Kit's creator funnels.",
      },
      {
        q: "Does day3 have automated sequences like Kit?",
        a: "Partly. day3 has automations: a trigger, emails, waits and branches drawn on a canvas, with four starter templates for welcome, onboarding and win-back flows. They're an early preview, so no A/B splits or wait-for-event steps yet, and nothing like Kit's creator funnels. Campaigns, meaning one-off product updates and changelogs, remain the main job.",
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
      "page:/pricing/for",
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
      "page:/pricing/for",
      "page:/how-it-works",
      "for:saas",
      "feature:campaigns",
      "page:/deliverability",
      "compare:kit-alternative",
      "page:/pricing",
    ],
  },
  {
    slug: "emailoctopus-alternative",
    competitor: "EmailOctopus",
    updated: "2026-09-18",
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
      "EmailOctopus landing pages don't come across, because day3 has none. Its automations don't import either: day3 has its own, with triggers, waits and branches on a canvas, but you rebuild a flow there by hand and day3's version is an early preview. Your email designs get rebuilt in day3's composer rather than imported.",
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
      "Stay with EmailOctopus if you have a small, stable list and want a generalist tool. Send-based pricing mainly pays off for large or fast-growing lists mailed occasionally, and at a few thousand contacts the two models land close enough that switching isn't worth the afternoon. Stay too if you need its landing pages, since day3 has none, or if its automations do more for you than a welcome or onboarding series would.",
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
        a: "Yes, as an early preview. A trigger, emails, waits and branches on a canvas, unlimited on every plan, with the emails they send drawn from your monthly allowance. Welcome series, onboarding and win-back flows are the intended shape. If you rely on something more elaborate in EmailOctopus, check the gaps before you move.",
      },
    ],
    related: [
      "page:/pricing/for",
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
      "page:/pricing/for",
      "page:/how-it-works",
      "for:indie-developers",
      "feature:signup-forms",
      "feature:api",
      "compare:emailoctopus-alternative",
      "page:/pricing",
    ],
  },
  /*
    Substack is the one competitor here that is not really a tool, it is a
    publisher with a business model attached. So the page does not argue price:
    a free newsletter sends on Substack for nothing, and pretending otherwise
    would be the kind of comparison nobody trusts. The argument is ownership and
    job-to-be-done, and the stay-if is unusually long because Substack is
    genuinely the right answer for a paid publication.
  */
  {
    slug: "substack-alternative",
    competitor: "Substack",
    updated: "2026-09-18",
    metaTitle: "A Substack alternative on your own domain",
    metaDescription:
      "Substack is a publishing network that takes a cut of paid subscriptions. day3 is plain email infrastructure: your domain, your list, a flat monthly plan, no revenue share.",
    keywords: [
      "substack alternative",
      "substack alternative for developers",
      "self hosted substack alternative",
      "newsletter without revenue share",
      "own your email list",
    ],
    title: "A Substack alternative where the list is yours.",
    intro:
      "Substack is a publishing platform with a network attached, and it earns by taking a share of what your paid subscribers pay you.",
    difference:
      "day3 is not a publisher. There is no public archive, no discovery feed, no recommendations and no payments layer. You get a sending domain, a list you own outright and a flat monthly plan, which is the right trade when the email is about your product rather than a publication you sell.",
    comparison: [
      { dimension: "Pricing model", day3: DAY3.pricing, competitor: "Free to send; a share of paid subscription revenue" },
      { dimension: "Subscriber limits", day3: DAY3.subscribers, competitor: "Unlimited too" },
      { dimension: "Product scope", day3: DAY3.scope, competitor: "Publishing platform: archive, network, comments, payments" },
      { dimension: "Sending domain", day3: "Your own, authenticated with DKIM, SPF and DMARC", competitor: "Substack's infrastructure" },
      { dimension: "Best for", day3: "Software teams emailing their own users", competitor: "Writers building a paid publication" },
      { dimension: "Starting price", day3: DAY3.startingPrice, competitor: "Nothing until you charge readers" },
    ],
    worked: {
      scenario:
        "10,000 users on the list, emailed once a week with product news. Nobody pays to receive it.",
      subscribers: 10_000,
      monthlySends: 40_000,
      otherModel:
        "Substack charges nothing to send a free newsletter and takes its cut from paid subscriptions instead, so at this shape it costs nothing and day3 costs the plan price",
    },
    migration: standardMigration(
      "Export your subscribers from Substack's settings as a CSV and upload it. day3 dedupes on the way in, refuses anyone already on your suppression list, and lets you retry only the rows that failed. Paid subscribers export as email addresses like everyone else; the billing relationship stays behind.",
    ),
    migrationCaveat:
      "Almost everything that makes Substack a publication stays on Substack: the public archive and its URLs, comments, the recommendation network, your paid subscriptions and the Stripe relationship behind them. day3 has no payments and no way to charge a reader, so a paid publication cannot move here without moving its billing somewhere else first.",
    reasonsToSwitch: [
      {
        title: "No revenue share",
        description:
          "A flat monthly plan by sends. What your product earns is none of our business.",
      },
      {
        title: "Your domain, your reputation",
        description:
          "Mail goes out authenticated from a domain you own, so the sending reputation you build belongs to you and follows you anywhere.",
      },
      {
        title: "Built for product email",
        description:
          "Audiences, segments, signup forms and transactional sends from the same place, which a publishing tool has no reason to offer.",
      },
    ],
    stayIf:
      "Stay on Substack if you are building a publication rather than a product. It costs nothing until you charge, it handles payments, it gives you an archive people can link to, and its network genuinely sends readers your way. day3 does none of that on purpose. If your newsletter is the thing you sell, Substack is the better tool and this page is not trying to talk you out of it.",
    faqs: [
      {
        q: "Is day3 cheaper than Substack?",
        a: "Not for a free newsletter. Substack costs nothing to send, and day3 charges a monthly plan by volume. day3 comes out ahead once you are selling something other than the newsletter, because Substack's share of a paid publication grows with your revenue while a send-based plan does not.",
      },
      {
        q: "Can I move my Substack list to day3?",
        a: "The email addresses, yes, by CSV export and import. Paid subscriptions cannot move, because day3 has no payments layer. People who pay you on Substack keep paying you on Substack until you move that billing yourself.",
      },
      {
        q: "Does day3 give me a public archive?",
        a: "No. There are no public post URLs, no comments and no reader-facing site. day3 sends email and reports on it. If you need a web archive people can find and link, a publishing platform is the right shape of tool.",
      },
      {
        q: "Who owns the subscriber list?",
        a: "You do, on both. Substack lets you export and has always been clear about that. The difference is the sending domain and the reader relationship: on day3 the mail comes from your domain, so the reputation and the relationship are yours from the first send.",
      },
    ],
    related: [
      "page:/pricing/for",
      "page:/how-it-works",
      "page:/deliverability",
      "compare:beehiiv-alternative",
      "compare:kit-alternative",
      "page:/pricing",
    ],
  },
  {
    slug: "mailerlite-alternative",
    competitor: "MailerLite",
    updated: "2026-09-18",
    metaTitle: "A send-priced MailerLite alternative",
    metaDescription:
      "MailerLite prices by subscriber count and bundles websites, landing pages and paid newsletters. day3 bills by sends, keeps subscribers unlimited, and stays narrow.",
    keywords: [
      "mailerlite alternative",
      "cheaper than mailerlite",
      "mailerlite alternative for saas",
      "mailerlite pricing by subscribers",
      "mailerlite alternative for developers",
    ],
    title: "A MailerLite alternative that meters sends, not subscribers.",
    intro:
      "MailerLite is a well-built marketing suite for small businesses, and like most of that category it prices by how many contacts you store.",
    difference:
      "The bill is the difference. On a contact-metered plan a list you email once a quarter costs the same as one you email daily. day3 meters sends, so a large, quiet list is cheap and the price only moves when you actually write to people.",
    comparison: [
      { dimension: "Pricing model", day3: DAY3.pricing, competitor: "By number of subscribers stored" },
      { dimension: "Subscriber limits", day3: DAY3.subscribers, competitor: "Tiered: more subscribers cost more" },
      { dimension: "Product scope", day3: DAY3.scope, competitor: "Marketing suite: websites, landing pages, paid newsletters, e-commerce" },
      { dimension: "Cost of a quiet month", day3: "Nothing changes. The meter only moves when you send", competitor: "The subscriber bill arrives either way" },
      { dimension: "Best for", day3: "Software teams shipping product updates", competitor: "Small businesses running marketing end to end" },
      { dimension: "Starting price", day3: DAY3.startingPrice, competitor: "Free tier, then priced by subscribers" },
    ],
    worked: {
      scenario:
        "25,000 signups collected over two years, emailed twice a month when something ships.",
      subscribers: 25_000,
      monthlySends: 50_000,
      otherModel:
        "A per-subscriber plan bills for all 25,000 every month, including the months you ship nothing",
    },
    migration: standardMigration(
      "Export your MailerLite subscribers to CSV, including the custom fields you use as merge tags, and upload it. day3 dedupes, honours your suppression list and reports failed rows so you can retry just those. The API takes batches of 1,000 if you would rather script it.",
    ),
    migrationCaveat:
      "Websites, landing pages, pop-up designs and paid-newsletter billing do not come across, because day3 has none of them. Drag-and-drop email designs get rebuilt in day3's composer, which is deliberately a writing tool rather than a layout canvas. Automations rebuild rather than import: day3 has triggers, waits and branches, as an early preview, without A/B splits.",
    reasonsToSwitch: [
      {
        title: "The list stops costing money",
        description:
          "Import every address you have ever collected. Until you email them, they cost nothing.",
      },
      {
        title: "One allowance, both jobs",
        description:
          "Product updates and password resets come out of the same plan and go from the same authenticated domain.",
      },
      {
        title: "Less to set up",
        description:
          "No site builder or funnel to configure first. Verify a domain, import a list, write the update, send.",
      },
    ],
    stayIf:
      "Stay with MailerLite if its breadth is the point: you want landing pages, a website builder, pop-ups and paid newsletters from one login, or a drag-and-drop designer for image-heavy campaigns. It is a capable suite for a small marketing team, and day3 is a narrow tool for a software team. Stay too if you email a small list very often, because that is the shape where a flat per-subscriber fee reads well.",
    faqs: [
      {
        q: "Is day3 cheaper than MailerLite?",
        a: "It depends on how often you send. day3 never charges for a contact, so the bigger and quieter your list, the wider the gap. A small list emailed several times a week is the case where a per-subscriber plan holds up best.",
      },
      {
        q: "Can I import my MailerLite subscribers?",
        a: "Yes, by CSV or API, with custom fields and unsubscribe status intact. Bring your suppression list first and day3 refuses those addresses on the way in rather than quietly re-subscribing anyone.",
      },
      {
        q: "Does day3 have a drag-and-drop email builder?",
        a: "No. day3's composer is a writing tool that produces clean, inbox-ready formatting. If your campaigns are laid out like a web page, MailerLite's designer is the better fit.",
      },
      {
        q: "What about landing pages and forms?",
        a: "Signup forms yes, as hosted pages, embeds or pop-ups. Landing pages and the website builder, no. day3 collects subscribers and emails them; the rest of your site stays wherever it already lives.",
      },
    ],
    related: [
      "page:/pricing/for",
      "page:/how-it-works",
      "feature:signup-forms",
      "compare:mailchimp-alternative",
      "compare:emailoctopus-alternative",
      "page:/pricing",
    ],
  },
  {
    slug: "loops-alternative",
    competitor: "Loops",
    updated: "2026-09-18",
    metaTitle: "A send-priced Loops alternative",
    metaDescription:
      "Loops is a well-made, developer-minded email tool that prices by contact count. day3 shares the sensibility and meters sends instead, with unlimited subscribers.",
    keywords: [
      "loops alternative",
      "loops so alternative",
      "loops email alternative",
      "cheaper than loops",
      "email tool for saas priced by sends",
    ],
    title: "A Loops alternative billed by sends, not contacts.",
    intro:
      "Loops is aimed at the same people day3 is, software teams who want email that does not feel like a marketing suite, and it prices by how many contacts you store.",
    difference:
      "There is less daylight here than on the other comparison pages, and pretending otherwise would be silly. Both tools are narrow on purpose and pleasant to use. The durable difference is the meter: Loops counts the contacts in your workspace, day3 counts the emails that leave it.",
    comparison: [
      { dimension: "Pricing model", day3: DAY3.pricing, competitor: "By number of contacts stored" },
      { dimension: "Subscriber limits", day3: DAY3.subscribers, competitor: "Tiered: more contacts cost more" },
      { dimension: "Product scope", day3: DAY3.scope, competitor: "Marketing and transactional email for SaaS, with lifecycle loops" },
      { dimension: "Cost of a quiet month", day3: "Nothing changes. The meter only moves when you send", competitor: "The contact bill arrives either way" },
      { dimension: "Best for", day3: "Teams with a big list they email occasionally", competitor: "Teams leaning on event-driven lifecycle campaigns" },
      { dimension: "Starting price", day3: DAY3.startingPrice, competitor: "Free tier, then priced by contacts" },
    ],
    worked: {
      scenario:
        "50,000 signed-up users, most of them dormant, emailed once a month with a changelog.",
      subscribers: 50_000,
      monthlySends: 50_000,
      otherModel:
        "A per-contact plan counts all 50,000 every month, dormant or not, because storage is the meter",
    },
    migration: standardMigration(
      "Export your Loops contacts to CSV with their properties, or pull them through the API, and import them into a day3 audience. Properties land as custom fields that register themselves as merge tags. day3 dedupes and skips anyone already suppressed.",
    ),
    migrationCaveat:
      "Loops campaigns and the lifecycle loops built around your product events do not import. day3 has automations with triggers, waits and branches, and they are an early preview, so a heavily event-driven setup is a rebuild rather than a move. Check that the events you trigger on exist as day3 API events before you commit to the switch.",
    reasonsToSwitch: [
      {
        title: "Dormant users are free",
        description:
          "Most SaaS lists are mostly inactive. day3 does not bill for an address until you email it.",
      },
      {
        title: "One allowance for everything",
        description:
          "Campaigns and transactional sends share a plan and a domain, so there is one number to watch.",
      },
      {
        title: "EU-only by default",
        description:
          "Data stays in the EU on infrastructure we name publicly, with a DPA on offer and every sub-processor listed.",
      },
    ],
    stayIf:
      "Stay with Loops if your email is genuinely event-driven and the lifecycle campaigns are the product: day3's automations are newer and narrower, and an early preview. Stay too if your list is small and active, because contact-based pricing is at its most reasonable exactly there. Loops is a good tool built by people who clearly care, and switching for the sake of switching would be a waste of a week.",
    faqs: [
      {
        q: "How is day3 different from Loops?",
        a: "Mostly the meter. Loops prices by contacts stored, day3 by emails sent, so the two diverge as a list grows quiet. On scope, Loops leans further into event-driven lifecycle campaigns while day3 leans into broadcasts, segments and transactional on one allowance.",
      },
      {
        q: "Is day3 cheaper than Loops?",
        a: "For a large list you email occasionally, usually, because dormant contacts cost nothing. For a small list you email constantly, the gap closes and can reverse. Run your own numbers: contacts stored against emails actually sent.",
      },
      {
        q: "Can I move my Loops contacts across?",
        a: "Yes, by CSV or API, with properties mapped to custom fields and unsubscribes carried over as unsubscribes. Import your suppression list first so the guard is in place before the contacts arrive.",
      },
      {
        q: "Does day3 do lifecycle automation?",
        a: "Yes, as an early preview: triggers, waits and branches, enough for welcome series, onboarding and win-back. It is not a match for a mature event-driven automation builder, and we would rather say so here than after you have migrated.",
      },
    ],
    related: [
      "page:/pricing/for",
      "feature:api",
      "feature:automations",
      "compare:resend-alternative",
      "for:saas",
      "page:/pricing",
    ],
  },
  /*
    The honest one. Brevo already bills by emails sent, so the pricing-model
    argument this site leans on everywhere else simply does not apply, and the
    page says that in the first line rather than burying it. What is left is a
    real difference of scope, which is the actual decision anyway.
  */
  {
    slug: "brevo-alternative",
    competitor: "Brevo",
    updated: "2026-09-18",
    metaTitle: "A narrower Brevo alternative, also priced by sends",
    metaDescription:
      "Brevo already bills by emails sent, so this is not a pricing argument. It is a suite with CRM, SMS and chat; day3 does product and transactional email and stops there.",
    keywords: [
      "brevo alternative",
      "sendinblue alternative",
      "brevo alternative for developers",
      "simple brevo alternative",
      "brevo vs day3",
    ],
    title: "A Brevo alternative for teams who only want the email part.",
    intro:
      "Brevo, formerly Sendinblue, already prices by emails sent rather than by contact count, so the argument day3 usually makes about the contact tax does not apply here.",
    difference:
      "This one is about scope, not the meter. Brevo is a suite: email, SMS, WhatsApp, chat, a sales CRM, landing pages and automation across all of it. day3 sends product updates and transactional email from one authenticated domain and has no ambition beyond that. Narrow is the feature, and it is also the reason to stay away if you need the rest.",
    comparison: [
      { dimension: "Pricing model", day3: DAY3.pricing, competitor: "Also by emails sent, with paid add-ons per channel" },
      { dimension: "Subscriber limits", day3: DAY3.subscribers, competitor: "Unlimited contacts too" },
      { dimension: "Product scope", day3: DAY3.scope, competitor: "Full suite: CRM, SMS, WhatsApp, chat, landing pages" },
      { dimension: "Surface area", day3: "One composer, one audience list, one API", competitor: "Many modules, most of which a software team will not use" },
      { dimension: "Best for", day3: "Software teams emailing their own users", competitor: "Businesses running sales and multi-channel marketing together" },
      { dimension: "Starting price", day3: DAY3.startingPrice, competitor: "Free tier with a daily cap, then priced by sends" },
    ],
    worked: {
      scenario:
        "10,000 users emailed twice a month, plus the password resets and receipts the app sends.",
      subscribers: 10_000,
      monthlySends: 25_000,
      otherModel:
        "Brevo meters the same way, by emails sent, so the two bills are genuinely comparable here and the decision comes down to which product you would rather use",
    },
    migration: standardMigration(
      "Export your Brevo contacts to CSV with their attributes and import them into a day3 audience. Attributes become custom fields that work as merge tags. day3 dedupes, honours suppressions and reports the rows it refused so you can fix and retry just those.",
    ),
    migrationCaveat:
      "The CRM, SMS and WhatsApp channels, chat, landing pages and any automation that spans them stay behind, because day3 is email only. Brevo's multi-channel workflows have no equivalent here. If a deal pipeline or an SMS step is load-bearing in your setup, this move breaks it.",
    reasonsToSwitch: [
      {
        title: "Far less to hold",
        description:
          "One composer, one list, one API key. Nothing to switch off, nothing to learn past the first send.",
      },
      {
        title: "Built for product email",
        description:
          "Changelogs, launch notes and receipts from the same domain and the same allowance, with per-email delivery status.",
      },
      {
        title: "EU-only hosting, named openly",
        description:
          "Every sub-processor is listed by name, data stays in the EU, and a DPA is on offer without asking sales.",
      },
    ],
    stayIf:
      "Stay with Brevo if you use more than the email module. A sales CRM next to your campaigns, SMS or WhatsApp in the same workflow, or chat on your site are real capabilities that day3 will never have. Brevo's send-based pricing is also fair on its own terms, so there is no bill-shaped reason to move. Switch only if the suite is more tool than you want to own.",
    faqs: [
      {
        q: "Is day3 cheaper than Brevo?",
        a: "Not necessarily, and it would be dishonest to imply otherwise. Both meter emails sent. Compare the two plans at your volume directly, and pick on product rather than on model.",
      },
      {
        q: "Why switch from Brevo to day3 at all?",
        a: "Scope. If you use Brevo only to email your users about your product, most of what you are logging into is not for you. day3 is that one job with nothing else attached, plus transactional on the same allowance and domain.",
      },
      {
        q: "Does day3 do SMS?",
        a: "No. Email only, and that is not a roadmap item. If a campaign needs an SMS step, day3 is the wrong tool.",
      },
      {
        q: "Can I bring my Brevo contacts and attributes?",
        a: "Yes, by CSV or API. Attributes map to custom fields, unsubscribes import as unsubscribes with the date they left on, and your suppression list should go in first so nobody gets re-mailed by the migration.",
      },
    ],
    related: [
      "page:/pricing/for",
      "page:/how-it-works",
      "page:/security",
      "feature:api",
      "compare:mailchimp-alternative",
      "page:/pricing",
    ],
  },
  {
    slug: "postmark-alternative",
    competitor: "Postmark",
    updated: "2026-09-18",
    metaTitle: "A Postmark alternative with the list layer included",
    metaDescription:
      "Postmark is excellent transactional email, priced by sends. day3 sends transactional the same way and brings audiences, segments, forms and consent with it.",
    keywords: [
      "postmark alternative",
      "postmark alternative with newsletters",
      "transactional and marketing email one provider",
      "postmark vs day3",
      "email api with audiences",
    ],
    title: "A Postmark alternative that also owns your list.",
    intro:
      "Postmark has spent a decade being very good at one thing: getting transactional mail delivered fast, with support that actually answers.",
    difference:
      "Both tools meter sends, so this is not a pricing argument either. The difference is what sits above the API. Postmark is built around message streams for application mail. day3 puts audiences, segments, signup forms, subscription topics and consent records in the same product, so the changelog and the password reset share one domain, one allowance and one suppression list.",
    comparison: [
      { dimension: "Pricing model", day3: DAY3.pricing, competitor: "Also by emails sent" },
      { dimension: "Subscriber limits", day3: DAY3.subscribers, competitor: "Not a list tool; no subscriber tiers" },
      { dimension: "Product scope", day3: DAY3.scope, competitor: "Transactional-first, with broadcast streams alongside" },
      { dimension: "List layer", day3: "Audiences, live segments, forms, topics, consent records", competitor: "Recipients and streams rather than a managed list" },
      { dimension: "Best for", day3: "Teams wanting both jobs in one place", competitor: "Teams who want application mail and nothing else" },
      { dimension: "Starting price", day3: DAY3.startingPrice, competitor: "Free trial volume, then priced by sends" },
    ],
    worked: {
      scenario:
        "A SaaS sending 15,000 transactional emails a month, plus a monthly changelog to 10,000 users.",
      subscribers: 10_000,
      monthlySends: 25_000,
      otherModel:
        "Postmark meters sends as well, so the comparison is close; what changes is whether the list, the forms and the consent trail live in the same tool or somewhere else",
    },
    migration: standardMigration(
      "There may not be much of a list to export, which is the point. Bring the contacts from wherever they currently live, a database dump or your app's users table, as a CSV with email and any fields you merge into templates. day3 dedupes and refuses suppressed addresses on the way in.",
    ),
    migrationCaveat:
      "Message streams, templates and webhooks are rebuilt rather than moved, and Postmark's message retention and search are deeper than day3's. If you rely on long log retention for support forensics, check day3's retention against yours before you switch. Inbound email processing is not something day3 offers.",
    reasonsToSwitch: [
      {
        title: "One domain, both jobs",
        description:
          "Receipts and changelogs from the same authenticated domain, on one allowance, with one suppression list guarding both.",
      },
      {
        title: "A list you can actually work with",
        description:
          "Live segments, hosted signup forms and subscription topics, so marketing email does not need a second tool.",
      },
      {
        title: "Consent kept as a record",
        description:
          "Opt-in source and timestamp stored per contact, one-click unsubscribe on every campaign, opt-outs honoured across both kinds of mail.",
      },
    ],
    stayIf:
      "Stay with Postmark if all you send is application mail. Its deliverability record, its speed and its support are genuinely first-rate, and day3 is not claiming to beat them at it. Stay too if inbound routing, deep message retention or per-stream reputation separation matter to you. Switch when the list layer you have been bolting on elsewhere is the part that hurts.",
    faqs: [
      {
        q: "Can day3 replace Postmark for transactional email?",
        a: "For most product teams, yes: one POST per email, idempotent retries and per-email delivery status, from a domain you authenticate. Heavy senders with strict retention, inbound routing or per-stream reputation requirements should check those specifics first.",
      },
      {
        q: "Is day3 cheaper than Postmark?",
        a: "Both meter sends, so compare plans at your volume. The saving, when there is one, usually comes from collapsing two subscriptions into one rather than from a lower per-email rate.",
      },
      {
        q: "Should marketing and transactional email share a domain?",
        a: "They can, and day3 is built for it, but a subdomain split is the safer pattern once volume grows so a bad campaign cannot drag your password resets down with it. The guide on this goes through the trade-off properly.",
      },
      {
        q: "Does day3 do inbound email?",
        a: "No. Outbound only. If you parse replies or route inbound mail into your app, you need something else for that half.",
      },
    ],
    related: [
      "docs:emails",
      "feature:api",
      "page:/deliverability",
      "blog:transactional-and-marketing-one-domain",
      "compare:resend-alternative",
      "page:/pricing",
    ],
  },
  {
    slug: "mailgun-alternative",
    competitor: "Mailgun",
    updated: "2026-09-18",
    metaTitle: "A Mailgun alternative your whole team can use",
    metaDescription:
      "Mailgun is email infrastructure for engineers, priced by sends. day3 sends transactional the same way and adds a composer, audiences and forms the rest of the team can use.",
    keywords: [
      "mailgun alternative",
      "mailgun alternative with newsletters",
      "simpler mailgun alternative",
      "mailgun vs day3",
      "email api with a composer",
    ],
    title: "A Mailgun alternative that is not only for engineers.",
    intro:
      "Mailgun is sending infrastructure: a capable API, deep deliverability tooling, validation and inbound routing, priced by the emails you push through it.",
    difference:
      "Again not a pricing argument, both meter sends. The difference is who can use it. Mailgun assumes an engineer for every send, so the marketing half ends up somewhere else, on a second bill and a second suppression list. day3 puts a composer, audiences, segments and signup forms on top of the same API, so the person writing the changelog does not need to open a terminal.",
    comparison: [
      { dimension: "Pricing model", day3: DAY3.pricing, competitor: "Also by emails sent, with add-ons" },
      { dimension: "Subscriber limits", day3: DAY3.subscribers, competitor: "Infrastructure, not a list tool" },
      { dimension: "Product scope", day3: DAY3.scope, competitor: "Sending infrastructure: API, validation, inbound routing, analytics" },
      { dimension: "Who can send", day3: "Anyone on the team, from a composer", competitor: "Whoever can call the API or drive the templates" },
      { dimension: "Best for", day3: "Small teams wanting one tool for both jobs", competitor: "High-volume senders with engineers to run it" },
      { dimension: "Starting price", day3: DAY3.startingPrice, competitor: "Free trial volume, then priced by sends" },
    ],
    worked: {
      scenario:
        "A product team sending 20,000 application emails a month and a fortnightly update to 15,000 users.",
      subscribers: 15_000,
      monthlySends: 50_000,
      otherModel:
        "Mailgun meters sends too, so the bills are comparable; the usual difference is the second subscription the marketing half needs alongside it",
    },
    migration: standardMigration(
      "If your list lives in a database rather than in Mailgun, export it from there as a CSV with email and the fields your templates merge. If you have been storing recipients in Mailgun's own lists, export those. day3 dedupes on import and refuses anything already suppressed.",
    ),
    migrationCaveat:
      "Email validation, inbound routing and message parsing are not things day3 does, and Mailgun's analytics and log retention go deeper. Templates and webhook handlers are rebuilt, not moved. At very high volume, dedicated-IP strategy and the controls around it are Mailgun's territory rather than day3's.",
    reasonsToSwitch: [
      {
        title: "One tool instead of two",
        description:
          "The API and the list layer in the same product, so marketing and transactional share a domain, an allowance and a suppression list.",
      },
      {
        title: "Non-engineers can send",
        description:
          "A composer, audiences and live segments mean the update does not queue behind a deploy.",
      },
      {
        title: "DNS set up for you",
        description:
          "Connect Cloudflare and day3 publishes DKIM, SPF and DMARC itself, then rechecks until the domain verifies.",
      },
    ],
    stayIf:
      "Stay with Mailgun if you are sending at real volume with engineers who know it, or if you need inbound routing, email validation, long log retention or fine-grained IP control. That is infrastructure work and Mailgun is built for it. day3 is for teams who want to send good email without running a mail platform.",
    faqs: [
      {
        q: "Can day3 replace Mailgun?",
        a: "For ordinary product and application email, yes. For inbound routing, address validation, very long retention or dedicated-IP management at scale, no, and those are the cases where Mailgun earns its place.",
      },
      {
        q: "Is day3 cheaper than Mailgun?",
        a: "Both meter sends, so compare at your volume. Where teams save is usually by dropping the second tool they were paying for the newsletter half.",
      },
      {
        q: "Does day3 have an API as good as Mailgun's?",
        a: "It is narrower on purpose: one POST to send, idempotency keys, per-email status, plus endpoints for contacts, audiences, topics and suppressions. It does not try to cover validation or inbound.",
      },
      {
        q: "Will my deliverability change?",
        a: "Authenticate the same sending domain and bring your suppression list first and the move is close to invisible to mailbox providers, because reputation attaches to your domain rather than to the provider. Warm up gradually if you are moving very high volume.",
      },
    ],
    related: [
      "docs:emails",
      "feature:api",
      "page:/deliverability",
      "compare:postmark-alternative",
      "compare:resend-alternative",
      "page:/pricing",
    ],
  },
];

export function getComparePage(slug: string): ComparePage | undefined {
  return comparePages.find((page) => page.slug === slug);
}
