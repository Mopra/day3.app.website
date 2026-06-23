/**
 * Live changelog source: published GitHub Releases from the app repo, fetched at
 * build time and revalidated hourly. Drafts and pre-releases are skipped.
 *
 * On any error — or before the first release exists — getReleases() returns an
 * empty array, and the /changelog page falls back to the curated entries in
 * changelog-content.ts. So the page is never blank and the build never fails on
 * a network hiccup.
 */

const RELEASES_URL = "https://api.github.com/repos/Mopra/day3.app/releases";

export type Release = {
  version: string;
  title: string;
  date: string;
  isoDate: string;
  body: string;
  url: string;
};

type GitHubRelease = {
  tag_name: string;
  name: string | null;
  body: string | null;
  published_at: string | null;
  created_at: string;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export async function getReleases(): Promise<Release[]> {
  try {
    const res = await fetch(RELEASES_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      // Build-time fetch with hourly ISR — new releases appear without a redeploy.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];

    return (data as GitHubRelease[])
      .filter((release) => !release.draft && !release.prerelease)
      .map((release) => {
        const iso = release.published_at ?? release.created_at;
        return {
          version: release.tag_name,
          title: release.name?.trim() || release.tag_name,
          date: formatDate(iso),
          isoDate: iso.slice(0, 10),
          body: release.body?.trim() ?? "",
          url: release.html_url,
        };
      });
  } catch {
    return [];
  }
}
