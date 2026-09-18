/**
 * The changelog. One curated, user-facing "what's new" entry per release, in
 * product language rather than raw commits. Newest first.
 *
 * Every entry gets its own page at /changelog/<slug> with Article markup and a
 * real publish date, and is listed in the sitemap and llms.txt. `isoDate`
 * drives the <time> element, the ordering, and the sitemap's lastmod.
 */
export type ChangelogEntry = {
  /** URL segment under /changelog. Stable once published: it is a permalink. */
  slug: string;
  date: string;
  isoDate: string;
  title: string;
  /** One paragraph of context. Without it an entry page is a bare bullet list. */
  summary: string;
  /** Short form for the meta description. `summary` is prose and runs far too long. */
  metaDescription: string;
  items: string[];
};

export const changelogEntries: ChangelogEntry[] = [
  {
    slug: "reputation-protection-that-explains-itself",
    date: "September 18, 2026",
    isoDate: "2026-09-18",
    title: "Reputation protection that pauses a campaign, not your account",
    summary:
      "The bounce and complaint guard used to have one response: lock the workspace, without saying why. It also fired on honest lists at low volume, where a handful of bad addresses looks like a high percentage. It now works in steps, every step needs a real count of bad addresses behind the rate, and every notice explains what happened and what to do next.",
    metaDescription:
      "day3's bounce and complaint guard now escalates in steps: pause the campaign first, warn the workspace, and only then pause sending. Every notice says why.",
    items: [
      "A campaign whose bounce or complaint rate climbs too high pauses itself first. You fix the list and resume it. Your other sending is untouched.",
      "The workspace gets a warning email before anything account-wide happens, at most once a week, and a workspace pause only follows a sustained problem.",
      "A pause now requires an absolute number of bad addresses, not just a percentage, so a small send with two bounces no longer trips it.",
      "Every notification spells out what happened, why inbox providers care, that the bad addresses are already suppressed, and what to do next.",
      "Deleting a sent campaign keeps its delivery record, so the health numbers stay honest.",
    ],
  },
  {
    slug: "automations-preview-and-one-activity-page",
    date: "September 8, 2026",
    isoDate: "2026-09-08",
    title: "Automations in early preview, and one Activity page for every send",
    summary:
      "The first version of automations: a node canvas with triggers, waits and sends that runs for real and sends real email, labelled as an early preview because the edges are still being found. Around it, the app got simpler. Campaign, automation and API sends now share one Activity page, the metrics page covers all three, and the sidebar dropped from thirteen items to nine.",
    metaDescription:
      "Automations arrive in early preview: a node canvas of triggers, waits and sends. Plus one Activity page and one metrics view across campaigns, automations and the API.",
    items: [
      "Build automations on a node canvas: a trigger, waits, branches and send steps, published as versions. Automation mail carries the same open and click tracking and one-click unsubscribe as campaigns.",
      "Automations are an early preview. They run for real, and the badge in the app says so. Report anything odd through Help.",
      "One Activity page lists every send, whether it came from a campaign, an automation or the API, with filters and a full event timeline per address.",
      "Metrics now cover transactional and automation mail, with a breakdown by source, and the reputation card shows the exact number the auto-pause uses.",
      "A shorter sidebar: Domains and Senders became one Sending page, Suppressions moved into Audiences, and the old links redirect.",
      "Organisation settings, members and billing now look like the rest of the app instead of an embedded widget.",
      "Verified domains are re-checked every six hours, and you are told if verification or the Return-Path is lost.",
    ],
  },
  {
    slug: "webhooks-send-pacing-and-the-app-on-a-phone",
    date: "August 16, 2026",
    isoDate: "2026-08-16",
    title: "Webhooks, send pacing, and the whole app on a phone",
    summary:
      "The API gained its other half. Your code could already call day3; webhooks let day3 call you when an address bounces or a message lands, so your own records stop drifting. Underneath, outbound mail is now paced to the provider's send rate instead of bursting into a throttle, pages load in one round trip instead of two, and the app works on a phone.",
    metaDescription:
      "Outbound webhooks for delivery, bounce, complaint and suppression events, signed so you can verify them. Plus paced sending, faster pages, and a mobile-ready app.",
    items: [
      "Outbound webhooks for six events: email.sent, email.delivered, email.bounced, email.complained, email.failed and suppression.created, covering campaign and transactional mail alike.",
      "Every webhook request is signed, retries run for around seven hours, and a failing endpoint is never silently disabled.",
      "Sending is paced to the provider's live send rate, so a large campaign no longer trips a throttle it caused itself and then waits ten minutes.",
      "Pages load their data on the server, so moving around the app costs one round trip instead of two.",
      "The whole app works on a phone: an off-canvas sidebar, stacked forms, tables that scroll in place, and real touch targets.",
      "Standing warnings above the campaign builder can be collapsed to one line, and a missing business address can be added right there.",
      "The MCP install snippet is one line and works in bash, zsh, CMD and PowerShell.",
    ],
  },
  {
    slug: "transactional-email-api-mcp-server-suppressions",
    date: "August 6, 2026",
    isoDate: "2026-08-06",
    title: "Transactional email, an MCP server, and a suppressions page",
    summary:
      "day3 stopped being only a newsletter tool. Password resets, receipts and magic links now go through the same API, the same verified domain and the same monthly allowance as campaigns. An MCP server lets Claude Code, Cursor or VS Code draft campaigns that open as editable blocks in the composer. And the suppression list is finally visible and manageable from the app.",
    metaDescription:
      "POST /v1/emails for transactional mail on the same domain and allowance as campaigns, an MCP server for writing campaigns from your AI editor, and a suppressions page.",
    items: [
      "Send transactional email with POST /v1/emails: up to 50 recipients per message, an Idempotency-Key that makes retries safe, and a delivery timeline per email.",
      "An MCP server at /api/mcp turns your AI editor into a composer. Drafts arrive as editable blocks, not frozen HTML, and a key can only send to a real audience if you gave it that scope.",
      "Campaigns over REST: create, update, preview, test send, send and schedule. Bodies accept Markdown, sections or HTML.",
      "A Suppressions page to view and lift the account's blocklist. Lifting an address needs a signed-in session, never an API key.",
      "An API panel on the audiences, domains and senders pages with every id in view, code snippets prefilled with real ids, and a context pack to paste into an assistant.",
      "DKIM verification that timed out at the provider now restarts on its own once the records resolve, and automatic DNS setup never overwrites a DMARC or Return-Path record you already have.",
      "Free plans run in a sandbox mode, campaign templates arrived, and the app picked up the brand's typefaces and palette.",
    ],
  },
  {
    slug: "public-api-cheaper-volume-ai-everywhere",
    date: "July 29, 2026",
    isoDate: "2026-07-29",
    title: "A public API, cheaper volume, and AI for everyone",
    summary:
      "The release that made day3 programmable. A REST API covers audiences, contacts, custom fields, segments, topics and suppressions, which means migrating a list off another provider is a short script rather than a spreadsheet exercise. The AI writing assistant stopped being a higher-tier feature, and the plan ladder grew a top end.",
    metaDescription:
      "day3's REST API arrives: audiences, contacts, fields, segments and suppressions. AI drafting comes to every paid plan, and the ladder reaches 1,000,000 emails.",
    items: [
      "Manage your audiences from code: a REST API for contacts, custom fields, segments, topics, and suppressions, built so migrating a list off another provider is a short script.",
      "The AI writing assistant is now included on every paid plan, starting at $1/mo. Higher plans carry a larger allowance.",
      "High-volume plans got cheaper, and the ladder now runs all the way to 1,000,000 emails a month at $220.",
      "Deleting your organisation now erases everything it owns, for real: subscribers, campaigns, files, and sending identities.",
    ],
  },
  {
    slug: "ai-composer-scheduling-senders",
    date: "June 23, 2026",
    isoDate: "2026-06-23",
    title: "AI campaign composer, scheduling, and senders",
    summary:
      "Writing and timing. An optional AI composer drafts campaigns, suggests subject lines and rewrites copy, with a per-account budget so assisted writing cannot produce a surprise cost. Campaigns can now be scheduled rather than sent the moment you finish, and an account can hold several sending identities.",
    metaDescription:
      "An optional AI campaign composer powered by Claude, with a per-account budget. Plus scheduled sends, multiple sending identities, and a refreshed brand.",
    items: [
      "Write campaigns faster with an optional AI composer that drafts emails, suggests subject lines, and rewrites copy. It's powered by Claude.",
      "Set a monthly AI usage budget per account, so assisted writing never produces a surprise cost.",
      "Schedule a campaign to go out later instead of sending the moment you finish.",
      "Add multiple sending identities and pick which one a campaign comes from.",
      "A refreshed brand, a new marketing site, and an installable app (PWA).",
    ],
  },
  {
    slug: "signup-forms",
    date: "June 22, 2026",
    isoDate: "2026-06-22",
    title: "Signup forms",
    summary:
      "One form definition, installed four ways: a hosted page for people without a site, an auto-resizing embed for people with one, a popup, and raw HTML for anyone who wants to style it themselves. Double opt-in is on by default, which keeps typos and bot signups off the list.",
    metaDescription:
      "Collect subscribers four ways from one form definition: a hosted page, an auto-resizing embed, a popup, or raw HTML. Double opt-in on by default.",
    items: [
      "Collect subscribers with hosted newsletter signup forms. No site required.",
      "Drop a lightweight widget onto your own site for inline or popup forms, or take the raw HTML and style it yourself.",
    ],
  },
  {
    slug: "sending-foundations-and-onboarding",
    date: "June 19, 2026",
    isoDate: "2026-06-19",
    title: "Sending foundations and onboarding",
    summary:
      "The unglamorous release everything else depends on: domain verification with automatic DNS setup, so SPF, DKIM and DMARC are published for you rather than pasted by hand at midnight, plus a guided path from signup to first campaign with real gates before anything sends.",
    metaDescription:
      "Domain verification with automatic SPF, DKIM and DMARC setup, a guided path from signup to first campaign, and imports that recover from bad rows.",
    items: [
      "A guided onboarding checklist takes you from sign-up to your first campaign, with clear gates before anything sends.",
      "Verify your sending domain with automatic DNS setup, so authentication (SPF, DKIM, DMARC) is handled for you.",
      "DNS access tokens are stored with versioned, rotating encryption keys.",
      "Imports recover cleanly from failed or malformed rows instead of losing the batch.",
      "Clearer billing and plan-change behaviour throughout.",
    ],
  },
];

export function getChangelogEntry(slug: string): ChangelogEntry | undefined {
  return changelogEntries.find((entry) => entry.slug === slug);
}
