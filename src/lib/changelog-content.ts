/**
 * The curated changelog archive.
 *
 * The /changelog index renders published GitHub Releases (see lib/changelog.ts)
 * when any exist; until the first release is cut, or if the GitHub fetch fails, it
 * falls back to these entries, so the page is never blank.
 *
 * These are also the only changelog entries that can have their own URL, because
 * they are the only ones known at build time: a GitHub release fetched hourly
 * cannot be prerendered or put in the sitemap. So this array is the indexable
 * archive, and each entry gets /changelog/<slug> with Article markup and a real
 * publish date.
 *
 * Curated, user-facing "what's new" entries in product language, not raw commits.
 * Newest first. `isoDate` drives the <time> element, the ordering, and the
 * sitemap's lastmod.
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
