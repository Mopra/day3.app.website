/**
 * Fallback changelog entries. The /changelog page renders published GitHub
 * Releases (see lib/changelog.ts) when any exist; until the first release is
 * cut — or if the GitHub fetch fails — it falls back to these curated entries,
 * so the page is never blank. Once you're publishing Releases, these can be
 * trimmed or removed.
 *
 * Curated, user-facing "what's new" entries — product language, not raw commits.
 * Newest first. `isoDate` drives the <time> element and ordering.
 */
export type ChangelogEntry = {
  date: string;
  isoDate: string;
  title: string;
  items: string[];
};

export const changelogEntries: ChangelogEntry[] = [
  {
    date: "June 23, 2026",
    isoDate: "2026-06-23",
    title: "AI campaign composer, scheduling, and senders",
    items: [
      "Write campaigns faster with an optional AI composer that drafts emails, suggests subject lines, and rewrites copy. It's powered by Claude and included on the 10k plan and up.",
      "Set a monthly AI usage budget per account, so assisted writing never produces a surprise cost.",
      "Schedule a campaign to go out later instead of sending the moment you finish.",
      "Add multiple sending identities and pick which one a campaign comes from.",
      "A refreshed brand, a new marketing site, and an installable app (PWA).",
    ],
  },
  {
    date: "June 22, 2026",
    isoDate: "2026-06-22",
    title: "Signup forms",
    items: [
      "Collect subscribers with hosted newsletter signup forms — no site required.",
      "Drop a lightweight widget onto your own site for inline or popup forms, or take the raw HTML and style it yourself.",
    ],
  },
  {
    date: "June 19, 2026",
    isoDate: "2026-06-19",
    title: "Sending foundations and onboarding",
    items: [
      "A guided onboarding checklist takes you from sign-up to your first campaign, with clear gates before anything sends.",
      "Verify your sending domain with automatic DNS setup, so authentication (SPF, DKIM, DMARC) is handled for you.",
      "DNS access tokens are stored with versioned, rotating encryption keys.",
      "Imports recover cleanly from failed or malformed rows instead of losing the batch.",
      "Clearer billing and plan-change behaviour throughout.",
    ],
  },
];
